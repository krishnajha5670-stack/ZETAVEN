import React, { useState } from 'react';
import { X, Globe, Copy, Check, User, Mail, Phone, MapPin, FileText, Shield, KeyRound, ExternalLink, Power } from 'lucide-react';
import { ShopOwner } from '../types';

interface ShopDetailsModalProps {
  shop: ShopOwner | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (shop: ShopOwner) => void;
  onResetPassword: (shop: ShopOwner) => void;
  onToggleStatus: (shop: ShopOwner) => void;
  onOpenShop: (shop: ShopOwner) => void;
}

export const ShopDetailsModal: React.FC<ShopDetailsModalProps> = ({
  shop,
  isOpen,
  onClose,
  onEdit,
  onResetPassword,
  onToggleStatus,
  onOpenShop
}) => {
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen || !shop) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const formattedDate = new Date(shop.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 font-bold text-slate-700">
              {shop.shopLogo ? (
                <img src={shop.shopLogo} alt={shop.shopName} className="w-full h-full object-cover" />
              ) : (
                shop.shopName.substring(0, 2).toUpperCase()
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{shop.shopName}</h2>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    shop.status === 'active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${shop.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  {shop.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">Created on {formattedDate} • ID: {shop.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Subdomain URL Banner */}
          <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-medium text-blue-700">Dedicated Shop URL</span>
              <div className="text-base font-bold text-blue-950 font-mono tracking-tight flex items-center gap-1.5 mt-0.5">
                <Globe className="w-4 h-4 text-blue-600" />
                https://{shop.fullUrl}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopy(`https://${shop.fullUrl}`, 'url')}
                className="px-3 py-1.5 bg-white border border-blue-200 hover:bg-blue-50 text-blue-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
              >
                {copied === 'url' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied === 'url' ? 'Copied' : 'Copy URL'}
              </button>
              <button
                type="button"
                onClick={() => onOpenShop(shop)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open Shop
              </button>
            </div>
          </div>

          {/* Section: Owner Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-500" /> Owner Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 rounded-xl p-4 border border-slate-200/80 text-sm">
              <div>
                <span className="text-xs text-slate-500">Full Name</span>
                <p className="font-semibold text-slate-900 mt-0.5">{shop.ownerName}</p>
              </div>

              <div>
                <span className="text-xs text-slate-500">Mobile Number</span>
                <p className="font-semibold text-slate-900 mt-0.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  +91 {shop.mobileNumber}
                </p>
              </div>

              <div>
                <span className="text-xs text-slate-500">Email Address</span>
                <p className="font-semibold text-slate-900 mt-0.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {shop.email}
                </p>
              </div>

              <div>
                <span className="text-xs text-slate-500">Business Mobile</span>
                <p className="font-semibold text-slate-900 mt-0.5">
                  {shop.businessMobileNumber ? `+91 ${shop.businessMobileNumber}` : <span className="text-slate-400 italic">Not provided</span>}
                </p>
              </div>
            </div>
          </div>

          {/* Section: Shop & Tax Verification Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" /> Shop & Tax Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 rounded-xl p-4 border border-slate-200/80 text-sm">
              <div className="sm:col-span-2">
                <span className="text-xs text-slate-500">Registered Shop Address</span>
                <p className="font-medium text-slate-800 mt-0.5 flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  {shop.shopAddress}
                </p>
              </div>

              <div>
                <span className="text-xs text-slate-500">GSTIN / Tax ID</span>
                <p className="font-mono font-medium text-slate-900 mt-0.5">
                  {shop.gstNumber || <span className="text-slate-400 italic font-sans">Not registered</span>}
                </p>
              </div>

              <div>
                <span className="text-xs text-slate-500">PAN Number</span>
                <p className="font-mono font-medium text-slate-900 mt-0.5">
                  {shop.panNumber || <span className="text-slate-400 italic font-sans">Not provided</span>}
                </p>
              </div>

              <div>
                <span className="text-xs text-slate-500">Aadhaar Number</span>
                <p className="font-mono font-medium text-slate-900 mt-0.5">
                  {shop.aadhaarNumber || <span className="text-slate-400 italic font-sans">Not provided</span>}
                </p>
              </div>

              <div>
                <span className="text-xs text-slate-500">Isolated Workspace ID</span>
                <p className="font-mono text-xs text-slate-700 bg-white px-2 py-1 rounded border border-slate-200 mt-0.5">
                  {shop.workspaceId}
                </p>
              </div>
            </div>
          </div>

          {/* Section: Shop Owner Login Credentials */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-slate-500" /> Access Credentials
            </h4>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm">
              <div>
                <span className="text-xs text-slate-500">Shop Owner Login ID</span>
                <div className="font-mono font-semibold text-slate-900 text-base">{shop.loginId}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onResetPassword(shop)}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                >
                  Reset Password
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onToggleStatus(shop)}
            className={`px-3 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors ${
              shop.status === 'active'
                ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            {shop.status === 'active' ? 'Disable Account' : 'Enable Account'}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit(shop)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Edit Shop
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
