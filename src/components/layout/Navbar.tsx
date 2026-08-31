import React, { useState } from 'react';
import {
  Bell,
  User,
  LogOut,
  Settings,
  Wifi,
  WifiOff,
  AlertTriangle,
  ChevronDown,
  Sparkles,
  Languages,
} from 'lucide-react';
import { FarmerLogo } from '../common/FarmerLogo';
import { LanguageCode } from '../../types';
import { useApp } from '../../context/AppContext';

interface NavbarProps {
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNotifications, onOpenSettings }) => {
  const {
    user,
    logoutFarmer,
    setActiveView,
    searchQuery,
    setSearchQuery,
    unreadNotifCount,
    lowBandwidth,
    setLowBandwidth,
    language,
    setLanguage,
    isOfficerAlertTriggered,
    distressRiskData,
    setIsDistressModalOpen,
    t,
  } = useApp();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const languagesList: Array<{ code: LanguageCode; name: string; native: string }> = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  ];

  return (
    <header
      id="main-navbar"
      className={`sticky top-0 z-30 bg-white/95 backdrop-blur border-b transition-colors ${
        isOfficerAlertTriggered ? 'border-amber-300 shadow-xs' : 'border-green-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <button
              id="navbar-brand-btn"
              onClick={() => setActiveView('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center text-white shadow-xs group-hover:bg-green-700 transition-colors">
                <FarmerLogo className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg tracking-tight text-green-900 leading-none">
                    i KISAN
                  </span>
                </div>
                <p className="text-[11px] text-green-600 hidden sm:block leading-tight font-medium">
                  {t.appSubtitle}
                </p>
              </div>
            </button>
          </div>

          {/* Right utility icons */}
          <div className="flex items-center gap-2 sm:gap-4">

            {/* Low-Bandwidth Mode Toggle Button */}
            <button
              id="low-bandwidth-toggle-btn"
              onClick={() => setLowBandwidth(!lowBandwidth)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                lowBandwidth
                  ? 'bg-green-100 text-green-800 border-green-300'
                  : 'bg-white text-green-700 border-green-100 hover:bg-green-50'
              }`}
              title="Toggle Lite / Low-Bandwidth Mode for slow 2G/3G connections"
            >
              {lowBandwidth ? <WifiOff className="w-3.5 h-3.5 text-green-700" /> : <Wifi className="w-3.5 h-3.5 text-green-600" />}
              <span className="hidden lg:inline">{lowBandwidth ? 'Lite Mode ON' : 'Lite Mode'}</span>
            </button>

            {/* Language Selector Dropdown (near notification bar) */}
            <div className="relative">
              <button
                id="navbar-language-dropdown-btn"
                onClick={() => {
                  setIsLanguageOpen(!isLanguageOpen);
                  setIsProfileOpen(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-green-50 text-green-800 border border-green-100 rounded-xl text-xs font-semibold transition-all focus:outline-none shadow-2xs"
                aria-label="Select Language"
              >
                <Languages className="w-4 h-4 text-green-600" />
                <span className="font-bold text-green-900">
                  {languagesList.find((l) => l.code === language)?.native || 'English'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-green-500 transition-transform ${isLanguageOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLanguageOpen && (
                <div
                  id="language-dropdown-menu"
                  className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-green-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setIsLanguageOpen(false)}
                >
                  <div className="px-3 py-1.5 border-b border-green-50 text-[10px] uppercase font-bold text-green-600">
                    Select Language
                  </div>
                  {languagesList.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLanguageOpen(false);
                      }}
                      className={`w-full px-3.5 py-2 text-left text-xs font-semibold flex items-center justify-between transition-colors ${
                        language === lang.code
                          ? 'bg-green-50 text-green-800 font-bold'
                          : 'text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <span>{lang.native}</span>
                      <span className="text-[10px] text-stone-400 font-normal">({lang.name})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <button
              id="navbar-notif-bell"
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl text-green-700 hover:bg-green-50 border border-green-100 focus:outline-none transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-green-700" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                id="navbar-profile-menu-btn"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-green-100 hover:bg-green-50 focus:outline-none transition-colors bg-white"
              >
                <div className="w-7 h-7 rounded-full bg-green-200 text-green-800 border border-green-300 flex items-center justify-center font-bold text-xs overflow-hidden shrink-0">
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.fullName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span>{user?.fullName?.charAt(0) || 'P'}</span>
                  )}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-green-950 leading-tight truncate max-w-[100px]">
                    {user?.fullName || 'Pranab'}
                  </div>
                  <div className="text-[10px] text-green-600 font-medium leading-tight">
                    {user?.district || 'Odisha'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-green-500 hidden sm:block" />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div
                  id="profile-dropdown-menu"
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-green-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setIsProfileOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-green-50">
                    <p className="text-[10px] uppercase font-bold text-green-500">Signed in as</p>
                    <p className="text-sm font-bold text-green-950 truncate">
                      {user?.fullName}
                    </p>
                    <p className="text-xs text-green-600 font-mono">
                      {user?.mobile || user?.email}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setActiveView('profile');
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-green-800 hover:bg-green-50 text-left transition-colors"
                  >
                    <User className="w-4 h-4 text-green-600" />
                    <span>{t.navProfile}</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenSettings();
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-green-800 hover:bg-green-50 text-left transition-colors"
                  >
                    <Settings className="w-4 h-4 text-green-600" />
                    <span>{t.navSettings}</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsDistressModalOpen(true);
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-amber-800 hover:bg-amber-50 text-left transition-colors"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>SIH Distress Simulator</span>
                  </button>

                  <div className="border-t border-green-50 my-1"></div>

                  <button
                    onClick={() => {
                      logoutFarmer();
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 text-left transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t.navLogout}</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
