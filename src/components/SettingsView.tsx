import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Database, 
  Download, 
  RefreshCw, 
  Check, 
  Lock, 
  Globe, 
  Server,
  Layers,
  HardDrive
} from 'lucide-react';
import { ShopOwner } from '../types';
import { INITIAL_SHOPS } from '../data/seedShops';
import { saveStoredShops } from '../services/storage';

interface SettingsViewProps {
  shops: ShopOwner[];
  onRefreshData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ shops, onRefreshData }) => {
  const [copiedDomain, setCopiedDomain] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [backupSuccess, setBackupSuccess] = useState(false);

  const handleExportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(shops, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `zetaven_shops_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setBackupSuccess(true);
    setTimeout(() => setBackupSuccess(false), 2500);
  };

  const handleResetToSeeds = () => {
    if (window.confirm("Are you sure you want to reset all shop data back to the default verified store accounts?")) {
      saveStoredShops(INITIAL_SHOPS);
      onRefreshData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 2500);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-2xl font-bold text-slate-900 font-outfit tracking-tight">Admin System Settings</h2>
        <p className="text-sm text-slate-500 mt-1">
          Platform configurations, tenant data isolation protocols, and database management.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Platform Domain & Networking */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Platform Domain Routing</h3>
              <p className="text-xs text-slate-500">Root domain and wildcard subdomains</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="font-semibold text-slate-700">Root Platform Gateway</span>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  readOnly
                  value="https://zetaven.com"
                  className="w-full bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 font-mono text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText("https://zetaven.com");
                    setCopiedDomain(true);
                    setTimeout(() => setCopiedDomain(false), 2000);
                  }}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold shrink-0"
                >
                  {copiedDomain ? <Check className="w-4 h-4 text-emerald-600" /> : 'Copy'}
                </button>
              </div>
            </div>

            <div>
              <span className="font-semibold text-slate-700">Subdomain Ingress Pattern</span>
              <div className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 font-mono text-blue-700 mt-1">
                {'*.[subdomain].zetaven.com'}
              </div>
              <p className="text-slate-500 mt-1 text-[11px]">
                Each provisioned shop is mapped directly via CNAME/A wildcard records to individual tenant spaces.
              </p>
            </div>
          </div>
        </div>

        {/* Tenant Data Separation Rules */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Data Isolation Protocol</h3>
              <p className="text-xs text-slate-500">Zero data crossover guarantee</p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <p className="leading-relaxed">
              In accordance with Section 11 specifications:
            </p>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/90 space-y-1.5 font-medium text-slate-700">
              <div className="flex items-center gap-1.5 text-emerald-700">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>Shop A customers & invoices isolated from Shop B</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>Distinct workspace ID per shop owner</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>Centralized admin controls without business data pooling</span>
              </div>
            </div>
          </div>
        </div>

        {/* Database Management & Backups */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Shop Database & Workspace State</h3>
              <p className="text-xs text-slate-500">Persistent storage tracking {shops.length} merchant accounts</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div>
              <div className="text-xs font-semibold text-slate-800">Export All Shop Records</div>
              <p className="text-xs text-slate-500">Download active shop catalog, credentials, and tenant metadata as JSON</p>
            </div>
            <button
              type="button"
              onClick={handleExportBackup}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
            >
              {backupSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
              {backupSuccess ? 'Backup Downloaded' : 'Export JSON Backup'}
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <div>
              <div className="text-xs font-semibold text-slate-800">Reset to Verified Demo Shops</div>
              <p className="text-xs text-slate-500">Restore Balaji, Sharma, Apex, Royal, and Metro store accounts</p>
            </div>
            <button
              type="button"
              onClick={handleResetToSeeds}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Sample Data</span>
            </button>
          </div>
          {resetSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium">
              Data successfully reset to initial verified shop owners!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
