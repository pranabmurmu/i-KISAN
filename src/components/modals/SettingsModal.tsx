import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Globe,
  Sliders,
  Wifi,
  RotateCcw,
  HelpCircle,
  X,
  ChevronRight,
  ShieldCheck,
  Building,
  CheckCircle2,
  Phone,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LanguageCode } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    language,
    setLanguage,
    distressThreshold,
    setDistressThreshold,
    lowBandwidth,
    setLowBandwidth,
    resetDemoData,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'preferences' | 'threshold' | 'faq'>('preferences');
  const [resetMessage, setResetMessage] = useState(false);

  if (!isOpen) return null;

  const languagesList: Array<{ code: LanguageCode; name: string; native: string }> = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  ];

  const handleResetData = () => {
    resetDemoData();
    setResetMessage(true);
    setTimeout(() => {
      setResetMessage(false);
    }, 2500);
  };

  return (
    <div
      id="settings-modal-overlay"
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="settings-modal-content"
        className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-green-100 shadow-2xl space-y-6 my-auto max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-green-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-green-100 text-green-800 border border-green-200 flex items-center justify-center font-bold">
              <SettingsIcon className="w-5 h-5 text-green-700" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-green-950">
                {t.navSettings}
              </h2>
              <p className="text-xs text-green-600 font-medium">
                System preferences, distress sensitivity & rural optimization
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-green-900 rounded-xl hover:bg-green-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-green-100 gap-2">
          <button
            onClick={() => setActiveTab('preferences')}
            className={`pb-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'preferences'
                ? 'border-green-600 text-green-800'
                : 'border-transparent text-stone-500 hover:text-green-950'
            }`}
          >
            General & Network
          </button>
          <button
            onClick={() => setActiveTab('threshold')}
            className={`pb-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'threshold'
                ? 'border-green-600 text-green-800'
                : 'border-transparent text-stone-500 hover:text-green-950'
            }`}
          >
            Distress Sensitivity ({distressThreshold}%)
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`pb-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'faq'
                ? 'border-green-600 text-green-800'
                : 'border-transparent text-stone-500 hover:text-green-950'
            }`}
          >
            Help & SIH FAQ
          </button>
        </div>

        {/* ================= TAB 1: PREFERENCES ================= */}
        {activeTab === 'preferences' && (
          <div className="space-y-5">
            {/* Language Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-green-950 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-green-700" />
                <span>{t.languageSelect}</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {languagesList.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    className={`p-3 rounded-2xl border text-xs font-bold text-center transition-all ${
                      language === l.code
                        ? 'bg-green-50 border-green-400 text-green-950 shadow-2xs'
                        : 'bg-stone-50 border-green-100 text-stone-600 hover:bg-green-50/50'
                    }`}
                  >
                    <div>{l.native}</div>
                    <div className="text-[10px] text-stone-400 font-normal">{l.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Low Bandwidth Mode Toggle */}
            <div className="p-4 bg-green-50/40 border border-green-100 rounded-2xl flex items-center justify-between">
              <div className="space-y-0.5 max-w-sm">
                <div className="text-xs font-bold text-green-950 flex items-center gap-1.5">
                  <Wifi className="w-4 h-4 text-green-700" />
                  <span>{t.lowBandwidthMode}</span>
                </div>
                <p className="text-[11px] text-stone-500 leading-snug">
                  Compresses imagery, disables background animations & optimizes caching for 2G/3G rural networks.
                </p>
              </div>

              <button
                onClick={() => setLowBandwidth(!lowBandwidth)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  lowBandwidth ? 'bg-green-600' : 'bg-stone-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                    lowBandwidth ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Reset Demo Data */}
            <div className="p-4 bg-green-50/40 border border-green-100 rounded-2xl flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-green-950 flex items-center gap-1.5">
                  <RotateCcw className="w-4 h-4 text-stone-600" />
                  <span>{t.resetDemoData}</span>
                </div>
                <p className="text-[11px] text-stone-500">
                  Restores demo farmer Pranab, Odisha Paddy farm conditions & cart state.
                </p>
              </div>

              <button
                onClick={handleResetData}
                className="px-3.5 py-1.5 bg-white border border-stone-200 hover:bg-stone-100 text-stone-800 rounded-xl text-xs font-bold transition-all shrink-0"
              >
                Reset
              </button>
            </div>

            {resetMessage && (
              <div className="p-3 bg-green-50 border border-green-300 text-green-900 text-xs rounded-xl flex items-center gap-2 font-bold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span>Demo datasets successfully restored to default state!</span>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: DISTRESS THRESHOLD ================= */}
        {activeTab === 'threshold' && (
          <div className="space-y-5">
            <div className="bg-green-50/40 border border-green-100 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-green-950">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-green-700" />
                  <span>{t.distressThresholdSetting}</span>
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-900 rounded-xl font-mono text-sm font-bold">
                  {distressThreshold}%
                </span>
              </div>

              <input
                type="range"
                min="10"
                max="40"
                value={distressThreshold}
                onChange={(e) => setDistressThreshold(Number(e.target.value))}
                className="w-full accent-green-600 cursor-pointer"
              />

              <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
                {[15, 20, 25, 30].map((val) => (
                  <button
                    key={val}
                    onClick={() => setDistressThreshold(val)}
                    className={`py-1.5 rounded-xl border text-xs font-bold transition-all ${
                      distressThreshold === val
                        ? 'bg-green-600 text-white border-green-700 shadow-2xs'
                        : 'bg-white text-stone-700 border-green-100 hover:bg-green-50'
                    }`}
                  >
                    {val}%
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed bg-amber-50/70 border border-amber-200 p-3.5 rounded-2xl">
              <strong>Evaluation Note:</strong> If composite risk score exceeds this trigger value, the platform instantly marks the farm as High Risk and activates the simulated government agricultural officer dispatch module.
            </p>
          </div>
        )}

        {/* ================= TAB 3: FAQ ================= */}
        {activeTab === 'faq' && (
          <div className="space-y-3 text-xs text-stone-700">
            <div className="bg-green-50/40 border border-green-100 rounded-2xl p-3.5 space-y-1">
              <h4 className="font-bold text-green-950">
                1. How does the Farmer Distress Early-Warning system work?
              </h4>
              <p className="text-stone-600 leading-relaxed">
                Smart Krishi computes a weighted composite vulnerability index using 4 real-world data points: Rainfall Deficit (35%), Crop Condition Stress (25%), Mandi Price Deficit (20%), and Loan Repayment Calendars (20%).
              </p>
            </div>

            <div className="bg-green-50/40 border border-green-100 rounded-2xl p-3.5 space-y-1">
              <h4 className="font-bold text-green-950">
                2. How accurate is the Crop Disease AI Lab?
              </h4>
              <p className="text-stone-600 leading-relaxed">
                Our lightweight computer vision model diagnoses visual symptoms (blight, blast, rust, curl) with up to 92% confidence and provides both organic (Neem cake, Trichoderma) and registered chemical therapies.
              </p>
            </div>

            <div className="bg-green-50/40 border border-green-100 rounded-2xl p-3.5 space-y-1">
              <h4 className="font-bold text-green-950">
                3. How to contact the assigned agricultural extension officer?
              </h4>
              <p className="text-stone-600 leading-relaxed">
                When distress triggers, local Block Agricultural Extension Officers (BAEO) are notified with farmer coordinates, crop stage, and primary distress vectors for on-ground extension support.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-green-100">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold shadow-xs"
          >
            Save & Close
          </button>
        </div>

      </div>
    </div>
  );
};
