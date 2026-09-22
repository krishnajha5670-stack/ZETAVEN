import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Store, 
  Settings, 
  LogOut, 
  Search, 
  Plus, 
  Menu, 
  X, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Globe
} from 'lucide-react';
import { ShopOwner } from '../types';

export type AdminTab = 'dashboard' | 'shop-owners' | 'settings';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onLogout: () => void;
  onOpenAddModal: () => void;
  onViewPublicSite: () => void;
  shops: ShopOwner[];
  onSelectShopFromSearch: (shop: ShopOwner) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onTabChange,
  onLogout,
  onOpenAddModal,
  onViewPublicSite,
  shops,
  onSelectShopFromSearch,
  children
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const searchResults = globalSearch.trim()
    ? shops.filter(
        (s) =>
          s.shopName.toLowerCase().includes(globalSearch.toLowerCase()) ||
          s.ownerName.toLowerCase().includes(globalSearch.toLowerCase()) ||
          s.subdomain.toLowerCase().includes(globalSearch.toLowerCase())
      ).slice(0, 5)
    : [];

  const navItems: { id: AdminTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'shop-owners', label: 'Shop Owners', icon: Store },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900 selection:bg-blue-500 selection:text-white">
      
      {/* SIDEBAR (Desktop) */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-slate-200 sticky top-0 h-screen z-20">
        
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
              Z
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-950 font-outfit">
                ZETAVEN
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600 block -mt-1">
                Admin Console
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="p-4 flex-1 space-y-1.5">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Platform Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.id === 'shop-owners' && (
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                      isActive ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {shops.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer & User Profile */}
        <div className="p-4 border-t border-slate-100 space-y-3">
          
          {/* Quick link to public page */}
          <button
            type="button"
            onClick={onViewPublicSite}
            className="w-full px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>Public Landing</span>
            </div>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </button>

          {/* Admin Profile Area */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                ZA
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-slate-900 truncate">Zetaven Admin</div>
                <div className="text-[11px] text-slate-500 font-mono truncate">admin@zetaven.com</div>
              </div>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE HEADER & DRAWER */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-950 text-white flex items-center justify-center font-extrabold text-sm">
            Z
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-950 font-outfit">ZETAVEN</h1>
            <span className="text-[9px] uppercase tracking-wider text-blue-600 block -mt-1 font-bold">Admin</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenAddModal}
            className="p-2 bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs flex flex-col justify-end">
          <div className="bg-white rounded-t-3xl p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-sm font-bold text-slate-900">Navigation Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onTabChange(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold ${
                      isActive ? 'bg-blue-600 text-white' : 'text-slate-700 bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onViewPublicSite();
                }}
                className="text-xs font-semibold text-slate-600"
              >
                View zetaven.com
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="text-xs font-semibold text-red-600 flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10 hidden md:flex items-center justify-between gap-4">
          
          {/* Global Search Area */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search all shops, owners, subdomains..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-medium"
            />

            {/* Live Search dropdown */}
            {isSearchOpen && globalSearch.trim() && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsSearchOpen(false)} />
                <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-20 max-h-72 overflow-y-auto">
                  {searchResults.length === 0 ? (
                    <div className="px-4 py-3 text-xs text-slate-500 text-center">
                      No matching shops or subdomains found.
                    </div>
                  ) : (
                    searchResults.map((shop) => (
                      <button
                        key={shop.id}
                        type="button"
                        onClick={() => {
                          setIsSearchOpen(false);
                          setGlobalSearch('');
                          onSelectShopFromSearch(shop);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-900">{shop.shopName}</div>
                          <div className="font-mono text-blue-600 text-[11px]">{shop.fullUrl}</div>
                        </div>
                        <span className="text-slate-400 font-medium">{shop.ownerName}</span>
                      </button>
                    ))
                  )}
                </div>
              </>
            )}
          </div>

          {/* Right Header Badges & Actions */}
          <div className="flex items-center gap-3">
            
            {/* System Status */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>All Systems Operational</span>
            </div>

            {/* Quick Add Shop Owner */}
            <button
              type="button"
              onClick={onOpenAddModal}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Shop Owner</span>
            </button>
          </div>
        </header>

        {/* View Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};
