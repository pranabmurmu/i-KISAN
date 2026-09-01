import React, { useState, useEffect } from 'react';
import {
  Sprout,
  Shield,
  AlertTriangle,
  CloudSun,
  Leaf,
  TrendingUp,
  Award,
  UserCheck,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Wheat,
  FileText,
  Phone,
  MessageSquareText,
  Languages,
  Calendar,
  Layers,
  Droplets,
  HelpCircle,
  Bell,
  RefreshCw,
  Info,
  Check,
  Compass,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FarmerProfile, LanguageCode } from '../../types';
import {
  cropNamesList,
  soilTypesList,
  irrigationTypesList,
  farmingTypesList,
  cropStagesList,
} from '../../data/translations';
import { landingNewsTicker, demoFarmer } from '../../data/mockData';
import { FarmerLogo } from '../common/FarmerLogo';

export const LandingAuth: React.FC = () => {
  const { setUser, setActiveView, language, setLanguage, t } = useApp();

  // Active form tab: 'login' or 'signup'
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  // Forgot password modal state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotStatus, setForgotStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Registration form state
  const [regData, setRegData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    state: 'Odisha',
    district: '',
    village: '',
    password: '',
    confirmPassword: '',
    mainCrop: 'Paddy (Rice)',
    otherCrops: '',
    farmAreaAcres: '2.5',
    soilType: 'Loamy',
    irrigationType: 'Borewell',
    farmingType: 'Mixed',
    cropGrowthStage: 'Vegetative',
    expectedHarvestDate: '',
  });

  const [regErrors, setRegErrors] = useState<Record<string, string>>({});
  const [regSuccess, setRegSuccess] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Live notification filter & auto-rotation for the Right Side
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'weather' | 'scheme' | 'market' | 'advisory'>('all');
  const [activeAdvisoryIndex, setActiveAdvisoryIndex] = useState(0);

  const indianStates = [
    'Andhra Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Tamil Nadu',
    'Telangana',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
  ];

  const agriculturalUpdates = [
    {
      id: 'up-1',
      category: 'weather',
      categoryLabel: t.filterWeather,
      title: t.updateWeatherTitle,
      message: t.updateWeatherMsg,
      tag: t.updateWeatherTag,
      time: '15 mins ago',
      icon: CloudSun,
      color: 'amber',
    },
    {
      id: 'up-2',
      category: 'scheme',
      categoryLabel: t.filterSchemes,
      title: t.updateSchemeTitle,
      message: t.updateSchemeMsg,
      tag: t.updateSchemeTag,
      time: '1 hour ago',
      icon: FileText,
      color: 'emerald',
    },
    {
      id: 'up-3',
      category: 'market',
      categoryLabel: t.filterMandi,
      title: t.updateMandiTitle,
      message: t.updateMandiMsg,
      tag: t.updateMandiTag,
      time: '2 hours ago',
      icon: TrendingUp,
      color: 'green',
    },
    {
      id: 'up-4',
      category: 'scheme',
      categoryLabel: t.filterSchemes,
      title: t.updateInsuranceTitle,
      message: t.updateInsuranceMsg,
      tag: t.updateInsuranceTag,
      time: '3 hours ago',
      icon: Shield,
      color: 'blue',
    },
    {
      id: 'up-5',
      category: 'advisory',
      categoryLabel: t.filterAdvisory,
      title: t.updatePestTitle,
      message: t.updatePestMsg,
      tag: t.updatePestTag,
      time: '5 hours ago',
      icon: Leaf,
      color: 'red',
    },
    {
      id: 'up-6',
      category: 'advisory',
      categoryLabel: t.filterAdvisory,
      title: t.updateTipTitle,
      message: t.updateTipMsg,
      tag: t.updateTipTag,
      time: 'Today',
      icon: Sprout,
      color: 'purple',
    },
  ];

  const filteredUpdates = activeCategoryFilter === 'all' 
    ? agriculturalUpdates 
    : agriculturalUpdates.filter(item => item.category === activeCategoryFilter);

  // Auto rotate banner every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveAdvisoryIndex((prev) => (prev + 1) % agriculturalUpdates.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [agriculturalUpdates.length]);

  const languagesList: Array<{ code: LanguageCode; name: string; native: string }> = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  ];

  const currentLang = languagesList.find((l) => l.code === language) || languagesList[0];

  // Login handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginIdentifier.trim()) {
      setLoginError('Please enter your mobile number or email address.');
      return;
    }
    if (!loginPassword.trim()) {
      setLoginError('Please enter your password.');
      return;
    }

    setIsLoggingIn(true);
    setTimeout(() => {
      // Check if user has saved credentials in localStorage
      const existing = localStorage.getItem('smart_krishi_user_v1');
      if (existing) {
        try {
          const parsed = JSON.parse(existing);
          setUser(parsed);
          setActiveView('home');
          return;
        } catch (err) {}
      }

      // Default demo profile
      setUser({
        ...demoFarmer,
        mobile: loginIdentifier.includes('@') ? demoFarmer.mobile : loginIdentifier,
        email: loginIdentifier.includes('@') ? loginIdentifier : demoFarmer.email,
      });
      setActiveView('home');
    }, 500);
  };

  // Quick 1-Click Demo login
  const handleQuickDemoLogin = () => {
    setUser(demoFarmer);
    setActiveView('home');
  };

  // Validation for registration form
  const validateRegistration = () => {
    const errors: Record<string, string> = {};
    if (!regData.fullName.trim()) errors.fullName = 'Full Name is required';
    
    if (!regData.mobile.trim()) {
      errors.mobile = 'Mobile number is required';
    } else if (!/^[0-9]{10}$/.test(regData.mobile.replace(/\D/g, ''))) {
      errors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    if (!regData.district.trim()) errors.district = 'District name is required';
    if (!regData.village.trim()) errors.village = 'Village / Panchayat name is required';

    if (!regData.password) {
      errors.password = 'Password is required';
    } else if (regData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (regData.password !== regData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    const areaNum = parseFloat(regData.farmAreaAcres);
    if (isNaN(areaNum) || areaNum <= 0) {
      errors.farmAreaAcres = 'Please enter a valid farm area in acres (e.g. 2.5)';
    }

    return errors;
  };

  // Registration submit handler
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateRegistration();
    setRegErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsRegistering(true);

    const newFarmer: FarmerProfile = {
      id: 'farmer-' + Date.now(),
      fullName: regData.fullName.trim(),
      email: regData.email.trim() || `${regData.mobile}@smartkrishi.in`,
      mobile: regData.mobile.trim(),
      state: regData.state,
      district: regData.district.trim(),
      village: regData.village.trim(),
      mainCrop: regData.mainCrop,
      otherCrops: regData.otherCrops ? regData.otherCrops.split(',').map((s) => s.trim()).filter(Boolean) : [],
      farmAreaAcres: parseFloat(regData.farmAreaAcres) || 2.0,
      soilType: regData.soilType as any,
      irrigationType: regData.irrigationType as any,
      farmingType: regData.farmingType as any,
      cropGrowthStage: regData.cropGrowthStage as any,
      expectedHarvestDate: regData.expectedHarvestDate || undefined,
      avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
    };

    setRegSuccess(true);
    setTimeout(() => {
      setUser(newFarmer);
      setActiveView('home');
    }, 1000);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotIdentifier.trim()) return;
    setForgotStatus('sending');
    setTimeout(() => {
      setForgotStatus('sent');
    }, 1200);
  };

  return (
    <div id="landing-auth-page" className="min-h-screen bg-emerald-950 text-slate-900 flex flex-col justify-between relative overflow-x-hidden">
      
      {/* Background Crop Field with high visibility & rich green atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2600&auto=format&fit=crop"
          alt="Lush green agricultural crop field"
          className="w-full h-full object-cover object-center scale-105 opacity-35 brightness-95 saturate-110"
          referrerPolicy="no-referrer"
        />
        {/* Soft light natural overlay for high readability */}
        <div className="absolute inset-0 bg-linear-to-b from-slate-50/95 via-emerald-50/90 to-emerald-100/95 backdrop-blur-[1px]" />
        {/* Soft natural radial glows */}
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-green-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-1/4 w-[500px] h-[500px] bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Top Header Navigation */}
      <header className="relative z-30 sticky top-0 bg-white/95 backdrop-blur-md border-b border-green-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-green-700 flex items-center justify-center text-white shadow-sm shadow-green-700/20 ring-2 ring-green-600/20">
              <FarmerLogo className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-green-950">
                  {t.appTitle}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-green-700 font-medium hidden sm:block">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            
            {/* Multi-language Selector */}
            <div className="relative">
              <button
                id="language-picker-button"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-green-50 border border-green-200 text-green-900 font-bold text-xs sm:text-sm hover:bg-green-100 transition-colors"
                title="Select language"
              >
                <Languages className="w-4 h-4 text-green-700" />
                <span>{currentLang.native}</span>
              </button>
              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-green-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                    Select Language / भाषा
                  </div>
                  {languagesList.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-green-50 transition-colors ${
                        language === lang.code ? 'text-green-800 font-bold bg-green-50' : 'text-slate-700'
                      }`}
                    >
                      <span>{lang.name}</span>
                      <span className="text-[11px] text-green-600 font-medium">{lang.native}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </header>

      {/* MAIN TWO-COLUMN SPLIT SCREEN LAYOUT */}
      <main className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full flex flex-col justify-center">
        
        {/* Main Grid Container: LEFT (Login/Signup) | RIGHT (Agri Advisory & Updates) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ========================================================================= */}
          {/* LEFT SIDE: LOGIN / SIGN UP INTERFACE (5 or 6 cols on desktop) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6 xl:col-span-6 bg-white rounded-3xl border border-green-200/90 shadow-xl shadow-green-950/5 p-6 sm:p-8 backdrop-blur-md">
            
            {/* Header / Intro inside Auth Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-green-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-green-100/90 border border-green-200 text-green-800 flex items-center justify-center font-bold shadow-sm shrink-0">
                  <Leaf className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-green-950 tracking-tight">
                      {authTab === 'login' ? t.farmerPortalLoginTitle : t.newFarmerRegTitle}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {authTab === 'login'
                      ? t.loginSubtext
                      : t.regSubtext}
                  </p>
                </div>
              </div>
              <div className="self-start sm:self-center">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  authTab === 'login'
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${authTab === 'login' ? 'bg-green-600' : 'bg-emerald-600'}`} />
                  {authTab === 'login' ? t.loginTabBtn : t.signUpTabBtn}
                </span>
              </div>
            </div>

            {/* TWO TABS: LOGIN vs SIGN UP (High Visibility Switcher) */}
            <div className="p-1.5 bg-slate-100/90 rounded-2xl mb-6 border border-slate-200/80 shadow-inner grid grid-cols-2 gap-1.5">
              <button
                id="tab-login-btn"
                type="button"
                onClick={() => {
                  setAuthTab('login');
                  setLoginError('');
                }}
                className={`py-3 px-4 text-xs sm:text-sm font-extrabold rounded-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer select-none ${
                  authTab === 'login'
                    ? 'bg-white text-green-950 shadow-md shadow-slate-200 border border-green-200 ring-2 ring-green-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <div className={`p-1 rounded-lg ${authTab === 'login' ? 'bg-green-100 text-green-800' : 'text-slate-500'}`}>
                  <UserCheck className="w-4 h-4" />
                </div>
                <span className="tracking-tight">{t.loginTabBtn}</span>
                {authTab === 'login' && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-green-600 hidden sm:inline-block" />
                )}
              </button>

              <button
                id="tab-signup-btn"
                type="button"
                onClick={() => {
                  setAuthTab('signup');
                  setRegErrors({});
                }}
                className={`py-3 px-4 text-xs sm:text-sm font-extrabold rounded-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer select-none ${
                  authTab === 'signup'
                    ? 'bg-white text-green-950 shadow-md shadow-slate-200 border border-green-200 ring-2 ring-green-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <div className={`p-1 rounded-lg ${authTab === 'signup' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-500'}`}>
                  <Sprout className="w-4 h-4" />
                </div>
                <span className="tracking-tight">{t.signUpTabBtn}</span>
                {authTab === 'signup' && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-emerald-600 hidden sm:inline-block" />
                )}
              </button>
            </div>

            {/* ----------------- LOGIN TAB CONTENT ----------------- */}
            {authTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4" id="farmer-login-form">
                
                {loginError && (
                  <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-center gap-2.5 animate-in fade-in duration-150">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{loginError}</span>
                  </div>
                )}

                {/* Email or Mobile */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    {t.emailOrMobile} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="login-identifier-input"
                      type="text"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="e.g. 9861234567 or farmer@gmail.com"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-green-600 focus:bg-white focus:ring-2 focus:ring-green-600/15 transition-all"
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <Phone className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {t.emailOrMobileHelper}
                  </p>
                </div>

                {/* Password with Show/Hide Toggle */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-800">
                      {t.passwordLabel} <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsForgotModalOpen(true)}
                      className="text-xs font-bold text-green-700 hover:text-green-900 hover:underline cursor-pointer"
                    >
                      {t.forgotPasswordLink}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      id="login-password-input"
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 pr-12 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-green-600 focus:bg-white focus:ring-2 focus:ring-green-600/15 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <button
                  id="farmer-login-submit-btn"
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3.5 bg-green-700 hover:bg-green-800 active:bg-green-900 text-white font-extrabold rounded-2xl text-sm sm:text-base shadow-md shadow-green-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {isLoggingIn ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{t.verifyingCredentials}</span>
                    </>
                  ) : (
                    <>
                      <span>{t.loginButton}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* 1-Click Quick Demo Login */}
                <button
                  id="quick-demo-login-btn"
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold rounded-2xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>{t.oneClickDemoLogin}</span>
                </button>

                {/* Switch to Register footer note */}
                <div className="text-center pt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-600">
                    {t.dontHaveAccountYet}{' '}
                    <button
                      type="button"
                      onClick={() => setAuthTab('signup')}
                      className="font-bold text-green-700 hover:text-green-900 hover:underline cursor-pointer"
                    >
                      {t.registerFarmHere}
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* ----------------- SIGN UP TAB CONTENT (DETAILED REGISTRATION FORM) ----------------- */}
            {authTab === 'signup' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4 max-h-[68vh] overflow-y-auto pr-1" id="farmer-signup-form">
                
                {regSuccess && (
                  <div className="p-4 bg-green-50 border border-green-200 text-green-800 text-xs sm:text-sm rounded-2xl flex items-center gap-3 animate-in fade-in">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                    <div>
                      <p className="font-bold">Farm Registration Successful!</p>
                      <p className="text-[11px] text-green-700">Configuring your personalized advisory dashboard...</p>
                    </div>
                  </div>
                )}

                {/* SECTION A: PERSONAL DETAILS */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-green-900 uppercase tracking-wider mb-2.5 pb-1 border-b border-green-100">
                    <UserCheck className="w-3.5 h-3.5 text-green-600" />
                    <span>{t.secPersonalDetails}</span>
                  </div>

                  {/* Full Name */}
                  <div className="mb-3">
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      {t.fullNameLabel} <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="reg-fullname"
                      type="text"
                      value={regData.fullName}
                      onChange={(e) => setRegData({ ...regData, fullName: e.target.value })}
                      placeholder="e.g. Pranab Mahapatra"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-green-600 focus:bg-white"
                    />
                    {regErrors.fullName && <p className="text-[11px] text-red-600 font-semibold mt-1">{regErrors.fullName}</p>}
                  </div>

                  {/* Email & Mobile Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        {t.mobileLabel} <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="reg-mobile"
                        type="tel"
                        value={regData.mobile}
                        onChange={(e) => setRegData({ ...regData, mobile: e.target.value })}
                        placeholder="e.g. 9861234567"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-green-600 focus:bg-white"
                      />
                      {regErrors.mobile && <p className="text-[11px] text-red-600 font-semibold mt-1">{regErrors.mobile}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        {t.emailOptionalLabel}
                      </label>
                      <input
                        id="reg-email"
                        type="email"
                        value={regData.email}
                        onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                        placeholder="farmer@gmail.com"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-green-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* State, District & Village Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        {t.stateLabel} <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="reg-state"
                        value={regData.state}
                        onChange={(e) => setRegData({ ...regData, state: e.target.value })}
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 shadow-sm cursor-pointer"
                      >
                        {indianStates.map((st) => (
                          <option key={st} value={st} className="text-slate-900 font-medium py-1">
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        {t.districtLabel} <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="reg-district"
                        type="text"
                        value={regData.district}
                        onChange={(e) => setRegData({ ...regData, district: e.target.value })}
                        placeholder="e.g. Khordha"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-green-600 focus:bg-white"
                      />
                      {regErrors.district && <p className="text-[11px] text-red-600 font-semibold mt-1">{regErrors.district}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        {t.villageLabel} <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="reg-village"
                        type="text"
                        value={regData.village}
                        onChange={(e) => setRegData({ ...regData, village: e.target.value })}
                        placeholder="e.g. Bhatapatana"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-green-600 focus:bg-white"
                      />
                      {regErrors.village && <p className="text-[11px] text-red-600 font-semibold mt-1">{regErrors.village}</p>}
                    </div>
                  </div>

                  {/* Password & Confirm Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        {t.passwordLabel} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="reg-password"
                          type={showPassword ? 'text' : 'password'}
                          value={regData.password}
                          onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                          placeholder="Min 6 chars"
                          className="w-full px-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-green-600 focus:bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      {regErrors.password && <p className="text-[11px] text-red-600 font-semibold mt-1">{regErrors.password}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        {t.repeatPassword} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="reg-confirm-password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={regData.confirmPassword}
                          onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                          placeholder="Repeat password"
                          className="w-full px-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-green-600 focus:bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                        >
                          {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      {regErrors.confirmPassword && <p className="text-[11px] text-red-600 font-semibold mt-1">{regErrors.confirmPassword}</p>}
                    </div>
                  </div>
                </div>

                {/* SECTION B: CROP & FARMING DETAILS */}
                <div className="pt-3">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-green-900 uppercase tracking-wider mb-2.5 pb-1 border-b border-green-100">
                    <Wheat className="w-3.5 h-3.5 text-green-600" />
                    <span>{t.secCropFieldDetails}</span>
                  </div>

                  {/* Main Crop & Other Crops */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        {t.mainCropLabel} <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="reg-main-crop"
                        value={regData.mainCrop}
                        onChange={(e) => setRegData({ ...regData, mainCrop: e.target.value })}
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 shadow-sm cursor-pointer"
                      >
                        {cropNamesList.map((crop) => (
                          <option key={crop} value={crop} className="text-slate-900 font-medium py-1">
                            {crop}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        {t.otherCropsLabel}
                      </label>
                      <input
                        id="reg-other-crops"
                        type="text"
                        value={regData.otherCrops}
                        onChange={(e) => setRegData({ ...regData, otherCrops: e.target.value })}
                        placeholder="e.g. Tomato, Green Gram"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-green-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Farming Area & Soil Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        {t.farmAreaLabel} <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="reg-farm-area"
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={regData.farmAreaAcres}
                        onChange={(e) => setRegData({ ...regData, farmAreaAcres: e.target.value })}
                        placeholder="e.g. 2.5"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-green-600 focus:bg-white"
                      />
                      {regErrors.farmAreaAcres && <p className="text-[11px] text-red-600 font-semibold mt-1">{regErrors.farmAreaAcres}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        {t.soilTypeLabel} <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="reg-soil-type"
                        value={regData.soilType}
                        onChange={(e) => setRegData({ ...regData, soilType: e.target.value as any })}
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 shadow-sm cursor-pointer"
                      >
                        <option value="Loamy" className="text-slate-900 font-medium py-1">Loamy Soil</option>
                        <option value="Clayey" className="text-slate-900 font-medium py-1">Clayey Soil</option>
                        <option value="Sandy" className="text-slate-900 font-medium py-1">Sandy Soil</option>
                        <option value="Black" className="text-slate-900 font-medium py-1">Black Soil</option>
                        <option value="Alluvial" className="text-slate-900 font-medium py-1">Alluvial Soil</option>
                        <option value="Red" className="text-slate-900 font-medium py-1">Red Soil</option>
                      </select>
                    </div>
                  </div>

                  {/* Irrigation Type & Farming Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        {t.irrigationTypeLabel} <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="reg-irrigation-type"
                        value={regData.irrigationType}
                        onChange={(e) => setRegData({ ...regData, irrigationType: e.target.value as any })}
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 shadow-sm cursor-pointer"
                      >
                        <option value="Borewell" className="text-slate-900 font-medium py-1">Borewell</option>
                        <option value="Canal" className="text-slate-900 font-medium py-1">Canal</option>
                        <option value="Drip" className="text-slate-900 font-medium py-1">Drip Irrigation</option>
                        <option value="Sprinkler" className="text-slate-900 font-medium py-1">Sprinkler</option>
                        <option value="Rainfed" className="text-slate-900 font-medium py-1">Rainfed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        {t.farmingTypeLabel} <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="reg-farming-type"
                        value={regData.farmingType}
                        onChange={(e) => setRegData({ ...regData, farmingType: e.target.value as any })}
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 shadow-sm cursor-pointer"
                      >
                        <option value="Organic" className="text-slate-900 font-medium py-1">Organic Farming</option>
                        <option value="Conventional" className="text-slate-900 font-medium py-1">Conventional Farming</option>
                        <option value="Mixed" className="text-slate-900 font-medium py-1">Mixed Farming</option>
                      </select>
                    </div>
                  </div>

                  {/* Crop Growth Stage & Expected Harvest Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        {t.growthStageLabel} <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="reg-growth-stage"
                        value={regData.cropGrowthStage}
                        onChange={(e) => setRegData({ ...regData, cropGrowthStage: e.target.value as any })}
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 shadow-sm cursor-pointer"
                      >
                        <option value="Vegetative" className="text-slate-900 font-medium py-1">Vegetative</option>
                        <option value="Flowering" className="text-slate-900 font-medium py-1">Flowering</option>
                        <option value="Grain Filling" className="text-slate-900 font-medium py-1">Grain Filling</option>
                        <option value="Maturity" className="text-slate-900 font-medium py-1">Maturity</option>
                        <option value="Harvesting" className="text-slate-900 font-medium py-1">Harvest Ready</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        {t.expectedHarvestLabel}
                      </label>
                      <input
                        id="reg-harvest-date"
                        type="date"
                        value={regData.expectedHarvestDate}
                        onChange={(e) => setRegData({ ...regData, expectedHarvestDate: e.target.value })}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-green-600 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Register Button */}
                <button
                  id="farmer-register-submit-btn"
                  type="submit"
                  disabled={isRegistering}
                  className="w-full py-3.5 bg-green-700 hover:bg-green-800 active:bg-green-900 text-white font-extrabold rounded-2xl text-sm sm:text-base shadow-md shadow-green-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isRegistering ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving Farm Profile & Entering...</span>
                    </>
                  ) : (
                    <>
                      <span>{t.completeRegBtn}</span>
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <p className="text-xs text-slate-600">
                    {t.alreadyHaveAccountLogin}{' '}
                    <button
                      type="button"
                      onClick={() => setAuthTab('login')}
                      className="font-bold text-green-700 hover:text-green-900 hover:underline cursor-pointer"
                    >
                      {t.loginTabBtn}
                    </button>
                  </p>
                </div>

              </form>
            )}

          </div>

          {/* ========================================================================= */}
          {/* RIGHT SIDE: VISUALLY ATTRACTIVE AGRICULTURAL INFORMATION & NOTIFICATION PANEL */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-6">
            
            {/* 1. Featured Crop Advisory Hero Card with Live Rotating Spotlight */}
            <div className="relative rounded-3xl overflow-hidden border border-green-300 shadow-xl bg-linear-to-br from-green-900 via-emerald-900 to-green-950 text-white p-6 sm:p-7">
              {/* Decorative crop field backdrop overlay */}
              <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
                <img
                  src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop"
                  alt="Farmland background"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>{t.realtimeBulletinBadge}</span>
                  </div>
                  <span className="text-[11px] text-green-300/80 font-medium">
                    {t.kharifEditionTag}
                  </span>
                </div>

                {/* Rotating Advisory Spotlight */}
                <div className="transition-all duration-500">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                      {React.createElement(agriculturalUpdates[activeAdvisoryIndex].icon, { className: 'w-5 h-5 text-emerald-300' })}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                          {agriculturalUpdates[activeAdvisoryIndex].categoryLabel}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/15 text-white font-medium">
                          {agriculturalUpdates[activeAdvisoryIndex].tag}
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-white mt-1 leading-snug">
                        "{agriculturalUpdates[activeAdvisoryIndex].title}"
                      </h3>
                      <p className="text-xs sm:text-sm text-green-100/90 mt-1.5 leading-relaxed">
                        {agriculturalUpdates[activeAdvisoryIndex].message}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Carousel indicators */}
                <div className="flex items-center justify-between pt-2 border-t border-green-800/80">
                  <div className="flex items-center gap-1.5">
                    {agriculturalUpdates.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveAdvisoryIndex(idx)}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          activeAdvisoryIndex === idx ? 'w-6 bg-emerald-400' : 'w-2 bg-emerald-800'
                        }`}
                        title={`View update ${idx + 1}`}
                      />
                    ))}
                  </div>
                  <div className="text-[11px] text-emerald-300 font-medium">
                    {t.sihEngineTag}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Scrolling / Interactive Agricultural Updates Feed */}
            <div className="bg-white/95 rounded-3xl border border-green-200/90 p-5 sm:p-6 shadow-lg shadow-green-950/5 backdrop-blur-sm">
              
              {/* Header with Category Filter Chips */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-green-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-green-100 text-green-800 flex items-center justify-center">
                    <Bell className="w-4 h-4 text-green-700" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-green-950">
                      {t.liveUpdatesTitle}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {t.liveUpdatesSub}
                    </p>
                  </div>
                </div>

                {/* Filter Chips */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: 'all', label: t.filterAll },
                    { id: 'weather', label: t.filterWeather },
                    { id: 'scheme', label: t.filterSchemes },
                    { id: 'market', label: t.filterMandi },
                    { id: 'advisory', label: t.filterAdvisory },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setActiveCategoryFilter(filter.id as any)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                        activeCategoryFilter === filter.id
                          ? 'bg-green-700 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-green-50 hover:text-green-800'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Update Items List */}
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {filteredUpdates.map((item) => {
                  const IconComp = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-green-50/50 hover:bg-green-50 border border-green-100 transition-all hover:border-green-200 flex items-start gap-3.5 group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-white border border-green-200 flex items-center justify-center text-green-700 shrink-0 shadow-2xs">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-green-100 text-green-800">
                              {item.categoryLabel}
                            </span>
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-100/80 px-1.5 py-0.5 rounded">
                              {item.tag}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {item.time}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs sm:text-sm text-green-950 mt-1 group-hover:text-green-800 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                          {item.message}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Quick Feature Badges */}
              <div className="mt-4 pt-3 border-t border-green-100 grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">{t.badgeLanguages}</p>
                  <p className="text-xs font-black text-green-900 mt-0.5">{t.badgeLanguagesVal}</p>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">{t.badgeNetwork}</p>
                  <p className="text-xs font-black text-green-900 mt-0.5">{t.badgeNetworkVal}</p>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">{t.badgeSos}</p>
                  <p className="text-xs font-black text-green-900 mt-0.5">{t.badgeSosVal}</p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-20 border-t border-green-200/80 bg-white/95 backdrop-blur-md py-6 text-center text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FarmerLogo className="w-5 h-5 text-green-700" />
            <span className="font-bold text-green-950">{t.appTitle}</span>
            <span>{t.footerPlatformTag}</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-semibold text-green-800">
            <span>{t.footerBadge1}</span>
            <span>{t.footerBadge2}</span>
            <span>{t.footerBadge3}</span>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* FORGOT PASSWORD MODAL */}
      {/* ========================================================================= */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-green-200 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => {
                setIsForgotModalOpen(false);
                setForgotStatus('idle');
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 text-lg p-1"
            >
              ✕
            </button>

            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mb-4">
              <Lock className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-green-950">{t.resetPasswordTitle}</h3>
            <p className="text-xs text-slate-500 mt-1">
              {t.resetPasswordSubtext}
            </p>

            {forgotStatus === 'sent' ? (
              <div className="my-6 p-4 rounded-2xl bg-green-50 border border-green-200 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto" />
                <p className="text-xs font-bold text-green-900">{t.otpSentSuccess}</p>
                <p className="text-[11px] text-green-700">
                  A verification code has been sent to <strong>{forgotIdentifier || 'your mobile'}</strong>. Use demo OTP <strong>8492</strong> to log in.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotModalOpen(false);
                    setForgotStatus('idle');
                    setLoginIdentifier(forgotIdentifier || '9861234567');
                    setLoginPassword('demo123');
                  }}
                  className="mt-3 px-4 py-2 bg-green-700 hover:bg-green-800 text-white text-xs font-bold rounded-xl w-full"
                >
                  {t.returnToLoginBtn}
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 my-6">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {t.emailOrMobile}
                  </label>
                  <input
                    type="text"
                    required
                    value={forgotIdentifier}
                    onChange={(e) => setForgotIdentifier(e.target.value)}
                    placeholder="e.g. 9861234567"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-green-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={forgotStatus === 'sending'}
                  className="w-full py-3 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {forgotStatus === 'sending' ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{t.sendingSmsOtp}</span>
                    </>
                  ) : (
                    <span>{t.sendResetOtpBtn}</span>
                  )}
                </button>
              </form>
            )}

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(false)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                {t.cancelBackToLogin}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
