import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  FarmerProfile,
  LanguageCode,
  DistressRiskData,
  CropConditionData,
  NotificationItem,
  CartItem,
  AgriProduct,
  ChatMessage,
} from '../types';
import {
  demoFarmer,
  mockDistressRiskData,
  mockCropConditionData,
  mockNotifications,
} from '../data/mockData';
import { translations, TranslationSchema } from '../data/translations';

export type ActiveView = 'home' | 'disease' | 'marketplace' | 'insights' | 'loans' | 'google-chat' | 'profile' | 'settings';

interface AppContextType {
  user: FarmerProfile | null;
  setUser: React.Dispatch<React.SetStateAction<FarmerProfile | null>>;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: TranslationSchema;
  lowBandwidth: boolean;
  setLowBandwidth: (val: boolean) => void;
  distressThreshold: number;
  setDistressThreshold: (val: number) => void;
  distressRiskData: DistressRiskData;
  setDistressRiskData: React.Dispatch<React.SetStateAction<DistressRiskData>>;
  cropConditionData: CropConditionData;
  notifications: NotificationItem[];
  unreadNotifCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
  cart: CartItem[];
  addToCart: (product: AgriProduct, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isChatOpen: boolean;
  setIsChatOpen: (val: boolean) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
  clearChat: () => void;
  loginDemoFarmer: () => void;
  logoutFarmer: () => void;
  recalculateDistressRisk: (customRainDeviation?: number, customPriceDrop?: number, customLoanUrgent?: boolean) => void;
  isOfficerAlertTriggered: boolean;
  isDistressModalOpen: boolean;
  setIsDistressModalOpen: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_USER_KEY = 'smart_krishi_user_v1';
const STORAGE_LANG_KEY = 'smart_krishi_lang_v1';
const STORAGE_LITE_KEY = 'smart_krishi_lite_v1';
const STORAGE_THRESHOLD_KEY = 'smart_krishi_threshold_v1';
const STORAGE_CART_KEY = 'smart_krishi_cart_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start with null by default so every visitor lands on the login page first
  const [user, setUser] = useState<FarmerProfile | null>(null);

  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem(STORAGE_LANG_KEY) as LanguageCode;
    return saved && translations[saved] ? saved : 'en';
  });

  const [lowBandwidth, setLowBandwidthState] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_LITE_KEY) === 'true';
  });

  const [distressThreshold, setDistressThresholdState] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_THRESHOLD_KEY);
    return saved ? Number(saved) : 20;
  });

  const [distressRiskData, setDistressRiskData] = useState<DistressRiskData>(mockDistressRiskData);
  const [cropConditionData] = useState<CropConditionData>(mockCropConditionData);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_CART_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDistressModalOpen, setIsDistressModalOpen] = useState(false);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg-welcome',
        sender: 'bot',
        text: `Namaste Kisan! I am your AI Krishi Advisor powered by Google Gemini. Ask me anything about crop diseases, organic fertilizers, market mandi rates, or government subsidies.`,
        timestamp: 'Just now',
        suggestedPrompts: [
          'How to control stem borer in Paddy?',
          'Urea & DAP fertilizer dosage guide',
          'Check today mandi wholesale rate',
          'Precaution for rain & spraying',
        ],
      },
    ];
  });

  const addChatMessage = (msg: ChatMessage) => {
    setChatMessages((prev) => [...prev, msg]);
  };

  const clearChat = () => {
    setChatMessages([
      {
        id: 'msg-' + Date.now(),
        sender: 'bot',
        text: `Conversation cleared. Namaste! How may I assist your farm today?`,
        timestamp: 'Just now',
        suggestedPrompts: [
          'Paddy pest management',
          'Soil testing procedure',
          'Mandi market rates',
        ],
      },
    ]);
  };

  // Sync to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_USER_KEY);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_LANG_KEY, language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem(STORAGE_LITE_KEY, String(lowBandwidth));
  }, [lowBandwidth]);

  useEffect(() => {
    localStorage.setItem(STORAGE_THRESHOLD_KEY, String(distressThreshold));
  }, [distressThreshold]);

  useEffect(() => {
    localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
  };

  const setLowBandwidth = (val: boolean) => {
    setLowBandwidthState(val);
  };

  const setDistressThreshold = (val: number) => {
    setDistressThresholdState(val);
    setDistressRiskData((prev) => {
      const isTriggered = prev.overallRiskPercentage > val;
      return {
        ...prev,
        thresholdPercentage: val,
        isAlertTriggered: isTriggered,
      };
    });
  };

  const recalculateDistressRisk = (
    customRainDeviation = 30,
    customPriceDrop = 18,
    customLoanUrgent = true
  ) => {
    // Smart India Hackathon Core Algorithm:
    // Risk = RainImpact (35%) + CropStress (25%) + PriceVolatility (20%) + CreditProximity (20%)
    const rainImpact = (customRainDeviation / 100) * 35;
    const cropStress = 6.8; // based on current sensor / visual check
    const priceImpact = (customPriceDrop / 100) * 25;
    const loanImpact = customLoanUrgent ? 4.5 : 1.0;

    const rawScore = Math.round((rainImpact + cropStress + priceImpact + loanImpact) * 10) / 10;
    const overallRisk = Math.min(Math.max(Math.round(rawScore), 5), 95);
    const isTriggered = overallRisk > distressThreshold;

    const level = overallRisk >= 25 ? 'High' : overallRisk >= 15 ? 'Medium' : 'Low';

    setDistressRiskData((prev) => ({
      ...prev,
      overallRiskPercentage: overallRisk,
      riskLevel: level,
      isAlertTriggered: isTriggered,
      factors: [
        {
          id: 'f-rain',
          name: 'Rainfall Deviation Index',
          weight: 35,
          currentValue: `${customRainDeviation}% Below Normal Seasonal Average`,
          status: customRainDeviation > 25 ? 'critical' : customRainDeviation > 15 ? 'warning' : 'normal',
          impactPercentage: Math.round(rainImpact * 10) / 10,
          description: 'Historical precipitation deficit affecting panicle initiation phase.',
        },
        {
          id: 'f-crop',
          name: 'Crop Condition & Health Index',
          weight: 25,
          currentValue: 'Moderate Fungal & Moisture Stress',
          status: 'warning',
          impactPercentage: 6.8,
          description: 'Delayed vegetative recovery due to moisture imbalance.',
        },
        {
          id: 'f-mandi',
          name: 'Market Price Fluctuations',
          weight: 20,
          currentValue: `${customPriceDrop}% Drop in Nearby Mandi Arrivals`,
          status: customPriceDrop > 15 ? 'warning' : 'normal',
          impactPercentage: Math.round(priceImpact * 10) / 10,
          description: 'Price realization below regional average due to surplus influx.',
        },
        {
          id: 'f-credit',
          name: 'Financial & Loan Due Proximity',
          weight: 20,
          currentValue: customLoanUrgent ? 'Kisan Credit Card EMI Due in 14 Days' : 'No Immediate Loan Due',
          status: customLoanUrgent ? 'critical' : 'normal',
          impactPercentage: loanImpact,
          description: customLoanUrgent ? 'Short-term debt maturity approaching before harvest realization.' : 'Debt service scheduled in comfortable window.',
        },
      ],
      officerAlertStatus: {
        sent: isTriggered,
        timestamp: isTriggered ? 'Just now (Auto-Dispatched)' : 'Standby (Risk within Safe Limits)',
        officerName: 'Shri Rabindra Kumar Mohapatra',
        officerDesignation: 'Block Agriculture Extension Officer (BAEO)',
        officerContact: '+91 94370 82194',
        officerBlock: 'Khordha Central Block Office',
        acknowledgementStatus: isTriggered ? 'Acknowledged' : 'Dispatched',
      },
    }));

    if (isTriggered) {
      setNotifications((prev) => [
        {
          id: 'notif-alert-' + Date.now(),
          title: `⚠️ Distress Early Warning Alert Dispatched (${overallRisk}%)`,
          message: `Your farm distress score (${overallRisk}%) exceeds your ${distressThreshold}% threshold. Local BAEO has been notified.`,
          timestamp: 'Just now',
          category: 'officer',
          priority: 'urgent',
          read: false,
        },
        ...prev,
      ]);
    }
  };

  const loginDemoFarmer = () => {
    setUser(demoFarmer);
    setActiveView('home');
  };

  const logoutFarmer = () => {
    setUser(null);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  const addToCart = (product: AgriProduct, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const t = translations[language] || translations.en;
  const isOfficerAlertTriggered = distressRiskData.overallRiskPercentage > distressThreshold;

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        activeView,
        setActiveView,
        language,
        setLanguage,
        t,
        lowBandwidth,
        setLowBandwidth,
        distressThreshold,
        setDistressThreshold,
        distressRiskData,
        setDistressRiskData,
        cropConditionData,
        notifications,
        unreadNotifCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        searchQuery,
        setSearchQuery,
        isChatOpen,
        setIsChatOpen,
        chatMessages,
        addChatMessage,
        clearChat,
        loginDemoFarmer,
        logoutFarmer,
        recalculateDistressRisk,
        isOfficerAlertTriggered,
        isDistressModalOpen,
        setIsDistressModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
