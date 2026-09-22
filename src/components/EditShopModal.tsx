import React, { useState, useEffect } from 'react';
import { X, Building2, User, Globe, AlertCircle } from 'lucide-react';
import { ShopOwner } from '../types';
import { formatSubdomain, checkSubdomainAvailability, updateShopOwner } from '../services/storage';

interface EditShopModalProps {
  shop: ShopOwner | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedShop: ShopOwner) => void;
}

export const EditShopModal: React.FC<EditShopModalProps> = ({
  shop,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [ownerName, setOwnerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [shopName, setShopName] = useState('');
  const [shopLogo, setShopLogo] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [businessMobileNumber, setBusinessMobileNumber] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [subdomainStatus, setSubdomainStatus] = useState<{ available: boolean; reason?: string }>({ available: true });

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (shop && isOpen) {
      setOwnerName(shop.ownerName || '');
      setMobileNumber(shop.mobileNumber || '');
      setEmail(shop.email || '');
      setShopName(shop.shopName || '');
      setShopLogo(shop.shopLogo || '');
      setShopAddress(shop.shopAddress || '');
      setGstNumber(shop.gstNumber || '');
      setBusinessMobileNumber(shop.businessMobileNumber || '');
      setSubdomain(shop.subdomain || '');
      setErrorMessage('');
      setSubdomainStatus({ available: true });
    }
  }, [shop, isOpen]);

  useEffect(() => {
    if (!shop || !subdomain) return;
    if (subdomain === shop.subdomain) {
      setSubdomainStatus({ available: true });
      return;
    }
    const check = checkSubdomainAvailability(subdomain, shop.id);
    setSubdomainStatus(check);
  }, [subdomain, shop]);

  if (!isOpen || !shop) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!ownerName.trim()) {
      setErrorMessage('Owner Name is required.');
      return;
    }
    if (!mobileNumber.trim()) {
      setErrorMessage('Mobile Number is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Valid Email is required.');
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
    if (!subdomainStatus.available) {
      setErrorMessage(subdomainStatus.reason || 'Invalid subdomain.');
      return;
    }

    setIsSubmitting(true);
    const res = updateShopOwner(shop.id, {
      ownerName: ownerName.trim(),
      mobileNumber: mobileNumber.trim(),
      email: email.trim(),
      shopName: shopName.trim(),
      shopLogo: shopLogo.trim() || undefined,
      shopAddress: shopAddress.trim(),
      gstNumber: gstNumber.trim().toUpperCase() || undefined,
      businessMobileNumber: businessMobileNumber.trim() || undefined,
      subdomain: subdomain.trim()
    });
    setIsSubmitting(false);

    if (res.success && res.shop) {
      onSuccess(res.shop);
      onClose();
    } else {
      setErrorMessage(res.error || 'Failed to update shop.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Edit Shop Profile</h3>
              <p className="text-xs text-slate-500">Update business and owner details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              {errorMessage}
            </div>
          )}

          {/* Owner details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 pb-1 border-b border-slate-100">
              <User className="w-3.5 h-3.5 text-slate-500" /> Owner Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Owner Name *</label>
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Shop details */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 pb-1 border-b border-slate-100">
              <Building2 className="w-3.5 h-3.5 text-slate-500" /> Shop Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Shop Name *</label>
                <input
                  type="text"
                  required
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Shop Logo URL</label>
                <input
                  type="url"
                  value={shopLogo}
                  onChange={(e) => setShopLogo(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Shop Address *</label>
                <textarea
                  required
                  rows={2}
                  value={shopAddress}
                  onChange={(e) => setShopAddress(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">GST Number</label>
                <input
                  type="text"
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                  className="w-full px-3 py-1.5 text-sm uppercase rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Business Phone</label>
                <input
                  type="tel"
                  value={businessMobileNumber}
                  onChange={(e) => setBusinessMobileNumber(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Subdomain */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 pb-1 border-b border-slate-100">
              <Globe className="w-3.5 h-3.5 text-slate-500" /> Subdomain
            </h4>
            <div className="flex items-center">
              <input
                type="text"
                value={subdomain}
                onChange={(e) => setSubdomain(formatSubdomain(e.target.value))}
                className="px-3 py-1.5 text-sm font-mono rounded-l-lg border border-r-0 border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 w-44"
              />
              <div className="px-3 py-1.5 text-sm font-mono font-semibold bg-slate-100 text-slate-600 rounded-r-lg border border-slate-300">
                .zetaven.com
              </div>
            </div>
            {!subdomainStatus.available && (
              <p className="text-xs text-red-600 font-medium">{subdomainStatus.reason}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !subdomainStatus.available}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 rounded-lg transition-colors shadow-xs"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
