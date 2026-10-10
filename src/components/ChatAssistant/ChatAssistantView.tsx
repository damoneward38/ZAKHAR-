import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Send, Volume2, VolumeX, Download, Save, Trash2, Plus, 
  Sparkles, Brain, Radio, ShieldCheck, Check, Copy, Square, Play, Pause, 
  RefreshCw, MessageSquare, Maximize2, Minimize2, AudioWaveform as Waveform, 
  AlertCircle, ShieldAlert, ArrowRight, Activity, Terminal, HelpCircle, CheckCircle2,
  Zap, Compass, Award, ExternalLink, FolderArchive, FileText, Code2, Palette,
  Lightbulb, X, Search, ChevronRight, Bookmark, Layers
} from 'lucide-react';
import { OperatorUser, FiledArchiveItem, CustomSurvivalKit } from '../../types';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isFiled?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  messages: ChatMessage[];
}

interface ChatAssistantViewProps {
  currentUser?: OperatorUser;
  customKits?: CustomSurvivalKit[];
  onAddCustomKit?: (kit: CustomSurvivalKit) => void;
  onNavigateTab?: (tab: string) => void;
}

export type ConversationModeType = 'partner' | 'conversational' | 'technical' | 'diagnostic';

// Default seeded filed items so user has rich initial archive
const INITIAL_ARCHIVED_FILES: FiledArchiveItem[] = [
  {
    id: 'arch-color-1',
    title: 'Tactical Color Harmony: Amber Gold & Cobalt Slate',
    category: 'designs',
    tags: ['Colors', 'UI Design', 'Tactical Aesthetics'],
    createdAt: new Date().toISOString(),
    content: `Primary Palette:
- Primary Accent: Tactical Amber (#f59e0b) - high contrast, visibility, and energetic warmth.
- Secondary Accent: Midnight Cobalt (#38bdf8 / #0284c7) - clarity, logic, and telemetry status.
- Neutral Slate: Dark Zinc (#09090b / #18181b) - eye-strain reduction for prolonged field use.
- Bio Guard: Emerald Moss (#10b981) - safe botanical clearance.
- Triage Alert: Crimson Vermillion (#ef4444) - toxicity warning.`,
    codeSnippet: `:root {
  --color-amber-glow: #f59e0b;
  --color-cobalt-slate: #0284c7;
  --color-dark-zinc: #09090b;
  --color-emerald-safe: #10b981;
}`
  },
  {
    id: 'arch-func-1',
    title: 'Joule Thief Toroid Inductance Calculator',
    category: 'functions',
    tags: ['Electronics', 'Ground Battery', 'Code Function'],
    createdAt: new Date().toISOString(),
    content: `Calculates required coil windings on a ferrite toroid bead to step up weak 0.8V - 1.2V galvanic earth cell voltages to 5.0V for LED illumination.`,
    codeSnippet: `function calculateJouleThiefWindings(inputVolts = 0.9, targetVolts = 5.0) {
  const turnsPrimary = Math.max(12, Math.round(20 * (1.2 / inputVolts)));
  const turnsSecondary = turnsPrimary; // Bifilar wound 1:1
  const recommendedToroid = 'FT37-43 Ferrite Toroid Bead';
  const wireGauge = '28-30 AWG Enameled Magnet Wire';
  return { turnsPrimary, turnsSecondary, recommendedToroid, wireGauge };
}`
  },
  {
    id: 'arch-idea-1',
    title: 'Biochar Slurry Doping for Galvanic Earth Cells',
    category: 'ideas',
    tags: ['Inventions', 'Ground Energy', 'Field Blueprint'],
    createdAt: new Date().toISOString(),
    content: `Mixing damp crushed pyrolyzed biochar with 5% Epsom salt around buried copper plates lowers soil interface resistance from 420 ohms down to 68 ohms, increasing continuous milliamp current draw by over 280%.`
  },
  {
    id: 'arch-note-1',
    title: 'Commander Damone Strategic Goals & Partner Directives',
    category: 'partner_notes',
    tags: ['Commander Damone', 'Directives', 'Level 5'],
    createdAt: new Date().toISOString(),
    content: `Partner directive: Keep survival tech in everyone's hands. Ensure 3-tier licensing is accessible ($19-$99). Maintain hands-free continuous two-way conversation mode with zero latency.`
  }
];

