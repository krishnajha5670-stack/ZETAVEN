import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  ShieldCheck, 
  AlertCircle, 
  Store, 
  CheckCircle2, 
  Sparkles,
  Info
} from 'lucide-react';
import { ShopOwner } from '../../types';
import { ThemeConfig } from '../../utils/theme';
import { shopLogin } from '../../services/shopDataService';

interface ShopLoginPageProps {
  shop: ShopOwner;
  theme: ThemeConfig;
  onSuccessLogin?: () => void;
  onLoginSuccess?: () => void;
  onBackToLanding?: () => void;
  onBackToPublic?: () => void;
}

export const ShopLoginPage: React.FC<ShopLoginPageProps> = ({
  shop,
  theme,
  onSuccessLogin,
  onLoginSuccess,
  onBackToLanding,
  onBackToPublic
}) => {
  const handleSuccess = onLoginSuccess || onSuccessLogin || (() => {});
  const handleBack = onBackToPublic || onBackToLanding || (() => {});
  const [loginId, setLoginId] = useState(shop.loginId || shop.mobileNumber || '');
  const [password, setPassword] = useState(shop.password || 'Password@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const result = shopLogin(shop, loginId, password);
      setIsSubmitting(false);

      if (result.success) {
        handleSuccess();
      } else {
        setErrorMessage(result.error || 'Authentication failed. Please check credentials.');
      }
    }, 300);
  };

  const handleUseRegisteredCredentials = () => {
    setLoginId(shop.loginId || shop.mobileNumber);
    setPassword(shop.password || 'Password@123');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-slate-900 selection:text-white">
      
      {/* Top back bar */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-950 transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to {shop.shopName} Public Page</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>{shop.subdomain}.zetaven.com/login</span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
          
          {/* Shop Header & Logo */}
          <div className="text-center space-y-2">
            <div 
              className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center font-bold text-white shadow-md text-xl"
              style={{ backgroundColor: theme.hex }}
            >
              {shop.shopLogo ? (
                <img src={shop.shopLogo} alt={shop.shopName} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                shop.shopName.substring(0, 2).toUpperCase()
              )}
            </div>

            <div className="pt-2">
              <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight font-outfit">
                {shop.shopName}
              </h1>
              <div className="text-xs font-medium text-slate-500 mt-1 flex items-center justify-center gap-1.5">
                <span>Signing in to</span>
                <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                  {shop.subdomain}.zetaven.com
                </span>
              </div>
            </div>
          </div>

          {/* Quick Credential Hint Box (One-click fill for testing) */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-3.5 text-xs text-blue-900 space-y-1.5">
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Shop Owner Credentials</span>
              </span>
              <button
                type="button"
                onClick={handleUseRegisteredCredentials}
                className="text-[11px] font-bold text-blue-700 hover:text-blue-900 underline cursor-pointer"
              >
                Auto-Fill
              </button>
            </div>
            <div className="text-[11px] text-blue-700 space-y-0.5">
              <div>Login ID: <strong className="font-mono">{shop.loginId || shop.mobileNumber}</strong></div>
              <div>Default Password: <strong className="font-mono">{shop.password || 'Password@123'}</strong></div>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Login ID / Mobile */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Login ID, Mobile or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder="e.g. balaji_owner or 9876543210"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all font-mono"
                  style={{ '--tw-ring-color': theme.hex } as React.CSSProperties}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all"
                  style={{ '--tw-ring-color': theme.hex } as React.CSSProperties}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="remember" className="ml-2 text-xs text-slate-600 cursor-pointer select-none">
                Remember this device for 30 days
              </label>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl font-bold text-white text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              style={{ backgroundColor: theme.hex }}
            >
              {isSubmitting ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign In to {shop.shopName}</span>
                </>
              )}
            </button>
          </form>

          {/* Security & Multi-tenant boundary notice */}
          <div className="pt-4 border-t border-slate-100 text-center space-y-2">
            <p className="text-[11px] text-slate-500 leading-relaxed">
              This login is exclusively for <strong>{shop.shopName}</strong> owner and authorized store staff. Zetaven Admin login is located on zetaven.com.
            </p>
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-emerald-600 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>End-to-End Isolated Shop Database</span>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Password Recovery</h3>
                <p className="text-xs text-slate-500">Contact Shop Administrator</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              If you forgot your password for <strong>{shop.shopName}</strong>, contact Zetaven Super Admin or reset via your registered mobile number:
              <strong className="block font-mono text-slate-800 mt-1">+91 {shop.mobileNumber}</strong>
            </p>

            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Bottom Footer */}
      <div className="py-6 text-center text-xs text-slate-400">
        © Zetaven Subdomain Engine • {shop.shopName}
      </div>
    </div>
  );
};
