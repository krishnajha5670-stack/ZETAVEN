import React, { useState, useEffect, useMemo } from 'react';
import { ShopOwner, DashboardStats, ActivityItem } from './types';
import { 
  getStoredShops, 
  getStoredActivities, 
  computeDashboardStats, 
  getAdminSession, 
  setAdminSession,
  toggleShopStatus 
} from './services/storage';

// Step 1: Central Zetaven Admin Components
import { LandingPage } from './components/LandingPage';
import { AdminLayout, AdminTab } from './components/AdminLayout';
import { DashboardView } from './components/DashboardView';
import { ShopOwnersView } from './components/ShopOwnersView';
import { SettingsView } from './components/SettingsView';

// Modals
import { AddShopOwnerModal } from './components/AddShopOwnerModal';
import { ShopDetailsModal } from './components/ShopDetailsModal';
import { EditShopModal } from './components/EditShopModal';
import { ResetPasswordModal } from './components/ResetPasswordModal';
import { OpenShopNoticeModal } from './components/OpenShopNoticeModal';

// Step 2: Shop Subdomain Components
import { SubdomainBar } from './components/subdomain/SubdomainBar';
import { ShopPublicLanding } from './components/subdomain/ShopPublicLanding';
import { ShopLoginPage } from './components/subdomain/ShopLoginPage';
import { ShopDashboard } from './components/subdomain/ShopDashboard';
import { getShopTheme, ThemeConfig } from './utils/theme';
import { isShopLoggedIn, getShopDataStore, updateShopSettings } from './services/shopDataService';

