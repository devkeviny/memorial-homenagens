import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  Send, 
  Play, 
  Pause, 
  Download, 
  Volume2, 
  ArrowLeft, 
  CheckCircle2, 
  Edit3, 
  Heart,
  ImageIcon,
  X
} from 'lucide-react';
import { ScreenId, ChatMessage, HistoryItem } from '../types';
import { DynamicOrb } from '../components/DynamicOrb';
import { TutorialModal } from '../components/TutorialModal';
import { ImageTouchModal } from '../components/ImageTouchModal';
import BlurText from '../components/BlurText/BlurText';
import { drawFeedImage, drawStoryImage, createSolemnAudioBlob, MemorialData } from '../utils/canvasHelper';
import { saveHomenagem } from '../lib/supabase';

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

  // Initialize single unified solemn conversation with pre-populated warm interaction
  useEffect(() => {
    const welcomeText = `Olá. Meus mais sinceros sentimentos por sua perda. Sou o Assistente Solene e estou aqui para acolher você em uma experiência única e integrada.\n\nJuntos, geraremos a **vinheta narrada em áudio** com orquestração solene e as **postagens de homenagem** (Feed 3:4 e Stories 9:16) prontas para compartilhar com a família.\n\nPor favor, me informe o nome completo, datas e local da cerimônia, ou toque no microfone para me contar por voz.`;

    const userExampleText = `Gostaria de criar uma vinheta e postagem para meu avô Antônio Carlos Ferreira. Ele nasceu em 12/03/1945 e partiu em 20/11/2026. Velório na Capela da Paz às 09h e sepultamento às 16h.`;

    const assistantReplyText = `Com profundo respeito e carinho, já organizei todas as informações de Antônio Carlos Ferreira. Podemos gerar a vinheta em áudio com voz solene e trilha orquestrada, e também as postagens comemorativas.\n\nSe desejar, anexe uma foto com o botão de foto (+) para enquadrarmos juntos. Confira os dados abaixo:`;

    const now = Date.now();
    setMessages([
      {
        id: 'msg_welcome',
        sender: 'assistant',
        text: welcomeText,
        timestamp: now - 180000
      },
      {
        id: 'msg_user_example',
        sender: 'user',
        text: userExampleText,
        timestamp: now - 120000
      },
      {
        id: 'msg_assistant_reply',
        sender: 'assistant',
        text: assistantReplyText,
        timestamp: now - 60000,
        isConfirmationCard: true,
        confirmationData: {
          nome: 'Antônio Carlos Ferreira',
          nascimento: '12/03/1945',
          falecimento: '20/11/2026',
          velorio: 'Capela da Paz • 09h00',
          sepultamento: 'Cemitério Municipal • 16h00',
          mensagem: '“Sua lembrança continuará brilhando eternamente em cada um de nós.”'
        }
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
      text: `Áudio gravado (${formatTime(recordingSeconds)}):\n"${simulatedVoiceText}"`,
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

  // Save to History helper (persiste no Supabase com fallback seguro no localStorage)
  const saveToHistory = (item: HistoryItem) => {
    saveHomenagem(item).catch((e) => {
      console.error('Failed to save to Supabase/memorial_historico:', e);
    });
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
    <div className="flex flex-col w-full h-[calc(100vh-4rem)] md:h-screen bg-transparent relative overflow-hidden select-none font-sans">
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

      {/* Top Header Bar - Full Width Horizontal & Semantic Backdrop */}
      <div className="w-full flex items-center justify-between px-4 sm:px-8 py-3.5 bg-surface/85 border-b border-hairline backdrop-blur-xl z-20 transition-colors">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="p-2 rounded-xl btn-tactile text-secondary hover:text-primary transition-all cursor-pointer font-sans"
            title="Voltar ao Início"
          >
            <ArrowLeft className="w-5 h-5 text-accent-wine" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <BlurText
                text="Assistente Solene"
                delay={40}
                animateBy="words"
                direction="top"
                className="text-base sm:text-lg font-bold text-primary font-sans tracking-tight inline-block"
              />
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <p className="text-xs sm:text-sm text-secondary font-sans">
              Vinheta em Áudio Narrado & Postagens Integradas
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-elevated border border-hairline text-xs font-semibold text-secondary font-sans shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-wine" />
          <span>Atendimento Solene</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6 max-w-4xl w-full mx-auto">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const msgDate = new Date(msg.timestamp);
          const timeStr = msgDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
          const dateStr = msgDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start animate-fadeIn font-sans`}
            >
              {/* Agent Avatar */}
              {!isUser && (
                <div className="w-10 h-10 rounded-full bg-surface-elevated border border-hairline flex items-center justify-center shrink-0 shadow-sm p-1.5 mt-0.5">
                  <img
                    src="/assets/dove-red-flower.svg"
                    alt="Assistente Solene"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              {/* Message Content & Timestamp */}
              <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[88%] sm:max-w-[80%]`}>
                {/* Balloon */}
                <div
                  className={`p-4 sm:p-5 rounded-2xl shadow-sm ${
                    isUser
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-medium rounded-tr-sm shadow-md'
                      : 'bg-surface border border-hairline text-primary rounded-tl-sm card-tactile'
                  }`}
                >
                  <div className="text-base sm:text-lg leading-relaxed whitespace-pre-line font-sans">
                    {msg.text}
                  </div>

                  {/* Structured Confirmation Card */}
                  {msg.isConfirmationCard && msg.confirmationData && (
                    <div className="mt-4 p-4 rounded-xl bg-surface-elevated border border-hairline space-y-2 card-tactile font-sans text-primary">
                      <div className="flex items-center justify-between pb-2 border-b border-hairline">
                        <span className="text-xs font-semibold text-accent-wine uppercase tracking-wider font-sans">
                          Dados Extraídos
                        </span>
                        <span className="text-[11px] text-secondary font-sans">Etapa de Verificação</span>
                      </div>

                      <div className="text-sm sm:text-base space-y-1.5 text-secondary font-sans">
                        <p><strong className="text-primary font-semibold">Nome:</strong> {msg.confirmationData.nome}</p>
                        <p><strong className="text-primary font-semibold">Nascimento:</strong> {msg.confirmationData.nascimento}</p>
                        <p><strong className="text-primary font-semibold">Falecimento:</strong> {msg.confirmationData.falecimento}</p>
                        <p><strong className="text-primary font-semibold">Velório:</strong> {msg.confirmationData.velorio}</p>
                        <p><strong className="text-primary font-semibold">Sepultamento:</strong> {msg.confirmationData.sepultamento}</p>
                        <p className="italic text-secondary pt-1 border-t border-hairline font-serif text-base sm:text-lg">
                          {msg.confirmationData.mensagem}
                        </p>
                      </div>

                      <div className="pt-3 flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => handleConfirmAndGenerate(msg.confirmationData!)}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl btn-tactile-white text-xs sm:text-sm font-semibold transition-all cursor-pointer font-sans"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span>Confirmar & Gerar Homenagem</span>
                        </button>
                        <button
                          onClick={() => setInputText(`Corrigir nome para ${msg.confirmationData?.nome}: `)}
                          className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl btn-tactile text-secondary hover:text-primary text-xs font-medium transition-colors cursor-pointer font-sans"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-accent-wine" />
                          <span>Ajustar</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Audio Deliverable Card */}
                  {msg.isAudioResult && (
                    <div className="mt-4 p-4 sm:p-5 rounded-xl bg-surface-elevated border border-hairline shadow-sm card-tactile font-sans text-primary">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-surface border border-hairline flex items-center justify-center text-accent-wine card-tactile">
                            <Volume2 className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm sm:text-base font-bold text-primary font-sans">
                              {msg.audioTitle || 'Vinheta Solene em Áudio'}
                            </h4>
                            <span className="text-xs text-secondary font-sans">Duração: {msg.audioDuration || '00:42'}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handlePlayAudio(msg.id, msg.audioTitle)}
                          className="w-10 h-10 rounded-xl btn-tactile-white flex items-center justify-center transition-all cursor-pointer"
                          title={playingMessageId === msg.id ? 'Pausar áudio' : 'Ouvir vinheta'}
                        >
                          {playingMessageId === msg.id ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4 fill-current translate-x-0.5" />
                          )}
                        </button>
                      </div>

                      {/* Audio Waveform visualization bar */}
                      <div className="flex items-center gap-1 h-6 py-1 px-2 rounded-lg bg-surface mb-3 card-tactile border border-hairline">
                        {Array.from({ length: 24 }).map((_, i) => (
                          <div
                            key={i}
                            className={`flex-1 rounded-full transition-all duration-300 ${
                              playingMessageId === msg.id
                                ? 'bg-red-600'
                                : 'bg-zinc-300 dark:bg-zinc-700'
                            }`}
                            style={{
                              height: playingMessageId === msg.id
                                ? `${Math.max(20, Math.sin(i * 0.8) * 90 + 30)}%`
                                : `${(i % 5 + 2) * 15}%`
                            }}
                          />
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-hairline">
                        <button
                          onClick={() => handleDownloadAudio(msg.audioTitle)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl btn-tactile text-primary text-xs font-semibold transition-all cursor-pointer font-sans"
                        >
                          <Download className="w-3.5 h-3.5 text-accent-wine" />
                          <span>Baixar Áudio (.wav)</span>
                        </button>

                        <button
                          onClick={onOpenPix}
                          className="text-xs text-accent-wine hover:underline flex items-center gap-1 font-sans cursor-pointer"
                        >
                          <Heart className="w-3 h-3 fill-current" />
                          <span>Apoiar Projeto</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Visual Arts Deliverable Card */}
                  {msg.isArtResult && (
                    <div className="mt-4 p-4 sm:p-5 rounded-xl bg-surface-elevated border border-hairline card-tactile font-sans text-primary">
                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-hairline">
                        <span className="text-xs font-semibold text-secondary uppercase tracking-wider font-sans">
                          Artes Oficiais de Homenagem
                        </span>
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-sans flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Prontas</span>
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                        {/* Feed 3:4 */}
                        <div className="flex flex-col items-center p-2.5 rounded-xl bg-surface border border-hairline card-tactile">
                          <div className="w-full aspect-[3/4] rounded-lg overflow-hidden bg-black/10 dark:bg-zinc-950 border border-hairline mb-2 relative group">
                            {msg.artRatio34Url ? (
                              <img
                                src={msg.artRatio34Url}
                                alt="Arte Feed 3:4"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-secondary text-xs">
                                Feed 3:4
                              </div>
                            )}
                          </div>
                          <span className="text-xs font-semibold text-primary mb-2 font-sans">
                            Feed (3:4)
                          </span>
                          <button
                            onClick={() =>
                              msg.artRatio34Url &&
                              handleDownloadImage(msg.artRatio34Url, 'homenagem-feed.png')
                            }
                            className="w-full flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg btn-tactile text-primary text-[11px] font-medium transition-colors font-sans cursor-pointer"
                          >
                            <Download className="w-3 h-3 text-accent-wine" />
                            <span>Baixar</span>
                          </button>
                        </div>

                        {/* Story 9:16 */}
                        <div className="flex flex-col items-center p-2.5 rounded-xl bg-surface border border-hairline card-tactile">
                          <div className="w-full aspect-[9/16] rounded-lg overflow-hidden bg-black/10 dark:bg-zinc-950 border border-hairline mb-2 relative group">
                            {msg.artRatio916Url ? (
                              <img
                                src={msg.artRatio916Url}
                                alt="Arte Story 9:16"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-secondary text-xs">
                                Story 9:16
                              </div>
                            )}
                          </div>
                          <span className="text-xs font-semibold text-primary mb-2 font-sans">
                            Stories (9:16)
                          </span>
                          <button
                            onClick={() =>
                              msg.artRatio916Url &&
                              handleDownloadImage(msg.artRatio916Url, 'homenagem-story.png')
                            }
                            className="w-full flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg btn-tactile text-primary text-[11px] font-medium transition-colors font-sans cursor-pointer"
                          >
                            <Download className="w-3 h-3 text-accent-wine" />
                            <span>Baixar</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Date & Time Timestamp Below Balloon */}
                <div className="px-2 mt-1.5 text-[11px] text-muted font-sans tracking-tight flex items-center gap-1.5">
                  <span>{dateStr}</span>
                  <span>•</span>
                  <span>{timeStr}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Processing Indicator with Dynamic Orb */}
        {isProcessing && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-surface border border-hairline w-fit max-w-[85%] card-tactile font-sans">
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
            className="px-6 py-4 bg-surface border-t border-hairline flex items-center justify-between z-30 shadow-lg font-sans"
          >
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
              <span className="text-xs sm:text-sm font-semibold text-primary font-sans">
                Gravando áudio solene... ({formatTime(recordingSeconds)})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRecording(false)}
                className="px-3.5 py-1.5 rounded-xl btn-tactile text-secondary hover:text-primary text-xs font-sans cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSendVoice}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl btn-tactile-white text-xs font-semibold cursor-pointer font-sans"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Enviar Áudio</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attached Photo Preview Pill */}
      {attachedPhoto && (
        <div className="px-6 py-2.5 bg-surface border-t border-hairline flex items-center justify-between z-20 font-sans">
          <div className="flex items-center gap-3">
            <img
              src={attachedPhoto}
              alt="Anexo selecionado"
              className="w-9 h-9 rounded-xl object-cover border border-hairline card-tactile"
            />
            <span className="text-xs text-secondary font-sans">Foto ajustada e pronta para a homenagem</span>
          </div>
          <button
            onClick={() => setAttachedPhoto(null)}
            className="p-1.5 rounded-xl btn-tactile text-secondary hover:text-primary cursor-pointer"
            title="Remover foto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Bottom Input Bar - Tactile Pill Shape with Min 16px font to prevent iOS zoom */}
      <div className="w-full px-4 sm:px-8 py-3.5 bg-surface/85 border-t border-hairline backdrop-blur-xl z-20 font-sans transition-colors">
        <div className="flex items-center gap-3 max-w-4xl mx-auto rounded-full bg-surface-elevated border border-hairline px-3 py-1.5 shadow-sm">
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
            className="w-10 h-10 flex items-center justify-center rounded-full text-secondary hover:text-primary hover:bg-surface transition-all cursor-pointer shrink-0 font-sans"
            title="Anexar foto"
            aria-label="Anexar foto"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          {/* Text Input - minimum 16px to prevent iOS auto-zoom */}
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
              placeholder="Escreva aqui ou toque no microfone..."
              className="w-full bg-transparent border-none focus:outline-none text-primary placeholder:text-muted text-base font-sans"
            />
          </div>

          {/* Botão Doe Pix Integrado na Barra de Digitação */}
          <button
            type="button"
            onClick={onOpenPix}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-surface border border-hairline text-accent-wine hover:text-red-700 dark:hover:text-red-400 transition-all text-xs font-bold tracking-wide uppercase shrink-0 cursor-pointer shadow-sm font-sans"
            title="Fazer contribuição via PIX"
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Doe Pix</span>
          </button>

          {/* Mic Button vs Send Arrow */}
          {inputText.trim().length === 0 && !attachedPhoto ? (
            <button
              onClick={() => setIsRecording(true)}
              className="relative w-11 h-11 flex items-center justify-center rounded-full btn-tactile text-accent-wine transition-all shrink-0 cursor-pointer shadow-sm"
              title="Falar por voz"
              aria-label="Gravar áudio"
            >
              <Mic className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSendMessage}
              className="relative w-11 h-11 flex items-center justify-center rounded-full btn-tactile-white transition-all shrink-0 cursor-pointer shadow-sm"
              title="Enviar mensagem"
              aria-label="Enviar"
            >
              <Send className="w-5 h-5 ml-0.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
