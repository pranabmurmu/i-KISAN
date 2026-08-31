import React, { useState } from 'react';
import {
  User,
  Trees,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  Save,
  ShieldCheck,
  Wheat,
  Layers,
  Droplets,
  Calendar,
  Sparkles,
  Landmark,
  CreditCard,
  Percent,
  IndianRupee,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  cropNamesList,
  soilTypesList,
  irrigationTypesList,
  farmingTypesList,
  cropStagesList,
} from '../../data/translations';
import { FarmerProfile } from '../../types';

export const ProfileView: React.FC = () => {
  const { user, setUser, t, setActiveView } = useApp();

  const [formData, setFormData] = useState<FarmerProfile>(
    user || {
      id: 'farmer-pranab-odisha',
      fullName: 'Pranab',
      email: 'pranab.farmer@smartkrishi.in',
      mobile: '+91 98612 34567',
      state: 'Odisha',
      district: 'Khordha',
      village: 'Bhatapatana Panchayat',
      mainCrop: 'Paddy (Rice)',
      otherCrops: ['Tomato', 'Green Gram'],
      farmAreaAcres: 3.0,
      soilType: 'Loamy',
      irrigationType: 'Borewell',
      farmingType: 'Mixed',
      cropGrowthStage: 'Vegetative',
      expectedHarvestDate: '2026-10-15',
      hasKCCLoan: true,
      loanType: 'Kisan Credit Card (KCC)',
      kccLimit: 300000,
      outstandingLoan: 120000,
      bankName: 'State Bank of India (Khordha Branch)',
      loanAccountNumber: 'SBIN0048912-KCC-8841',
      loanInterestRate: 4.0,
      loanDueDate: '2027-03-31',
    }
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  return (
    <div id="farmer-profile-view" className="space-y-6 max-w-4xl mx-auto pb-12">
      
      {/* Header */}
      <section className="bg-white rounded-3xl border border-green-100 p-5 sm:p-7 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-green-100 border-2 border-green-200 flex items-center justify-center text-green-800 text-2xl font-black shrink-0">
            {formData.fullName ? formData.fullName[0] : 'P'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-green-950">
                {formData.fullName} (Farm Profile)
              </h1>
              <span className="px-2.5 py-0.5 bg-green-100 text-green-800 text-[10px] font-bold uppercase rounded-full">
                Verified Farmer
              </span>
            </div>
            <p className="text-xs text-green-600 font-medium mt-0.5">
              {formData.village}, {formData.district}, {formData.state} • {formData.farmAreaAcres} Acres Farm
            </p>
          </div>
        </div>
      </section>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {savedSuccess && (
          <div className="p-4 bg-green-50 border border-green-300 text-green-950 rounded-2xl flex items-center gap-2.5 font-bold text-xs animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            <span>Farm profile updated successfully! Dashboards & AI models refreshed with new parameters.</span>
          </div>
        )}

        {/* Section 1: Personal Details */}
        <div className="bg-white rounded-3xl border border-green-100 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-green-50">
            <User className="w-4 h-4 text-green-700" />
            <h2 className="text-xs uppercase font-bold tracking-wider text-green-900">
              Personal & Contact Coordinates
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-green-950 mb-1">
                {t.fullName}
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-green-50/40 border border-green-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-green-950 mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-green-50/40 border border-green-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-green-950 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-green-50/40 border border-green-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-green-950 mb-1">
                {t.state}
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-green-50/40 border border-green-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-green-950 mb-1">
                {t.district}
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-green-50/40 border border-green-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-green-950 mb-1">
                {t.village}
              </label>
              <input
                type="text"
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-green-50/40 border border-green-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Farm & Crop Parameters */}
        <div className="bg-white rounded-3xl border border-green-100 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-green-50">
            <Trees className="w-4 h-4 text-green-700" />
            <h2 className="text-xs uppercase font-bold tracking-wider text-green-900">
              Farm Soil & Crop Agro-Parameters
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-green-950 mb-1">
                {t.mainCrop}
              </label>
              <select
                value={formData.mainCrop}
                onChange={(e) => setFormData({ ...formData, mainCrop: e.target.value })}
                className="w-full px-3 py-2.5 bg-green-50/40 border border-green-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {cropNamesList.map((crop) => (
                  <option key={crop} value={crop}>
                    {crop}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-green-950 mb-1">
                {t.farmArea} ({t.acres})
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={formData.farmAreaAcres}
                onChange={(e) => setFormData({ ...formData, farmAreaAcres: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2.5 bg-green-50/40 border border-green-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-green-950 mb-1">
                {t.soilType}
              </label>
              <select
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value as any })}
                className="w-full px-3 py-2.5 bg-green-50/40 border border-green-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {soilTypesList.map((soil) => (
                  <option key={soil} value={soil}>
                    {soil} Soil
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-green-950 mb-1">
                {t.irrigationType}
              </label>
              <select
                value={formData.irrigationType}
                onChange={(e) => setFormData({ ...formData, irrigationType: e.target.value as any })}
                className="w-full px-3 py-2.5 bg-green-50/40 border border-green-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {irrigationTypesList.map((irr) => (
                  <option key={irr} value={irr}>
                    {irr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-green-950 mb-1">
                {t.growthStage}
              </label>
              <select
                value={formData.cropGrowthStage}
                onChange={(e) => setFormData({ ...formData, cropGrowthStage: e.target.value as any })}
                className="w-full px-3 py-2.5 bg-green-50/40 border border-green-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {cropStagesList.map((st) => (
                  <option key={st} value={st}>
                    {st} Stage
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-green-950 mb-1">
                {t.farmingType}
              </label>
              <select
                value={formData.farmingType}
                onChange={(e) => setFormData({ ...formData, farmingType: e.target.value as any })}
                className="w-full px-3 py-2.5 bg-green-50/40 border border-green-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {farmingTypesList.map((ft) => (
                  <option key={ft} value={ft}>
                    {ft}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Agricultural Loan & Credit Details */}
        <div className="bg-white rounded-3xl border border-green-100 p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-green-50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
                <Landmark className="w-4 h-4 text-amber-800" />
              </div>
              <div>
                <h2 className="text-xs uppercase font-bold tracking-wider text-green-900">
                  Agri Loans & Kisan Credit Card (KCC) Records
                </h2>
                <p className="text-[11px] text-stone-500 font-medium">
                  Add or update your bank credit details to calculate interest subsidies, risk ratings, and repayment cycles.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveView('loans')}
              className="hidden sm:flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200 transition-colors"
            >
              <IndianRupee className="w-3.5 h-3.5" />
              <span>Open Loan Hub</span>
            </button>
          </div>

          {/* Active Loan Switch */}
          <div className="p-4 bg-gradient-to-r from-amber-50/60 to-emerald-50/60 border border-amber-200/80 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-amber-950 block">
                  Do you currently have an active Agricultural / KCC Loan?
                </span>
                <span className="text-[11px] text-amber-900 font-medium">
                  Enables 3% prompt repayment interest subvention & crop insurance synchronization.
                </span>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={Boolean(formData.hasKCCLoan)}
                onChange={(e) => setFormData({ ...formData, hasKCCLoan: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Conditional Loan Input Fields */}
          {formData.hasKCCLoan && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold text-green-950 mb-1 flex items-center justify-between">
                  <span>Facility / Loan Scheme</span>
                  <span className="text-[10px] text-amber-800 font-semibold">Govt Subsidized</span>
                </label>
                <select
                  value={formData.loanType || 'Kisan Credit Card (KCC)'}
                  onChange={(e) => setFormData({ ...formData, loanType: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 bg-green-50/40 border border-green-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 text-green-950"
                >
                  <option value="Kisan Credit Card (KCC)">Kisan Credit Card (KCC Crop Loan)</option>
                  <option value="Tractor / Farm Mechanization">Tractor & Farm Equipment Loan</option>
                  <option value="PM-KUSUM Solar Pump">PM-KUSUM Solar Pump Credit</option>
                  <option value="Dairy & Animal Husbandry">Dairy & Animal Husbandry KCC</option>
                  <option value="Agri Infrastructure">Agri Infrastructure Fund (AIF)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-green-950 mb-1">
                  Lending Bank & Branch Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. State Bank of India, Khordha Branch"
                  value={formData.bankName || ''}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-green-50/40 border border-green-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 text-green-950"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-green-950 mb-1">
                  Loan / KCC Account Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. SBIN0048912-KCC-8841"
                  value={formData.loanAccountNumber || ''}
                  onChange={(e) => setFormData({ ...formData, loanAccountNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-green-50/40 border border-green-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 text-green-950"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-green-950 mb-1 flex items-center justify-between">
                  <span>Sanctioned Credit Limit (₹)</span>
                  <span className="text-[10px] text-stone-500">Max Limit</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs text-stone-500 font-bold">₹</span>
                  <input
                    type="number"
                    step="5000"
                    placeholder="300000"
                    value={formData.kccLimit || ''}
                    onChange={(e) => setFormData({ ...formData, kccLimit: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-7 pr-3.5 py-2.5 bg-green-50/40 border border-green-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 text-green-950"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-green-950 mb-1 flex items-center justify-between">
                  <span>Current Outstanding Balance (₹)</span>
                  <span className="text-[10px] text-amber-700 font-bold">Principal Due</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs text-stone-500 font-bold">₹</span>
                  <input
                    type="number"
                    step="1000"
                    placeholder="120000"
                    value={formData.outstandingLoan || ''}
                    onChange={(e) => setFormData({ ...formData, outstandingLoan: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-7 pr-3.5 py-2.5 bg-green-50/40 border border-green-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 text-green-950"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-green-950 mb-1 flex items-center justify-between">
                  <span>Effective Interest Rate (% p.a.)</span>
                  <span className="text-[10px] text-emerald-700 font-bold">4% with Subvention</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="4.0"
                    value={formData.loanInterestRate || ''}
                    onChange={(e) => setFormData({ ...formData, loanInterestRate: parseFloat(e.target.value) || 0 })}
                    className="w-full pr-7 px-3.5 py-2.5 bg-green-50/40 border border-green-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 text-green-950"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-stone-500 font-bold">%</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-green-950 mb-1">
                  Upcoming Payment Due Date
                </label>
                <input
                  type="date"
                  value={formData.loanDueDate || '2027-03-31'}
                  onChange={(e) => setFormData({ ...formData, loanDueDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-green-50/40 border border-green-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 text-green-950"
                />
              </div>

              {/* Calculated available credit summary */}
              <div className="sm:col-span-2 p-3.5 bg-stone-50 border border-stone-200 rounded-2xl flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[11px] text-stone-500 font-bold block uppercase">Available Credit Cushion</span>
                  <span className="text-base font-black text-emerald-800">
                    ₹{Math.max(0, (formData.kccLimit || 0) - (formData.outstandingLoan || 0)).toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-400 block font-semibold">Credit Utilization</span>
                  <span className="text-xs font-black text-stone-800">
                    {formData.kccLimit ? Math.round(((formData.outstandingLoan || 0) / formData.kccLimit) * 100) : 0}% of Sanctioned Limit
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-7 py-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl text-xs font-bold shadow-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save & Recalculate Advisory</span>
          </button>
        </div>

      </form>

    </div>
  );
};
