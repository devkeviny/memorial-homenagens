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
import { ImageTouchModal } from '../components/ImageTouchModal';
import { drawFeedImage, drawStoryImage, createSolemnAudioBlob, MemorialData } from '../utils/canvasHelper';

interface ChatScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onOpenPix: () => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ 
  onNavigate, 
  onOpenPix 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('Pensando...');
  
  // Tutorial modal state
  const [showTutorial, setShowTutorial] = useState(false);

  // Photo touch/pinch crop modal state
  const [rawPhotoToCrop, setRawPhotoToCrop] = useState<string | null>(null);

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

  // Initialize single unified solemn conversation
  useEffect(() => {
    const welcomeText = `Olá. Meus mais sinceros sentimentos por sua perda. Sou o Assistente Solene e estou aqui para acolher você em uma experiência única e integrada.\n\nJuntos, geraremos a **vinheta narrada em áudio** com orquestração solene e as **artes visuais de homenagem** (Feed 3:4 e Stories 9:16) prontas para compartilhar com a família.\n\nPor favor, me informe:\n• **Nome completo** do homenageado\n• **Data de nascimento e falecimento**\n• **Local e horário do velório e sepultamento**\n• Uma **frase especial** ou mensagem de carinho\n• Se desejar, anexe uma foto com o botão (+) abaixo para enquadrar com respeito.\n\nVocê pode **escrever aqui** ou simplesmente **tocar no microfone** para me contar por voz.`;

    setMessages([
      {
        id: 'msg_welcome',
        sender: 'assistant',
        text: welcomeText,
        timestamp: Date.now()
      }
    ]);
  }, []);

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

  // Handle Photo Attachment with Touch/Pinch Modal
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setRawPhotoToCrop(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
    if (e.target) e.target.value = '';
  };

  // Send User Message
  const handleSendMessage = () => {
    if (!inputText.trim() && !attachedPhoto) return;

    const userMsg: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text: inputText.trim() || '(Foto ajustada anexada para a homenagem)',
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
    const simulatedVoiceText = 'Homenagem solene a Maria das Graças Silva, nascida em 12/05/1944 e falecida em 21/11/2026. Velório na Capela da Saudade a partir das 08h e sepultamento às 16h. Combati o bom combate, guardei a fé, descanse em paz.';

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

    setProcessingStage('Sintetizando voz solene de homenagem...');
    setTimeout(() => {
      setProcessingStage('Equalizando áudio e renderizando artes visuais (Feed 3:4 e Stories 9:16)...');
    }, 1400);

    const renderArtifacts = (photoImg?: HTMLImageElement | null) => {
      setTimeout(() => {
        setIsProcessing(false);

        // Draw real high quality canvas images with adjusted photo if provided
        const feedUrl = drawFeedImage(data, photoImg);
        const storyUrl = drawStoryImage(data, photoImg);

        const resultMsg: ChatMessage = {
          id: `msg_result_${Date.now()}`,
          sender: 'assistant',
          text: 'Sua **vinheta solene em áudio** e **artes visuais integradas** foram geradas com respeito e acolhimento. Você pode ouvir a narração orquestrada abaixo e baixar gratuitamente as artes nos formatos Feed 3:4 e Stories 9:16 para homenagear e compartilhar com a família:',
          timestamp: Date.now(),
          isAudioResult: true,
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
          type: 'vinheta',
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
          artRatio34Url: feedUrl,
          artRatio916Url: storyUrl,
          audioTitle: `Vinheta Solene - ${data.nome}`,
          audioDuration: '00:42',
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

    if (attachedPhoto) {
      const img = new Image();
      img.onload = () => renderArtifacts(img);
      img.onerror = () => renderArtifacts(null);
      img.src = attachedPhoto;
    } else {
      renderArtifacts(null);
    }
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

    audio.play().catch(() => {});

    // Solemn narration
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
    <div className="flex flex-col w-full h-[calc(100vh-4rem)] md:h-screen max-w-4xl mx-auto bg-[#0C0C0F] relative overflow-hidden select-none font-sans">
      {/* Tutorial Modal */}
      <TutorialModal isOpen={showTutorial} onClose={() => setShowTutorial(false)} />

      {/* Image Touch / Pinch Crop Modal */}
      <ImageTouchModal
        isOpen={Boolean(rawPhotoToCrop)}
        imageSrc={rawPhotoToCrop || ''}
        onConfirm={(croppedUrl) => {
          setAttachedPhoto(croppedUrl);
          setRawPhotoToCrop(null);
        }}
        onClose={() => setRawPhotoToCrop(null)}
      />

      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#16161B]/95 border-b border-white/10 backdrop-blur-xl z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="p-2 rounded-xl btn-tactile text-zinc-400 hover:text-white transition-all cursor-pointer font-sans"
            title="Voltar ao Início"
          >
            <ArrowLeft className="w-5 h-5 text-red-400" />
          </button>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white font-sans tracking-tight flex items-center gap-2">
              <span>Assistente Solene</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h2>
            <p className="text-[11px] text-zinc-400 font-sans">
              Vinheta em Áudio Narrado & Artes Integradas
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-300 font-sans">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
          <span>Atendimento Solene</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fade-in font-sans`}
            >
              {/* Balloon */}
              <div
                className={`max-w-[92%] sm:max-w-[80%] p-4 sm:p-5 rounded-2xl ${
                  isUser
                    ? 'btn-tactile-red text-white rounded-br-sm'
                    : 'bg-[#16161D] border border-white/10 text-zinc-200 rounded-bl-sm card-tactile'
                }`}
              >
                <div className="text-sm sm:text-base leading-relaxed whitespace-pre-line font-sans">
                  {msg.text}
                </div>

                {/* Structured Confirmation Card */}
                {msg.isConfirmationCard && msg.confirmationData && (
                  <div className="mt-4 p-4 rounded-xl bg-black/40 border border-white/10 space-y-2 card-tactile font-sans">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <span className="text-xs font-semibold text-red-400 uppercase tracking-wider font-sans">
                        Dados Extraídos
                      </span>
                      <span className="text-[11px] text-zinc-400 font-sans">Etapa de Verificação</span>
                    </div>

                    <div className="text-xs sm:text-sm space-y-1.5 text-zinc-300 font-sans">
                      <p><strong className="text-white">Nome:</strong> {msg.confirmationData.nome}</p>
                      <p><strong className="text-white">Nascimento:</strong> {msg.confirmationData.nascimento}</p>
                      <p><strong className="text-white">Falecimento:</strong> {msg.confirmationData.falecimento}</p>
                      <p><strong className="text-white">Velório:</strong> {msg.confirmationData.velorio}</p>
                      <p><strong className="text-white">Sepultamento:</strong> {msg.confirmationData.sepultamento}</p>
                      <p className="italic text-zinc-400 pt-1 border-t border-white/5">
                        {msg.confirmationData.mensagem}
                      </p>
                    </div>

                    <div className="pt-3 flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleConfirmAndGenerate(msg.confirmationData!)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl btn-tactile-red text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer font-sans"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirmar & Gerar Homenagem</span>
                      </button>
                      <button
                        onClick={() => setInputText(`Corrigir nome para ${msg.confirmationData?.nome}: `)}
                        className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl btn-tactile text-zinc-300 hover:text-white text-xs font-medium transition-colors cursor-pointer font-sans"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Ajustar</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Audio Deliverable Card */}
                {msg.isAudioResult && (
                  <div className="mt-4 p-4 sm:p-5 rounded-xl bg-black/60 border border-red-500/40 shadow-[0_4px_25px_rgba(220,38,38,0.25)] card-tactile font-sans">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-red-950/80 border border-red-500/50 flex items-center justify-center text-red-400 card-tactile">
                          <Volume2 className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-white font-sans">
                            {msg.audioTitle || 'Vinheta Solene em Áudio'}
                          </h4>
                          <span className="text-[11px] text-zinc-400 font-sans">Duração: {msg.audioDuration || '00:42'}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handlePlayAudio(msg.id, msg.audioTitle)}
                        className="w-10 h-10 rounded-xl btn-tactile-red flex items-center justify-center text-white transition-all cursor-pointer"
                        title={playingMessageId === msg.id ? 'Pausar áudio' : 'Ouvir vinheta'}
                      >
                        {playingMessageId === msg.id ? (
                          <Pause className="w-4 h-4 fill-white" />
                        ) : (
                          <Play className="w-4 h-4 fill-white translate-x-0.5" />
                        )}
                      </button>
                    </div>

                    {/* Audio Waveform visualization bar */}
                    <div className="flex items-center gap-1 h-6 py-1 px-2 rounded-lg bg-white/5 mb-3 card-tactile">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-full transition-all duration-300 ${
                            playingMessageId === msg.id
                              ? 'bg-red-500 animate-pulse'
                              : 'bg-zinc-600'
                          }`}
                          style={{
                            height: playingMessageId === msg.id
                              ? `${Math.max(20, Math.sin(i * 0.8) * 90 + 30)}%`
                              : `${(i % 5 + 2) * 15}%`
                          }}
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <button
                        onClick={() => handleDownloadAudio(msg.audioTitle)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl btn-tactile text-white text-xs font-semibold transition-all cursor-pointer font-sans"
                      >
                        <Download className="w-3.5 h-3.5 text-red-400" />
                        <span>Baixar Áudio (.wav)</span>
                      </button>

                      <button
                        onClick={onOpenPix}
                        className="text-[11px] text-red-300 hover:text-white flex items-center gap-1 font-sans cursor-pointer"
                      >
                        <Heart className="w-3 h-3 fill-red-400 text-red-400" />
                        <span>Apoiar Projeto</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Visual Art Deliverables Cards (Feed & Stories) */}
                {msg.isArtResult && (
                  <div className="mt-4 space-y-3 font-sans">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Feed 3:4 */}
                      {msg.artRatio34Url && (
                        <div className="p-3 rounded-xl bg-black/50 border border-white/10 flex flex-col justify-between card-tactile">
                          <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-zinc-950 border border-white/5 mb-2 card-tactile">
                            <img
                              src={msg.artRatio34Url}
                              alt="Feed 3:4"
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/75 border border-white/10 text-[10px] font-semibold text-zinc-300 font-sans">
                              Feed 3:4
                            </span>
                          </div>
                          <button
                            onClick={() => handleDownloadImage(msg.artRatio34Url!, 'memorial-feed-3x4.png')}
                            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg btn-tactile text-white text-xs font-semibold transition-all cursor-pointer font-sans"
                          >
                            <Download className="w-3.5 h-3.5 text-red-400" />
                            <span>Baixar Feed (PNG)</span>
                          </button>
                        </div>
                      )}

                      {/* Stories 9:16 */}
                      {msg.artRatio916Url && (
                        <div className="p-3 rounded-xl bg-black/50 border border-white/10 flex flex-col justify-between card-tactile">
                          <div className="relative aspect-[9/16] w-full rounded-lg overflow-hidden bg-zinc-950 border border-white/5 mb-2 card-tactile">
                            <img
                              src={msg.artRatio916Url}
                              alt="Stories 9:16"
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/75 border border-white/10 text-[10px] font-semibold text-zinc-300 font-sans">
                              Stories 9:16
                            </span>
                          </div>
                          <button
                            onClick={() => handleDownloadImage(msg.artRatio916Url!, 'memorial-stories-9x16.png')}
                            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg btn-tactile text-white text-xs font-semibold transition-all cursor-pointer font-sans"
                          >
                            <Download className="w-3.5 h-3.5 text-red-400" />
                            <span>Baixar Stories (PNG)</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <span className="mt-1 px-1 text-[10px] text-zinc-400 font-sans">
                {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}

        {/* Processing Indicator with Dynamic Orb */}
        {isProcessing && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#16161D] border border-white/10 w-fit max-w-[85%] card-tactile font-sans">
            <DynamicOrb stage={processingStage} />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Voice Recording Drawer Banner */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="px-6 py-4 bg-[#14141A] border-t border-red-500/40 flex items-center justify-between z-30 shadow-[0_-10px_30px_rgba(220,38,38,0.2)] font-sans"
          >
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
              <span className="text-xs sm:text-sm font-semibold text-white font-sans">
                Gravando áudio solene... ({formatTime(recordingSeconds)})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRecording(false)}
                className="px-3.5 py-1.5 rounded-xl btn-tactile text-zinc-400 hover:text-white text-xs font-sans cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSendVoice}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl btn-tactile-red text-white text-xs font-semibold cursor-pointer font-sans"
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
        <div className="px-6 py-2.5 bg-[#14141A] border-t border-white/10 flex items-center justify-between z-20 font-sans">
          <div className="flex items-center gap-3">
            <img
              src={attachedPhoto}
              alt="Anexo selecionado"
              className="w-9 h-9 rounded-xl object-cover border border-red-500/40 card-tactile"
            />
            <span className="text-xs text-zinc-300 font-sans">Foto ajustada e pronta para a homenagem</span>
          </div>
          <button
            onClick={() => setAttachedPhoto(null)}
            className="p-1.5 rounded-xl btn-tactile text-zinc-400 hover:text-white cursor-pointer"
            title="Remover foto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Bottom Input Bar */}
      <div className="p-3 sm:p-4 bg-[#16161B]/95 border-t border-white/10 backdrop-blur-xl z-20 font-sans">
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
            className="w-11 h-11 flex items-center justify-center rounded-xl btn-tactile text-zinc-300 hover:text-white transition-all active:scale-95 cursor-pointer shrink-0 font-sans"
            title="Anexar e enquadrar foto do homenageado"
            aria-label="Anexar foto"
          >
            <Paperclip className="w-5 h-5 text-red-400" />
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
              className="w-full h-11 px-4 rounded-xl bg-[#0C0C0F] border border-white/10 focus:border-red-500/60 focus:outline-none text-white placeholder-zinc-500 text-xs sm:text-sm transition-colors font-sans card-tactile"
            />
          </div>

          {/* Exclusivity: Mic Button (Empty Input) vs Send Arrow (With Text) */}
          {inputText.trim().length === 0 && !attachedPhoto ? (
            <button
              onClick={() => setIsRecording(true)}
              className="relative w-11 h-11 flex items-center justify-center rounded-xl btn-tactile-red text-white transition-all shrink-0 cursor-pointer animate-pulse-glow"
              title="Falar por voz"
              aria-label="Gravar áudio"
            >
              <Mic className="w-5 h-5 text-white" />
            </button>
          ) : (
            <button
              onClick={handleSendMessage}
              className="w-11 h-11 flex items-center justify-center rounded-xl btn-tactile-red text-white transition-all shrink-0 cursor-pointer"
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
