import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Copy, Check, Eye, EyeOff, RefreshCw, Globe, ShieldCheck, User, Store, KeyRound, Building2 } from 'lucide-react';
import { ShopOwner } from '../types';
import { formatSubdomain, checkSubdomainAvailability, createShopOwner } from '../services/storage';

interface AddShopOwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newShop: ShopOwner) => void;
}

export const AddShopOwnerModal: React.FC<AddShopOwnerModalProps> = ({ isOpen, onClose, onSuccess }) => {
  // Form fields
  // 1. Owner Details
  const [ownerName, setOwnerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');

  // 2. Shop Details
  const [shopName, setShopName] = useState('');
  const [shopLogo, setShopLogo] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [businessMobileNumber, setBusinessMobileNumber] = useState('');

  // 3. Login Details
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // 4. Subdomain
  const [subdomain, setSubdomain] = useState('');
  const [isSubdomainManual, setIsSubdomainManual] = useState(false);
  const [subdomainStatus, setSubdomainStatus] = useState<{ available: boolean; reason?: string }>({ available: false });

  // Creation State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [createdShop, setCreatedShop] = useState<ShopOwner | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Auto-generate subdomain from shop name if not manually modified
  useEffect(() => {
    if (!isSubdomainManual && shopName) {
      const generated = formatSubdomain(shopName);
      setSubdomain(generated);
    }
  }, [shopName, isSubdomainManual]);

  // Auto-generate suggested loginId from email or shop name
  useEffect(() => {
    if (!loginId && shopName) {
      const clean = formatSubdomain(shopName).replace(/-/g, '_');
      setLoginId(`${clean}_admin`);
    }
  }, [shopName, loginId]);

  // Check subdomain availability whenever subdomain changes
  useEffect(() => {
    if (!subdomain) {
      setSubdomainStatus({ available: false, reason: 'Enter a subdomain' });
      return;
    }
    const check = checkSubdomainAvailability(subdomain);
    setSubdomainStatus(check);
  }, [subdomain]);

  // Default suggested password on open
  useEffect(() => {
    if (isOpen && !password) {
      generateSecurePassword();
    }
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const generateSecurePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789@#$';
    let res = 'Zt@';
    for (let i = 0; i < 7; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(res);
    setConfirmPassword(res);
  };

  const resetForm = () => {
    setOwnerName('');
    setMobileNumber('');
    setEmail('');
    setAadhaarNumber('');
    setPanNumber('');
    setShopName('');
    setShopLogo('');
    setShopAddress('');
    setGstNumber('');
    setBusinessMobileNumber('');
    setLoginId('');
    setPassword('');
    setConfirmPassword('');
    setSubdomain('');
    setIsSubdomainManual(false);
    setErrorMessage('');
    setCreatedShop(null);
    setCopiedField(null);
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validations
    if (!ownerName.trim()) {
      setErrorMessage('Owner Name is required.');
      return;
    }
    if (!mobileNumber.trim() || mobileNumber.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit Mobile Number.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid Email Address.');
      return;
    }
    if (!shopName.trim()) {
      setErrorMessage('Shop Name is required.');
      return;
    }
    if (!shopAddress.trim()) {
      setErrorMessage('Shop Address is required.');
      return;
    }
    if (!loginId.trim()) {
      setErrorMessage('Login ID is required.');
      return;
    }
    if (!password.trim() || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Password and Confirm Password do not match.');
      return;
    }
    if (!subdomainStatus.available) {
      setErrorMessage(subdomainStatus.reason || 'The specified subdomain is not available.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = createShopOwner({
        ownerName: ownerName.trim(),
        mobileNumber: mobileNumber.trim(),
        email: email.trim(),
        aadhaarNumber: aadhaarNumber.trim() || undefined,
        panNumber: panNumber.trim().toUpperCase() || undefined,
        shopName: shopName.trim(),
        shopLogo: shopLogo.trim() || undefined,
        shopAddress: shopAddress.trim(),
        gstNumber: gstNumber.trim().toUpperCase() || undefined,
        businessMobileNumber: businessMobileNumber.trim() || undefined,
        loginId: loginId.trim(),
        password: password.trim(),
        subdomain: subdomain.trim(),
        status: 'active'
      });

      if (result.success && result.shop) {
        setCreatedShop(result.shop);
        onSuccess(result.shop);
      } else {
        setErrorMessage(result.error || 'Failed to create shop.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Add New Shop Owner</h2>
              <p className="text-xs text-slate-500">Create shop account, provision subdomain, and generate credentials</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {createdShop ? (
            /* Success View */
            <div className="space-y-6 py-2">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-emerald-900">Shop Created Successfully!</h3>
                <p className="text-emerald-700 text-sm mt-1">
                  The shop owner account has been registered and dedicated tenant workspace is initialized.
                </p>
              </div>

              {/* Account Credentials Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Shop Profile & Credentials</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-3.5 rounded-lg border border-slate-200/80">
                    <div className="text-xs text-slate-400">Shop Name</div>
                    <div className="text-base font-semibold text-slate-900 mt-0.5">{createdShop.shopName}</div>
                  </div>

                  <div className="bg-white p-3.5 rounded-lg border border-slate-200/80">
                    <div className="text-xs text-slate-400">Owner Name</div>
                    <div className="text-base font-semibold text-slate-900 mt-0.5">{createdShop.ownerName}</div>
                  </div>
                </div>

                {/* Subdomain URL highlight */}
                <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-medium text-blue-700">Dedicated Shop URL</div>
                    <div className="text-lg font-bold text-blue-950 font-mono tracking-tight flex items-center gap-1.5 mt-0.5">
                      <Globe className="w-4 h-4 text-blue-600 shrink-0" />
                      {createdShop.fullUrl}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(`https://${createdShop.fullUrl}`, 'url')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
                  >
                    {copiedField === 'url' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedField === 'url' ? 'Copied URL!' : 'Copy URL'}
                  </button>
                </div>

                {/* Login Credentials */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-400">Shop Owner Login ID</div>
                      <div className="text-sm font-semibold font-mono text-slate-800">{createdShop.loginId}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(createdShop.loginId, 'loginId')}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 p-1 hover:bg-blue-50 rounded"
                    >
                      {copiedField === 'loginId' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedField === 'loginId' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div>
                      <div className="text-xs text-slate-400">Assigned Password</div>
                      <div className="text-sm font-semibold font-mono text-slate-800">{createdShop.password}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(createdShop.password || '', 'pwd')}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 p-1 hover:bg-blue-50 rounded"
                    >
                      {copiedField === 'pwd' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedField === 'pwd' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div>
                      <div className="text-xs text-slate-400">Workspace Tenant ID</div>
                      <div className="text-xs font-mono text-slate-600">{createdShop.workspaceId}</div>
                    </div>
                    <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Isolated DB</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                  }}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Create Another Shop
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-xs"
                >
                  Done & View in List
                </button>
              </div>
            </div>
          ) : (
            /* Creation Form */
            <form id="add-shop-form" onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2.5 text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1. OWNER DETAILS */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-100 text-slate-900 font-semibold text-sm">
                  <User className="w-4 h-4 text-blue-600" />
                  <span>1. Owner Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Owner Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Chandra Balaji"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9845012345"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. ramesh.balaji@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Aadhaar Number <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="12 digits e.g. 7845 9012 3412"
                      value={aadhaarNumber}
                      onChange={(e) => setAadhaarNumber(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      PAN Number <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="10 alphanumeric characters e.g. BLJPR8821K"
                      value={panNumber}
                      onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                      className="w-full sm:w-1/2 px-3 py-2 text-sm uppercase rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* 2. SHOP DETAILS */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-100 text-slate-900 font-semibold text-sm">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>2. Shop Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Shop Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Balaji Shop"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Shop Logo URL <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://... or leave empty for default badge"
                      value={shopLogo}
                      onChange={(e) => setShopLogo(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Shop Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Full physical address, city, state and pincode"
                      value={shopAddress}
                      onChange={(e) => setShopAddress(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      GST Number <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 29ABCDE1234F1Z5"
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 text-sm uppercase rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Business Mobile Number <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 9845012346"
                      value={businessMobileNumber}
                      onChange={(e) => setBusinessMobileNumber(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* 3. SHOP DOMAIN / SUBDOMAIN */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-100 text-slate-900 font-semibold text-sm">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span>3. Shop Domain / Subdomain</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-slate-700">Dedicated Web Address</span>
                      <p className="text-xs text-slate-500">Auto-generated from Shop Name. You can customize the subdomain prefix.</p>
                    </div>
                    {subdomain && (
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          subdomainStatus.available
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {subdomainStatus.available ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Subdomain Available
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                            {subdomainStatus.reason || 'Unavailable'}
                          </>
                        )}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center">
                    <input
                      type="text"
                      value={subdomain}
                      onChange={(e) => {
                        setIsSubdomainManual(true);
                        setSubdomain(formatSubdomain(e.target.value));
                      }}
                      placeholder="e.g. balaji"
                      className="px-3 py-2 text-sm font-mono font-medium rounded-l-lg border border-r-0 border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 w-44 sm:w-56"
                    />
                    <div className="px-3.5 py-2 text-sm font-mono font-semibold bg-slate-200 text-slate-700 rounded-r-lg border border-slate-300 flex items-center gap-1">
                      .zetaven.com
                    </div>
                  </div>

                  {subdomain && (
                    <div className="text-xs text-slate-600 font-mono flex items-center gap-1.5 pt-1">
                      <span>Preview URL:</span>
                      <strong className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                        {subdomain}.zetaven.com
                      </strong>
                    </div>
                  )}
                </div>
              </div>

              {/* 4. LOGIN DETAILS */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                    <KeyRound className="w-4 h-4 text-blue-600" />
                    <span>4. Login Details (Shop Owner Credentials)</span>
                  </div>
                  <button
                    type="button"
                    onClick={generateSecurePassword}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Generate Password
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Login ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. balaji_admin"
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value)}
                      className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 pr-9 text-sm font-mono rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full px-3 py-2 text-sm font-mono rounded-lg border ${
                        confirmPassword && confirmPassword !== password
                          ? 'border-red-400 bg-red-50/50'
                          : 'border-slate-300'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all`}
                    />
                  </div>
                </div>
              </div>

              {/* Data Separation Notice */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3.5 flex items-start gap-3 text-xs text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800">Isolated Workspace Security:</strong> This shop will be provisioned in an isolated business tenant. Its customers, invoices, products, and financials will remain strictly inaccessible to any other shop.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !subdomainStatus.available}
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-xl transition-all shadow-md shadow-blue-600/20 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Provisioning Shop...
                    </>
                  ) : (
                    'Create Shop Owner'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
