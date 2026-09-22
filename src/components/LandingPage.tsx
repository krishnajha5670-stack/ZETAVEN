import React, { useState } from 'react';
import { 
  Building2, 
  Store, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  KeyRound,
  TrendingUp,
  BarChart3,
  Globe,
  Users
} from 'lucide-react';
import { ShopOwner } from '../types';

interface LandingPageProps {
  onLoginSuccess: () => void;
  shops: ShopOwner[];
  onLaunchShopSubdomain?: (shop: ShopOwner) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onLoginSuccess, 
  shops,
  onLaunchShopSubdomain 
}) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginIdentifier, setLoginIdentifier] = useState('admin@zetaven.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const activeCount = shops.filter(s => s.status === 'active').length;
  const totalCount = shops.length;

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginIdentifier.trim() || !password.trim()) {
      setLoginError('Please enter both Email/Mobile and Password.');
      return;
    }

    setIsAuthenticating(true);

    // Simulate verification
    setTimeout(() => {
      setIsAuthenticating(false);
      // Valid credentials
      const validIdent = loginIdentifier.toLowerCase().trim();
      if (
        (validIdent === 'admin@zetaven.com' || validIdent === '9876543210' || validIdent === 'admin') &&
        (password === 'admin123' || password === 'admin' || password === 'zetaven2026')
      ) {
        setIsLoginModalOpen(false);
        onLoginSuccess();
      } else {
        setLoginError('Invalid admin credentials. Use demo: admin@zetaven.com / admin123');
      }
    }, 600);
  };

  const fillDemoCredentials = () => {
    setLoginIdentifier('admin@zetaven.com');
    setPassword('admin123');
    setLoginError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-500 selection:text-white relative overflow-hidden">
      
      {/* Subtle background glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-100/50 via-slate-50/20 to-transparent pointer-events-none -z-10" />

      {/* Domain Bar indicator */}
      <div className="w-full bg-slate-900 text-slate-300 py-1.5 px-4 text-xs flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-mono text-slate-200 font-medium">https://zetaven.com</span>
          <span className="text-slate-500 hidden sm:inline">• Central Admin Platform Gateway</span>
          <div className="ml-auto text-slate-400 text-[11px] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Enterprise Multi-Tenant Node</span>
          </div>
        </div>
      </div>

      {/* 1. HEADER */}
      <header className="w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Left side: ZETAVEN */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-950 text-white flex items-center justify-center font-extrabold text-xl shadow-md shadow-slate-900/10 tracking-tight">
              Z
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 font-outfit">
                ZETAVEN
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600 block -mt-1">
                Admin Platform
              </span>
            </div>
          </div>

          {/* Right side: Login / Sign In */}
          <div className="flex items-center gap-3">
            <button
              id="admin-login-button"
              type="button"
              onClick={() => setIsLoginModalOpen(true)}
              className="px-6 py-2.5 rounded-xl font-bold text-sm bg-slate-950 hover:bg-blue-600 text-white transition-all shadow-md shadow-slate-950/20 hover:shadow-blue-600/25 flex items-center gap-2 group cursor-pointer"
            >
              <span>Login / Sign In</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO / MAIN CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
          
          {/* Left side: Headline, description, CTA */}
          <div className="lg:col-span-6 space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Zetaven Enterprise Administration</span>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.1] font-outfit">
                <span className="text-blue-600 underline decoration-blue-200 decoration-wavy underline-offset-8">Manage</span> Every{' '}
                <span className="text-slate-900">Shop</span>.
                <br />
                All in <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">One Place</span>.
              </h2>

              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal pt-2 max-w-xl">
                <strong className="text-slate-900 font-semibold">Zetaven</strong> helps you create and manage shop accounts, provide dedicated shop websites, and manage your business platform from one powerful admin system.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => setIsLoginModalOpen(true)}
                className="px-8 py-4 rounded-xl font-bold text-base bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2.5 cursor-pointer"
              >
                <span>Access Admin Portal</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  fillDemoCredentials();
                  setIsLoginModalOpen(true);
                }}
                className="px-5 py-4 rounded-xl font-semibold text-sm bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition-colors shadow-xs"
              >
                Quick Demo Sign-In
              </button>
            </div>

            {/* Feature points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Dedicated Subdomains</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Data Separation</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>One-Click Setup</span>
              </div>
            </div>
          </div>

          {/* Right side: Beautiful visual preview/mockup of the Zetaven Admin Dashboard */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              {/* Outer decorative card frame */}
              <div className="bg-white rounded-3xl p-5 shadow-2xl border border-slate-200/90 relative z-10 transition-transform duration-300 hover:scale-[1.01]">
                
                {/* Mockup Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-xs font-mono text-slate-400 ml-2">zetaven.com/admin/dashboard</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-semibold rounded-full border border-emerald-200">
                    Live System
                  </span>
                </div>

                {/* Mockup Content */}
                <div className="py-4 space-y-4">
                  
                  {/* Top metric row */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                      <div className="text-[11px] font-semibold text-slate-500">Total Shop Owners</div>
                      <div className="text-xl font-bold text-slate-900 mt-1">{totalCount} Shops</div>
                      <div className="text-[10px] text-emerald-600 flex items-center gap-0.5 mt-0.5 font-medium">
                        <TrendingUp className="w-3 h-3" /> +100% active
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                      <div className="text-[11px] font-semibold text-slate-500">Active Shops</div>
                      <div className="text-xl font-bold text-emerald-600 mt-1">{activeCount} Online</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Subdomains live</div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 col-span-2 sm:col-span-1">
                      <div className="text-[11px] font-semibold text-slate-500">Infrastructure</div>
                      <div className="text-xl font-bold text-blue-600 mt-1">99.98%</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Separate DBs</div>
                    </div>
                  </div>

                  {/* Active Subdomains spotlight */}
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-4 shadow-md">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-blue-400" />
                        Dedicated Shop Routing
                      </span>
                      <span className="text-[10px] bg-slate-700/80 text-blue-300 px-2 py-0.5 rounded-full font-mono">
                        *.zetaven.com
                      </span>
                    </div>

                    <div className="space-y-2">
                      {shops.slice(0, 3).map((s) => (
                        <div 
                          key={s.id}
                          onClick={() => onLaunchShopSubdomain && onLaunchShopSubdomain(s)}
                          className="bg-slate-800/80 hover:bg-slate-700/90 cursor-pointer p-2.5 rounded-xl border border-slate-700 flex items-center justify-between transition-colors group"
                        >
                          <div>
                            <div className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                              {s.shopName}
                            </div>
                            <div className="text-[11px] font-mono text-blue-400">
                              {s.subdomain}.zetaven.com
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold rounded-md border border-emerald-500/30">
                              Active
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interactive preview prompt */}
                  <div 
                    onClick={() => setIsLoginModalOpen(true)}
                    className="p-3.5 rounded-xl border border-dashed border-blue-300 bg-blue-50/50 hover:bg-blue-50 transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Admin Control Center</div>
                        <div className="text-[11px] text-slate-500">Click to enter Zetaven Admin Console</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                      Sign In <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating aesthetic badge */}
              <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl p-4 shadow-xl border border-slate-200 hidden sm:flex items-center gap-3 z-20">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Multi-Tenant Isolation</div>
                  <div className="text-[11px] text-slate-500">Zero data leaks between shops</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 3. ZETAVEN ADMIN LOGIN MODAL */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden relative">
            
            {/* Top Close */}
            <button
              type="button"
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute right-4 top-4 w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="p-6 pb-2 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-950 text-white flex items-center justify-center font-extrabold text-2xl mx-auto shadow-md mb-3">
                Z
              </div>
              <h3 className="text-2xl font-extrabold text-slate-950 tracking-tight font-outfit">
                ZETAVEN
              </h3>
              <p className="text-lg font-bold text-slate-900 mt-1">Welcome Back</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Central Admin Access Only • Central Platform
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleAdminLogin} className="p-6 pt-2 space-y-4">
              
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                  {loginError}
                </div>
              )}

              {/* Email / Mobile */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email / Mobile Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="admin@zetaven.com or mobile"
                    className="w-full px-3.5 py-2.5 pl-10 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-medium"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(true)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full px-3.5 py-2.5 pl-10 pr-10 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-medium"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Sign In CTA */}
              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-slate-950 hover:bg-blue-600 text-white transition-all shadow-md shadow-slate-950/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isAuthenticating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Admin...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Sign In</span>
                  </>
                )}
              </button>

              {/* Quick autofill helper for easy review */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="text-xs font-semibold text-slate-500 hover:text-blue-600 underline underline-offset-2"
                >
                  Quick Demo: Fill admin@zetaven.com / admin123
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 text-center">
                <strong>Admin Security Notice:</strong> This login is strictly for Zetaven central platform administrators. Shop owners sign in via their dedicated store websites.
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm p-6 relative">
            <button
              onClick={() => {
                setIsForgotPasswordOpen(false);
                setForgotSent(false);
              }}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>

            <h4 className="text-lg font-bold text-slate-900">Reset Admin Password</h4>
            <p className="text-xs text-slate-500 mt-1">
              Enter your registered administrator email to receive authorization instructions.
            </p>

            {forgotSent ? (
              <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs space-y-2">
                <div className="font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Recovery link sent!
                </div>
                <p>A secure reset token has been dispatched to <strong>{forgotEmail || 'admin@zetaven.com'}</strong>.</p>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPasswordOpen(false);
                    setForgotSent(false);
                  }}
                  className="w-full mt-2 py-2 bg-emerald-600 text-white rounded-lg font-semibold"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <input
                  type="email"
                  placeholder="admin@zetaven.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
                <button
                  type="button"
                  onClick={() => setForgotSent(true)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
                >
                  Send Recovery Link
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Zetaven Platform. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Enterprise Multi-Tenant SaaS</span>
            <span>•</span>
            <span>Central Management Node</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
