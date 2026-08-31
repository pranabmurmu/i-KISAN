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
  const { user, setUser, t } = useApp();

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

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-7 py-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl text-xs font-bold shadow-xs flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save & Recalculate Advisory</span>
          </button>
        </div>

      </form>

    </div>
  );
};
