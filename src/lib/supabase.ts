import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { HistoryItem } from '../types';

/**
 * ==============================================================================
 * CLIENTE SUPABASE & PERSISTÊNCIA RESILIENTE — MEMORIAL DE HOMENAGENS
 * Specs: specs/004-supabase-and-frontend-integration-spec.md
 * Schema: specs/004-supabase-schema.sql
 * ==============================================================================
 * 
 * Regras Invioláveis de Segurança e Resiliência:
 * 1. NUNCA utilizar service_role no client-side. Apenas anon_key pública com RLS.
 * 2. Fallback transparente para localStorage caso VITE_SUPABASE_URL ou 
 *    VITE_SUPABASE_ANON_KEY não estejam presentes ou o endpoint esteja inacessível.
 * 3. O front-end JAMAIS deve apresentar tela branca ou crash decorrente de falha de rede.
 */

export interface HomenagemRow {
  id: string; // UUID gerado pelo Supabase
  nome_falecido: string;
  data_nascimento: string | null;
  data_falecimento: string | null;
  cidade_cerimonia: string | null;
  local_cerimonia: string | null;
  horario_cerimonia: string | null;
  mensagem_homenagem: string | null;
  audio_url: string | null;
  artes: {
    feed_3x4?: string;
    stories_9x16?: string;
    perfil?: string;
    preview?: string;
    [key: string]: any;
  } | null;
  status: string;
  created_at: string;
}

export type HomenagemInsert = {
  id?: string;
  nome_falecido: string;
  data_nascimento?: string | null;
  data_falecimento?: string | null;
  cidade_cerimonia?: string | null;
  local_cerimonia?: string | null;
  horario_cerimonia?: string | null;
  mensagem_homenagem?: string | null;
  audio_url?: string | null;
  artes?: {
    feed_3x4?: string;
    stories_9x16?: string;
    perfil?: string;
    preview?: string;
    [key: string]: any;
  } | null;
  status?: string;
  created_at?: string;
};

