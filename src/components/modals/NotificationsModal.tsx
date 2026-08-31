import React, { useState } from 'react';
import {
  Bell,
  X,
  CheckCheck,
  Trash2,
  AlertTriangle,
  CloudRain,
  Landmark,
  ShieldCheck,
  TrendingUp,
  FlaskConical,
  Building2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Calendar,
  IndianRupee,
  Clock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NotificationItem } from '../../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
    setActiveView,
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'unread' | 'loan' | 'weather'>('all');

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'loan') return notif.category === 'loan';
    if (filter === 'weather') return notif.category === 'weather';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getCategoryIcon = (category: NotificationItem['category']) => {
    switch (category) {
      case 'loan':
        return <Landmark className="w-5 h-5 text-amber-700" />;
      case 'weather':
        return <CloudRain className="w-5 h-5 text-sky-600" />;
      case 'officer':
        return <AlertTriangle className="w-5 h-5 text-rose-600" />;
      case 'government':
        return <Building2 className="w-5 h-5 text-emerald-700" />;
      case 'market':
        return <TrendingUp className="w-5 h-5 text-teal-600" />;
      case 'crop':
        return <FlaskConical className="w-5 h-5 text-green-700" />;
      default:
        return <Bell className="w-5 h-5 text-stone-600" />;
    }
  };

  const getCategoryBadgeClass = (category: NotificationItem['category'], priority: NotificationItem['priority']) => {
    if (priority === 'urgent') {
      return 'bg-rose-100 text-rose-800 border-rose-200';
    }
    if (category === 'loan') {
      return 'bg-amber-100 text-amber-900 border-amber-200';
    }
    if (category === 'weather') {
      return 'bg-sky-100 text-sky-900 border-sky-200';
    }
    if (category === 'government') {
      return 'bg-emerald-100 text-emerald-900 border-emerald-200';
    }
    return 'bg-stone-100 text-stone-700 border-stone-200';
  };

  return (
    <div
      id="notifications-modal-overlay"
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="notifications-modal-card"
        className="bg-white rounded-3xl border border-green-100 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-green-900 via-green-800 to-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/15">
              <Bell className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight">Kisan Alerts & Notifications</h2>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-rose-500 text-white rounded-full text-xs font-black shadow-xs">
                    {unreadCount} New
                  </span>
                )}
              </div>
              <p className="text-xs text-green-200 font-medium">
                Live agricultural advisories, loan payment alerts & disaster warnings
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-green-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills & Actions Bar */}
        <div className="px-5 sm:px-6 py-3 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-2">
          {/* Quick Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-green-800 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-200/70 border border-stone-200'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === 'unread'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-200/70 border border-stone-200'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('loan')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                filter === 'loan'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-200/70 border border-stone-200'
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>Loans</span>
            </button>
            <button
              onClick={() => setFilter('weather')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                filter === 'weather'
                  ? 'bg-sky-700 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-200/70 border border-stone-200'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" />
              <span>Weather</span>
            </button>
          </div>

          {/* Bulk Actions */}
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="text-xs font-bold text-green-800 hover:text-green-950 flex items-center gap-1 bg-green-100/70 hover:bg-green-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark All Read</span>
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={clearNotifications}
                className="text-xs font-bold text-stone-500 hover:text-rose-700 flex items-center gap-1 px-2 py-1 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Clear All Notifications"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Notifications Scrollable List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 divide-y divide-stone-100">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center text-stone-400 space-y-2">
              <Bell className="w-12 h-12 mx-auto text-stone-300 stroke-[1.5]" />
              <p className="text-sm font-bold text-stone-600">No notifications found</p>
              <p className="text-xs text-stone-400">All current advisories and alerts have been processed.</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotificationAsRead(notif.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                  notif.read
                    ? 'bg-white border-stone-200/80 hover:bg-stone-50/80'
                    : notif.category === 'loan'
                    ? 'bg-amber-50/70 border-amber-300/90 shadow-2xs'
                    : notif.category === 'weather'
                    ? 'bg-sky-50/70 border-sky-300/90 shadow-2xs'
                    : notif.priority === 'urgent'
                    ? 'bg-rose-50/70 border-rose-300/90 shadow-2xs'
                    : 'bg-green-50/60 border-green-200 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {/* Category Icon Badge */}
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                      notif.category === 'loan'
                        ? 'bg-amber-100 border-amber-200 text-amber-800'
                        : notif.category === 'weather'
                        ? 'bg-sky-100 border-sky-200 text-sky-700'
                        : notif.priority === 'urgent'
                        ? 'bg-rose-100 border-rose-200 text-rose-700'
                        : 'bg-emerald-100 border-emerald-200 text-emerald-800'
                    }`}
                  >
                    {getCategoryIcon(notif.category)}
                  </div>

                  {/* Notification Content */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm font-black text-stone-900 leading-snug">
                          {notif.title}
                        </span>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                        )}
                      </div>

                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border shrink-0 ${getCategoryBadgeClass(
                          notif.category,
                          notif.priority
                        )}`}
                      >
                        {notif.priority === 'urgent' ? 'Urgent' : notif.category}
                      </span>
                    </div>

                    <p className="text-xs text-stone-700 leading-relaxed font-medium">
                      {notif.message}
                    </p>

                    {/* Meta info & Specific Loan / Weather tags */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-3 text-[11px] text-stone-500 font-semibold">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-stone-400" />
                          {notif.timestamp}
                        </span>

                        {notif.amount && (
                          <span className="flex items-center gap-1 text-amber-800 font-bold bg-amber-100/80 px-1.5 py-0.5 rounded">
                            <IndianRupee className="w-3 h-3" />
                            {notif.amount}
                          </span>
                        )}

                        {notif.dueDate && (
                          <span className="flex items-center gap-1 text-stone-600 font-bold bg-stone-100 px-1.5 py-0.5 rounded">
                            <Calendar className="w-3 h-3 text-stone-500" />
                            Due: {notif.dueDate}
                          </span>
                        )}
                      </div>

                      {/* Action Button */}
                      {notif.actionLink && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            markNotificationAsRead(notif.id);
                            setActiveView(notif.actionLink as any);
                            onClose();
                          }}
                          className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 bg-green-800 hover:bg-green-900 text-white rounded-xl transition-colors cursor-pointer shadow-2xs"
                        >
                          <span>{notif.actionLabel || 'View Details'}</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500 font-medium">
          <div className="flex items-center gap-1.5 text-green-900 font-bold">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>AI Automated Agronomic & Financial Alert Engine</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
