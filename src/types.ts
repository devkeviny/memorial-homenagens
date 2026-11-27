export interface HomenagemArtes {
  feed_3x4?: string;
  stories_9x16?: string;
  perfil?: string;
  [key: string]: string | undefined;
}

export interface HomenagemRow {
  id: string;
  nome_falecido: string;
  data_nascimento?: string | null;
  data_falecimento?: string | null;
  cidade_cerimonia?: string | null;
  local_cerimonia?: string | null;
  horario_cerimonia?: string | null;
  mensagem_homenagem?: string | null;
  audio_url?: string | null;
  artes?: HomenagemArtes | null;
  status?: string | null;
  created_at?: string;
}

export type HomenagemInsert = Omit<HomenagemRow, 'id' | 'created_at'> & {
  id?: string;
  created_at?: string;
};

export interface HistoryItem {
  id: string;
  supabaseId?: string;
  type: 'vinheta' | 'post-duplo' | 'foto-perfil';
  name: string;
  dateStr: string; // ISO or formatted
  timestamp: number;
  previewUrl?: string;
  artRatio34Url?: string;
  artRatio916Url?: string;
  audioDuration?: string;
  audioTitle?: string;
  audioUrl?: string;
  details?: {
    nascimento?: string;
    falecimento?: string;
    velorio?: string;
    sepultamento?: string;
    mensagem?: string;
    cidade?: string;
    local?: string;
    horario?: string;
  };
  source?: 'supabase' | 'local' | 'localStorage' | 'merged';
}

export type ScreenId = 'home' | 'artes-submenu' | 'templates-artes' | 'chat' | 'editor-perfil' | 'historico' | 'sobre' | 'privacidade';

export interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user';
  text?: string;
  timestamp: number;
  isConfirmationCard?: boolean;
  confirmationData?: {
    nome: string;
    nascimento: string;
    falecimento: string;
    velorio: string;
    sepultamento: string;
    mensagem: string;
  };
  isAudioResult?: boolean;
  audioTitle?: string;
  audioDuration?: string;
  isArtResult?: boolean;
  artRatio34Url?: string;
  artRatio916Url?: string;
}
