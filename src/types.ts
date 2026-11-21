export interface HistoryItem {
  id: string;
  type: 'vinheta' | 'post-duplo' | 'foto-perfil';
  name: string;
  dateStr: string; // ISO or formatted
  timestamp: number;
  previewUrl?: string;
  audioDuration?: string;
  details?: {
    nascimento?: string;
    falecimento?: string;
    velorio?: string;
    sepultamento?: string;
    mensagem?: string;
  };
}

export type ScreenId = 'home' | 'artes-submenu' | 'chat' | 'editor-perfil' | 'historico' | 'sobre' | 'privacidade';

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
