import React from 'react';
import {
  LayoutDashboard,
  Bug,
  Store,
  BookOpen,
  User,
} from 'lucide-react';
import { useApp, ActiveView } from '../../context/AppContext';

export const MobileNav: React.FC = () => {
  const { activeView, setActiveView, t } = useApp();

  const navItems: Array<{
    id: ActiveView;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: 'home', label: 'Home', icon: LayoutDashboard },
    { id: 'disease', label: 'Disease Lab', icon: Bug },
    { id: 'marketplace', label: 'Market', icon: Store },
    { id: 'insights', label: 'Insights', icon: BookOpen },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav
      id="mobile-bottom-navbar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur border-t border-green-100 px-2 py-1.5 shadow-lg"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="grid grid-cols-5 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => setActiveView(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
                isActive
                  ? 'text-green-700 font-bold bg-green-50'
                  : 'text-green-600/70 hover:text-green-900 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-green-700' : ''}`} />
              <span className="text-[10px] tracking-tight mt-0.5 truncate w-full text-center">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
