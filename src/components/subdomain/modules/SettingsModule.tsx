import React, { useState } from 'react';
import { 
  Settings, 
  Store, 
  ShieldCheck, 
  Bell, 
  Percent, 
  CheckCircle2, 
  Palette, 
  Lock, 
  Save,
  Globe
} from 'lucide-react';
import { ShopOwner } from '../../../types';
import { ThemeConfig, THEME_PALETTES } from '../../../utils/theme';
import { getShopDataStore, updateShopSettings } from '../../../services/shopDataService';

interface SettingsModuleProps {
  shop: ShopOwner;
  theme: ThemeConfig;
  onThemeColorChange?: (colorKey: string) => void;
}

export const SettingsModule: React.FC<SettingsModuleProps> = ({
  shop,
  theme,
  onThemeColorChange
}) => {
  const store = getShopDataStore(shop);

  const [taxRate, setTaxRate] = useState(store.settings.taxRate ?? 5);
  const [defaultDiscount, setDefaultDiscount] = useState(store.settings.defaultDiscount ?? 0);
  const [smsNotif, setSmsNotif] = useState(store.settings.smsNotifications ?? true);
  const [whatsappNotif, setWhatsappNotif] = useState(store.settings.whatsappAlerts ?? true);
  const [lowStockAlert, setLowStockAlert] = useState(store.settings.lowStockAlerts ?? true);
  const [selectedThemeKey, setSelectedThemeKey] = useState(theme.id);

  // Password update fields
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateShopSettings(shop, {
      taxRate,
      defaultDiscount,
      smsNotifications: smsNotif,
      whatsappAlerts: whatsappNotif,
      lowStockAlerts: lowStockAlert,
      themeColor: selectedThemeKey
    });

    if (onThemeColorChange) {
      onThemeColorChange(selectedThemeKey);
    }

    setToastMessage('Shop settings and billing preferences saved successfully!');
  };

  return (
    <div className="space-y-6">
      
      {/* Toast */}
      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setToastMessage(null)}
            className="text-emerald-600 hover:text-emerald-950 font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-outfit">Shop Settings & Preferences</h2>
          <p className="text-xs text-slate-500">
            Configure business identity, tax rates, inventory thresholds and brand theme color
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveSettings}
          className="px-5 py-2.5 rounded-xl font-bold text-white text-xs shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
          style={{ backgroundColor: theme.hex }}
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Business Profile & Accent Theme (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Business Profile (Read-only verified details with shop info) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Store className="w-4 h-4" style={{ color: theme.hex }} />
              <h3 className="text-sm font-bold text-slate-900">Shop Identity & Subdomain</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Shop Name</label>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-900">
                  {shop.shopName}
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Active Subdomain</label>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-mono font-bold text-emerald-600 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  <span>{shop.subdomain}.zetaven.com</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Owner Name</label>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-800">
                  {shop.ownerName}
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Registered Mobile</label>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-mono text-slate-800">
                  +91 {shop.mobileNumber}
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">GSTIN Number</label>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-mono font-semibold text-slate-800">
                  {shop.gstNumber || '29ABCDE1234F1Z5'}
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Workspace ID</label>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-mono text-slate-500">
                  {shop.workspaceId}
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Theme Color Customizer */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Palette className="w-4 h-4" style={{ color: theme.hex }} />
              <h3 className="text-sm font-bold text-slate-900">Brand Accent Color</h3>
            </div>

            <p className="text-xs text-slate-500">
              Select an accent palette for {shop.shopName}. Buttons, highlights, navigation tabs and continuous line charts will reflect this choice:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(THEME_PALETTES).map(([key, pal]) => {
                const isSelected = selectedThemeKey === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setSelectedThemeKey(key);
                      if (onThemeColorChange) onThemeColorChange(key);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-900 ring-offset-2'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-4 h-4 rounded-full shadow-xs" style={{ backgroundColor: pal.hex }} />
                      <span className="font-bold text-xs text-slate-900">{pal.name}</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">{pal.hex}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Billing & Notifications (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Billing Preferences */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Percent className="w-4 h-4" style={{ color: theme.hex }} />
              <h3 className="text-sm font-bold text-slate-900">Billing & Tax Rates</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">Default GST Rate (%)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="28"
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                  <span className="font-bold text-slate-500">%</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">Default Discount (₹)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    value={defaultDiscount}
                    onChange={(e) => setDefaultDiscount(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                  <span className="font-bold text-slate-500">₹</span>
                </div>
              </div>
            </div>
          </div>

          {/* Automated Notifications */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Bell className="w-4 h-4" style={{ color: theme.hex }} />
              <h3 className="text-sm font-bold text-slate-900">Alerts & Reminders</h3>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200/80 cursor-pointer">
                <div>
                  <div className="font-bold text-slate-900">WhatsApp Invoices</div>
                  <div className="text-slate-500 text-[11px]">Send bill receipts directly to customer</div>
                </div>
                <input
                  type="checkbox"
                  checked={whatsappNotif}
                  onChange={(e) => setWhatsappNotif(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200/80 cursor-pointer">
                <div>
                  <div className="font-bold text-slate-900">SMS Udhar Reminders</div>
                  <div className="text-slate-500 text-[11px]">Auto alert customer on pending balance</div>
                </div>
                <input
                  type="checkbox"
                  checked={smsNotif}
                  onChange={(e) => setSmsNotif(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200/80 cursor-pointer">
                <div>
                  <div className="font-bold text-slate-900">Low Stock Push Warning</div>
                  <div className="text-slate-500 text-[11px]">Warn when stock hits threshold</div>
                </div>
                <input
                  type="checkbox"
                  checked={lowStockAlert}
                  onChange={(e) => setLowStockAlert(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </label>
            </div>
          </div>

          {/* Account Security */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Lock className="w-4 h-4" style={{ color: theme.hex }} />
              <h3 className="text-sm font-bold text-slate-900">Security Credentials</h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="text-slate-500">
                Owner Login ID: <strong className="font-mono text-slate-900">{shop.loginId || shop.mobileNumber}</strong>
              </div>
              <div className="text-slate-500">
                Current Password: <strong className="font-mono text-slate-900">{shop.password || 'Password@123'}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
