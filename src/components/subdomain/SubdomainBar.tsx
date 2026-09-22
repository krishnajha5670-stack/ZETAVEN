import React, { useState } from 'react';
import { Globe, ArrowRight, ShieldCheck, Store, ChevronDown, Check, ExternalLink } from 'lucide-react';
import { ShopOwner } from '../../types';
import { ThemeConfig } from '../../utils/theme';

interface SubdomainBarProps {
  currentShop: ShopOwner;
  allShops: ShopOwner[];
  currentMode: 'public' | 'login' | 'dashboard';
  theme: ThemeConfig;
  onSelectShop: (shop: ShopOwner) => void;
  onSelectMode: (mode: 'public' | 'login' | 'dashboard') => void;
  onBackToAdmin: () => void;
}

export const SubdomainBar: React.FC<SubdomainBarProps> = ({
  currentShop,
  allShops,
  currentMode,
  theme,
  onSelectShop,
  onSelectMode,
  onBackToAdmin
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="bg-slate-950 text-white text-xs border-b border-slate-800 sticky top-0 z-50 px-4 py-2 flex flex-wrap items-center justify-between gap-3 shadow-md">
      
      {/* Left: Subdomain & Shop Indicator */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-400 font-medium hidden sm:inline">Active Subdomain:</span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700 font-mono text-emerald-400 font-bold text-[11px]">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>https://{currentShop.subdomain}.zetaven.com</span>
          </div>
        </div>

        {/* Shop Switcher Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-colors"
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.hex }} />
            <span className="max-w-[140px] truncate">{currentShop.shopName}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
              <div className="absolute left-0 mt-1.5 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1.5 z-50 text-xs animate-in fade-in duration-100">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  Switch Shop Subdomain
                </div>
                <div className="max-h-60 overflow-y-auto divide-y divide-slate-800/50">
                  {allShops.map((s) => {
                    const isSelected = s.id === currentShop.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          onSelectShop(s);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-800 transition-colors ${
                          isSelected ? 'bg-slate-800 text-white font-bold' : 'text-slate-300'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <div className="truncate text-xs">{s.shopName}</div>
                          <div className="text-[10px] font-mono text-slate-400 truncate">{s.subdomain}.zetaven.com</div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right: Quick View Switchers (Public vs Login vs Dashboard) & Return to Zetaven Admin */}
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[11px]">
          <button
            type="button"
            onClick={() => onSelectMode('public')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
              currentMode === 'public'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Public Site
          </button>
          <button
            type="button"
            onClick={() => onSelectMode('login')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
              currentMode === 'login'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In Page
          </button>
          <button
            type="button"
            onClick={() => onSelectMode('dashboard')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
              currentMode === 'dashboard'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Shop Dashboard
          </button>
        </div>

        <button
          type="button"
          onClick={onBackToAdmin}
          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          title="Return to Zetaven Admin"
        >
          <span>Admin System</span>
          <ArrowRight className="w-3 h-3 text-slate-400" />
        </button>
      </div>
    </div>
  );
};
