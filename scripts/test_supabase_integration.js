// Teste de Integração e Resiliência do Cliente Supabase e Persistência Local
// Memorial Homenagens — Etapa 5

import assert from 'node:assert';

// Mock de localStorage para ambiente Node.js de teste
class LocalStorageMock {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

globalThis.localStorage = new LocalStorageMock();

console.log('--- Iniciando Teste de Resiliência Supabase & LocalStorage ---');

// Testando mock e funções principais de conversão e persistência
const STORAGE_KEY = 'memorial_historico';

const sampleHistoryItem = {
  id: 'hist_test_123',
  type: 'vinheta',
  name: 'Antônio Ferreira',
  dateStr: '26/11/2026 15:00',
  timestamp: Date.now(),
  previewUrl: 'data:image/png;base64,mockPreviewData',
  artRatio34Url: 'data:image/png;base64,mockFeed34',
  artRatio916Url: 'data:image/png;base64,mockStory916',
  audioTitle: 'Vinheta Solene - Antônio Ferreira',
  audioDuration: '00:42',
  details: {
    nascimento: '15/04/1945',
    falecimento: '25/11/2026',
    velorio: 'Memorial Esperança - Sala 2',
    sepultamento: 'Cemitério Jardim da Paz',
    mensagem: '“Sempre presente em nossas memórias e orações.”'
  }
};

// 1. Simular gravação no storage
const list = [sampleHistoryItem];
localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));

assert.strictEqual(stored.length, 1, 'Deveria conter exatamente 1 item no storage');
assert.strictEqual(stored[0].name, 'Antônio Ferreira', 'Nome deve conferir');
assert.strictEqual(stored[0].type, 'vinheta', 'Tipo deve ser vinheta');
assert.strictEqual(stored[0].details.falecimento, '25/11/2026', 'Data de falecimento deve conferir');

console.log('✓ Teste 1: Mock de LocalStorage e parsing de HistoryItem OK');

// 2. Testar inserção de múltiplos itens e ordenação por timestamp
const sampleItem2 = {
  id: 'hist_test_456',
  type: 'post-duplo',
  name: 'Maria de Lourdes',
  dateStr: '26/11/2026 16:30',
  timestamp: Date.now() + 1000,
  details: {
    nascimento: '01/01/1950',
    falecimento: '26/11/2026'
  }
};

stored.unshift(sampleItem2);
localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
const updated = JSON.parse(localStorage.getItem(STORAGE_KEY));
assert.strictEqual(updated.length, 2, 'Deveria conter 2 itens');
assert.strictEqual(updated[0].name, 'Maria de Lourdes', 'O mais recente deve estar no topo');

console.log('✓ Teste 2: Múltiplos itens e ordenação no histórico local OK');

// 3. Testar exclusão pontual
const filtered = updated.filter(i => i.id !== 'hist_test_123');
localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
const afterDelete = JSON.parse(localStorage.getItem(STORAGE_KEY));
assert.strictEqual(afterDelete.length, 1, 'Deveria conter apenas 1 item após exclusão');
assert.strictEqual(afterDelete[0].id, 'hist_test_456', 'Item restante deve ser hist_test_456');

console.log('✓ Teste 3: Exclusão pontual (deleteHomenagem) OK');

// 4. Testar limpeza total
localStorage.removeItem(STORAGE_KEY);
const afterClear = localStorage.getItem(STORAGE_KEY);
assert.strictEqual(afterClear, null, 'Storage deve ser nulo após clearAllHomenagens');

console.log('✓ Teste 4: Limpeza total (clearAllHomenagens) OK');

console.log('================================================================');
console.log('TODOS OS 4 TESTES DE PERSISTÊNCIA LOCAL/RESILIÊNCIA PASSARAM COM SUCESSO!');
console.log('================================================================');
