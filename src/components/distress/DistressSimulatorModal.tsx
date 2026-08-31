import React, { useState } from 'react';
import {
  ShieldAlert,
  Sliders,
  Sparkles,
  CloudRain,
  TrendingDown,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Send,
  Building,
  UserCheck,
  Phone,
  RefreshCw,
  X,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DistressSimulatorModal: React.FC = () => {
  const {
    isDistressModalOpen,
    setIsDistressModalOpen,
    distressThreshold,
    setDistressThreshold,
    distressRiskData,
    recalculateDistressRisk,
    t,
  } = useApp();

  const [rainDeviation, setRainDeviation] = useState(30);
  const [priceDrop, setPriceDrop] = useState(18);
  const [loanUrgent, setLoanUrgent] = useState(true);

  if (!isDistressModalOpen) return null;

  const handleSimulate = () => {
    recalculateDistressRisk(rainDeviation, priceDrop, loanUrgent);
  };

  const handleReset = () => {
    setRainDeviation(30);
    setPriceDrop(18);
    setLoanUrgent(true);
    recalculateDistressRisk(30, 18, true);
  };

  const isTriggered = distressRiskData.overallRiskPercentage > distressThreshold;

  return (
    <div
      id="distress-simulator-modal-overlay"
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={() => setIsDistressModalOpen(false)}
    >
      <div
        id="distress-simulator-modal-content"
        className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-green-100 shadow-2xl space-y-6 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-green-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-green-950">
                  Farmer Distress Early-Warning Engine
                </h3>
              </div>
              <p className="text-xs text-green-600 font-medium">
                Multi-factorial risk calculation & automated agricultural extension dispatch
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDistressModalOpen(false)}
            className="p-1.5 text-stone-400 hover:text-green-900 rounded-xl hover:bg-green-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SIH Algorithm Explanation for Judges */}
        <div className="bg-green-50/50 border border-green-100 rounded-2xl p-4 space-y-2">
          <div className="text-xs font-bold text-green-950 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-green-600" />
            <span>How the Algorithm Works (Module 2):</span>
          </div>
          <p className="text-xs text-green-800 leading-relaxed">
            The platform synthesizes 4 distinct rural vulnerability vectors: <strong>Rainfall Anomaly (35% wt)</strong>, <strong>Crop Health Stress (25% wt)</strong>, <strong>Mandi Price Deficit (20% wt)</strong>, and <strong>Kisan Credit Loan Proximity (20% wt)</strong>. If composite risk exceeds the safe threshold (currently {distressThreshold}%), an early warning alert is generated and dispatched to the local Block Agricultural Officer.
          </p>
        </div>

        {/* Live Score Display Banner */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isTriggered
              ? 'bg-red-50/90 border-red-300 text-red-950'
              : 'bg-green-50/90 border-green-300 text-green-950'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider opacity-80">
                Composite Distress Risk Score
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-extrabold tracking-tight">
                  {distressRiskData.overallRiskPercentage}%
                </span>
                <span className="text-sm font-bold uppercase px-2.5 py-0.5 rounded-full bg-white/80 border border-current shadow-2xs">
                  {distressRiskData.riskLevel} RISK
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <div className="text-xs font-semibold">
                Configured Threshold: <span className="font-bold">{distressThreshold}%</span>
              </div>
              <div className="text-xs font-bold flex items-center sm:justify-end gap-1.5">
                {isTriggered ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-red-700">Early Warning Alert: ACTIVE</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-green-700">Within Safe Limits</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Sliders to Test Scenarios */}
        <div className="space-y-4 pt-1">
          <div className="text-xs font-bold uppercase tracking-wider text-green-950 flex items-center justify-between">
            <span>Adjust Simulation Vectors:</span>
            <button
              onClick={handleReset}
              className="text-[11px] text-green-700 hover:underline flex items-center gap-1 font-semibold"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset to Demo State</span>
            </button>
          </div>

          {/* Slider 1: Rainfall Deviation */}
          <div className="bg-green-50/40 border border-green-100 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-green-950">
              <span className="flex items-center gap-1.5">
                <CloudRain className="w-4 h-4 text-blue-600" />
                Rainfall Deficit (% below normal)
              </span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-900 rounded-md font-mono">
                -{rainDeviation}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="70"
              value={rainDeviation}
              onChange={(e) => {
                const val = Number(e.target.value);
                setRainDeviation(val);
                recalculateDistressRisk(val, priceDrop, loanUrgent);
              }}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-green-700">
              <span>0% (Normal Monsoon)</span>
              <span>30% (Severe Deficit)</span>
              <span>70% (Severe Drought)</span>
            </div>
          </div>

          {/* Slider 2: Mandi Price Deficit */}
          <div className="bg-green-50/40 border border-green-100 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-green-950">
              <span className="flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-amber-600" />
                Mandi Price Drop (% below MSP/avg)
              </span>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded-md font-mono">
                -{priceDrop}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={priceDrop}
              onChange={(e) => {
                const val = Number(e.target.value);
                setPriceDrop(val);
                recalculateDistressRisk(rainDeviation, val, loanUrgent);
              }}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-green-700">
              <span>0% (Stable Market)</span>
              <span>18% (Market Glut)</span>
              <span>50% (Market Crash)</span>
            </div>
          </div>

          {/* Toggle 3: Loan Due Date */}
          <div className="bg-green-50/40 border border-green-100 rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-green-950">
              <CreditCard className="w-4 h-4 text-purple-600" />
              <div>
                <div>Kisan Credit Card (KCC) Loan Due in &lt; 15 Days</div>
                <div className="text-[10px] text-stone-500 font-normal">
                  Financial repayment stress factor
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                const next = !loanUrgent;
                setLoanUrgent(next);
                recalculateDistressRisk(rainDeviation, priceDrop, next);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                loanUrgent
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'bg-stone-200 text-stone-700'
              }`}
            >
              {loanUrgent ? 'Active (Due)' : 'No Due Loan'}
            </button>
          </div>

          {/* Slider 4: Risk Alert Threshold */}
          <div className="bg-green-50/40 border border-green-100 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-green-950">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-green-600" />
                Trigger Alert Threshold
              </span>
              <span className="px-2 py-0.5 bg-green-100 text-green-900 rounded-md font-mono">
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
            <div className="flex justify-between text-[10px] text-green-700">
              <span>10% (Ultra Sensitive)</span>
              <span>20% (Recommended)</span>
              <span>40% (High Resilience)</span>
            </div>
          </div>
        </div>

        {/* Agricultural Extension Officer Dispatch Preview Card */}
        <div className="bg-green-50/70 border border-green-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-green-950">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-green-700" />
              <span>Simulated Block Agri Extension Officer Integration</span>
            </div>
            <span
              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                isTriggered
                  ? 'bg-green-600 text-white'
                  : 'bg-stone-300 text-stone-700'
              }`}
            >
              {isTriggered ? 'Dispatched' : 'Standby'}
            </span>
          </div>

          <div className="text-xs text-green-900 space-y-1 pt-1">
            <p>
              <strong>Officer Assigned:</strong> {distressRiskData.officerAlertStatus.officerName} (
              {distressRiskData.officerAlertStatus.officerDesignation})
            </p>
            <p>
              <strong>Block Office:</strong> {distressRiskData.officerAlertStatus.officerBlock} •{' '}
              <strong>Helpline:</strong> {distressRiskData.officerAlertStatus.officerContact}
            </p>
            <p className="text-[11px] text-green-700 italic">
              Status: {distressRiskData.officerAlertStatus.acknowledgementStatus} (Prototype simulation — structured for e-Governance API linkage)
            </p>
          </div>
        </div>

        {/* Done button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={() => setIsDistressModalOpen(false)}
            className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold shadow-xs transition-all"
          >
            Apply & Close Simulator
          </button>
        </div>

      </div>
    </div>
  );
};
