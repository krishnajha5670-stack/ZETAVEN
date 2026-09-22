import React, { useState } from 'react';
import { 
  FileText, 
  Users, 
  Package, 
  BarChart3, 
  Settings, 
  ArrowRight, 
  CheckCircle2, 
  Receipt, 
  Printer, 
  Share2, 
  Download, 
  AlertCircle, 
  Plus, 
  Minus, 
  Search, 
  ShieldCheck, 
  Smartphone, 
  Laptop, 
  Check, 
  Sparkles,
  ExternalLink,
  Lock,
  ChevronRight,
  TrendingUp,
  Clock,
  CircleDollarSign
} from 'lucide-react';
import { ShopOwner } from '../../types';
import { ThemeConfig } from '../../utils/theme';
import { ContinuousLineTrendChart, DonutBreakdownChart } from './ShopCharts';
import { computeReportData } from '../../services/shopDataService';

interface ShopPublicLandingProps {
  shop: ShopOwner;
  theme: ThemeConfig;
  onOpenLogin: () => void;
  onOpenDashboardDirect?: () => void;
}

export const ShopPublicLanding: React.FC<ShopPublicLandingProps> = ({
  shop,
  theme,
  onOpenLogin,
  onOpenDashboardDirect
}) => {
  const [selectedReportTime, setSelectedReportTime] = useState<'today' | 'week' | 'month' | 'year'>('week');
  const [activeStockTab, setActiveStockTab] = useState<'all' | 'low'>('all');
  const [interactiveStockQty, setInteractiveStockQty] = useState(24);

  // Compute live report data for the public showcase
  const sampleReportData = computeReportData(shop, 'sales', selectedReportTime);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      
      {/* 1. TOP HEADER (Horizontal Navigation across the top) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* LEFT: Shop Logo + Shop Name */}
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
              <div className="font-extrabold text-slate-900 tracking-tight text-lg sm:text-xl font-outfit leading-tight">
                {shop.shopName}
              </div>
              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                <span>{shop.subdomain}.zetaven.com</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              </div>
            </div>
          </div>

          {/* CENTER: The Five Main Modules in Horizontal Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-xs font-semibold text-slate-600">
            <button
              onClick={() => scrollToSection('section-billing')}
              className="px-3 py-2 rounded-xl hover:text-slate-950 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <Receipt className="w-3.5 h-3.5" style={{ color: theme.hex }} />
              <span>Billing</span>
            </button>

            <button
              onClick={() => scrollToSection('section-customers')}
              className="px-3 py-2 rounded-xl hover:text-slate-950 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" style={{ color: theme.hex }} />
              <span>Customers</span>
            </button>

            <button
              onClick={() => scrollToSection('section-products')}
              className="px-3 py-2 rounded-xl hover:text-slate-950 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <Package className="w-3.5 h-3.5" style={{ color: theme.hex }} />
              <span>Products</span>
            </button>

            <button
              onClick={() => scrollToSection('section-reports')}
              className="px-3 py-2 rounded-xl hover:text-slate-950 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <BarChart3 className="w-3.5 h-3.5" style={{ color: theme.hex }} />
              <span>Reports</span>
            </button>

            <button
              onClick={() => scrollToSection('section-settings')}
              className="px-3 py-2 rounded-xl hover:text-slate-950 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" style={{ color: theme.hex }} />
              <span>Settings</span>
            </button>
          </nav>

          {/* RIGHT: Clearly Highlighted Sign In Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenLogin}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-sm transition-all hover:opacity-95 flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
              style={{ backgroundColor: theme.hex }}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Top eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200/80 shadow-xs">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.hex }} />
              <span className="text-slate-700">Official Merchant Portal</span>
              <span className="text-slate-300">•</span>
              <span className="font-mono text-slate-500">{shop.subdomain}.zetaven.com</span>
            </div>

            {/* Shop greeting & Dynamic Name */}
            <div>
              <div className="text-sm sm:text-base font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Welcome to
              </div>
              <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-950 tracking-tight font-outfit uppercase">
                {shop.shopName}
              </h1>
            </div>

            {/* Strong Headline with Highlighted Accent Words */}
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-snug">
              Everything Your Shop Needs.{' '}
              <span 
                className="underline decoration-wavy decoration-2 underline-offset-4"
                style={{ color: theme.hex }}
              >
                Simple
              </span>
              .{' '}
              <span 
                className="underline decoration-wavy decoration-2 underline-offset-4"
                style={{ color: theme.hex }}
              >
                Smart
              </span>
              .{' '}
              <span>All in One Place.</span>
            </h2>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Manage your customers, products, billing, payments and business reports from one simple platform.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                type="button"
                onClick={onOpenLogin}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold text-white shadow-md transition-all hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
                style={{ backgroundColor: theme.hex }}
              >
                <span>Sign In to Your Shop</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('section-billing')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors shadow-xs"
              >
                Explore Shop Features
              </button>
            </div>
          </div>

          {/* Interactive Mockup Visual Preview in Hero */}
          <div className="mt-12 sm:mt-16 max-w-5xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-2xl p-4 sm:p-6 lg:p-8 space-y-6">
            
            {/* Mockup Topbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs font-mono text-slate-400 ml-2">
                  https://{shop.subdomain}.zetaven.com/dashboard
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Live Shop Workspace
                </span>
              </div>
            </div>

            {/* Mockup Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Card 1: Today's Billing */}
              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold">Today's Sales</span>
                  <Receipt className="w-4 h-4" style={{ color: theme.hex }} />
                </div>
                <div className="text-2xl font-extrabold text-slate-900 font-mono">₹18,450</div>
                <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +14.2% vs yesterday
                </div>
              </div>

              {/* Card 2: Udhar & Customer Balance */}
              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold">Udhar Customers</span>
                  <Users className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-extrabold text-amber-600 font-mono">3 Pending</div>
                <div className="text-[11px] text-slate-500 font-medium">
                  Auto-categorized on unpaid balance
                </div>
              </div>

              {/* Card 3: Stock Status */}
              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold">Stock Health</span>
                  <Package className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-extrabold text-slate-900 font-mono">98.4% Optimal</div>
                <div className="text-[11px] text-slate-500 font-medium">
                  Auto-updated on sales & purchases
                </div>
              </div>
            </div>

            {/* Quick Chart Strip in Mockup */}
            <div className="p-4 bg-slate-50/40 rounded-2xl border border-slate-100">
              <ContinuousLineTrendChart
                data={sampleReportData.timeSeries}
                theme={theme}
                height={160}
                title="Continuous Sales & Collections Real-Time Velocity"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. FIVE MAIN COMPONENTS SECTION (Horizontal Overview) */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Complete Shop Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-outfit">
              Five Core Capabilities. Zero Clutter.
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Everything structured cleanly across the top navigation for maximum operational speed.
            </p>
          </div>

          {/* Five Horizontal Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Module 1: Billing */}
            <div 
              onClick={() => scrollToSection('section-billing')}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 group"
            >
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                style={{ backgroundColor: theme.hex }}
              >
                <Receipt className="w-5 h-5" />
              </div>
              <div className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                ONE CLICK BILLING
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Create Bills in One Click
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Create professional invoices quickly with customer details, products, quantity, price, tax, discount, payment mode and paid/due status.
              </p>
            </div>

            {/* Module 2: Customers */}
            <div 
              onClick={() => scrollToSection('section-customers')}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 group"
            >
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                style={{ backgroundColor: theme.hex }}
              >
                <Users className="w-5 h-5" />
              </div>
              <div className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                CUSTOMERS + UDHAAR
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Keep Every Customer Organized
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Manage general customers and automatically track customers with outstanding dues without manual categorization.
              </p>
            </div>

            {/* Module 3: Products */}
            <div 
              onClick={() => scrollToSection('section-products')}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 group"
            >
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                style={{ backgroundColor: theme.hex }}
              >
                <Package className="w-5 h-5" />
              </div>
              <div className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                SMART STOCK
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Know Your Stock
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Add products, track quantities, update stock automatically through sales and purchases, and identify low-stock products.
              </p>
            </div>

            {/* Module 4: Reports */}
            <div 
              onClick={() => scrollToSection('section-reports')}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 group"
            >
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                style={{ backgroundColor: theme.hex }}
              >
                <BarChart3 className="w-5 h-5" />
              </div>
              <div className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                CLEAR REPORTS
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Understand Your Business
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                View Sales, Purchases, Profit, Customers, Stock and Payments with clear data and visual financial trend charts.
              </p>
            </div>

            {/* Module 5: Settings */}
            <div 
              onClick={() => scrollToSection('section-settings')}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 group"
            >
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                style={{ backgroundColor: theme.hex }}
              >
                <Settings className="w-5 h-5" />
              </div>
              <div className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                EASY SETTINGS
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Control Your Shop
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Manage your business profile, billing tax preferences, owner discounts, alerts and account security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BILLING FEATURE SECTION (Visual Invoice Showcase + Text) */}
      <section id="section-billing" className="py-20 sm:py-28 bg-slate-50/70 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* LEFT SIDE: Realistic Invoice Preview Card */}
            <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-5">
              
              {/* Invoice Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="text-xs font-bold tracking-wider uppercase text-slate-400">TAX INVOICE</div>
                  <div className="text-lg font-extrabold text-slate-950 font-outfit mt-0.5">{shop.shopName}</div>
                  <div className="text-[11px] text-slate-500 font-mono">GSTIN: {shop.gstNumber || '29ABCDE1234F1Z5'}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold font-mono text-slate-900">INV-2026-0891</div>
                  <div className="text-[11px] text-slate-500">Date: 22 Sep 2026</div>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    PAID • UPI
                  </span>
                </div>
              </div>

              {/* Customer Details */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 text-xs space-y-0.5">
                <div className="text-[10px] uppercase font-bold text-slate-400">Billed To</div>
                <div className="font-bold text-slate-900">Devraj Mendonca</div>
                <div className="text-slate-500 font-mono">+91 98801 92847 • Villa 14, Indiranagar</div>
              </div>

              {/* Items Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Product</th>
                      <th className="p-2.5 text-center">Qty</th>
                      <th className="p-2.5 text-right">Rate</th>
                      <th className="p-2.5 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="p-2.5 font-medium">Aashirvaad Sharbati Atta 10kg</td>
                      <td className="p-2.5 text-center font-mono">2</td>
                      <td className="p-2.5 text-right font-mono">₹495</td>
                      <td className="p-2.5 text-right font-mono font-semibold">₹990</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Fortune Sunflower Oil 5L</td>
                      <td className="p-2.5 text-center font-mono">1</td>
                      <td className="p-2.5 text-right font-mono">₹650</td>
                      <td className="p-2.5 text-right font-mono font-semibold">₹650</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Subtotal, Tax, Discount, Total */}
              <div className="space-y-1.5 text-xs border-t border-slate-100 pt-3">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-mono">₹1,640.00</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST (5%)</span>
                  <span className="font-mono">₹82.00</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Shop Owner Discount</span>
                  <span className="font-mono">- ₹50.00</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-950 border-t border-slate-200 pt-2">
                  <span>Grand Total</span>
                  <span className="font-mono">₹1,672.00</span>
                </div>
              </div>

              {/* Invoice Action Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="text-[11px] font-bold text-slate-500">
                  ONE CLICK → CREATE → PRINT / PDF / SHARE
                </div>
                <div className="flex items-center gap-1.5">
                  <button className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700" title="Print Invoice">
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700" title="Download PDF">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700" title="Share via WhatsApp">
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Text explanation */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-700">
                <Receipt className="w-3.5 h-3.5" style={{ color: theme.hex }} />
                <span>Next-Gen Point of Sale</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-950 font-outfit tracking-tight leading-tight">
                Professional Invoices.{' '}
                <span style={{ color: theme.hex }}>Made in One Click.</span>
              </h2>

              <p className="text-base text-slate-600 leading-relaxed">
                Create a complete invoice quickly, print it, share it or save it as PDF. Everything you need is laid out with precision so you can process customers in seconds.
              </p>

              {/* Mention checklist */}
              <div className="grid grid-cols-2 gap-3 text-xs font-medium text-slate-700 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Customer details lookup</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Real-time stock deduction</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Configurable GST Tax %</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Shop Owner custom discount</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Payment: Cash, UPI, Card, Udhar</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Instant Print, PDF & Share</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="px-6 py-3 rounded-xl text-xs font-bold text-white shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                  style={{ backgroundColor: theme.hex }}
                >
                  <span>Experience Billing Live</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CUSTOMER FEATURE SECTION (General vs Udhar Customers) */}
      <section id="section-customers" className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Text description */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                <Users className="w-3.5 h-3.5" style={{ color: theme.hex }} />
                <span>Zero Manual Categorization</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-950 font-outfit tracking-tight leading-tight">
                Your Customers.{' '}
                <span style={{ color: theme.hex }}>Always Organized.</span>
              </h2>

              <p className="text-base text-slate-600 leading-relaxed">
                Smart customer bookkeeping eliminates manual ledgers. Every customer is instantly grouped based on outstanding balances.
              </p>

              {/* Automatic Behavior explanation box */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/90 space-y-3 text-xs text-slate-700">
                <div className="font-bold text-slate-900 text-sm">
                  ⚡ Smart Auto-Classification Logic:
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>
                      <strong>Udhar Customers:</strong> When a customer's bill has a due amount, the customer automatically moves into Udhar Customers.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>
                      <strong>General Customers:</strong> When the due is settled and becomes zero, the customer automatically returns to General Customers.
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-medium text-slate-700 pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                  <div className="font-bold text-slate-900">Transaction History</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">Every invoice & payment recorded</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                  <div className="font-bold text-slate-900">Receive Payment</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">Settle balance in one click</div>
                </div>
              </div>
            </div>

            {/* Interactive Visual Customer Ledger Cards */}
            <div className="lg:col-span-6 space-y-4">
              
              {/* Udhar Customer Example Card */}
              <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                      Udhar Customers (Due &gt; 0)
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    Outstanding Due: ₹2,450
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-amber-200/80 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Suresh Narayana Rao</div>
                    <div className="text-xs text-slate-500 font-mono">+91 98440 19283</div>
                    <div className="text-[11px] text-slate-400 mt-1">Total Spent: ₹14,250 • Last: 21 Sep</div>
                  </div>
                  <button 
                    onClick={onOpenLogin}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Receive Payment
                  </button>
                </div>
              </div>

              {/* General Customer Example Card */}
              <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                      General Customers (Due = 0)
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    All Dues Clear
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-emerald-200/80 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Ananya Deshmukh</div>
                    <div className="text-xs text-slate-500 font-mono">+91 98203 94851</div>
                    <div className="text-[11px] text-slate-400 mt-1">Total Spent: ₹28,400 • Last: Today</div>
                  </div>
                  <button 
                    onClick={onOpenLogin}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                  >
                    + New Bill
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PRODUCTS & INVENTORY SECTION */}
      <section id="section-products" className="py-20 sm:py-28 bg-slate-50/70 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              SMART STOCK MANAGEMENT
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-outfit">
              Simple Stock Management
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Add products with free-text descriptions, track profit margins, and adjust quantities instantly.
            </p>
          </div>

          {/* Interactive Stock Preview Box */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
            
            {/* Header Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveStockTab('all')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    activeStockTab === 'all' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  All Products (12)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStockTab('low')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    activeStockTab === 'low' ? 'bg-white text-red-600 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Low Stock Warning (2)
                </button>
              </div>

              <div className="text-xs text-slate-500 font-medium">
                Sales automatically reduce stock • Purchases automatically increase stock
              </div>
            </div>

            {/* Interactive Product Item */}
            <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">Fortune Sunlite Refined Sunflower Oil</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200 text-slate-700">Edible Oils</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Purchase Price: <span className="font-mono font-semibold">₹560</span> • Selling Price: <span className="font-mono font-semibold text-slate-900">₹650</span>
                  <span className="text-emerald-600 ml-2 font-bold">(+16.1% Margin)</span>
                </div>
              </div>

              {/* Interactive Quantity Stepper */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-500">Live Quantity:</span>
                <div className="flex items-center bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setInteractiveStockQty(q => Math.max(0, q - 1))}
                    className="p-2 hover:bg-slate-100 text-slate-600 transition-colors"
                    title="Stock Out / Decrease"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 py-1.5 font-mono font-bold text-slate-900 text-sm">
                    {interactiveStockQty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setInteractiveStockQty(q => q + 1)}
                    className="p-2 hover:bg-slate-100 text-slate-600 transition-colors"
                    title="Stock Add / Increase"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                {interactiveStockQty <= 8 && (
                  <span className="px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-bold">
                    Low Stock!
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. REPORTS SECTION (Dual Charts: Donut + Continuous Line Trend) */}
      <section id="section-reports" className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              BUSINESS INTELLIGENCE
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-950 font-outfit">
              See Your Business Clearly.
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Live continuous financial trendlines and donut breakdowns calculated directly from your real bills and collections.
            </p>
          </div>

          {/* Time Filter Tabs */}
          <div className="flex justify-center">
            <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-bold">
              {(['today', 'week', 'month', 'year'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setSelectedReportTime(filter)}
                  className={`px-4 py-2 rounded-lg capitalize transition-all ${
                    selectedReportTime === filter
                      ? 'bg-white text-slate-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Dual Charts Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Chart 1: Continuous Financial Line Chart */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Continuous Revenue Curve</h3>
                    <p className="text-xs text-slate-500">Real-time daily transaction velocity</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-extrabold text-slate-900 font-mono">
                      ₹{sampleReportData.totalVolume.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-emerald-600 font-medium">Realized Volume</div>
                  </div>
                </div>

                <ContinuousLineTrendChart
                  data={sampleReportData.timeSeries}
                  theme={theme}
                  height={220}
                  valuePrefix="₹"
                />
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                {sampleReportData.summaryItems.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="p-2 bg-slate-50 rounded-xl">
                    <div className="text-[10px] text-slate-400 font-semibold">{item.label}</div>
                    <div className="font-bold text-slate-900 font-mono mt-0.5">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 2: Donut Breakdown Chart */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl flex flex-col justify-between">
              <div>
                <div className="pb-4 border-b border-slate-100 mb-6">
                  <h3 className="text-base font-bold text-slate-900">Payment Modes & Channel Mix</h3>
                  <p className="text-xs text-slate-500">Distribution of revenue receipts</p>
                </div>

                <DonutBreakdownChart
                  data={sampleReportData.breakdown}
                  theme={theme}
                  size={190}
                  totalLabel="Gross Sales"
                />
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 text-center">
                Visual reports dynamically generated from live database tables.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. SETTINGS & DATA ISOLATION SECTION */}
      <section id="section-settings" className="py-20 sm:py-24 bg-slate-50/70 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Settings Features */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                style={{ backgroundColor: theme.hex }}
              >
                <Settings className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 font-outfit">Control Your Shop</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Configure your business profile, default tax rates, custom owner discount thresholds, and SMS/WhatsApp alert channels in one uncluttered settings panel.
              </p>
              <div className="pt-2 space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Business Profile & GSTIN Settings</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Configurable Tax & Post-Tax Owner Discount</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Account Password Recovery System</span>
                </div>
              </div>
            </div>

            {/* Tenant Data Separation */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                style={{ backgroundColor: theme.hex }}
              >
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 font-outfit">100% Isolated Shop Data</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Operating on <strong>{shop.fullUrl}</strong> guarantees zero data crossover. Your customers, products, margins and invoices remain strictly private to your shop workspace.
              </p>
              <div className="pt-2 space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Dedicated tenant workspace: <strong className="font-mono">{shop.workspaceId}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Responsive on Desktop, Laptop, Tablet & Mobile</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Subdomain authentication isolation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FINAL CALL TO ACTION */}
      <section className="py-20 sm:py-28 bg-slate-950 text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
          <span 
            className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full inline-block"
            style={{ backgroundColor: `${theme.hex}30`, color: theme.hexLight }}
          >
            {shop.shopName} Online Portal
          </span>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-outfit">
            Ready to manage your shop smarter?
          </h2>

          <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto">
            Sign in to access your complete shop management system.
          </p>

          <div className="pt-4 flex justify-center">
            <button
              type="button"
              onClick={onOpenLogin}
              className="px-10 py-4 rounded-2xl text-base font-bold text-white shadow-xl hover:opacity-95 transition-all transform hover:-translate-y-1 flex items-center gap-2 cursor-pointer"
              style={{ backgroundColor: theme.hex }}
            >
              <Lock className="w-4 h-4" />
              <span>SIGN IN</span>
            </button>
          </div>
        </div>
      </section>

      {/* 10. PROFESSIONAL FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Shop Logo & Name */}
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white text-xs"
              style={{ backgroundColor: theme.hex }}
            >
              {shop.shopName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="font-bold text-white text-sm">{shop.shopName}</div>
              <div className="text-[11px] text-slate-500 font-mono">https://{shop.fullUrl}</div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 font-medium text-slate-300">
            <button onClick={() => scrollToSection('section-billing')} className="hover:text-white transition-colors">Billing</button>
            <button onClick={() => scrollToSection('section-customers')} className="hover:text-white transition-colors">Customers</button>
            <button onClick={() => scrollToSection('section-products')} className="hover:text-white transition-colors">Products</button>
            <button onClick={() => scrollToSection('section-reports')} className="hover:text-white transition-colors">Reports</button>
            <button onClick={() => scrollToSection('section-settings')} className="hover:text-white transition-colors">Settings</button>
          </div>

          {/* Support & Copyright */}
          <div className="text-center md:text-right space-y-1">
            <div className="text-slate-300">Support: {shop.email} • +91 {shop.mobileNumber}</div>
            <div className="text-slate-500 text-[11px]">
              Powered by <strong className="text-slate-400">Zetaven Subdomain Cloud</strong> • © Zetaven
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