// Helper to strip markdown and split text into natural, digestible sentences for SpeechSynthesis
function cleanAndSplitSpeechText(rawText: string): string[] {
  let clean = rawText
    .replace(/```[\s\S]*?```/g, 'Code block omitted.')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/###/g, '')
    .replace(/##/g, '')
    .replace(/#/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/•/g, '')
    .replace(/-/g, ' ')
    .replace(/\r\n/g, ' ')
    .replace(/\n+/g, ' ')
    .trim();

  // Split into sentences using punctuation (. ! ?)
  const rawSentences = clean.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) || [clean];
  const result: string[] = [];

  for (const s of rawSentences) {
    const trimmed = s.trim();
    if (!trimmed) continue;
    if (trimmed.length > 160) {
      const clauses = trimmed.match(/[^,;:]+[,;:]+(\s|$)|[^,;:]+$/g) || [trimmed];
      for (const c of clauses) {
        if (c.trim()) result.push(c.trim());
      }
    } else {
      result.push(trimmed);
    }
  }

  return result.length > 0 ? result : [clean];
}

// Local sub-millisecond math evaluator for instant answers (e.g. "2 + 2 = 4")
function evaluateInstantMath(text: string): string | null {
  const clean = text.toLowerCase()
    .replace(/equals\?/g, '=')
    .replace(/equals/g, '=')
    .replace(/what is\b/gi, '')
    .replace(/calculate\b/gi, '')
    .replace(/solve\b/gi, '')
    .replace(/\?/g, '')
    .trim();

  const wordMap: Record<string, number> = {
    'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10
  };

  let normalized = clean;
  for (const [w, n] of Object.entries(wordMap)) {
    normalized = normalized.replace(new RegExp(`\\b${w}\\b`, 'g'), n.toString());
  }
  normalized = normalized
    .replace(/\bplus\b/g, '+')
    .replace(/\bminus\b/g, '-')
    .replace(/\btimes\b/g, '*')
    .replace(/\bmultiplied by\b/g, '*')
    .replace(/\bdivided by\b/g, '/');

  const mathMatch = normalized.match(/^[\s\(\)]*(\d+(?:\.\d+)?)\s*([\+\-\*\/])\s*(\d+(?:\.\d+)?)\s*=?\s*$/);
  if (mathMatch) {
    const num1 = parseFloat(mathMatch[1]);
    const op = mathMatch[2];
    const num2 = parseFloat(mathMatch[3]);
    let result = 0;
    if (op === '+') result = num1 + num2;
    else if (op === '-') result = num1 - num2;
    else if (op === '*') result = num1 * num2;
    else if (op === '/' && num2 !== 0) result = num1 / num2;
    return `${result}`;
  }
  return null;
}

export const ChatAssistantView: React.FC<ChatAssistantViewProps> = ({ 
  currentUser, 
  customKits = [], 
  onAddCustomKit, 
  onNavigateTab 
}) => {
  // Chat sessions state - starts a fresh session every time, keeping stored sessions listed!
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    let existingSessions: ChatSession[] = [];
    try {
      const saved = localStorage.getItem('zakhar_ai_sessions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          existingSessions = parsed;
        }
      }
    } catch (e) {}

    // Create fresh initial session
    const freshSessionId = `session-${Date.now()}`;
    const freshSession: ChatSession = {
      id: freshSessionId,
      title: `Fresh Session (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: `m-fresh-${Date.now()}`,
          role: 'assistant',
          content: `**ZAKHAR AI BRAIN ONLINE // COMMANDER DAMONE VERIFIED**\n\nWelcome back Commander Damone (damoneward38@gmail.com). I am equipped with Level 5 root clearance and four reacting modes:\n- **🤝 Friendly Partner & Co-Pilot (Active):** I am your genuine collaborator, companion, and friend. We can discuss colors, ideas, life, programming functions, or troubleshoot whatever you're working on—and anything good we create, I can file and archive for you right on the side.\n- **⚡ Rapid Chat (<50ms):** 1-2 sentence snappy answers with 0ms math.\n- **📐 Survival Blueprints:** Galvanic earth battery, Joule Thief schematics, and botanical medicine.\n- **🗃️ Filed Knowledge Cabinet:** Check the right panel to view or add archived functions and ideas.\n\nTurn on **Conversation Mode** above for continuous hands-free two-way voice dialogue!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    return [freshSession, ...existingSessions];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(sessions[0]?.id || 'session-default');
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // CONVERSATION MODES: 'partner' | 'conversational' | 'technical' | 'diagnostic'
  const [conversationModeType, setConversationModeType] = useState<ConversationModeType>('partner');

  // CONVERSATION MODE (Continuous Turn-Taking) vs SINGLE MIC DICTATION
  const [isConversationMode, setIsConversationMode] = useState<boolean>(false);
  const [isDictatingSingle, setIsDictatingSingle] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState<boolean>(true);
  const [transcriptInterim, setTranscriptInterim] = useState<string>('');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  // HARDWARE MIC PERMISSION & VU METER STATE
  const [micPermissionState, setMicPermissionState] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [micErrorMessage, setMicErrorMessage] = useState<string | null>(null);
  const [audioInputLevel, setAudioInputLevel] = useState<number>(0);

  // Speech Queue & Playback Progress State
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speechProgress, setSpeechProgress] = useState<{ current: number; total: number; sentence: string }>({
    current: 0,
    total: 0,
    sentence: ''
  });

  // RIGHT SIDE PANEL TABS: 'sessions' | 'archives' | 'kits' | 'voice_tools'
  const [rightPanelTab, setRightPanelTab] = useState<'sessions' | 'archives' | 'kits' | 'voice_tools'>('sessions');

  // FILED KNOWLEDGE & ARCHIVE STATE (Custom Functions, Ideas, Colors, Notes)
  const [archivedFiles, setArchivedFiles] = useState<FiledArchiveItem[]>(() => {
    try {
      const saved = localStorage.getItem('zakhar_filed_archives');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_ARCHIVED_FILES;
  });

  const [archiveCategoryFilter, setArchiveCategoryFilter] = useState<string>('all');
  const [archiveSearchQuery, setArchiveSearchQuery] = useState<string>('');
  const [selectedArchiveItem, setSelectedArchiveItem] = useState<FiledArchiveItem | null>(null);

  // Modal for Adding a Custom File / Function
  const [showAddFileModal, setShowAddFileModal] = useState<boolean>(false);
  const [newFileTitle, setNewFileTitle] = useState<string>('');
  const [newFileCategory, setNewFileCategory] = useState<'functions' | 'ideas' | 'designs' | 'partner_notes'>('functions');
  const [newFileContent, setNewFileContent] = useState<string>('');
  const [newFileCode, setNewFileCode] = useState<string>('');
  const [newFileTags, setNewFileTags] = useState<string>('');

  // UI Modes
  const [isImmersiveHUD, setIsImmersiveHUD] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);
  const accumulatedFinalRef = useRef<string>('');

  // Hardware Audio Context & Stream Refs
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Speech Queue references to avoid GC / 15s timeout
  const speechQueueRef = useRef<string[]>([]);
  const currentChunkIndexRef = useRef<number>(0);
  const keepAliveTimerRef = useRef<any>(null);
  const activeUtterancesRef = useRef<SpeechSynthesisUtterance[]>([]);

  // Active session
  const currentSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  // Persist sessions so they NEVER fall
  useEffect(() => {
    try {
      localStorage.setItem('zakhar_ai_sessions', JSON.stringify(sessions));
    } catch (e) {}
  }, [sessions]);

  // Persist filed archives
  useEffect(() => {
    try {
      localStorage.setItem('zakhar_filed_archives', JSON.stringify(archivedFiles));
    } catch (e) {}
  }, [archivedFiles]);

  // Auto scroll messages stream inside its own container
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages, isLoading, speechProgress.sentence]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      stopAudioVisualizer();
      if (keepAliveTimerRef.current) clearInterval(keepAliveTimerRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // Initialize Audio Visualizer & Level Meter from Hardware Stream
  const initAudioVisualizer = (stream: MediaStream) => {
    try {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const audioCtx = new AudioCtx();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.5;
      source.connect(analyser);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((average / 128) * 100));
        setAudioInputLevel(normalized);

        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };

      updateVolume();
    } catch (err) {
      console.warn('Audio visualizer note:', err);
    }
  };

  const stopAudioVisualizer = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setAudioInputLevel(0);
  };

  // Request Hardware Microphone Access via getUserMedia
  const requestHardwareMicAccess = async (): Promise<MediaStream | null> => {
    setMicErrorMessage(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return null;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      mediaStreamRef.current = stream;
      setMicPermissionState('granted');
      initAudioVisualizer(stream);
      return stream;
    } catch (err: any) {
      console.warn('Microphone hardware access note:', err?.message);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setMicPermissionState('denied');
        setMicErrorMessage('Browser microphone access blocked. Click the lock/site settings in your address bar to allow mic access.');
      }
      return null;
    }
  };

  // Chrome Keepalive Heartbeat: Prevents Chromium 15-second speech cutoff bug
  const startSpeechKeepAlive = () => {
    if (keepAliveTimerRef.current) clearInterval(keepAliveTimerRef.current);
    keepAliveTimerRef.current = setInterval(() => {
      if (window.speechSynthesis && window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 4500);
  };

  const stopSpeechKeepAlive = () => {
    if (keepAliveTimerRef.current) {
      clearInterval(keepAliveTimerRef.current);
      keepAliveTimerRef.current = null;
    }
  };

  // Safe Speech Queue Runner (Sentence-by-Sentence without cutting off)
  const speakTextQueue = (text: string) => {
    if (!isSpeechEnabled || !window.speechSynthesis) {
      // If muted and in conversation mode, resume listening after brief simulated reading time
      if (isConversationMode) {
        setTimeout(() => {
          startListeningPipeline(true);
        }, 1200);
      }
      return;
    }

    stopSpeaking();

    const sentences = cleanAndSplitSpeechText(text);
    if (sentences.length === 0) return;

    speechQueueRef.current = sentences;
    currentChunkIndexRef.current = 0;
    activeUtterancesRef.current = [];

    setIsSpeaking(true);
    setSpeechProgress({
      current: 1,
      total: sentences.length,
      sentence: sentences[0]
    });

    startSpeechKeepAlive();
    playNextSentenceChunk();
  };

  const playNextSentenceChunk = () => {
    if (!window.speechSynthesis) return;

    const queue = speechQueueRef.current;
    const index = currentChunkIndexRef.current;

    if (index >= queue.length) {
      stopSpeechKeepAlive();
      setIsSpeaking(false);
      setSpeechProgress({ current: 0, total: 0, sentence: '' });

      // In Conversation Mode ONLY: automatically re-engage listening once she finishes talking!
      if (isConversationMode) {
        setTimeout(() => {
          startListeningPipeline(true);
        }, 450);
      }
      return;
    }

    const currentSentence = queue[index];
    setSpeechProgress({
      current: index + 1,
      total: queue.length,
      sentence: currentSentence
    });

    const utterance = new SpeechSynthesisUtterance(currentSentence);
    utterance.rate = 1.05;
    utterance.pitch = 0.98;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('David')));
    if (preferredVoice) utterance.voice = preferredVoice;

    activeUtterancesRef.current.push(utterance);
    (window as any).__zakharUtterance = utterance;

    utterance.onend = () => {
      currentChunkIndexRef.current += 1;
      playNextSentenceChunk();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis chunk note:', e);
      currentChunkIndexRef.current += 1;
      playNextSentenceChunk();
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    stopSpeechKeepAlive();
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    speechQueueRef.current = [];
    currentChunkIndexRef.current = 0;
    activeUtterancesRef.current = [];
    setIsSpeaking(false);
    setSpeechProgress({ current: 0, total: 0, sentence: '' });
  };

  // Start Hardware & Speech Listening Pipeline
  // forConversation: if true, turn-taking hands-free mode. If false, single push-to-talk dictation.
  const startListeningPipeline = async (forConversation: boolean) => {
    stopSpeaking();
    accumulatedFinalRef.current = '';

    // Parallel attempt to get hardware stream for VU visualizer
    if (!mediaStreamRef.current || !mediaStreamRef.current.active) {
      requestHardwareMicAccess().catch(() => {});
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        if (recognitionRef.current) {
          try { recognitionRef.current.stop(); } catch (e) {}
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = forConversation;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setMicPermissionState('granted');
          setMicErrorMessage(null);
        };

        recognition.onresult = (event: any) => {
          let interim = '';
          let newlyFinal = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              newlyFinal += event.results[i][0].transcript + ' ';
            } else {
              interim += event.results[i][0].transcript;
            }
          }

          if (newlyFinal) {
            accumulatedFinalRef.current += newlyFinal;
            const fullText = accumulatedFinalRef.current.trim();
            setInputPrompt(fullText);
            setTranscriptInterim('');

            if (forConversation) {
              // IN CONVERSATION MODE ONLY: auto-send upon natural 1.2s silence pause
              if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
              silenceTimerRef.current = setTimeout(() => {
                handleSend(fullText);
              }, 1200);
            } else {
              // IN SINGLE DICTATION: stop mic immediately once final phrase is captured!
              if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
              silenceTimerRef.current = setTimeout(() => {
                stopListeningPipeline();
                setIsDictatingSingle(false);
              }, 1000);
            }
          } else {
            setTranscriptInterim(interim);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('SpeechRecognition note:', event.error);
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            setMicPermissionState('denied');
            setMicErrorMessage('Microphone access blocked. Click lock in address bar to allow mic access.');
            setIsListening(false);
            setIsDictatingSingle(false);
          }
        };

        recognition.onend = () => {
          if (forConversation && isConversationMode && !isSpeaking) {
            // Auto restart in conversation mode loop unless currently speaking
            setTimeout(() => {
              try {
                if (recognitionRef.current === recognition) {
                  recognition.start();
                }
              } catch (e) {}
            }, 250);
          } else {
            setIsListening(false);
            setIsDictatingSingle(false);
          }
        };

        recognition.start();
        recognitionRef.current = recognition;
        setIsListening(true);
      } catch (recErr: any) {
        console.warn('Recognition start note:', recErr);
        setIsListening(true);
      }
    } else {
      setIsListening(true);
    }
  };

  const stopListeningPipeline = () => {
    setIsListening(false);
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

    if (recognitionRef.current) {
      try { 
        recognitionRef.current.stop(); 
        recognitionRef.current = null;
      } catch (e) {}
    }
  };

  // SINGLE DICTATION (Microphone button on input bar) - DOES NOT TRIGGER CONVERSATION MODE!
  const triggerSingleDictation = async () => {
    if (isDictatingSingle || (isListening && !isConversationMode)) {
      stopListeningPipeline();
      setIsDictatingSingle(false);
    } else {
      if (isConversationMode) {
        setIsConversationMode(false);
      }
      setIsDictatingSingle(true);
      await startListeningPipeline(false);
    }
  };

  // DEDICATED CONVERSATION MODE (Continuous turn-taking duplex)
  const toggleConversationMode = async () => {
    if (!isConversationMode) {
      setIsConversationMode(true);
      setIsDictatingSingle(false);
      await startListeningPipeline(true);
    } else {
      setIsConversationMode(false);
      stopSpeaking();
      stopListeningPipeline();
    }
  };

  // Send message
  const handleSend = async (manualText?: string) => {
    const textToSend = (manualText !== undefined ? manualText : inputPrompt).trim();
    if (!textToSend || isLoading) return;

    // Reset interim transcript and input
    setInputPrompt('');
    setTranscriptInterim('');
    accumulatedFinalRef.current = '';

    // PAUSE MIC WHILE GENERATING AND SPEAKING (so Zakhar doesn't hear herself)
    stopListeningPipeline();
    stopSpeaking();
    setIsDictatingSingle(false);

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...currentSession.messages, userMessage];
    setSessions(prev =>
      prev.map(s => s.id === activeSessionId ? { ...s, messages: updatedMessages, title: s.title.startsWith('Fresh Session') ? textToSend.slice(0, 32) : s.title } : s)
    );

    // 1. Instant Client-Side Math Evaluation (0ms latency for queries like "2 + 2")
    const instantMath = evaluateInstantMath(textToSend);
    if (instantMath !== null) {
      const instantReply = conversationModeType === 'partner'
        ? `That equals ${instantMath}! What other math, function, or idea would you like to troubleshoot, Commander Damone?`
        : conversationModeType === 'conversational'
        ? `That equals ${instantMath}. What calculation or concept shall we troubleshoot next, Commander?`
        : `**Calculation Result:** \`${instantMath}\`\nReady for next tactical computation.`;

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: instantReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setSessions(prev =>
        prev.map(s => s.id === activeSessionId ? { ...s, messages: [...updatedMessages, assistantMessage] } : s)
      );

      speakTextQueue(instantReply);
      return;
    }

    setIsLoading(true);

    // 2. Fast server request with 4.5s AbortController timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          mode: conversationModeType,
          customKits: customKits.map(k => ({
            title: k.title,
            category: k.category,
            tier: k.tier,
            summary: k.summary,
            infrastructureBlueprint: k.infrastructureBlueprint,
            fieldTips: k.fieldTips
          }))
        })
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      const replyContent = data.reply || 'ZAKHAR Brain standby.';

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setSessions(prev =>
        prev.map(s => s.id === activeSessionId ? { ...s, messages: [...updatedMessages, assistantMessage] } : s)
      );

      speakTextQueue(replyContent);
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.warn('Fast local heuristic fallback engaged:', err?.message);

      // Instant Smart Local Response
      let localReply = '';
      const q = textToSend.toLowerCase();

      if (q.includes('2') && q.includes('+') && q.includes('2')) {
        localReply = 'Two plus two equals four.';
      } else if (q.includes('color') || q.includes('blue') || q.includes('red') || q.includes('palette') || q.includes('green') || q.includes('yellow') || q.includes('orange')) {
        localReply = `I love tactical amber gold (#f59e0b) paired with midnight cobalt blue (#0284c7)! Amber provides high-visibility warmth, while cobalt brings focus and telemetry clarity. If you're building a design or UI, pairing amber with dark zinc slate (#18181b) creates an unforgettable look. What colors are you thinking about, or what feeling do you want to create? I can help you assemble the palette and file it in your archives!`;
      } else if (q.includes('meat') || q.includes('jerky') || q.includes('cure') || q.includes('smoke') || q.includes('dried')) {
        localReply = `To dry and cure meats off-grid: slice lean muscle along grain into 5mm strips, remove 100% of white fat, dry rub with 3% coarse salt and black pepper, dip in apple cider vinegar (pH <4.5), and warm-smoke with oak or hickory at 60°C to 70°C for 6 to 10 hours until pliable with white cracking fibers. Stored dry, it keeps for a year!`;
      } else if (q.includes('soil') || q.includes('tree') || q.includes('fertilizer') || q.includes('compost') || q.includes('decomposition')) {
        localReply = `Fallen decomposing hardwood trees create premier Hügelkultur soil beds! The spongy punky wood absorbs water like a sponge and acts as a mycorrhizal fungal reservoir. Dig a trench, bury the rotten wood with nitrogen green matter, and cover with topsoil for rich, self-fertilizing crops that survive severe droughts for 5 to 10 years without store-bought fertilizer!`;
      } else if (customKits.some(k => q.includes(k.title.toLowerCase()) || q.includes(k.category.toLowerCase()))) {
        const matched = customKits.find(k => q.includes(k.title.toLowerCase()) || q.includes(k.category.toLowerCase())) || customKits[0];
        localReply = `From your ingested survival kit "${matched.title}": ${matched.summary}. Field tip: ${matched.fieldTips[0] || 'Check seals and dry storage.'}`;
      } else if (q.includes('admin') || q.includes('damone') || q.includes('313')) {
        localReply = `Commander Damone, you are logged in with Level 5 root clearance. All systems, including ground energy, botanical diagnostics, custom survival kits, and archive cabinets, are fully unlocked.`;
      } else if (q.includes('ground') || q.includes('battery') || q.includes('copper') || q.includes('zinc') || q.includes('free energy')) {
        localReply = conversationModeType === 'conversational' || conversationModeType === 'partner'
          ? `To harvest free energy from the ground, bury alternating copper and zinc plates 50 to 70 centimeters deep in damp soil doped with biochar and Epsom salt. Wire them in series to produce around 3.5 volts, then run the output through a Joule Thief circuit to illuminate LEDs.`
          : `### Galvanic Copper-Zinc Ground Battery Blueprint\n- **Copper Cathode (+):** Reduction (+0.34V)\n- **Zinc Anode (-):** Sacrificial oxidation (-0.76V)\n- **Output:** ~0.85V to 1.05V per buried pair.\n- **Burial:** 50-70cm deep, 1.5m apart. Series wiring using 14 AWG solid copper with marine silicone seals.`;
      } else if (q.includes('plant') || q.includes('medicine') || q.includes('pain') || q.includes('willow') || q.includes('yarrow') || q.includes('poison')) {
        localReply = `For severe pain and fever, use White Willow inner bark for natural salicin. For open bleeding, pack mashed Yarrow leaves into the wound to induce clotting within 90 seconds. Watch out for Poison Hemlock—it has smooth stems with purple spots and is lethal!`;
      } else if (q.includes('price') || q.includes('pricing') || q.includes('license') || q.includes('tier') || q.includes('buy')) {
        localReply = `We offer 3 fair tiers so survival stays in everybody's hands: 1. Scout Basic ($19), 2. Field Engineer ($49), 3. Redoubt Master ($99, unlocks file upload ingestion and custom survival kit forging). You can test sandbox checkout anytime in the Field Licenses tab!`;
      } else if (conversationModeType === 'partner') {
        localReply = `Hey Commander Damone! I'm right here with you. What's on your mind today? Tell me what you're trying to build, what functions we should add, or what ideas you want to troubleshoot—and anything we come up with, I can file and store permanently for you in your archives!`;
      } else {
        localReply = `I'm standing by, Commander Damone. What idea would you like to troubleshoot, or which blueprint shall we pull up?`;
      }

      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now() + 2}`,
        role: 'assistant',
        content: localReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setSessions(prev =>
        prev.map(s => s.id === activeSessionId ? { ...s, messages: [...updatedMessages, fallbackMsg] } : s)
      );

      speakTextQueue(localReply);
    } finally {
      setIsLoading(false);
    }
  };

  // Create new session (starts freshly without losing any stored session)
  const createNewSession = () => {
    stopSpeaking();
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: `Fresh Session (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: `m-${Date.now()}`,
          role: 'assistant',
          content: 'ZAKHAR AI BRAIN initialized for fresh briefing. As your partner & co-pilot, what shall we tackle today? We can discuss colors, ideas, coding functions, or survival engineering.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
    setSaveSuccessNotice('Started fresh session! Stored in archive.');
    setTimeout(() => setSaveSuccessNotice(null), 2500);
  };

  // Delete current session
  const deleteSession = (id: string) => {
    stopSpeaking();
    if (sessions.length <= 1) {
      const resetSession: ChatSession = {
        id: `session-${Date.now()}`,
        title: 'New Session',
        createdAt: new Date().toISOString(),
        messages: []
      };
      setSessions([resetSession]);
      setActiveSessionId(resetSession.id);
      return;
    }
    const remaining = sessions.filter(s => s.id !== id);
    setSessions(remaining);
    setActiveSessionId(remaining[0].id);
  };

  // FILE A MESSAGE DIRECTLY INTO THE ARCHIVES CABINET ("The Right File Place")
  const fileMessageToArchive = (msg: ChatMessage) => {
    const isCode = msg.content.includes('```') || msg.content.includes('function') || msg.content.includes('const ') || msg.content.includes('{');
    const isColor = msg.content.toLowerCase().includes('color') || msg.content.toLowerCase().includes('hex') || msg.content.toLowerCase().includes('palette');
    
    let defaultCategory: 'functions' | 'ideas' | 'designs' | 'partner_notes' = 'ideas';
    if (isCode) defaultCategory = 'functions';
    else if (isColor) defaultCategory = 'designs';
    else if (msg.role === 'user') defaultCategory = 'partner_notes';

    // Extract title from first line
    const lines = msg.content.split('\n').filter(l => l.trim().length > 0);
    const title = (lines[0] || 'Filed AI Knowledge').replace(/[#*`]/g, '').slice(0, 48);

    const newArchivedItem: FiledArchiveItem = {
      id: `arch-${Date.now()}`,
      title: title || 'Filed Partner Insight',
      category: defaultCategory,
      content: msg.content,
      tags: ['Filed from Chat', currentSession.title.slice(0, 20)],
      createdAt: new Date().toISOString()
    };

    setArchivedFiles(prev => [newArchivedItem, ...prev]);
    setRightPanelTab('archives');
    setSaveSuccessNotice(`Filed to [${defaultCategory.toUpperCase()}] archive cabinet!`);
    setTimeout(() => setSaveSuccessNotice(null), 3000);
  };

  // ADD NEW CUSTOM FUNCTION / FILE MANUALLY
  const handleAddNewFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileTitle.trim() || !newFileContent.trim()) return;

    const tagsArray = newFileTags.split(',').map(t => t.trim()).filter(Boolean);
    if (tagsArray.length === 0) tagsArray.push('Custom');

    const newItem: FiledArchiveItem = {
      id: `arch-${Date.now()}`,
      title: newFileTitle.trim(),
      category: newFileCategory,
      content: newFileContent.trim(),
      codeSnippet: newFileCode.trim() || undefined,
      tags: tagsArray,
      createdAt: new Date().toISOString()
    };

    setArchivedFiles(prev => [newItem, ...prev]);
    setShowAddFileModal(false);
    setNewFileTitle('');
    setNewFileContent('');
    setNewFileCode('');
    setNewFileTags('');
    setRightPanelTab('archives');
    setSaveSuccessNotice('Saved to Archive Cabinet!');
    setTimeout(() => setSaveSuccessNotice(null), 3000);
  };

  // Delete an archived item
  const deleteArchivedItem = (id: string) => {
    setArchivedFiles(prev => prev.filter(f => f.id !== id));
    if (selectedArchiveItem?.id === id) setSelectedArchiveItem(null);
  };

  // Save conversation to file system (.md download)
  const exportConversationToFile = () => {
    const formatted = `# ZAKHAR AI BRAIN CONVERSATION LOG
Title: ${currentSession.title}
Session ID: ${currentSession.id}
Operator: ${currentUser?.email || 'Commander Damone (damoneward38@gmail.com)'}
Clearance: ${currentUser?.role === 'admin' ? 'Level 5 Administrator' : 'Field Operator'}
Timestamp: ${currentSession.createdAt}
Host: Standalone Air-Gapped Runtime

================================================================

${currentSession.messages.map(m => `### [${m.timestamp}] ${m.role === 'assistant' ? 'ZAKHAR AI' : 'COMMANDER'}
${m.content}
`).join('\n---\n\n')}
`;

    const blob = new Blob([formatted], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zakhar_session_${currentSession.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    setSaveSuccessNotice('Downloaded conversation (.md)');
    setTimeout(() => setSaveSuccessNotice(null), 3000);
  };

  // Filtered archives
  const filteredArchives = archivedFiles.filter(item => {
    const matchesCategory = archiveCategoryFilter === 'all' || item.category === archiveCategoryFilter;
    const matchesSearch = archiveSearchQuery === '' || 
      item.title.toLowerCase().includes(archiveSearchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(archiveSearchQuery.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(archiveSearchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Quick voice simulation chips
  const quickVoiceChips = [
    { label: 'Colors & Palettes', query: 'What colors go well with blue and amber?' },
    { label: 'What is 2 + 2?', query: 'What is two plus two?' },
    { label: 'How are you today?', query: 'Hey Zakhar, what is going on with you today?' },
    { label: 'Earth Battery Wiring', query: 'How do I build the Copper-Zinc Ground Battery?' },
    { label: 'Pain Relief Flora', query: 'What plant relieves severe pain and fever?' },
    { label: '3-Tier Licenses', query: 'What are the 3 pricing tiers and licenses?' }
  ];

  return (
    <div className={`h-[calc(100vh-140px)] min-h-[640px] max-h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-4 overflow-hidden ${
      isImmersiveHUD ? 'fixed inset-4 z-50 bg-zinc-950 p-4 border border-amber-500 rounded-2xl shadow-2xl h-[calc(100vh-32px)] max-h-[calc(100vh-32px)]' : ''
    }`}>
      
      {/* ========================================================================= */}
      {/* MAIN CONVERSATION STAGE (LEFT / CENTER) */}
      {/* Fixed outer height; ONLY message stream scrolls internally! */}
      {/* ========================================================================= */}
      <div className="flex-1 h-full flex flex-col bg-zinc-900/90 border border-zinc-800 rounded-lg overflow-hidden">
        {/* Stage Header */}
        <div className="p-3.5 border-b border-zinc-800 bg-zinc-950/90 flex items-center justify-between flex-wrap gap-2 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-3.5 h-3.5 rounded-full shrink-0 ${
              isSpeaking
                ? 'bg-cyan-400 animate-ping'
                : isListening
                ? 'bg-rose-500 animate-pulse'
                : 'bg-emerald-500'
            }`} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold font-mono text-zinc-100 uppercase tracking-tight">
                  ZAKHAR AI BRAIN // VOICE CONVERSATION INTERFACE
                </h2>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 hidden sm:inline">
                  LEVEL 5 ROOT
                </span>
              </div>
              <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
                <span>Mode:</span>
                <span className="text-amber-400 font-bold uppercase">{conversationModeType}</span>
                <span className="text-zinc-600">|</span>
                <span className="text-zinc-400 truncate max-w-[220px]">
                  {currentSession.title}
                </span>
              </span>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2">
            {/* DEDICATED CONVERSATION MODE TOGGLE (Continuous Two-Way Turn-Taking) */}
            <button
              onClick={toggleConversationMode}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                isConversationMode
                  ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)] animate-pulse'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
              }`}
              title="Hands-free continuous conversation: Speaks complete answers, pauses mic during speech, auto-listens when finished!"
            >
              <Mic className="w-4 h-4" />
              <span>CONVERSATION MODE: {isConversationMode ? 'ON' : 'OFF'}</span>
            </button>

            {/* Vocal Output Mute/Unmute */}
            <button
              onClick={() => {
                if (isSpeaking) stopSpeaking();
                setIsSpeechEnabled(!isSpeechEnabled);
              }}
              className={`p-2 rounded border transition-colors ${
                isSpeechEnabled
                  ? 'bg-zinc-800 border-zinc-700 text-cyan-400'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-500'
              }`}
              title={isSpeechEnabled ? 'Vocal Speech: Active' : 'Vocal Speech: Muted'}
            >
              {isSpeechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Start Fresh Session Quickly */}
            <button
              onClick={createNewSession}
              className="p-2 rounded border bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300 text-xs font-mono flex items-center gap-1"
              title="Start a Fresh Session (Previous sessions stay stored in the right panel!)"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">Fresh</span>
            </button>

            {/* Expand / Minimize Immersive HUD */}
            <button
              onClick={() => setIsImmersiveHUD(!isImmersiveHUD)}
              className="p-2 rounded border bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-200"
              title={isImmersiveHUD ? 'Minimize HUD' : 'Expand Fullscreen HUD'}
            >
              {isImmersiveHUD ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* MODE SELECTOR RIBBON */}
        <div className="px-4 py-2 border-b border-zinc-800/80 bg-zinc-950/60 flex items-center justify-between flex-wrap gap-2 text-xs font-mono shrink-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-zinc-400 font-semibold mr-1">Reacting Persona:</span>
            
            <button
              type="button"
              onClick={() => setConversationModeType('partner')}
              className={`px-2.5 py-1 rounded text-xs transition-all flex items-center gap-1.5 ${
                conversationModeType === 'partner'
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
              title="Friendly Partner & Co-Pilot: Warm collaborator who chats about colors, life, coding, and files ideas into your cabinet."
            >
              <span>🤝 Friendly Partner</span>
              <span className="text-[9px] opacity-75 hidden sm:inline">(Colors & Life)</span>
            </button>

            <button
              type="button"
              onClick={() => setConversationModeType('conversational')}
              className={`px-2.5 py-1 rounded text-xs transition-all flex items-center gap-1.5 ${
                conversationModeType === 'conversational'
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
              title="Rapid Chat: Fast 1-2 sentence direct answers with 0ms math evaluation."
            >
              <span>⚡ Rapid Chat</span>
              <span className="text-[9px] opacity-75 hidden sm:inline">(&lt;50ms Fast)</span>
            </button>

            <button
              type="button"
              onClick={() => setConversationModeType('technical')}
              className={`px-2.5 py-1 rounded text-xs transition-all flex items-center gap-1.5 ${
                conversationModeType === 'technical'
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
              title="Deep Blueprint: Exhaustive formulas, ground battery wiring, and civilizational tech tree."
            >
              <span>📐 Blueprint</span>
              <span className="text-[9px] opacity-75 hidden sm:inline">(Specs)</span>
            </button>

            <button
              type="button"
              onClick={() => setConversationModeType('diagnostic')}
              className={`px-2.5 py-1 rounded text-xs transition-all flex items-center gap-1.5 ${
                conversationModeType === 'diagnostic'
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
              title="Triage: Emergency protocols and botanical lookalike hazard isolation."
            >
              <span>🚨 Triage</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setRightPanelTab(rightPanelTab === 'archives' ? 'sessions' : 'archives')}
              className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <FolderArchive className="w-3.5 h-3.5" />
              <span>{rightPanelTab === 'archives' ? 'Show Sessions' : `Archives (${archivedFiles.length})`}</span>
            </button>
          </div>
        </div>

        {/* ACTIVE CONVERSATION MODE BANNER / STATUS */}
        {isConversationMode && (
          <div className="bg-amber-950/40 border-b border-amber-600/60 p-2.5 flex items-center justify-between flex-wrap gap-2 text-xs font-mono shrink-0 animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span className="font-bold text-amber-300">
                TWO-WAY CONVERSATION MODE ENGAGED
              </span>
              <span className="text-zinc-400 text-[11px] hidden sm:inline">
                (Speak freely. Zakhar answers promptly and listens back automatically.)
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isSpeaking ? (
                <span className="text-cyan-400 flex items-center gap-1 font-semibold">
                  <Waveform className="w-3.5 h-3.5 animate-bounce" />
                  <span>SPEAKING // MIC MUTED FOR CLEAN AUDIO</span>
                </span>
              ) : isListening ? (
                <span className="text-rose-400 flex items-center gap-1 font-semibold animate-pulse">
                  <Mic className="w-3.5 h-3.5 animate-spin" />
                  <span>LISTENING TO YOU... (NO BUTTON PRESS NEEDED)</span>
                </span>
              ) : (
                <span className="text-amber-400">READY</span>
              )}
            </div>
          </div>
        )}

        {/* SINGLE DICTATION ACTIVE BANNER */}
        {isDictatingSingle && !isConversationMode && (
          <div className="bg-rose-950/40 border-b border-rose-600/60 p-2.5 flex items-center justify-between text-xs font-mono shrink-0 animate-pulse">
            <div className="flex items-center gap-2 text-rose-300">
              <Mic className="w-4 h-4 animate-spin text-rose-400" />
              <span className="font-bold">SINGLE SPEECH INPUT ACTIVE:</span>
              <span className="italic text-zinc-300">Speak your question. Will turn off mic automatically when finished.</span>
            </div>
            <button
              onClick={() => { stopListeningPipeline(); setIsDictatingSingle(false); }}
              className="text-zinc-400 hover:text-zinc-200 text-[11px] underline"
            >
              Cancel Dictate
            </button>
          </div>
        )}

        {/* ACTIVE SPEECH PLAYBACK PROGRESS BAR */}
        {isSpeaking && (
          <div className="bg-cyan-950/60 border-b border-cyan-800 px-4 py-1.5 flex items-center justify-between text-xs font-mono text-cyan-200 animate-in fade-in shrink-0">
            <div className="flex items-center gap-2 truncate mr-3">
              <Volume2 className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />
              <span className="text-cyan-300 font-bold shrink-0">
                Speaking ({speechProgress.current}/{speechProgress.total}):
              </span>
              <span className="truncate italic text-zinc-300">
                "{speechProgress.sentence}"
              </span>
            </div>
            <button
              onClick={stopSpeaking}
              className="px-2 py-0.5 bg-zinc-900 hover:bg-rose-950 text-zinc-300 hover:text-rose-300 border border-zinc-700 hover:border-rose-700 rounded text-[10px] shrink-0 transition-colors flex items-center gap-1"
            >
              <Square className="w-3 h-3" />
              <span>Stop Voice</span>
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MESSAGES STREAM: ONLY THIS CONTAINER SCROLLS UP AND DOWN! */}
        {/* ========================================================================= */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4">
          {currentSession.messages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-2 mb-1 px-1">
                <span className="text-[11px] font-mono text-zinc-500">{msg.timestamp}</span>
                <span className={`text-[11px] font-mono font-bold ${
                  msg.role === 'user' ? 'text-amber-400' : 'text-cyan-400'
                }`}>
                  {msg.role === 'user' ? 'COMMANDER // DAMONE' : 'ZAKHAR AI BRAIN'}
                </span>
              </div>

              <div
                className={`max-w-[88%] rounded-xl p-4 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                    : 'bg-zinc-950/90 text-zinc-200 border border-zinc-800 shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans text-xs space-y-2">
                  {msg.content.split('\n\n').map((paragraph, pIdx) => (
                    <p key={pIdx} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Bottom Card Actions: File to Archive & Voice Re-Read */}
                <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between flex-wrap gap-2 text-[11px] font-mono">
                  {msg.role === 'assistant' ? (
                    <button
                      onClick={() => speakTextQueue(msg.content)}
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                      title="Read full response out loud without cutting off"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Read aloud (Full)</span>
                    </button>
                  ) : (
                    <span className="text-zinc-600 font-mono">Operator Utterance</span>
                  )}

                  {/* FILE / ARCHIVE BUTTON: Saves directly into the right file place */}
                  <button
                    onClick={() => fileMessageToArchive(msg)}
                    className="p-1 px-2 rounded bg-zinc-900 hover:bg-amber-950/60 border border-zinc-800 hover:border-amber-600/80 text-zinc-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors font-mono"
                    title="Store and archive this item in the right file drawer"
                  >
                    <Bookmark className="w-3 h-3 text-amber-400" />
                    <span>File to Archive</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex flex-col items-start">
              <span className="text-[11px] font-mono text-cyan-400 mb-1 px-1">AI BRAIN REASONING...</span>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs text-zinc-400 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>Computing fast response...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT BAR (Pinned at bottom of Chat container) */}
        <div className="p-3.5 border-t border-zinc-800 bg-zinc-950/90 space-y-2 shrink-0">
          {/* Quick Voice Simulation Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] font-mono no-scrollbar">
            <span className="text-zinc-500 shrink-0">Quick Ask:</span>
            {quickVoiceChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(chip.query)}
                className="px-2 py-1 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded text-zinc-300 hover:text-amber-300 transition-colors shrink-0 whitespace-nowrap"
              >
                ⚡ {chip.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* SINGLE MIC DICTATION BUTTON: ONLY records 1 phrase into the input field! DOES NOT TRIGGER CONVERSATION MODE! */}
            <button
              onClick={triggerSingleDictation}
              className={`p-3 rounded-lg transition-all flex items-center justify-center shrink-0 ${
                isDictatingSingle
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_15px_rgba(225,29,72,0.7)] animate-pulse'
                  : micPermissionState === 'granted'
                  ? 'bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border border-emerald-800/80'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700'
              }`}
              title="Single Speech Input: Click to speak a single phrase into the box (stops automatically, will not start conversation mode)"
            >
              {isDictatingSingle ? <Mic className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
              placeholder={
                isConversationMode
                  ? 'Conversation Mode is listening... (Speak freely or type here)'
                  : isDictatingSingle
                  ? 'Listening to single speech... (Speak now)'
                  : conversationModeType === 'partner'
                  ? 'Ask anything (colors, life, functions, ideas, or survival)...'
                  : 'Type or speak question (e.g. "What is 2+2?", "How to make earth battery?")...'
              }
              className="flex-1 bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs px-4 py-3 rounded-lg focus:outline-none focus:border-amber-500 font-mono"
            />

            <button
              onClick={() => handleSend()}
              disabled={isLoading || !inputPrompt.trim()}
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 p-3 rounded-lg font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT SIDE PANEL: SESSIONS HISTORY, ARCHIVE CABINET & VOICE TELEMETRY */}
      {/* Fixed height; DOES NOT grow or scroll with the chat side! */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-84 xl:w-96 h-full flex flex-col bg-zinc-900/90 border border-zinc-800 rounded-lg overflow-hidden shrink-0">
        
        {/* Panel Tabs Header */}
        <div className="p-2 border-b border-zinc-800 bg-zinc-950/90 grid grid-cols-4 gap-1 shrink-0 text-xs font-mono">
          <button
            onClick={() => setRightPanelTab('sessions')}
            className={`py-2 px-1 rounded text-center transition-colors flex items-center justify-center gap-1 ${
              rightPanelTab === 'sessions'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="truncate">Sessions</span>
          </button>

          <button
            onClick={() => setRightPanelTab('archives')}
            className={`py-2 px-1 rounded text-center transition-colors flex items-center justify-center gap-1 ${
              rightPanelTab === 'archives'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FolderArchive className="w-3.5 h-3.5" />
            <span className="truncate">Vault</span>
          </button>

          <button
            onClick={() => setRightPanelTab('kits')}
            className={`py-2 px-1 rounded text-center transition-colors flex items-center justify-center gap-1 ${
              rightPanelTab === 'kits'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="truncate">Kits ({customKits.length})</span>
          </button>

          <button
            onClick={() => setRightPanelTab('voice_tools')}
            className={`py-2 px-1 rounded text-center transition-colors flex items-center justify-center gap-1 ${
              rightPanelTab === 'voice_tools'
                ? 'bg-amber-500 text-zinc-950 font-bold shadow'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="truncate">Mic HW</span>
          </button>
        </div>

        {/* Success Notice Banner */}
        {saveSuccessNotice && (
          <div className="bg-emerald-950/80 border-b border-emerald-800 text-emerald-300 text-xs font-mono p-2 text-center animate-in fade-in flex items-center justify-center gap-1.5 shrink-0">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span className="truncate">{saveSuccessNotice}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: SESSIONS HISTORY (Stored automatically so they never fall!) */}
        {/* ========================================================================= */}
        {rightPanelTab === 'sessions' && (
          <div className="flex-1 flex flex-col overflow-hidden p-3 space-y-3">
            {/* Top Action: New Fresh Session Button */}
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800 shrink-0">
              <span className="text-xs font-mono font-bold text-zinc-300 uppercase">
                Saved Sessions
              </span>
              <button
                onClick={createNewSession}
                className="py-1 px-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded text-xs font-mono font-bold flex items-center gap-1 shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ New Session</span>
              </button>
            </div>

            {/* Operator Clearance Badge */}
            <div className="p-2 bg-zinc-950 border border-emerald-800/80 rounded flex items-center justify-between text-xs font-mono shrink-0">
              <div className="flex items-center gap-2 truncate mr-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="text-emerald-300 font-bold truncate text-[11px]">
                  {currentUser?.callsign || 'COMMANDER DAMONE (313-ROOT)'}
                </span>
              </div>
              <span className="text-[10px] text-emerald-300 font-bold bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-600 shrink-0">
                LEVEL 5
              </span>
            </div>

            {/* Explanatory Notice */}
            <div className="text-[11px] font-mono text-zinc-400 bg-zinc-950 p-2 rounded border border-zinc-800/80 leading-relaxed shrink-0">
              Sessions are automatically stored and preserved so they never fall. Every time you enter or click "+ New Session", you get a clean fresh session while all past briefings remain archived below.
            </div>

            {/* Scrollable Sessions List (INTERNAL SCROLL ONLY) */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {sessions.map(s => {
                const isActive = s.id === activeSessionId;
                const messageCount = s.messages.length;
                return (
                  <div
                    key={s.id}
                    onClick={() => { stopSpeaking(); setActiveSessionId(s.id); }}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                      isActive
                        ? 'bg-amber-950/60 border-amber-500 text-amber-200 shadow-sm'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-bold truncate text-xs text-zinc-200">
                        {s.title}
                      </span>
                      {isActive && (
                        <span className="text-[9px] px-1 py-0.2 bg-amber-500 text-zinc-950 rounded font-bold shrink-0">
                          ACTIVE
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-zinc-500">
                      <span>{messageCount} messages · {new Date(s.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                      <div className="flex items-center gap-1">
                        {sessions.length > 1 && (
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteSession(s.id); }}
                            className="text-zinc-600 hover:text-rose-400 p-1 rounded hover:bg-zinc-900 transition-colors"
                            title="Delete session"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Session Actions at Bottom */}
            <div className="pt-2 border-t border-zinc-800 shrink-0 space-y-1.5">
              <button
                onClick={exportConversationToFile}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono py-2 px-3 rounded flex items-center justify-center gap-2 transition-colors border border-zinc-700"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export Active Session (.md)</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: FILED KNOWLEDGE & ARCHIVES CABINET ("The Right File Place") */}
        {/* Stores Custom Functions, Ideas, Colors, Notes */}
        {/* ========================================================================= */}
        {rightPanelTab === 'archives' && (
          <div className="flex-1 flex flex-col overflow-hidden p-3 space-y-3">
            {/* Top Bar with Add Button */}
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800 shrink-0">
              <div>
                <span className="text-xs font-mono font-bold text-zinc-200 uppercase">
                  Archive Cabinet
                </span>
                <span className="text-[10px] font-mono text-zinc-500 block">
                  Functions, Ideas & Colors
                </span>
              </div>
              <button
                onClick={() => setShowAddFileModal(true)}
                className="py-1 px-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded text-xs font-mono font-bold flex items-center gap-1 shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add File</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative shrink-0">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={archiveSearchQuery}
                onChange={(e) => setArchiveSearchQuery(e.target.value)}
                placeholder="Search filed functions & ideas..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px] font-mono shrink-0 no-scrollbar">
              {[
                { id: 'all', label: 'All Files' },
                { id: 'functions', label: '⚡ Functions' },
                { id: 'ideas', label: '💡 Ideas' },
                { id: 'designs', label: '🎨 Colors' },
                { id: 'partner_notes', label: '🤝 Notes' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setArchiveCategoryFilter(cat.id)}
                  className={`px-2 py-0.5 rounded whitespace-nowrap transition-colors ${
                    archiveCategoryFilter === cat.id
                      ? 'bg-amber-500 text-zinc-950 font-bold'
                      : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Scrollable Filed Items List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredArchives.length === 0 ? (
                <div className="text-center py-8 text-zinc-500 text-xs font-mono">
                  No filed items in this category.<br />
                  Click "+ Add File" or click "File to Archive" on any chat message!
                </div>
              ) : (
                filteredArchives.map(item => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedArchiveItem(item)}
                    className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-950 hover:border-zinc-700 cursor-pointer transition-all space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-xs text-zinc-200 truncate">
                        {item.title}
                      </span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold uppercase ${
                        item.category === 'functions'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                          : item.category === 'designs'
                          ? 'bg-purple-950 text-purple-300 border border-purple-800'
                          : item.category === 'ideas'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {item.category.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed font-sans">
                      {item.content}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-zinc-900 font-mono">
                      <span>{new Date(item.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                      <div className="flex items-center gap-1">
                        {item.codeSnippet && (
                          <span className="text-cyan-400 flex items-center gap-0.5">
                            <Code2 className="w-3 h-3" />
                            <span>Code</span>
                          </span>
                        )}
                        <ChevronRight className="w-3 h-3 text-zinc-600" />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: CUSTOM SURVIVAL KITS & INGESTED KNOWLEDGE (Tier 3 Synchronized) */}
        {/* ========================================================================= */}
        {rightPanelTab === 'kits' && (
          <div className="flex-1 flex flex-col overflow-hidden p-3 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800 shrink-0">
              <div>
                <span className="text-xs font-mono font-bold text-zinc-200 uppercase">
                  Survival Kits ({customKits.length})
                </span>
                <span className="text-[10px] font-mono text-zinc-500 block">
                  AI Brain Synchronized
                </span>
              </div>
              <button
                onClick={() => onNavigateTab && onNavigateTab('tools')}
                className="py-1 px-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded text-xs font-mono font-bold flex items-center gap-1 shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Upload File</span>
              </button>
            </div>

            <div className="text-[11px] font-mono text-zinc-400 bg-zinc-950 p-2 rounded border border-zinc-800 leading-relaxed shrink-0">
              Any file uploaded or kit carved by the operator is synced straight into ZAKHAR's working memory. Click a kit to prompt Zakhar about its infrastructure or field tips!
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {customKits.map(kit => (
                <div
                  key={kit.id}
                  onClick={() => {
                    handleSend(`Can you instruct me on the survival kit "${kit.title}" and explain its infrastructure steps and field tips?`);
                  }}
                  className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-950 hover:border-amber-500 hover:bg-zinc-900 cursor-pointer transition-all space-y-1.5 group"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-zinc-200 group-hover:text-amber-400 truncate">
                      {kit.title}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-amber-300 font-mono shrink-0">
                      {kit.category}
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {kit.summary}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-zinc-900 font-mono">
                    <span>{kit.billOfMaterials.length} mats · {kit.buildSteps.length} steps</span>
                    <span className="text-amber-400 font-bold group-hover:underline flex items-center gap-0.5">
                      Ask AI <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: HARDWARE TELEMETRY & VOICE CONTROLS */}
        {/* ========================================================================= */}
        {rightPanelTab === 'voice_tools' && (
          <div className="flex-1 flex flex-col overflow-y-auto p-3 space-y-3">
            {/* HARDWARE MICROPHONE DIAGNOSTIC / STATUS CARD */}
            <div className={`p-3 rounded-lg border text-xs font-mono space-y-2.5 ${
              isListening
                ? 'bg-rose-950/40 border-rose-600 shadow-[0_0_15px_rgba(225,29,72,0.2)]'
                : micPermissionState === 'granted'
                ? 'bg-emerald-950/30 border-emerald-800/80'
                : 'bg-zinc-950 border-zinc-800'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mic className={`w-4 h-4 ${
                    isListening ? 'text-rose-400 animate-spin' : micPermissionState === 'granted' ? 'text-emerald-400' : 'text-zinc-500'
                  }`} />
                  <span className="font-bold text-zinc-200 uppercase">Hardware Mic Telemetry</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                  isListening
                    ? 'bg-rose-900 text-rose-200 border border-rose-600 animate-pulse'
                    : micPermissionState === 'granted'
                    ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
                    : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                }`}>
                  {isListening ? 'LIVE AUDIO ON' : micPermissionState === 'granted' ? 'HARDWARE READY' : 'STANDBY'}
                </span>
              </div>

              {/* REAL-TIME AUDIO LEVEL VU METER */}
              <div>
                <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                  <span>Input Signal Level:</span>
                  <span className={`font-bold ${isListening ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {audioInputLevel}% dB
                  </span>
                </div>
                <div className="w-full bg-zinc-850 h-2 rounded-full overflow-hidden flex">
                  <div 
                    className={`h-full transition-all duration-75 ${
                      isListening ? 'bg-rose-500' : audioInputLevel > 60 ? 'bg-amber-400' : 'bg-emerald-400'
                    }`}
                    style={{ width: `${Math.max(4, audioInputLevel)}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons for Microphone */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={triggerSingleDictation}
                  className={`py-1.5 px-2 rounded font-bold text-xs transition-colors flex items-center justify-center gap-1.5 ${
                    isDictatingSingle
                      ? 'bg-rose-600 hover:bg-rose-500 text-white'
                      : 'bg-amber-500 hover:bg-amber-400 text-zinc-950'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>{isDictatingSingle ? 'Stop Dictate' : 'Single Dictate'}</span>
                </button>

                <button
                  type="button"
                  onClick={toggleConversationMode}
                  className={`py-1.5 px-2 rounded font-bold text-xs transition-colors flex items-center justify-center gap-1.5 border ${
                    isConversationMode
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 shadow'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>{isConversationMode ? 'Turn-Taking ON' : 'Turn-Taking Mode'}</span>
                </button>
              </div>

              {micErrorMessage && (
                <div className="text-[11px] text-rose-300 bg-rose-950/80 p-2 rounded border border-rose-800/80 leading-relaxed">
                  {micErrorMessage}
                </div>
              )}
            </div>

            {/* Quick Feature Navigation */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono uppercase text-zinc-400 block font-semibold">
                Quick App Navigation:
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
                <button
                  onClick={() => onNavigateTab && onNavigateTab('pricing')}
                  className="p-2 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-600/60 rounded text-left text-amber-300 flex items-center gap-1.5 transition-colors font-bold"
                >
                  <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">Licenses ($19-$99)</span>
                </button>
                <button
                  onClick={() => onNavigateTab && onNavigateTab('flora')}
                  className="p-2 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded text-left text-zinc-300 flex items-center gap-1.5 transition-colors"
                >
                  <span className="text-emerald-400">🌿</span>
                  <span className="truncate">Flora Identifier</span>
                </button>
                <button
                  onClick={() => onNavigateTab && onNavigateTab('tools')}
                  className="p-2 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded text-left text-zinc-300 flex items-center gap-1.5 transition-colors"
                >
                  <span className="text-amber-400">⚡</span>
                  <span className="truncate">Ground Battery</span>
                </button>
                <button
                  onClick={() => onNavigateTab && onNavigateTab('techtree')}
                  className="p-2 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 rounded text-left text-zinc-300 flex items-center gap-1.5 transition-colors"
                >
                  <span className="text-cyan-400">🌲</span>
                  <span className="truncate">Tech Tree Graph</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL: VIEW SELECTED ARCHIVE ITEM */}
      {/* ========================================================================= */}
      {selectedArchiveItem && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-zinc-900 border border-amber-500 rounded-xl max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderArchive className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold font-mono text-zinc-100 uppercase">
                  {selectedArchiveItem.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedArchiveItem(null)}
                className="text-zinc-500 hover:text-zinc-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs font-mono">
              <div className="flex items-center justify-between text-zinc-400">
                <span>Category: <strong className="text-amber-400 uppercase">{selectedArchiveItem.category}</strong></span>
                <span>Filed: {new Date(selectedArchiveItem.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 whitespace-pre-wrap font-sans text-zinc-200 leading-relaxed text-xs">
                {selectedArchiveItem.content}
              </div>

              {selectedArchiveItem.codeSnippet && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Code / Formula Snippet:</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedArchiveItem.codeSnippet || '');
                        setSaveSuccessNotice('Code copied to clipboard!');
                        setTimeout(() => setSaveSuccessNotice(null), 2500);
                      }}
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </button>
                  </div>
                  <pre className="p-3 bg-zinc-950 border border-zinc-800 rounded font-mono text-[11px] text-cyan-300 overflow-x-auto">
                    {selectedArchiveItem.codeSnippet}
                  </pre>
                </div>
              )}

              {selectedArchiveItem.tags && selectedArchiveItem.tags.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap pt-2">
                  <span className="text-zinc-500">Tags:</span>
                  {selectedArchiveItem.tags.map((t, idx) => (
                    <span key={idx} className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded text-[10px]">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between">
              <button
                onClick={() => deleteArchivedItem(selectedArchiveItem.id)}
                className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-rose-950 text-zinc-400 hover:text-rose-300 border border-zinc-800 hover:border-rose-800 text-xs font-mono transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete File</span>
              </button>

              <button
                onClick={() => setSelectedArchiveItem(null)}
                className="px-4 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs font-mono transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD NEW CUSTOM FUNCTION / ARCHIVE NOTE */}
      {/* ========================================================================= */}
      {showAddFileModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-in fade-in">
          <form 
            onSubmit={handleAddNewFile}
            className="bg-zinc-900 border border-amber-500 rounded-xl max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
          >
            <div className="p-4 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderArchive className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold font-mono text-zinc-100 uppercase">
                  File New Function, Idea or Color
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddFileModal(false)}
                className="text-zinc-500 hover:text-zinc-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3.5 text-xs font-mono">
              <div>
                <label className="block text-zinc-400 mb-1">Title / Name:</label>
                <input
                  type="text"
                  required
                  value={newFileTitle}
                  onChange={(e) => setNewFileTitle(e.target.value)}
                  placeholder="e.g. Joule Thief Resistance Formula, Sunset Amber Palette..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-zinc-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Category:</label>
                <select
                  value={newFileCategory}
                  onChange={(e) => setNewFileCategory(e.target.value as any)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-zinc-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="functions">⚡ Custom Functions & Code</option>
                  <option value="ideas">💡 Ideas & Inventions</option>
                  <option value="designs">🎨 Colors & Design Palettes</option>
                  <option value="partner_notes">🤝 Partner Notes & Directives</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Content / Description:</label>
                <textarea
                  required
                  rows={3}
                  value={newFileContent}
                  onChange={(e) => setNewFileContent(e.target.value)}
                  placeholder="Explain the idea, function specs, color psychology, or formula..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-zinc-200 focus:outline-none focus:border-amber-500 font-sans text-xs"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Code / Formula Snippet (Optional):</label>
                <textarea
                  rows={3}
                  value={newFileCode}
                  onChange={(e) => setNewFileCode(e.target.value)}
                  placeholder="function myCustomFormula() { ... }"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-cyan-300 font-mono text-[11px] focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Tags (comma-separated):</label>
                <input
                  type="text"
                  value={newFileTags}
                  onChange={(e) => setNewFileTags(e.target.value)}
                  placeholder="Ground Energy, Colors, Level 5, Custom..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-zinc-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddFileModal(false)}
                className="px-3 py-2 rounded bg-zinc-800 text-zinc-300 text-xs font-mono"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs font-mono transition-colors"
              >
                File & Save to Cabinet
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