export interface Database {
  public: {
    Tables: {
      homenagens: {
        Row: HomenagemRow;
        Insert: HomenagemInsert;
        Update: Partial<HomenagemInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}

const STORAGE_KEY = 'memorial_historico';
const TIMEOUT_MS = 6000;

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const SUPABASE_URL = typeof rawUrl === 'string' ? rawUrl.trim() : '';
const SUPABASE_ANON_KEY = typeof rawAnonKey === 'string' ? rawAnonKey.trim() : '';

/**
 * Verifica se as credenciais do Supabase foram fornecidas no ambiente Vite.
 */
export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    SUPABASE_URL &&
    (SUPABASE_URL.startsWith('http://') || SUPABASE_URL.startsWith('https://')) &&
    SUPABASE_ANON_KEY &&
    SUPABASE_ANON_KEY.length > 10
  );
};

/**
 * Instância do cliente Supabase tipado.
 * Null se as variáveis de ambiente não estiverem configuradas.
 */
export const supabase = isSupabaseConfigured()
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

/**
 * Helper para abortar chamadas de rede que excedam TIMEOUT_MS
 */
const withTimeout = async <T>(promiseLike: PromiseLike<T>, ms: number = TIMEOUT_MS): Promise<T> => {
  return Promise.race([
    Promise.resolve(promiseLike),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout de conexão após ${ms}ms`)), ms)
    ),
  ]);
};

/**
 * Lê homenagens salvas no localStorage de forma resiliente.
 */
export const getLocalHomenagens = (): HistoryItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('[Supabase/Local] Falha ao ler memorial_historico do localStorage:', err);
    return [];
  }
};

/**
 * Salva homenagens no localStorage com proteção contra estouro de quota (imagens base64).
 */
export const setLocalHomenagens = (items: HistoryItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.warn('[Supabase/Local] Quota de localStorage excedida, podando itens para preservar estabilidade...', err);
    try {
      // Mantém os 8 mais recentes e reduz data URLs pesadas de itens mais antigos
      const trimmed = items.slice(0, 8).map((item, idx) => {
        if (idx > 2) {
          return {
            ...item,
            previewUrl: item.previewUrl?.startsWith('data:') ? undefined : item.previewUrl,
            artRatio34Url: item.artRatio34Url?.startsWith('data:') ? undefined : item.artRatio34Url,
            artRatio916Url: item.artRatio916Url?.startsWith('data:') ? undefined : item.artRatio916Url,
          };
        }
        return item;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch (innerErr) {
      console.error('[Supabase/Local] Erro crítico ao gravar histórico local:', innerErr);
    }
  }
};

/**
 * Converte uma linha do banco Supabase para o formato HistoryItem do front-end.
 */
export const homenagemRowToHistoryItem = (row: HomenagemRow): HistoryItem => {
  const artes = row.artes || {};
  const preview = artes.feed_3x4 || artes.stories_9x16 || artes.perfil || artes.preview;
  const isVinheta = Boolean(row.audio_url);
  const isPerfil = Boolean(artes.perfil && !artes.feed_3x4 && !artes.stories_9x16);
  const itemType: HistoryItem['type'] = isPerfil ? 'foto-perfil' : isVinheta ? 'vinheta' : 'post-duplo';

  let dateStr = '';
  let timestamp = Date.now();

  if (row.created_at) {
    const d = new Date(row.created_at);
    if (!isNaN(d.getTime())) {
      timestamp = d.getTime();
      dateStr = d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Sao_Paulo',
      });
    }
  }

  if (!dateStr) {
    dateStr = new Date().toLocaleDateString('pt-BR');
  }

  return {
    id: row.id,
    type: itemType,
    name: row.nome_falecido,
    dateStr,
    timestamp,
    previewUrl: preview,
    artRatio34Url: artes.feed_3x4,
    artRatio916Url: artes.stories_9x16,
    audioDuration: isVinheta ? '00:42' : undefined,
    audioTitle: isVinheta ? `Vinheta Solene - ${row.nome_falecido}` : undefined,
    audioUrl: row.audio_url || undefined,
    details: {
      nascimento: row.data_nascimento || undefined,
      falecimento: row.data_falecimento || undefined,
      velorio: row.local_cerimonia ? `${row.cidade_cerimonia ? row.cidade_cerimonia + ' - ' : ''}${row.local_cerimonia}` : undefined,
      sepultamento: row.horario_cerimonia || undefined,
      mensagem: row.mensagem_homenagem || undefined,
      cidade: row.cidade_cerimonia || undefined,
      local: row.local_cerimonia || undefined,
    },
    source: 'supabase',
  };
};

/**
 * Converte um HistoryItem para o formato de inserção na tabela homenagens do Supabase.
 */
export const historyItemToHomenagemInsert = (item: HistoryItem): HomenagemInsert => {
  return {
    nome_falecido: item.name || 'Homenagem Póstuma',
    data_nascimento: item.details?.nascimento || null,
    data_falecimento: item.details?.falecimento || null,
    cidade_cerimonia: item.details?.cidade || null,
    local_cerimonia: item.details?.local || item.details?.velorio || null,
    horario_cerimonia: item.details?.sepultamento || null,
    mensagem_homenagem: item.details?.mensagem || null,
    audio_url: item.audioUrl || (item.type === 'vinheta' ? 'audio:vinheta_solene_generica' : null),
    artes: {
      feed_3x4: item.artRatio34Url,
      stories_9x16: item.artRatio916Url,
      perfil: item.type === 'foto-perfil' ? item.previewUrl : undefined,
      preview: item.previewUrl,
    },
    status: 'concluido',
  };
};

/**
 * Salva uma nova homenagem no Supabase (se configurado) e no localStorage (fallback e cache).
 */
export const saveHomenagem = async (
  item: HistoryItem
): Promise<{ success: boolean; item: HistoryItem; source: 'supabase' | 'local'; error?: any }> => {
  // 1. Grava no localStorage imediatamente para resposta de UI sem latência
  const localList = getLocalHomenagens();
  const existingIdx = localList.findIndex((i) => i.id === item.id);
  if (existingIdx >= 0) {
    localList[existingIdx] = item;
  } else {
    localList.unshift(item);
  }
  setLocalHomenagens(localList);

  // 2. Se o Supabase estiver configurado, tenta persistir na nuvem
  if (isSupabaseConfigured() && supabase) {
    try {
      const payload = historyItemToHomenagemInsert(item);
      const insertQuery = supabase
        .from('homenagens')
        .insert(payload as any)
        .select()
        .single();

      const { data, error } = await withTimeout(insertQuery, TIMEOUT_MS);

      if (error) {
        console.warn('[Supabase] Falha ao gravar homenagem remota, mantida no localStorage:', error.message);
        return { success: true, item: { ...item, source: 'local' }, source: 'local', error };
      }

      if (data) {
        // Atualiza o item local com o ID gerado pelo Supabase (UUID) e source 'supabase'
        const syncedItem: HistoryItem = {
          ...item,
          id: (data as HomenagemRow).id,
          source: 'supabase',
        };

        const updatedLocal = getLocalHomenagens().map((i) =>
          i.id === item.id ? syncedItem : i
        );
        setLocalHomenagens(updatedLocal);

        return { success: true, item: syncedItem, source: 'supabase' };
      }
    } catch (err) {
      console.warn('[Supabase] Erro de rede ou timeout ao persistir homenagem:', err);
      return { success: true, item: { ...item, source: 'local' }, source: 'local', error: err };
    }
  }

  return { success: true, item: { ...item, source: 'local' }, source: 'local' };
};

/**
 * Carrega a lista de homenagens, unificando registros remotos do Supabase com o cache local.
 */
export const fetchHomenagens = async (): Promise<HistoryItem[]> => {
  const localItems = getLocalHomenagens();

  if (!isSupabaseConfigured() || !supabase) {
    return localItems;
  }

  try {
    const selectQuery = supabase
      .from('homenagens')
      .select('*')
      .order('created_at', { ascending: false });

    const { data, error } = await withTimeout(selectQuery, TIMEOUT_MS);

    if (error) {
      console.warn('[Supabase] Erro ao buscar homenagens da nuvem, retornando cache local:', error.message);
      return localItems;
    }

    if (data && Array.isArray(data)) {
      const remoteItems: HistoryItem[] = (data as HomenagemRow[]).map(homenagemRowToHistoryItem);

      // Unifica: registros remotos + itens locais que ainda não foram sincronizados
      const remoteIds = new Set(remoteItems.map((r) => r.id));
      const unmergedLocal = localItems.filter((loc) => !remoteIds.has(loc.id));

      const merged = [...unmergedLocal, ...remoteItems].sort(
        (a, b) => b.timestamp - a.timestamp
      );

      // Atualiza o cache local
      setLocalHomenagens(merged);
      return merged;
    }
  } catch (err) {
    console.warn('[Supabase] Erro de rede/timeout ao listar homenagens, usando cache local:', err);
  }

  return localItems;
};

/**
 * Remove uma homenagem do Supabase (se configurado) e do localStorage.
 */
export const deleteHomenagem = async (id: string): Promise<boolean> => {
  // Remove do localStorage
  const localItems = getLocalHomenagens().filter((item) => item.id !== id);
  setLocalHomenagens(localItems);

  // Se for UUID e Supabase estiver ativo, tenta deletar remotamente
  if (isSupabaseConfigured() && supabase && id.includes('-')) {
    try {
      const deleteQuery = supabase.from('homenagens').delete().eq('id', id);
      await withTimeout(deleteQuery, TIMEOUT_MS);
    } catch (err) {
      console.warn('[Supabase] Falha ao deletar homenagem remota:', err);
    }
  }

  return true;
};

/**
 * Limpa todo o histórico de homenagens localmente.
 */
export const clearAllHomenagens = async (): Promise<boolean> => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (err) {
    console.error('[Supabase/Local] Falha ao limpar histórico:', err);
    return false;
  }
};
