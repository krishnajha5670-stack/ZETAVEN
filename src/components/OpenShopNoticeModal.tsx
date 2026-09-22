import React, { useState } from 'react';
import { X, Globe, Copy, Check, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ShopOwner } from '../types';

interface OpenShopNoticeModalProps {
  shop: ShopOwner | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OpenShopNoticeModal: React.FC<OpenShopNoticeModalProps> = ({
  shop,
  isOpen,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !shop) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://${shop.fullUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Shop Subdomain Gateway</h3>
              <p className="text-xs text-slate-500">{shop.shopName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Assigned Domain</div>
            <div className="text-xl font-bold font-mono text-blue-900 mt-1 flex items-center justify-center gap-1.5">
              <span>https://{shop.fullUrl}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Tenant Subdomain • Workspace: {shop.workspaceId}</p>

            <div className="mt-3 flex justify-center">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-xs transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied Subdomain URL' : 'Copy Subdomain URL'}
              </button>
            </div>
          </div>

          <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-4 space-y-2 text-xs text-slate-700">
            <div className="flex items-center gap-2 font-semibold text-blue-900 text-sm">
              <CheckCircle2 className="w-4 h-4 text-blue-600" /> Subdomain Configured & Ready
            </div>
            <p>
              The DNS and multi-tenant routing for <strong>{shop.fullUrl}</strong> is successfully provisioned in the Zetaven routing table.
            </p>
            <p className="text-slate-500 pt-1">
              Per <strong>STEP 1 instructions</strong>, the public shopfront and the shop-owner business dashboard for <em>{shop.shopName}</em> will be constructed separately in <strong>STEP 2 & STEP 3</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Dedicated isolated database tenant mapped to this URL.</span>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-xs"
            >
              Back to Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
