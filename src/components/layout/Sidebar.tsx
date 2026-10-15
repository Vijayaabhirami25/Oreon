import React from 'react';
import {
  LayoutDashboard,
  Cpu,
  ShieldCheck,
  Radio,
  BarChart3,
  Bell,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { NavTab } from '../../types/mineguard';
import { OreonLogo } from '../common/OreonLogo';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  activeAlertCount: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  activeAlertCount,
  collapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  const navItems: Array<{ id: NavTab; label: string; icon: React.ReactNode; badge?: number }> = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <LayoutDashboard className="w-5 h-5 flex-shrink-0" />,
    },
    {
      id: 'zone-a',
      label: 'Zone A — Sensor Unit',
      icon: <Cpu className="w-5 h-5 flex-shrink-0" />,
    },
    {
      id: 'zone-b',
      label: 'Zone B — Control & Power',
      icon: <ShieldCheck className="w-5 h-5 flex-shrink-0" />,
    },
    {
      id: 'lora',
      label: 'LoRa Communication',
      icon: <Radio className="w-5 h-5 flex-shrink-0" />,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="w-5 h-5 flex-shrink-0" />,
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: <Bell className="w-5 h-5 flex-shrink-0" />,
      badge: activeAlertCount,
    },
    {
      id: 'logs',
      label: 'Event Logs',
      icon: <FileText className="w-5 h-5 flex-shrink-0" />,
    },
  ];

  const handleSelect = (tab: NavTab) => {
    onTabChange(tab);
    if (isMobileOpen) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white border-r border-[#E5E7EB] transition-all duration-300 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Area */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#E5E7EB]">
          <div className="overflow-hidden">
            <OreonLogo size="md" showWordmark={!collapsed} showTagline={!collapsed} />
          </div>

          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-md text-[#697386] hover:text-[#171A21] hover:bg-slate-100 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Primary Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className={`px-2 mb-2 text-[11px] font-semibold tracking-wider text-[#9CA3AF] uppercase ${collapsed ? 'hidden' : 'block'}`}>
            Operations
          </div>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative ${
                  isActive
                    ? 'bg-[#FAF4EE] text-[#C47A35] font-semibold'
                    : 'text-[#4A5568] hover:text-[#171A21] hover:bg-slate-50'
                }`}
                title={collapsed ? item.label : undefined}
              >
                {/* Active Indicator Bar on left in OREON copper */}
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#C47A35] rounded-r-md" />
                )}

                <span className={isActive ? 'text-[#C47A35]' : 'text-[#697386] group-hover:text-[#171A21]'}>
                  {item.icon}
                </span>

                {!collapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}

                {!collapsed && item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#DC2626] text-white">
                    {item.badge}
                  </span>
                )}

                {/* Collapsed Badge Pill */}
                {collapsed && item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#DC2626]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Navigation: Settings & Team Info */}
        <div className="p-3 border-t border-[#E5E7EB] space-y-2 bg-[#FAFBFC]">
          <button
            onClick={() => handleSelect('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative ${
              activeTab === 'settings'
                ? 'bg-[#FAF4EE] text-[#C47A35] font-semibold'
                : 'text-[#4A5568] hover:text-[#171A21] hover:bg-slate-100'
            }`}
            title={collapsed ? 'Settings' : undefined}
          >
            {activeTab === 'settings' && (
              <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#C47A35] rounded-r-md" />
            )}
            <Settings className={`w-5 h-5 flex-shrink-0 ${activeTab === 'settings' ? 'text-[#C47A35]' : 'text-[#697386] group-hover:text-[#171A21]'}`} />
            {!collapsed && <span className="flex-1 text-left truncate">Settings</span>}
          </button>

          {!collapsed && (
            <div className="pt-2 px-3 text-[11px] text-[#697386] font-mono leading-tight border-t border-slate-200/60">
              <div className="font-semibold text-[#171A21]">OREON Platform</div>
              <div className="text-[10px] text-[#9CA3AF] mt-0.5">VAYUJ NEXUS • HSN|TN|00803</div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
