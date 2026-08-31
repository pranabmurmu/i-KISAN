import React, { useState } from 'react';
import {
  Landmark,
  ShieldCheck,
  CreditCard,
  Percent,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  TrendingDown,
  CheckCircle2,
  HelpCircle,
  FileText,
  Calculator,
  RefreshCw,
  Phone,
  Sparkles,
  ChevronRight,
  ExternalLink,
  IndianRupee,
  Building,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LoanDetailsView: React.FC = () => {
  const { user, setActiveView, setIsDistressModalOpen } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'calculator' | 'schemes' | 'relief'>('overview');

  // Calculator state
  const [calcAmount, setCalcAmount] = useState<number>(150000);
  const [calcTenureMonths, setCalcTenureMonths] = useState<number>(12);
  const [calcLoanType, setCalcLoanType] = useState<'kcc' | 'tractor' | 'solar' | 'dairy'>('kcc');

  // Interactive KCC values
  const sanctionedLimit = user?.kccLimit || 300000;
  const outstandingAmount = user?.outstandingLoan || 120000;
  const availableLimit = Math.max(0, sanctionedLimit - outstandingAmount);
  const interestRate = user?.loanInterestRate || 4.0;
  const bankName = user?.bankName || 'State Bank of India (Khordha Branch)';
  const loanAccount = user?.loanAccountNumber || 'SBIN0048912-KCC-8841';
  const dueDate = user?.loanDueDate || '31 March 2027';

  // Calculator rates
  const getInterestRate = () => {
    switch (calcLoanType) {
      case 'kcc':
        return 4.0; // 7% base - 3% prompt repayment subvention
      case 'tractor':
        return 8.5;
      case 'solar':
        return 5.5; // Subsidized via PM-KUSUM
      case 'dairy':
        return 4.0; // Dairy KCC
      default:
        return 7.0;
    }
  };

  const calculatedRate = getInterestRate();
  const yearlyInterest = Math.round((calcAmount * calculatedRate) / 100);
  const totalRepayment = calcAmount + yearlyInterest;
  const monthlyEmi = Math.round(totalRepayment / calcTenureMonths);
  const marketRateDiff = Math.round((calcAmount * (11.5 - calculatedRate)) / 100);

  return (
    <div id="agri-loan-details-view" className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-green-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold">
              <Landmark className="w-3.5 h-3.5" />
              <span>Government Subsidized Agricultural Credit</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Agri Loans & Kisan Credit Card (KCC) Hub
            </h1>
            <p className="text-sm text-green-100 max-w-2xl font-medium">
              Manage your agricultural credit lines, track seasonal repayment due dates, calculate interest subventions, and apply for disaster moratoriums.
            </p>
          </div>

          {/* Prompt Repayment Badge */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center min-w-[200px] shadow-sm">
            <div className="text-[11px] text-amber-200 uppercase font-extrabold tracking-wider">Effective Interest Rate</div>
            <div className="text-3xl font-black text-amber-300 my-1">{interestRate}% p.a.</div>
            <div className="text-[10px] text-green-200 font-semibold flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>3% Subvention Applied</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-white/15">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-amber-400 text-green-950 shadow-md scale-102'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Credit Line Overview
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'calculator'
                ? 'bg-amber-400 text-green-950 shadow-md scale-102'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Agri EMI & Subsidy Calculator
          </button>
          <button
            onClick={() => setActiveTab('schemes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'schemes'
                ? 'bg-amber-400 text-green-950 shadow-md scale-102'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Special Credit Schemes
          </button>
          <button
            onClick={() => setActiveTab('relief')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'relief'
                ? 'bg-amber-400 text-green-950 shadow-md scale-102'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            RBI Moratorium & Distress Relief
          </button>
        </div>
      </div>

      {/* Tab 1: Credit Line Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-green-100 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-stone-500">
                <span>Sanctioned KCC Limit</span>
                <Landmark className="w-4 h-4 text-green-700" />
              </div>
              <div className="text-2xl font-black text-green-950">
                ₹{sanctionedLimit.toLocaleString()}
              </div>
              <div className="text-[11px] text-green-700 font-semibold">
                Approved by {bankName.split('(')[0] || 'SBI'}
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-amber-100 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-amber-700">
                <span>Current Outstanding</span>
                <TrendingDown className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-amber-950">
                ₹{outstandingAmount.toLocaleString()}
              </div>
              <div className="text-[11px] text-stone-500">
                Principal & accrued interest
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-700">
                <span>Available Credit Cushion</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-900">
                ₹{availableLimit.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold">
                Instant withdrawal ready
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-rose-100 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-rose-700">
                <span>Upcoming Due Date</span>
                <Calendar className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-xl font-black text-rose-950">
                {dueDate}
              </div>
              <div className="text-[11px] text-rose-700 font-semibold">
                Annual interest cycle
              </div>
            </div>
          </div>

          {/* Active Facility Details Card */}
          <div className="bg-white rounded-3xl border border-green-100 p-6 sm:p-7 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
              <div>
                <h2 className="text-base sm:text-lg font-black text-green-950">
                  Active Kisan Credit Card Account Details
                </h2>
                <p className="text-xs text-stone-500">
                  Linked to {user?.farmAreaAcres || 3.0} Acres of Kharif Paddy cultivation
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveView('profile')}
                  className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Edit Bank Details
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-1">
                <div className="text-[11px] font-bold text-stone-500 uppercase">Account Identifier</div>
                <div className="text-sm font-black text-stone-900 font-mono">{loanAccount}</div>
                <div className="text-[11px] text-stone-500">{bankName}</div>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-1">
                <div className="text-[11px] font-bold text-stone-500 uppercase">Subvention Status</div>
                <div className="text-sm font-black text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>3% Prompt Repayment Active</span>
                </div>
                <div className="text-[11px] text-stone-500">7.0% Base Rate - 3.0% GoI Rebate = 4.0%</div>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-1">
                <div className="text-[11px] font-bold text-stone-500 uppercase">PMFBY Insurance Shield</div>
                <div className="text-sm font-black text-sky-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-sky-600" />
                  <span>Auto-Enrolled (Kharif 2026)</span>
                </div>
                <div className="text-[11px] text-stone-500">Premium deducted & sum insured protected</div>
              </div>
            </div>

            {/* Notification Callout for Pending Due */}
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-amber-950">
                    Timely Renewal Reminder for 2026-27
                  </div>
                  <div className="text-[11px] text-amber-900 font-medium">
                    Deposit the accrued interest of ₹4,800 before {dueDate} to keep your 4% rate intact and unlock a 10% credit limit hike.
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsDistressModalOpen(true)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl whitespace-nowrap transition-colors cursor-pointer shadow-xs"
              >
                Simulate Distress & Moratorium
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Interactive EMI & Subsidy Calculator */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-3xl border border-green-100 p-6 sm:p-7 shadow-xs space-y-6">
            <div>
              <h2 className="text-base sm:text-lg font-black text-green-950">
                Agri Credit & Subsidy Calculator
              </h2>
              <p className="text-xs text-stone-500">
                Calculate your seasonal interest burden, monthly repayments, and government subsidies.
              </p>
            </div>

            {/* Loan Type Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 block">Select Scheme / Facility</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'kcc', label: 'KCC Crop Loan', rate: '4.0%' },
                  { id: 'tractor', label: 'Tractor Loan', rate: '8.5%' },
                  { id: 'solar', label: 'PM-KUSUM Solar', rate: '5.5%' },
                  { id: 'dairy', label: 'Dairy KCC', rate: '4.0%' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCalcLoanType(item.id as any)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      calcLoanType === item.id
                        ? 'bg-amber-50 border-amber-300 text-amber-950 font-black shadow-xs'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100 font-semibold'
                    }`}
                  >
                    <div className="text-xs">{item.label}</div>
                    <div className="text-[11px] text-green-700 font-bold">{item.rate} Rate</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Loan Amount Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-stone-700">Required Credit Amount</span>
                <span className="text-green-900 font-black text-base">₹{calcAmount.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="20000"
                max="1000000"
                step="10000"
                value={calcAmount}
                onChange={(e) => setCalcAmount(Number(e.target.value))}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-green-700"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-semibold">
                <span>₹20,000</span>
                <span>₹5,00,000</span>
                <span>₹10,00,000</span>
              </div>
            </div>

            {/* Tenure Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-stone-700">Repayment Period</span>
                <span className="text-green-900 font-black text-base">{calcTenureMonths} Months ({calcTenureMonths / 12} Yrs)</span>
              </div>
              <input
                type="range"
                min="6"
                max="60"
                step="6"
                value={calcTenureMonths}
                onChange={(e) => setCalcTenureMonths(Number(e.target.value))}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-green-700"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-semibold">
                <span>6 Months (1 Crop)</span>
                <span>12 Months (1 Year)</span>
                <span>60 Months (5 Years)</span>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-5 bg-gradient-to-br from-green-900 to-emerald-950 rounded-3xl p-6 text-white flex flex-col justify-between space-y-6 shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Computed Repayment Summary</span>
              </div>

              <div className="p-4 bg-white/10 rounded-2xl border border-white/15 space-y-1">
                <div className="text-xs text-green-200">Estimated Annual Interest</div>
                <div className="text-3xl font-black text-amber-300">₹{yearlyInterest.toLocaleString()}</div>
                <div className="text-[11px] text-green-300">Calculated at {calculatedRate}% subsidized rate</div>
              </div>

              <div className="space-y-2 text-xs divide-y divide-white/10">
                <div className="flex items-center justify-between pt-2">
                  <span className="text-green-200">Principal Borrowed:</span>
                  <span className="font-bold">₹{calcAmount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-green-200">Estimated Monthly EMI:</span>
                  <span className="font-bold">₹{monthlyEmi.toLocaleString()}/mo</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-green-200">Government Interest Savings:</span>
                  <span className="font-black text-emerald-400">+₹{marketRateDiff.toLocaleString()} Saved</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-emerald-800/50 rounded-2xl border border-emerald-500/40 text-xs space-y-1 text-emerald-100">
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Collateral-Free Limit: ₹1,60,000</span>
              </div>
              <p className="text-[11px] text-emerald-200">
                No land hypothecation or mortgage required for loans up to ₹1.60 Lakh under RBI guidelines.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Special Credit Schemes */}
      {activeTab === 'schemes' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-3xl border border-green-100 p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm">
                4%
              </div>
              <h3 className="text-base font-black text-green-950">Kisan Credit Card (KCC)</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Short term crop loans up to ₹3,00,000 at 7% interest with 3% prompt repayment incentive, reducing actual burden to just 4.0% p.a.
              </p>
            </div>
            <div className="pt-3 border-t border-stone-100 text-xs font-bold text-green-800">
              Eligibility: All active small & marginal landholders
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-green-100 p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-900 flex items-center justify-center font-bold text-sm">
                60%
              </div>
              <h3 className="text-base font-black text-green-950">PM-KUSUM Solar Irrigation</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Receive 60% direct subsidy for standalone solar agricultural pumps with bank loan assistance covering the remaining 30% farmer share.
              </p>
            </div>
            <div className="pt-3 border-t border-stone-100 text-xs font-bold text-sky-800">
              Subsidy: 30% Central + 30% Odisha State
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-green-100 p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-sm">
                3%
              </div>
              <h3 className="text-base font-black text-green-950">Agri Infrastructure Fund (AIF)</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Post-harvest management loans up to ₹2 Crore with 3% interest subvention for establishing cold storage, sorting units, and grain dryers.
              </p>
            </div>
            <div className="pt-3 border-t border-stone-100 text-xs font-bold text-emerald-800">
              Tenure: Up to 7 years with moratorium
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: RBI Moratorium & Distress Relief */}
      {activeTab === 'relief' && (
        <div className="bg-white rounded-3xl border border-rose-100 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-stone-900">
                RBI Natural Calamity Loan Restructuring Guidelines
              </h2>
              <p className="text-xs text-stone-500">
                Protection protocols activated during extreme weather, flood damage, or pest outbreak disasters.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2">
              <span className="font-extrabold text-stone-900 block text-sm">1. Short-Term to Term Loan Conversion</span>
              <p className="text-stone-600 leading-relaxed">
                When crop loss exceeds 33%, short-term KCC loans can be restructured into medium-term loans spanning 3 to 5 years, with the first year as a repayment moratorium.
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2">
              <span className="font-extrabold text-stone-900 block text-sm">2. Interest Waiver & Penalty Immunity</span>
              <p className="text-stone-600 leading-relaxed">
                No penal interest or compounding will be charged during the moratorium period, and normal interest subvention continues under government notifications.
              </p>
            </div>
          </div>

          <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-black text-rose-950">
                Are you facing acute weather distress or flood damage right now?
              </div>
              <div className="text-[11px] text-rose-800">
                Trigger the multi-factor distress assessment to alert your local Block Agricultural Extension Officer.
              </div>
            </div>

            <button
              onClick={() => setIsDistressModalOpen(true)}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs whitespace-nowrap"
            >
              Open Distress Assessment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
