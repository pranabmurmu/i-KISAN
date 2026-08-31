import React from 'react';
import {
  LayoutDashboard,
  Bug,
  Store,
  BookOpen,
  ChevronRight,
} from 'lucide-react';
import { FarmerLogo } from '../common/FarmerLogo';
import { useApp, ActiveView } from '../../context/AppContext';

interface SidebarProps {
  onOpenSettings?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = () => {
  const { activeView, setActiveView, user, t } = useApp();

  const navItems: Array<{
    id: ActiveView;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }> = [
    {
      id: 'home',
      label: t.navHome,
      icon: LayoutDashboard,
    },
    {
      id: 'disease',
      label: t.navDisease,
      icon: Bug,
      badge: 'AI Lab',
    },
    {
      id: 'marketplace',
      label: t.navMarketplace,
      icon: Store,
      badge: 'Live Mandi',
    },
    {
      id: 'insights',
      label: t.navInsights,
      icon: BookOpen,
    },
  ];

  return (
    <aside
      id="desktop-sidebar"
      className="hidden md:flex flex-col w-64 lg:w-72 bg-white border-r border-green-100 min-h-[calc(100vh-4rem)] p-4 sm:p-5 justify-between shrink-0 select-none shadow-sm"
    >
      {/* Top Section: Navigation Links */}
      <div className="space-y-6">
        
        {/* Brand / Farm Header Chip */}
        <div className="flex items-center gap-3 px-1 mb-2">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-md">
            <FarmerLogo className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-green-900 block leading-tight">
              i KISAN
            </span>
            <span className="text-[10px] uppercase font-bold text-green-600 tracking-wider">
              {user?.district || 'Odisha'}, IN
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1" aria-label="Main sidebar navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all group ${
                  isActive
                    ? 'bg-green-100 text-green-700 shadow-2xs font-bold'
                    : 'text-green-600 hover:bg-green-50 hover:text-green-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-105 ${
                      isActive ? 'text-green-700' : 'text-green-600 group-hover:text-green-800'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-green-600 text-white'
                        : 'bg-green-50 text-green-700 border border-green-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* End of Sidebar Nav */}
    </aside>
  );
};
