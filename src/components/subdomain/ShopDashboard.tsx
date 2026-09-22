import React, { useState } from 'react';
import { 
  Receipt, 
  Users, 
  Package, 
  BarChart3, 
  Settings, 
  LogOut, 
  Plus, 
  Store, 
  Globe, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  Clock, 
  Printer, 
  ExternalLink,
  ChevronDown,
  ShieldCheck,
  LayoutDashboard
} from 'lucide-react';
import { ShopOwner } from '../../types';
import { ThemeConfig } from '../../utils/theme';
import { ShopNavigationTab } from '../../types/shop';
import { getShopDataStore, computeReportData, shopLogout } from '../../services/shopDataService';
import { ContinuousLineTrendChart, DonutBreakdownChart } from './ShopCharts';

import { BillingModule } from './modules/BillingModule';
import { CustomersModule } from './modules/CustomersModule';
import { ProductsModule } from './modules/ProductsModule';
import { ReportsModule } from './modules/ReportsModule';
import { SettingsModule } from './modules/SettingsModule';

interface ShopDashboardProps {
  shop: ShopOwner;
  theme: ThemeConfig;
  onLogout: () => void;
  onViewPublicSite: () => void;
  onThemeColorChange?: (colorKey: string) => void;
}

export const ShopDashboard: React.FC<ShopDashboardProps> = ({
  shop,
  theme,
  onLogout,
  onViewPublicSite,
  onThemeColorChange
}) => {
  const [activeNavTab, setActiveNavTab] = useState<ShopNavigationTab | 'overview'>('overview');
  const [preselectedCustomerId, setPreselectedCustomerId] = useState<string | null>(null);

  const store = getShopDataStore(shop);
  const salesBills = store.bills.filter(b => b.type === 'sale');
  const totalSales = salesBills.reduce((acc, b) => acc + b.grandTotal, 0);
  const totalUdhar = store.customers.reduce((acc, c) => acc + c.totalDue, 0);
  const udharCount = store.customers.filter(c => c.totalDue > 0).length;
  const lowStockCount = store.products.filter(p => p.stock <= p.minStockLevel).length;

  const sampleReport = computeReportData(shop, 'sales', 'week');

  const navItems: { id: ShopNavigationTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'billing', label: 'Billing', icon: <Receipt className="w-4 h-4" /> },
    { id: 'customers', label: 'Customers', icon: <Users className="w-4 h-4" />, badge: udharCount > 0 ? `${udharCount} Udhar` : undefined },
    { id: 'products', label: 'Products', icon: <Package className="w-4 h-4" />, badge: lowStockCount > 0 ? `${lowStockCount} Low` : undefined },
    { id: 'reports', label: 'Reports', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleCreateBillForCustomer = (customerId: string) => {
    setPreselectedCustomerId(customerId);
    setActiveNavTab('billing');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-900 selection:text-white flex flex-col justify-between">
      
      {/* 1. TOP HEADER WITH HORIZONTAL NAVIGATION */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        
        {/* Top Row: Shop Brand + Horizontal Nav + Actions */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* LEFT: Shop Logo + Name + Subdomain badge */}
          <div className="flex items-center gap-3 shrink-0">
            <div 
              className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-white shadow-sm overflow-hidden"
              style={{ backgroundColor: theme.hex }}
            >
              {shop.shopLogo ? (
                <img src={shop.shopLogo} alt={shop.shopName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-base tracking-wider">{shop.shopName.substring(0, 2).toUpperCase()}</span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg font-outfit">
                  {shop.shopName}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>ONLINE</span>
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                <span>{shop.subdomain}.zetaven.com</span>
              </div>
            </div>
          </div>

          {/* CENTER: THE 5 MAIN COMPONENTS IN HORIZONTAL NAVIGATION ACROSS THE TOP */}
          <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
            
            {/* Overview / Home Tab */}
            <button
              type="button"
              onClick={() => setActiveNavTab('overview')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeNavTab === 'overview'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" style={{ color: activeNavTab === 'overview' ? theme.hex : undefined }} />
              <span>Overview</span>
            </button>

            {/* The 5 Modules */}
            {navItems.map((item) => {
              const isActive = activeNavTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveNavTab(item.id);
                    if (item.id !== 'billing') setPreselectedCustomerId(null);
                  }}
                  className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-white text-slate-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  <span style={{ color: isActive ? theme.hex : undefined }}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* RIGHT: Quick + New Bill Action & User / Sign Out */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            <button
              type="button"
              onClick={() => {
                setActiveNavTab('billing');
                setPreselectedCustomerId(null);
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-xs hover:opacity-95 transition-all flex items-center gap-1.5 cursor-pointer"
              style={{ backgroundColor: theme.hex }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">+ New Bill</span>
              <span className="sm:hidden">Bill</span>
            </button>

            <button
              type="button"
              onClick={onViewPublicSite}
              className="p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
              title="View Public Storefront"
            >
              <Globe className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                shopLogout(shop.id);
                onLogout();
              }}
              className="p-2 text-slate-500 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Sub-Header: Scrollable Horizontal Navigation for smaller screens */}
        <div className="lg:hidden px-4 py-2 border-t border-slate-100 overflow-x-auto flex items-center gap-1.5 scrollbar-none bg-slate-50/70 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveNavTab('overview')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap ${
              activeNavTab === 'overview' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600'
            }`}
          >
            Overview
          </button>
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveNavTab(item.id);
                if (item.id !== 'billing') setPreselectedCustomerId(null);
              }}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap flex items-center gap-1 ${
                activeNavTab === item.id ? 'bg-white text-slate-950 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              <span>{item.label}</span>
              {item.badge && (
                <span className="px-1 py-0.2 rounded-full text-[9px] bg-amber-500 text-white">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* 2. MAIN CONTENT AREA */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        
        {/* CASE 1: OVERVIEW DASHBOARD */}
        {activeNavTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Greeting Banner */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {shop.subdomain}.zetaven.com • Merchant Console
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-outfit">
                  Hello, {shop.ownerName}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600">
                  Here is the real-time business health for <strong className="text-slate-900">{shop.shopName}</strong> today.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveNavTab('billing')}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
                  style={{ backgroundColor: theme.hex }}
                >
                  <Receipt className="w-4 h-4" />
                  <span>Open Billing Terminal</span>
                </button>
              </div>
            </div>

            {/* 4 Summary KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Metric 1: Total Sales */}
              <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>Gross Sales</span>
                  <Receipt className="w-4 h-4" style={{ color: theme.hex }} />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                  ₹{totalSales.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{salesBills.length} recorded invoices</span>
                </div>
              </div>

              {/* Metric 2: Udhar Dues Pending */}
              <div 
                onClick={() => setActiveNavTab('customers')}
                className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-2 cursor-pointer hover:border-amber-300 transition-colors"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>Outstanding Udhar</span>
                  <Users className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-mono">
                  ₹{totalUdhar.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-amber-600 font-medium">
                  {udharCount} customer balances pending
                </div>
              </div>

              {/* Metric 3: Active Stock */}
              <div 
                onClick={() => setActiveNavTab('products')}
                className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-2 cursor-pointer hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>Inventory Catalog</span>
                  <Package className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                  {store.products.length} SKUs
                </div>
                <div className="text-[11px] text-slate-500">
                  {store.products.reduce((acc, p) => acc + p.stock, 0)} units in physical stock
                </div>
              </div>

              {/* Metric 4: Low Stock Alert */}
              <div 
                onClick={() => setActiveNavTab('products')}
                className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-2 cursor-pointer hover:border-red-300 transition-colors"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>Stock Warnings</span>
                  <AlertCircle className="w-4 h-4 text-red-500" />
                </div>
                <div className={`text-2xl sm:text-3xl font-extrabold font-mono ${lowStockCount > 0 ? 'text-red-600' : 'text-slate-900'}`}>
                  {lowStockCount} Items
                </div>
                <div className="text-[11px] text-red-500 font-medium">
                  {lowStockCount > 0 ? 'Action required to reorder' : 'All stocks optimal'}
                </div>
              </div>
            </div>

            {/* Visual Charts Overview (Continuous Line + Donut) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Financial Continuous Revenue Trend</h3>
                      <p className="text-[11px] text-slate-500">Weekly sales trajectory</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveNavTab('reports')}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800"
                    >
                      View All Reports →
                    </button>
                  </div>

                  <ContinuousLineTrendChart
                    data={sampleReport.timeSeries}
                    theme={theme}
                    height={210}
                    valuePrefix="₹"
                  />
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Real-time continuous line without bar substitutes</span>
                  <span className="font-mono font-bold text-slate-800">Dynamic Live Data</span>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="pb-3 border-b border-slate-100 mb-4">
                    <h3 className="text-sm font-bold text-slate-900">Revenue Collection Mix</h3>
                    <p className="text-[11px] text-slate-500">Payment modes breakdown</p>
                  </div>

                  <DonutBreakdownChart
                    data={sampleReport.breakdown}
                    theme={theme}
                    size={175}
                    totalLabel="Gross Sales"
                  />
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-center text-[11px] text-slate-400">
                  Calculated from live settled and udhar transactions
                </div>
              </div>
            </div>

            {/* Recent Invoices Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-outfit">Recent Invoices</h3>
                  <p className="text-xs text-slate-500">Processed bills across counter</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveNavTab('billing')}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                >
                  Create Bill
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-200">
                    <tr>
                      <th className="p-3">Invoice No</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3 text-right">Grand Total</th>
                      <th className="p-3 text-center">Payment Mode</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {store.bills.slice(0, 6).map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-mono font-bold text-slate-900">{b.invoiceNumber}</td>
                        <td className="p-3 text-slate-500 font-mono text-[11px]">
                          {new Date(b.date).toLocaleDateString()}
                        </td>
                        <td className="p-3 font-medium text-slate-900">{b.customerName}</td>
                        <td className="p-3 text-right font-mono font-bold text-slate-900">
                          ₹{b.grandTotal.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3 text-center font-medium">{b.paymentMode}</td>
                        <td className="p-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            b.status === 'paid'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {b.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* CASE 2: BILLING MODULE */}
        {activeNavTab === 'billing' && (
          <BillingModule
            shop={shop}
            theme={theme}
            preselectedCustomerId={preselectedCustomerId}
            onNavigateToCustomers={() => setActiveNavTab('customers')}
          />
        )}

        {/* CASE 3: CUSTOMERS MODULE */}
        {activeNavTab === 'customers' && (
          <CustomersModule
            shop={shop}
            theme={theme}
            onSelectCustomerForBill={handleCreateBillForCustomer}
          />
        )}

        {/* CASE 4: PRODUCTS MODULE */}
        {activeNavTab === 'products' && (
          <ProductsModule
            shop={shop}
            theme={theme}
          />
        )}

        {/* CASE 5: REPORTS MODULE */}
        {activeNavTab === 'reports' && (
          <ReportsModule
            shop={shop}
            theme={theme}
          />
        )}

        {/* CASE 6: SETTINGS MODULE */}
        {activeNavTab === 'settings' && (
          <SettingsModule
            shop={shop}
            theme={theme}
            onThemeColorChange={onThemeColorChange}
          />
        )}
      </main>

      {/* 3. FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.hex }} />
            <span className="font-bold text-slate-800">{shop.shopName}</span>
            <span className="text-slate-400">•</span>
            <span className="font-mono text-slate-500">{shop.subdomain}.zetaven.com</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Workspace: <strong className="font-mono text-slate-600">{shop.workspaceId}</strong></span>
            <span>•</span>
            <span>Powered by Zetaven Subdomain Cloud</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