export default function App() {
  // Shops & activities data
  const [shops, setShops] = useState<ShopOwner[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  // System view: 'admin-platform' (zetaven.com) vs 'shop-subdomain' (*.zetaven.com)
  const [viewEnvironment, setViewEnvironment] = useState<'admin-platform' | 'shop-subdomain'>('admin-platform');

  // Zetaven Admin states
  const [adminView, setAdminView] = useState<'landing' | 'admin'>('landing');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');

  // Shop Subdomain states
  const [activeShop, setActiveShop] = useState<ShopOwner | null>(null);
  const [shopMode, setShopMode] = useState<'public' | 'login' | 'dashboard'>('public');
  const [customThemeKey, setCustomThemeKey] = useState<string | null>(null);

  // Admin Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewShopModal, setViewShopModal] = useState<ShopOwner | null>(null);
  const [editShopModal, setEditShopModal] = useState<ShopOwner | null>(null);
  const [resetPasswordModal, setResetPasswordModal] = useState<ShopOwner | null>(null);
  const [openShopModal, setOpenShopModal] = useState<ShopOwner | null>(null);

  // Load shops & initialize subdomain routing
  useEffect(() => {
    const loadedShops = getStoredShops();
    const loadedActs = getStoredActivities();
    setShops(loadedShops);
    setActivities(loadedActs);

    // 1. Detect if hostname or URL queries point to a specific shop subdomain
    const hostname = window.location.hostname.toLowerCase();
    const searchParams = new URLSearchParams(window.location.search);
    const subParam = searchParams.get('subdomain') || searchParams.get('shop');
    const path = window.location.pathname.toLowerCase();

    let matchedShop: ShopOwner | undefined = undefined;

    // Check hostname for tenant subdomain e.g. "balaji.zetaven.com"
    if (hostname.includes('.zetaven.com')) {
      const sub = hostname.split('.zetaven.com')[0];
      if (sub && sub !== 'www' && sub !== 'admin') {
        matchedShop = loadedShops.find(s => s.subdomain.toLowerCase() === sub.toLowerCase());
      }
    }

    // Check query params if not matched by hostname (useful in preview environment)
    if (!matchedShop && subParam) {
      matchedShop = loadedShops.find(
        s => s.subdomain.toLowerCase() === subParam.toLowerCase() || s.id === subParam
      );
    }

    if (matchedShop) {
      setActiveShop(matchedShop);
      setViewEnvironment('shop-subdomain');

      // Determine initial mode
      if (path.includes('/dashboard') || searchParams.get('mode') === 'dashboard') {
        setShopMode('dashboard');
      } else if (path.includes('/login') || searchParams.get('mode') === 'login') {
        setShopMode('login');
      } else {
        setShopMode('public');
      }
    } else {
      // If admin session exists, open admin dashboard
      if (getAdminSession()) {
        setAdminView('admin');
      }
    }
  }, []);

  const reloadData = () => {
    const freshShops = getStoredShops();
    setShops(freshShops);
    setActivities(getStoredActivities());
    if (activeShop) {
      const refreshed = freshShops.find(s => s.id === activeShop.id);
      if (refreshed) setActiveShop(refreshed);
    }
  };

  // Real-time computed dashboard stats for Admin
  const stats: DashboardStats = useMemo(() => {
    return computeDashboardStats(shops);
  }, [shops]);

  // Active Shop Theme
  const activeTheme: ThemeConfig = useMemo(() => {
    if (!activeShop) return getShopTheme('balaji');
    const store = getShopDataStore(activeShop);
    const colorKey = customThemeKey || store.settings.themeColor || activeShop.subdomain;
    return getShopTheme(colorKey);
  }, [activeShop, customThemeKey]);

  // Admin Auth handlers
  const handleAdminLoginSuccess = () => {
    setAdminSession(true);
    setAdminView('admin');
    setAdminTab('dashboard');
  };

  const handleAdminLogout = () => {
    setAdminSession(false);
    setAdminView('landing');
  };

  // Switcher to Subdomain view
  const handleLaunchShopSubdomain = (shop: ShopOwner, targetMode: 'public' | 'login' | 'dashboard' = 'public') => {
    setActiveShop(shop);
    setShopMode(targetMode);
    setViewEnvironment('shop-subdomain');
  };

  // Switcher back to Zetaven Admin
  const handleBackToZetavenAdmin = () => {
    setViewEnvironment('admin-platform');
  };

  // Toggle status callback
  const handleToggleStatus = (shop: ShopOwner) => {
    const newStatus = shop.status === 'active' ? 'inactive' : 'active';
    const res = toggleShopStatus(shop.id, newStatus);
    if (res.success && res.shop) {
      reloadData();
      if (viewShopModal?.id === shop.id) {
        setViewShopModal(res.shop);
      }
    }
  };

  // If viewing a shop subdomain
  if (viewEnvironment === 'shop-subdomain' && activeShop) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        
        {/* Top Subdomain Bar & Cross-Tenant Switcher */}
        <SubdomainBar
          currentShop={activeShop}
          allShops={shops}
          currentMode={shopMode}
          theme={activeTheme}
          onSelectShop={(s) => {
            setActiveShop(s);
            setCustomThemeKey(null);
          }}
          onSelectMode={(mode) => setShopMode(mode)}
          onBackToAdmin={handleBackToZetavenAdmin}
        />

        {/* 1. PUBLIC LANDING PAGE (e.g. balaji.zetaven.com) */}
        {shopMode === 'public' && (
          <ShopPublicLanding
            shop={activeShop}
            theme={activeTheme}
            onOpenLogin={() => setShopMode('login')}
          />
        )}

        {/* 2. LOGIN PAGE (e.g. balaji.zetaven.com/login) */}
        {shopMode === 'login' && (
          <ShopLoginPage
            shop={activeShop}
            theme={activeTheme}
            onLoginSuccess={() => setShopMode('dashboard')}
            onBackToPublic={() => setShopMode('public')}
          />
        )}

        {/* 3. SHOP OWNER DASHBOARD (e.g. balaji.zetaven.com/dashboard) */}
        {shopMode === 'dashboard' && (
          <ShopDashboard
            shop={activeShop}
            theme={activeTheme}
            onLogout={() => setShopMode('login')}
            onViewPublicSite={() => setShopMode('public')}
            onThemeColorChange={(colorKey) => setCustomThemeKey(colorKey)}
          />
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // Default: STEP 1 - Zetaven Central Admin Platform (zetaven.com)
  // Preserved exactly as required: "Do NOT modify the Zetaven Admin Panel."
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* 1. PUBLIC LANDING PAGE (zetaven.com) */}
      {adminView === 'landing' ? (
        <LandingPage
          onLoginSuccess={handleAdminLoginSuccess}
          shops={shops}
          onLaunchShopSubdomain={(shop) => handleLaunchShopSubdomain(shop, 'public')}
        />
      ) : (
        /* 2. ADMIN DASHBOARD AFTER LOGIN */
        <AdminLayout
          currentTab={adminTab}
          onTabChange={(tab) => setAdminTab(tab)}
          onLogout={handleAdminLogout}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onViewPublicSite={() => setAdminView('landing')}
          shops={shops}
          onSelectShopFromSearch={(shop) => setViewShopModal(shop)}
        >
          {adminTab === 'dashboard' && (
            <DashboardView
              shops={shops}
              stats={stats}
              activities={activities}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onNavigateToShops={() => setAdminTab('shop-owners')}
              onViewShop={(shop) => setViewShopModal(shop)}
            />
          )}

          {adminTab === 'shop-owners' && (
            <ShopOwnersView
              shops={shops}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onViewShop={(shop) => setViewShopModal(shop)}
              onEditShop={(shop) => setEditShopModal(shop)}
              onResetPassword={(shop) => setResetPasswordModal(shop)}
              onToggleStatus={handleToggleStatus}
              onOpenShop={(shop) => setOpenShopModal(shop)}
            />
          )}

          {adminTab === 'settings' && (
            <SettingsView
              shops={shops}
              onRefreshData={reloadData}
            />
          )}
        </AdminLayout>
      )}

      {/* MODAL 1: Add Shop Owner */}
      <AddShopOwnerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => reloadData()}
      />

      {/* MODAL 2: View Complete Shop Details */}
      <ShopDetailsModal
        shop={viewShopModal}
        isOpen={!!viewShopModal}
        onClose={() => setViewShopModal(null)}
        onEdit={(shop) => {
          setViewShopModal(null);
          setEditShopModal(shop);
        }}
        onResetPassword={(shop) => {
          setViewShopModal(null);
          setResetPasswordModal(shop);
        }}
        onToggleStatus={handleToggleStatus}
        onOpenShop={(shop) => {
          setViewShopModal(null);
          setOpenShopModal(shop);
        }}
      />

      {/* MODAL 3: Edit Shop Owner */}
      <EditShopModal
        shop={editShopModal}
        isOpen={!!editShopModal}
        onClose={() => setEditShopModal(null)}
        onSuccess={() => {
          reloadData();
          setEditShopModal(null);
        }}
      />

      {/* MODAL 4: Reset Password */}
      <ResetPasswordModal
        shop={resetPasswordModal}
        isOpen={!!resetPasswordModal}
        onClose={() => setResetPasswordModal(null)}
        onSuccess={() => reloadData()}
      />

      {/* MODAL 5: Open Shop Subdomain Information Gateway */}
      <OpenShopNoticeModal
        shop={openShopModal}
        isOpen={!!openShopModal}
        onClose={() => setOpenShopModal(null)}
        onLaunchShop={(shop) => {
          handleLaunchShopSubdomain(shop, 'public');
          setOpenShopModal(null);
        }}
      />
    </div>
  );
}
