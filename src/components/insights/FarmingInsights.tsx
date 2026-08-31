import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Clock,
  ArrowRight,
  X,
  Sparkles,
  CheckCircle2,
  Landmark,
  Droplets,
  Sprout,
  ShieldCheck,
  Calendar,
  User,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mockFarmingArticles } from '../../data/mockData';
import { FarmingArticle } from '../../types';

export const FarmingInsights: React.FC = () => {
  const { t } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeArticle, setActiveArticle] = useState<FarmingArticle | null>(null);

  const categories = [
    'All',
    'Best crops based on ROI',
    'Weather-based farming',
    'Government schemes',
    'Pest and disease prevention',
  ];

  const filteredArticles = mockFarmingArticles.filter((art) => {
    const matchesCategory =
      selectedCategory === 'All' || art.category === selectedCategory;
    const matchesQuery =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (art.recommendedFor.crops &&
        art.recommendedFor.crops.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesQuery;
  });

  return (
    <div id="farming-insights-page" className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header Banner */}
      <section className="bg-white rounded-3xl border border-green-100 p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-800 border border-green-200 flex items-center justify-center font-bold">
              <BookOpen className="w-6 h-6 text-green-700" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-green-950 tracking-tight">
                {t.navInsights}
              </h1>
              <p className="text-xs text-green-600 font-medium">
                Practical agronomic guides, govt subsidies, organic soil revitalisation & climate adaptation
              </p>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides, schemes, tips..."
              className="w-full pl-10 pr-4 py-2 bg-green-50/40 border border-green-200 rounded-xl text-xs text-green-950 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </section>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-green-600 text-white shadow-xs'
                : 'bg-white text-green-800 border border-green-200 hover:bg-green-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <article
            key={article.id}
            onClick={() => setActiveArticle(article)}
            className="bg-white rounded-3xl border border-green-100 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              {/* Image banner */}
              <div className="relative aspect-16/9 overflow-hidden bg-stone-100">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-green-800/90 backdrop-blur-xs text-white text-[10px] font-bold rounded-full">
                  {article.category}
                </span>
                <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium rounded-md flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {article.readTimeMinutes} min read
                </span>
              </div>

              {/* Body */}
              <div className="p-5 space-y-2">
                <div className="text-[11px] text-stone-400 font-medium">
                  {article.publishDate} • {article.author}
                </div>
                <h3 className="text-sm font-extrabold text-green-950 leading-snug group-hover:text-green-700 transition-colors">
                  {article.title}
                </h3>
                <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                  {article.summary}
                </p>
              </div>
            </div>

            {/* Footer tags and read more */}
            <div className="p-5 pt-0 space-y-3">
              <div className="flex flex-wrap gap-1">
                {article.recommendedFor.crops?.map((c, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-medium bg-green-50 text-green-800 px-2 py-0.5 rounded-md"
                  >
                    🌱 {c}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-green-50 flex items-center justify-between text-xs font-bold text-green-700 group-hover:text-green-800">
                <span>{t.readMore}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Article Detail Modal / Reader */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-green-100 shadow-2xl space-y-5 my-auto max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-green-100">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase px-2.5 py-1 bg-green-100 text-green-800 rounded-full">
                  {activeArticle.category}
                </span>
                <span className="text-xs text-stone-400 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {activeArticle.readTimeMinutes} min read
                </span>
              </div>
              <button
                onClick={() => setActiveArticle(null)}
                className="p-1.5 text-stone-400 hover:text-green-900 rounded-xl hover:bg-green-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Article Image Banner */}
            <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-stone-100">
              <img
                src={activeArticle.imageUrl}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Article Title */}
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-green-950 leading-snug">
                {activeArticle.title}
              </h2>
              <p className="text-xs text-stone-400 mt-1">
                Published on {activeArticle.publishDate} • {activeArticle.author}
              </p>
            </div>

            {/* Article Content */}
            <div className="text-xs sm:text-sm text-stone-700 leading-relaxed space-y-3">
              <p className="font-semibold text-green-950 bg-green-50/50 p-3.5 rounded-xl border border-green-100">
                {activeArticle.summary}
              </p>
              
              {activeArticle.content.map((paragraph, idx) => (
                <p key={idx} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Recommended for */}
            <div className="border-t border-green-100 pt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {activeArticle.recommendedFor.crops?.map((c, idx) => (
                  <span key={idx} className="text-xs bg-green-50 text-green-800 px-2.5 py-1 rounded-lg font-medium">
                    Crop: {c}
                  </span>
                ))}
              </div>

              <button
                onClick={() => setActiveArticle(null)}
                className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Close Article
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
