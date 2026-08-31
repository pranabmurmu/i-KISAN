import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Users,
  Send,
  Plus,
  RefreshCw,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Lock,
  LogOut,
  ExternalLink,
  Bot,
  Wheat,
  ShieldAlert,
  TrendingUp,
  CloudRain,
  HelpCircle,
  Hash,
  ChevronRight,
  Info,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  initGoogleAuth,
  signInWithGoogleChat,
  signOutGoogle,
} from '../../services/googleAuthService';
import {
  GoogleChatSpace,
  GoogleChatMessage,
  listGoogleChatSpaces,
  listGoogleChatMessages,
  sendGoogleChatMessage,
  createGoogleChatSpace,
} from '../../services/googleChatService';
import { User } from 'firebase/auth';

export const GoogleChatView: React.FC = () => {
  const { user: farmerUser } = useApp();

  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [spaces, setSpaces] = useState<GoogleChatSpace[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<GoogleChatSpace | null>(null);
  const [messages, setMessages] = useState<GoogleChatMessage[]>([]);
  const [isLoadingSpaces, setIsLoadingSpaces] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [messageInput, setMessageInput] = useState('');

  // Confirmation modals
  const [confirmSendOpen, setConfirmSendOpen] = useState(false);
  const [pendingMessageText, setPendingMessageText] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const [createSpaceModalOpen, setCreateSpaceModalOpen] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState('');
  const [isCreatingSpace, setIsCreatingSpace] = useState(false);

  // Status feedback
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Initialize Auth listener on mount
  useEffect(() => {
    const unsubscribe = initGoogleAuth(
      (user, token) => {
        setGoogleUser(user);
        setAccessToken(token);
        loadSpaces(token);
      },
      () => {
        setGoogleUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const res = await signInWithGoogleChat();
      if (res) {
        setGoogleUser(res.user);
        setAccessToken(res.accessToken);
        await loadSpaces(res.accessToken);
      }
    } catch (err: any) {
      console.error(err);
      setAuthError(
        err?.message || 'Could not complete Google Sign-In. Please check your browser popup settings.'
      );
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = async () => {
    await signOutGoogle();
    setGoogleUser(null);
    setAccessToken(null);
    setSpaces([]);
    setSelectedSpace(null);
    setMessages([]);
  };

  const loadSpaces = async (token: string) => {
    setIsLoadingSpaces(true);
    try {
      const fetchedSpaces = await listGoogleChatSpaces(token);
      setSpaces(fetchedSpaces);
      if (fetchedSpaces.length > 0 && !selectedSpace) {
        setSelectedSpace(fetchedSpaces[0]);
        loadMessages(token, fetchedSpaces[0].name);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoadingSpaces(false);
    }
  };

  const loadMessages = async (token: string, spaceName: string) => {
    setIsLoadingMessages(true);
    try {
      const msgs = await listGoogleChatMessages(token, spaceName);
      setMessages(msgs.reverse());
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleSelectSpace = (space: GoogleChatSpace) => {
    setSelectedSpace(space);
    if (accessToken) {
      loadMessages(accessToken, space.name);
    }
  };

  // Trigger confirmation before sending
  const initiateSendMessage = (textToSend?: string) => {
    const text = textToSend || messageInput;
    if (!text.trim() || !selectedSpace || !accessToken) return;
    setPendingMessageText(text.trim());
    setConfirmSendOpen(true);
  };

  // Confirmed execution
  const executeSendMessage = async () => {
    if (!accessToken || !selectedSpace || !pendingMessageText) return;
    setIsSendingMessage(true);
    try {
      const sent = await sendGoogleChatMessage(accessToken, selectedSpace.name, pendingMessageText);
      setMessages((prev) => [...prev, sent]);
      setMessageInput('');
      setConfirmSendOpen(false);
      setPendingMessageText('');
      setActionSuccess('Message published to Google Chat space successfully!');
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to send message to Google Chat.');
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Create Space with confirmation
  const handleCreateSpace = async () => {
    if (!accessToken || !newSpaceName.trim()) return;
    setIsCreatingSpace(true);
    try {
      const created = await createGoogleChatSpace(accessToken, newSpaceName.trim());
      setSpaces((prev) => [created, ...prev]);
      setSelectedSpace(created);
      setMessages([]);
      setCreateSpaceModalOpen(false);
      setNewSpaceName('');
      setActionSuccess(`Space "${newSpaceName}" created in Google Chat!`);
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to create Google Chat space.');
    } finally {
      setIsCreatingSpace(false);
    }
  };

  // Quick agricultural broadcast templates
  const broadcastTemplates = [
    {
      title: '🚨 Distress Risk Alert',
      text: `[i KISAN Emergency Alert] Farmer Distress Alert for ${farmerUser?.district || 'Khordha'} block: Severe weather shock & mandi price drop detected. Agricultural Extension Officer assistance requested.`,
      icon: ShieldAlert,
      color: 'text-red-700 bg-red-50 border-red-200',
    },
    {
      title: '🌿 Disease Diagnosis Share',
      text: `[i KISAN AI Lab] Brown Plant Hopper infestation identified in Paddy with 95% AI confidence. Recommended immediate spray: Neem Oil 1500ppm @ 3ml/L or Pymetrozine 50% WG @ 120g/acre.`,
      icon: Wheat,
      color: 'text-amber-700 bg-amber-50 border-amber-200',
    },
    {
      title: '🌧️ Weather Caution Note',
      text: `[i KISAN Agromet Advisory] 45mm thunderstorm rainfall forecasted within 24 hours. Postpone urea top-dressing and open field drainage channels.`,
      icon: CloudRain,
      color: 'text-blue-700 bg-blue-50 border-blue-200',
    },
    {
      title: '📈 Mandi Rate Update',
      text: `[i KISAN Market Watch] Paddy (Common) modal wholesale rate reached ₹2,450/qtl at local APMC mandis. Favorable window for selling current stock.`,
      icon: TrendingUp,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
  ];

  return (
    <div id="google-chat-integration-view" className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-green-100 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-700/20">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-green-950 tracking-tight">
                Google Chat Collaboration Hub
              </h1>
              <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
                Google Workspace API
              </span>
            </div>
            <p className="text-xs text-green-700 font-medium mt-0.5">
              Connect directly with Agricultural Officers, Krishi Vigyan Kendra (KVK) staff, and Farmer Producer Groups
            </p>
          </div>
        </div>

        {/* User Auth Status */}
        <div className="flex items-center gap-3">
          {accessToken && googleUser ? (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-2xl">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold uppercase overflow-hidden">
                {googleUser.photoURL ? (
                  <img src={googleUser.photoURL} alt={googleUser.displayName || 'Google User'} className="w-full h-full object-cover" />
                ) : (
                  (googleUser.displayName || googleUser.email || 'G')[0]
                )}
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-xs font-bold text-emerald-950 block leading-tight truncate max-w-[150px]">
                  {googleUser.displayName || googleUser.email}
                </span>
                <span className="text-[10px] text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> Connected to Google
                </span>
              </div>
              <button
                onClick={handleSignOut}
                title="Disconnect Google Chat"
                className="p-1.5 rounded-xl hover:bg-emerald-200/60 text-emerald-800 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleSignIn}
              disabled={isAuthenticating}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 rounded-2xl text-xs font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              </svg>
              <span>{isAuthenticating ? 'Connecting...' : 'Sign in with Google'}</span>
            </button>
          )}
        </div>
      </div>

      {actionSuccess && (
        <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {authError && (
        <div className="bg-red-50 border border-red-200 text-red-900 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{authError}</span>
        </div>
      )}

      {/* Main Grid: Spaces List (Left) + Chat Window (Right) */}
      {!accessToken ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-green-100 shadow-xs text-center max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-3xl flex items-center justify-center mx-auto text-emerald-700 shadow-sm">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-green-950">
              Connect Google Chat with Permission
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Sign in with your Google Workspace or Gmail account to view your agricultural spaces, collaborate with district farm extension officers, and broadcast crop advisories directly to farmer groups.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <span className="font-extrabold text-slate-900 block">👥 Group Spaces</span>
              <p className="text-slate-500 text-[11px]">Join KVK circles and local mandi farmer groups</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <span className="font-extrabold text-slate-900 block">🚨 One-Click Alerts</span>
              <p className="text-slate-500 text-[11px]">Publish AI leaf diagnostics and pest warnings</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <span className="font-extrabold text-slate-900 block">🔒 Verified Security</span>
              <p className="text-slate-500 text-[11px]">Explicit user confirmation before sending any data</p>
            </div>
          </div>

          <button
            onClick={handleSignIn}
            disabled={isAuthenticating}
            className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-sm font-extrabold shadow-md shadow-emerald-800/20 inline-flex items-center gap-2 cursor-pointer transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
            </svg>
            <span>{isAuthenticating ? 'Connecting to Google...' : 'Sign in with Google Account'}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Spaces List (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-green-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-700" />
                <h3 className="font-extrabold text-sm text-green-950">Google Chat Spaces</h3>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => loadSpaces(accessToken)}
                  disabled={isLoadingSpaces}
                  title="Refresh spaces"
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSpaces ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={() => setCreateSpaceModalOpen(true)}
                  className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3 h-3" /> New Space
                </button>
              </div>
            </div>

            {/* Spaces list container */}
            <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
              {isLoadingSpaces && spaces.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto text-emerald-600" />
                  <p>Loading your Google Chat spaces...</p>
                </div>
              ) : spaces.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                  <p className="font-semibold">No Google Chat spaces found</p>
                  <p className="text-[11px] text-slate-400">
                    Create a new space to start collaborating with extension officers.
                  </p>
                  <button
                    onClick={() => setCreateSpaceModalOpen(true)}
                    className="px-3 py-1.5 bg-emerald-700 text-white font-bold rounded-xl text-xs"
                  >
                    + Create First Space
                  </button>
                </div>
              ) : (
                spaces.map((space) => {
                  const isSelected = selectedSpace?.name === space.name;
                  return (
                    <button
                      key={space.name}
                      onClick={() => handleSelectSpace(space)}
                      className={`w-full text-left p-3 rounded-2xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 border border-emerald-300 text-emerald-950 font-bold shadow-2xs'
                          : 'hover:bg-slate-50 border border-transparent text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          <Hash className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <span className="block truncate font-bold">
                            {space.displayName || space.name.replace('spaces/', 'Space ')}
                          </span>
                          <span className="text-[10px] text-slate-400 block uppercase">
                            {space.spaceType || 'Group Space'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-emerald-700' : 'text-slate-300'}`} />
                    </button>
                  );
                })
              )}
            </div>

            {/* Pre-formatted Farmer Broadcast Cards */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                Quick Advisory Broadcasts:
              </span>
              <div className="space-y-1.5">
                {broadcastTemplates.map((t, idx) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => initiateSendMessage(t.text)}
                      className={`w-full p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between cursor-pointer transition-all hover:scale-[1.01] ${t.color}`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{t.title}</span>
                      </div>
                      <Send className="w-3 h-3 shrink-0 opacity-60" />
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Chat Stream & Message Input (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-green-100 shadow-xs flex flex-col h-[650px] overflow-hidden">
            
            {/* Space Header */}
            <div className="p-4 sm:p-5 border-b border-green-100 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h3 className="font-black text-base text-green-950 flex items-center gap-2">
                  <span>{selectedSpace?.displayName || 'Select a Space'}</span>
                  {selectedSpace && (
                    <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Live Chat Space
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  {selectedSpace ? selectedSpace.name : 'Choose a Google Chat space to read & post messages'}
                </p>
              </div>

              {selectedSpace && (
                <button
                  onClick={() => accessToken && loadMessages(accessToken, selectedSpace.name)}
                  disabled={isLoadingMessages}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-white text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMessages ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              )}
            </div>

            {/* Message Stream */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/30">
              {isLoadingMessages ? (
                <div className="h-full flex flex-col items-center justify-center text-xs text-slate-400 space-y-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
                  <p>Fetching messages from Google Chat...</p>
                </div>
              ) : !selectedSpace ? (
                <div className="h-full flex flex-col items-center justify-center text-xs text-slate-400 space-y-2">
                  <MessageSquare className="w-8 h-8 text-slate-300" />
                  <p>Please select a space on the left to view messages</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-xs text-slate-400 space-y-2">
                  <Bot className="w-8 h-8 text-slate-300" />
                  <p className="font-semibold text-slate-600">No messages in this space yet</p>
                  <p className="text-[11px]">Be the first to post a farmer update or advisory notice!</p>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isMe = msg.sender?.name?.includes(googleUser?.email || '') || false;
                  return (
                    <div
                      key={msg.name || index}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-full`}
                    >
                      <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-400">
                        <span className="font-bold text-slate-700">
                          {msg.sender?.displayName || 'Community Member'}
                        </span>
                        <span>•</span>
                        <span>
                          {msg.createTime ? new Date(msg.createTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                        </span>
                      </div>
                      <div
                        className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[85%] sm:max-w-[75%] whitespace-pre-wrap break-words ${
                          isMe
                            ? 'bg-emerald-700 text-white rounded-tr-xs shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs shadow-2xs'
                        }`}
                      >
                        {msg.formattedText || msg.text}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-white border-t border-green-100">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  initiateSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder={
                    selectedSpace
                      ? `Post a message to ${selectedSpace.displayName || 'this space'}...`
                      : 'Select a space first...'
                  }
                  disabled={!selectedSpace}
                  className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim() || !selectedSpace}
                  className="px-5 py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>
            </div>

          </div>

        </div>
      )}

      {/* MANDATORY USER CONFIRMATION MODAL BEFORE SENDING MESSAGE */}
      {confirmSendOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Send className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Confirm Post to Google Chat
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                With your permission, this message will be published to the Google Chat space{' '}
                <strong className="text-emerald-950">"{selectedSpace?.displayName || selectedSpace?.name}"</strong> on behalf of your Google Account.
              </p>
            </div>

            {/* Message Preview */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-800 font-medium whitespace-pre-wrap">
              {pendingMessageText}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmSendOpen(false)}
                disabled={isSendingMessage}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={executeSendMessage}
                disabled={isSendingMessage}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                {isSendingMessage ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>{isSendingMessage ? 'Publishing...' : 'Confirm & Post'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW SPACE MODAL */}
      {createSpaceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Plus className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Create Agricultural Collaboration Space
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Creates a new group space in Google Chat for your district farming cooperative, Krishi Vigyan Kendra circle, or crop advisory group.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Space Display Name
              </label>
              <input
                type="text"
                value={newSpaceName}
                onChange={(e) => setNewSpaceName(e.target.value)}
                placeholder="e.g. Khordha Paddy Advisory Circle"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setCreateSpaceModalOpen(false)}
                disabled={isCreatingSpace}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSpace}
                disabled={!newSpaceName.trim() || isCreatingSpace}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                {isCreatingSpace ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                <span>{isCreatingSpace ? 'Creating...' : 'Create Space'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
