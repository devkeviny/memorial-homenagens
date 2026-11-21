import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  Send, 
  Paperclip, 
  Play, 
  Pause, 
  Download, 
  Volume2, 
  ArrowLeft, 
  CheckCircle2, 
  Edit3, 
  RotateCcw, 
  Sparkles, 
  Square, 
  Heart,
  ImageIcon,
  X,
  Radio
} from 'lucide-react';
import { ScreenId, ChatMessage, HistoryItem } from '../types';
import { DynamicOrb } from '../components/DynamicOrb';
import { TutorialModal } from '../components/TutorialModal';
import { drawFeedImage, drawStoryImage, createSolemnAudioBlob, MemorialData } from '../utils/canvasHelper';

interface ChatScreenProps {
  onNavigate: (screen: ScreenId) => void;
  initialMode?: 'vinheta' | 'artes';
  onOpenPix: () => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ 
  onNavigate, 
  initialMode = 'vinheta',
  onOpenPix 
}) => {
  const [mode, setMode] = useState<'vinheta' | 'artes'>(initialMode);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('Pensando...');
  
  // Tutorial modal state
  const [showTutorial, setShowTutorial] = useState(false);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const timerRef = useRef<number | null>(null);

  // Audio player state
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Photo attachment state
  const [attachedPhoto, setAttachedPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Bottom scroll anchor
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  // Check tutorial on mount
  useEffect(() => {
    const tutorialSeen = localStorage.getItem('tutorial_chat_visto');
    if (!tutorialSeen) {
      setShowTutorial(true);
    }
  }, []);

  // Initialize conversation based on mode
  useEffect(() => {
    const welcomeText = mode === 'vinheta'
      ? `Olá. Meus mais sinceros sentimentos por sua perda. Estou aqui para ajudar você a criar uma **vinheta solene em áudio** com muito respeito e carinho.\n\nPor favor, me informe:\n• **Nome completo** do ente querido\n• **Data de nascimento e falecimento**\n• **Local e horário do velório e sepultamento**\n• Uma **frase especial** ou mensagem de despedida que gostaria de incluir.\n\nVocê pode **escrever aqui** ou simplesmente **tocar no microfone** para me contar por voz.`
      : `Olá. Nossos sentimentos fraternos neste momento. Vamos preparar as **artes de homenagem e luto** para suas redes sociais (Feed 3:4 e Stories 9:16).\n\nPara começarmos, envie os dados:\n• **Nome do homenageado**\n• **Datas de nascimento e partida**\n• **Informações da cerimônia de despedida** (velório/missa)\n• Se desejar, anexe uma foto com o botão de anexo (+) abaixo.\n\nVocê pode digitar ou falar pelo microfone.`;

    setMessages([
      {
        id: 'msg_welcome',
        sender: 'assistant',
        text: welcomeText,
        timestamp: Date.now()
      }
    ]);
  }, [mode]);

  // Voice Recording Timer
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // Handle Photo Attachment
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachedPhoto(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Send User Message
  const handleSendMessage = () => {
    if (!inputText.trim() && !attachedPhoto) return;

    const userMsg: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text: inputText.trim() || '(Foto anexada para homenagem)',
      timestamp: Date.now()
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = inputText.trim();
    setInputText('');
    setAttachedPhoto(null);

    // Process Response
    simulateProcessingResponse(currentInput);
  };

  // Simulate Audio/Text Voice Submission
  const handleSendVoice = () => {
    setIsRecording(false);
    const simulatedVoiceText = mode === 'vinheta'
      ? 'Homenagem a Dona Maria das Graças, nascida em 12/05/1944 e falecida em 21/11/2026. Velório na Capela da Saudade a partir das 08h e sepultamento às 16h. Combati o bom combate, descanse em paz.'
      : 'Homenagem a José Carlos da Silva, 1952 a 2026. Missa de 7º dia na Igreja Matriz às 19h. Sempre lembraremos do seu sorriso.';

    const userMsg: ChatMessage = {
      id: `msg_voice_${Date.now()}`,
      sender: 'user',
      text: `🎤 Áudio gravado (${formatTime(recordingSeconds)}):\n"${simulatedVoiceText}"`,
      timestamp: Date.now()
    };

    setMessages((prev) => [...prev, userMsg]);
    simulateProcessingResponse(simulatedVoiceText, true);
  };

  // Extraction & Confirmation Simulator
  const simulateProcessingResponse = (rawText: string, fromVoice = false) => {
    setIsProcessing(true);

    if (fromVoice) {
      setProcessingStage('Transcrevendo áudio...');
      setTimeout(() => {
        setProcessingStage('Analisando dados do homenageado...');
      }, 1200);
    } else {
      setProcessingStage('Pensando e acolhendo dados...');
    }

    setTimeout(() => {
      setIsProcessing(false);

      // Extract heuristic or fallback details
      const fallbackName = rawText.includes('Maria') ? 'Maria das Graças' : rawText.includes('José') ? 'José Carlos da Silva' : 'Antônio Pereira dos Santos';
      const confirmationData = {
        nome: fallbackName,
        nascimento: '14/05/1948',
        falecimento: '21/11/2026',
        velorio: 'Capela Central das Flores - Sala 02 (a partir das 09:00)',
        sepultamento: 'Cemitério Municipal da Paz (às 16:30)',
        mensagem: '“Aqueles que amamos nunca partem para sempre; continuam vivos em cada oração e lembrança.”'
      };

      const confirmationMsg: ChatMessage = {
        id: `msg_confirm_${Date.now()}`,
        sender: 'assistant',
        text: 'Acolhi os dados da homenagem com muito carinho. Por gentileza, confirme se todas as informações estão corretas antes de finalizarmos:',
        timestamp: Date.now(),
        isConfirmationCard: true,
        confirmationData
      };

      setMessages((prev) => [...prev, confirmationMsg]);
    }, fromVoice ? 2200 : 1500);
  };

  // Trigger Final Deliverables Generation
  const handleConfirmAndGenerate = (data: MemorialData) => {
    setIsProcessing(true);

    if (mode === 'vinheta') {
      setProcessingStage('Sintetizando voz solene de homenagem...');
      setTimeout(() => {
        setProcessingStage('Equalizando fundo musical orquestrado...');
      }, 1400);
    } else {
      setProcessingStage('Compondo tipografia solene e molduras...');
      setTimeout(() => {
        setProcessingStage('Renderizando Feed 3:4 e Stories 9:16...');
      }, 1400);
    }

    setTimeout(() => {
      setIsProcessing(false);

      // Draw real high quality canvas images
      const feedUrl = drawFeedImage(data);
      const storyUrl = drawStoryImage(data);

      const resultMsg: ChatMessage = {
        id: `msg_result_${Date.now()}`,
        sender: 'assistant',
        text: mode === 'vinheta'
          ? 'Sua **vinheta solene em áudio** foi gerada com perfeição e respeito. Você pode ouvi-la abaixo e fazer o download gratuito para compartilhar com a família:'
          : 'Suas **artes comemorativas de luto** estão prontas em alta definição (Feed 3:4 e Stories 9:16). Faça o download gratuito de cada formato abaixo:',
        timestamp: Date.now(),
        isAudioResult: mode === 'vinheta',
        audioTitle: `Vinheta Solene - ${data.nome}`,
        audioDuration: '00:42',
        isArtResult: true,
        artRatio34Url: feedUrl,
        artRatio916Url: storyUrl
      };

      setMessages((prev) => [...prev, resultMsg]);

      // Save to localStorage memorial_historico
      saveToHistory({
        id: `hist_${Date.now()}`,
        type: mode === 'vinheta' ? 'vinheta' : 'post-duplo',
        name: data.nome,
        dateStr: new Date().toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'America/Sao_Paulo'
        }),
        timestamp: Date.now(),
        previewUrl: feedUrl,
        audioDuration: mode === 'vinheta' ? '00:42' : undefined,
        details: {
          nascimento: data.nascimento,
          falecimento: data.falecimento,
          velorio: data.velorio,
          sepultamento: data.sepultamento,
          mensagem: data.mensagem
        }
      });
    }, 2800);
  };

  // Save to History helper
  const saveToHistory = (item: HistoryItem) => {
    try {
      const existing = localStorage.getItem('memorial_historico');
      const list: HistoryItem[] = existing ? JSON.parse(existing) : [];
      list.unshift(item);
      localStorage.setItem('memorial_historico', JSON.stringify(list));
    } catch (e) {
      console.error('Failed to save to memorial_historico:', e);
    }
  };

  // Real Audio Playback using generated WAV Blob & SpeechSynthesis
  const handlePlayAudio = (msgId: string, title?: string) => {
    if (playingMessageId === msgId) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      window.speechSynthesis?.cancel();
      setPlayingMessageId(null);
      return;
    }

    // Stop current
    if (audioRef.current) {
      audioRef.current.pause();
    }
    window.speechSynthesis?.cancel();

    // Create real audio blob
    const audioBlob = createSolemnAudioBlob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.onended = () => {
      setPlayingMessageId(null);
    };

    audio.play().catch(() => {
      // Audio autoplay policy fallback
    });

    // Optional synthesized solemn narration
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        `Nota de falecimento e homenagem solene a ${title || 'nosso ente querido'}. Que descanse em paz na luz eterna.`
      );
      utterance.lang = 'pt-BR';
      utterance.rate = 0.85;
      utterance.pitch = 0.9;
      window.speechSynthesis.speak(utterance);
    }

    setPlayingMessageId(msgId);
  };

  // Download Audio WAV
  const handleDownloadAudio = (title?: string) => {
    const audioBlob = createSolemnAudioBlob();
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(title || 'vinheta-memorial').toLowerCase().replace(/\s+/g, '-')}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Download Image PNG
  const handleDownloadImage = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex flex-col w-full h-[calc(100vh-4rem)] md:h-screen max-w-4xl mx-auto bg-[#0C0C0F] relative overflow-hidden select-none">
      {/* Tutorial Modal */}
      <TutorialModal isOpen={showTutorial} onClose={() => setShowTutorial(false)} />

      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#16161B]/90 border-b border-white/5 backdrop-blur-xl z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            title="Voltar ao Início"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white font-serif tracking-tight flex items-center gap-2">
              <span>Assistente Solene</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h2>
            <p className="text-[11px] text-zinc-400">
              {mode === 'vinheta' ? 'Modo: Vinheta em Áudio' : 'Modo: Artes para Redes'}
            </p>
          </div>
        </div>

        {/* Mode Switcher Pill */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#0C0C0F] border border-white/10 text-xs">
          <button
            onClick={() => setMode('vinheta')}
            className={`px-3 py-1.5 rounded-full font-medium transition-all ${
              mode === 'vinheta'
                ? 'bg-gradient-to-r from-red-800 to-red-600 text-white shadow-[0_0_12px_rgba(220,38,38,0.4)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Vinheta
          </button>
          <button
            onClick={() => setMode('artes')}
            className={`px-3 py-1.5 rounded-full font-medium transition-all ${
              mode === 'artes'
                ? 'bg-gradient-to-r from-red-800 to-red-600 text-white shadow-[0_0_12px_rgba(220,38,38,0.4)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Artes
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fade-in`}
            >
              {/* Balloon */}
              <div
                className={`max-w-[92%] sm:max-w-[80%] p-4 sm:p-5 rounded-3xl ${
                  isUser
                    ? 'bg-white text-[#111111] rounded-br-sm shadow-lg'
                    : 'bg-[#1C1C22] text-white border border-white/10 rounded-bl-sm shadow-[0_0_20px_rgba(0,0,0,0.5)]'
                }`}
              >
                {/* Assistant Dove Icon Header */}
                {!isUser && (
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
                    <div className="w-6 h-6 rounded-lg bg-red-900/40 border border-red-500/30 flex items-center justify-center p-1">
                      <img
                        src="/src/assets/dove-red-flower.svg"
                        alt="Memorial"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-xs font-semibold tracking-wider text-red-400">
                      MEMORIAL
                    </span>
                  </div>
                )}

                {/* Message Text */}
                {msg.text && (
                  <div className={`text-base sm:text-lg leading-relaxed whitespace-pre-wrap ${isUser ? 'font-sans' : 'font-sans'}`}>
                    {msg.text}
                  </div>
                )}

                {/* Confirmation Card */}
                {msg.isConfirmationCard && msg.confirmationData && (
                  <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-[#141418] border border-red-500/40 text-white shadow-[0_0_25px_rgba(220,38,38,0.2)]">
                    <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider mb-3">
                      <Sparkles className="w-4 h-4" />
                      <span>Resumo das Informações Extraídas</span>
                    </div>

                    <div className="space-y-2 text-sm text-zinc-300 mb-5">
                      <p><strong className="text-white">Nome:</strong> {msg.confirmationData.nome}</p>
                      <p><strong className="text-white">Datas:</strong> ★ {msg.confirmationData.nascimento} • ✝ {msg.confirmationData.falecimento}</p>
                      <p><strong className="text-white">Velório:</strong> {msg.confirmationData.velorio}</p>
                      <p><strong className="text-white">Sepultamento:</strong> {msg.confirmationData.sepultamento}</p>
                      <p><strong className="text-white">Mensagem:</strong> {msg.confirmationData.mensagem}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <button
                        onClick={() => handleConfirmAndGenerate(msg.confirmationData as MemorialData)}
                        className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 text-white text-sm font-semibold shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all active:scale-95 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Tudo certo, gerar agora</span>
                      </button>

                      <button
                        onClick={() => {
                          setInputText(`Gostaria de corrigir: o nome é ${msg.confirmationData?.nome}...`);
                        }}
                        className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-300 hover:text-white transition-all active:scale-95 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Alterar dados</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Audio Deliverable Player */}
                {msg.isAudioResult && (
                  <div className="mt-4 p-5 rounded-2xl bg-[#141418] border border-red-500/40 text-white shadow-[0_0_25px_rgba(220,38,38,0.2)]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-900 to-red-600 flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.4)]">
                          <Radio className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white font-serif">{msg.audioTitle}</h4>
                          <span className="text-xs text-zinc-400">Voz Solene + Fundo Musical</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-zinc-400">{msg.audioDuration}</span>
                    </div>

                    {/* Waveform / Visualizer Mock */}
                    <div className="flex items-center justify-between gap-1 h-8 px-3 rounded-lg bg-black/40 mb-4">
                      {Array.from({ length: 28 }).map((_, i) => (
                        <span
                          key={i}
                          className={`w-1 rounded-full transition-all ${
                            playingMessageId === msg.id
                              ? 'bg-red-500 animate-pulse'
                              : 'bg-zinc-700'
                          }`}
                          style={{
                            height: `${Math.max(20, (Math.sin(i * 0.5) * 40 + 50))}%`
                          }}
                        />
                      ))}
                    </div>

                    {/* Audio Player Controls */}
                    <div className="flex items-center justify-between gap-3 pt-2">
                      <button
                        onClick={() => handlePlayAudio(msg.id, msg.audioTitle)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
                      >
                        {playingMessageId === msg.id ? (
                          <>
                            <Pause className="w-4 h-4" />
                            <span>Pausar</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 fill-white" />
                            <span>Ouvir Vinheta</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleDownloadAudio(msg.audioTitle)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-medium transition-all active:scale-95 cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>Baixar Áudio (WAV)</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Arts Deliverables Previews (Side-by-side Feed 3:4 & Stories 9:16) */}
                {msg.isArtResult && msg.artRatio34Url && msg.artRatio916Url && (
                  <div className="mt-4 p-5 rounded-2xl bg-[#141418] border border-red-500/40 text-white">
                    <h4 className="text-sm font-bold text-white font-serif mb-4 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-red-400" />
                      <span>Artes Prontas para Download (PNG Alta Resolução)</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Feed 3:4 Card */}
                      <div className="flex flex-col items-center p-3 rounded-xl bg-black/50 border border-white/10">
                        <span className="text-xs font-semibold text-zinc-300 mb-2">Feed (3:4)</span>
                        <div className="w-full aspect-[3/4] max-h-64 rounded-lg overflow-hidden border border-white/10 mb-3 bg-[#0C0C0F]">
                          <img
                            src={msg.artRatio34Url}
                            alt="Feed 3:4 Preview"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <button
                          onClick={() => handleDownloadImage(msg.artRatio34Url!, 'homenagem-feed-3x4.png')}
                          className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-medium transition-all active:scale-95 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Baixar Feed (3:4)</span>
                        </button>
                      </div>

                      {/* Stories 9:16 Card */}
                      <div className="flex flex-col items-center p-3 rounded-xl bg-black/50 border border-white/10">
                        <span className="text-xs font-semibold text-zinc-300 mb-2">Stories (9:16)</span>
                        <div className="w-full aspect-[9/16] max-h-64 rounded-lg overflow-hidden border border-white/10 mb-3 bg-[#0C0C0F]">
                          <img
                            src={msg.artRatio916Url}
                            alt="Stories 9:16 Preview"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <button
                          onClick={() => handleDownloadImage(msg.artRatio916Url!, 'homenagem-stories-9x16.png')}
                          className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-medium transition-all active:scale-95 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Baixar Stories (9:16)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Dynamic Orb Processing State */}
        {isProcessing && (
          <div className="flex justify-start">
            <DynamicOrb stage={processingStage} />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Voice Recording Overlay Bar */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="px-4 py-3 bg-[#181820] border-t border-red-500/40 flex items-center justify-between text-white z-30"
          >
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
              <div className="flex flex-col">
                <span className="text-xs text-red-400 font-semibold tracking-wide">
                  Gravando Homenagem por Voz
                </span>
                <span className="text-sm font-mono font-bold text-white">
                  {formatTime(recordingSeconds)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsRecording(false)}
                className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium text-zinc-300 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSendVoice}
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Enviar Áudio</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attached Photo Preview Pill */}
      {attachedPhoto && (
        <div className="px-6 py-2 bg-[#14141A] border-t border-white/5 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <img
              src={attachedPhoto}
              alt="Anexo selecionado"
              className="w-8 h-8 rounded-lg object-cover border border-red-500/40"
            />
            <span className="text-xs text-zinc-300">Foto anexada para a homenagem</span>
          </div>
          <button
            onClick={() => setAttachedPhoto(null)}
            className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Bottom Input Bar with Strict Exclusivity Rule */}
      <div className="p-3 sm:p-4 bg-[#16161B]/95 border-t border-white/10 backdrop-blur-xl z-20">
        <div className="flex items-center gap-2 sm:gap-3 max-w-3xl mx-auto">
          {/* Photo Attachment Picker */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoSelect}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-[#1F1F28] hover:bg-[#282834] border border-white/10 text-zinc-300 hover:text-white transition-all active:scale-95 cursor-pointer shrink-0"
            title="Anexar foto do homenageado"
            aria-label="Anexar foto"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Text Input */}
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Digite o nome, datas ou mensagem..."
              className="w-full h-12 px-5 rounded-full bg-[#0C0C0F] border border-white/10 focus:border-red-500/60 focus:outline-none text-white placeholder-zinc-500 text-sm sm:text-base transition-colors"
            />
          </div>

          {/* Exclusivity: Mic Button (Empty Input) vs Send Arrow (With Text) */}
          {inputText.trim().length === 0 && !attachedPhoto ? (
            /* Prominent Mic with Pulsing Red Gradient Glow */
            <button
              onClick={() => setIsRecording(true)}
              className="relative w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-tr from-red-800 to-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer animate-pulse-glow"
              title="Falar por voz"
              aria-label="Gravar áudio"
            >
              <Mic className="w-5 h-5 text-white" />
            </button>
          ) : (
            /* Send Button */
            <button
              onClick={handleSendMessage}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-red-800 to-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
              title="Enviar mensagem"
              aria-label="Enviar"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
