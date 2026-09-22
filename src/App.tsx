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

// Modular Components
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

export default function App() {
  // Main view: 'landing' or 'admin'
  const [currentView, setCurrentView] = useState<'landing' | 'admin'>('landing');
  
  // Admin view tab: 'dashboard' | 'shop-owners' | 'settings'
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');

  // Core shops data
  const [shops, setShops] = useState<ShopOwner[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewShopModal, setViewShopModal] = useState<ShopOwner | null>(null);
  const [editShopModal, setEditShopModal] = useState<ShopOwner | null>(null);
  const [resetPasswordModal, setResetPasswordModal] = useState<ShopOwner | null>(null);
  const [openShopModal, setOpenShopModal] = useState<ShopOwner | null>(null);

  // Initialize data and check session
  useEffect(() => {
    const loadedShops = getStoredShops();
    const loadedActs = getStoredActivities();
    setShops(loadedShops);
    setActivities(loadedActs);

    if (getAdminSession()) {
      setCurrentView('admin');
    }
  }, []);

  const reloadData = () => {
    setShops(getStoredShops());
    setActivities(getStoredActivities());
  };

  // Real-time computed dashboard stats
  const stats: DashboardStats = useMemo(() => {
    return computeDashboardStats(shops);
  }, [shops]);

  // Auth handlers
  const handleLoginSuccess = () => {
    setAdminSession(true);
    setCurrentView('admin');
    setAdminTab('dashboard');
  };

  const handleLogout = () => {
    setAdminSession(false);
    setCurrentView('landing');
  };

  // Add shop callback
  const handleAddShopSuccess = (newShop: ShopOwner) => {
    reloadData();
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* 1. PUBLIC LANDING PAGE (zetaven.com) */}
      {currentView === 'landing' ? (
        <LandingPage
          onLoginSuccess={handleLoginSuccess}
          shops={shops}
        />
      ) : (
        /* 2. ADMIN DASHBOARD AFTER LOGIN */
        <AdminLayout
          currentTab={adminTab}
          onTabChange={(tab) => setAdminTab(tab)}
          onLogout={handleLogout}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onViewPublicSite={() => setCurrentView('landing')}
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
        onSuccess={handleAddShopSuccess}
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
        onSuccess={(updated) => {
          reloadData();
          setEditShopModal(null);
        }}
      />

      {/* MODAL 4: Reset Password */}
      <ResetPasswordModal
        shop={resetPasswordModal}
        isOpen={!!resetPasswordModal}
        onClose={() => setResetPasswordModal(null)}
        onSuccess={(updated) => {
          reloadData();
        }}
      />

      {/* MODAL 5: Open Shop Subdomain Information Gateway */}
      <OpenShopNoticeModal
        shop={openShopModal}
        isOpen={!!openShopModal}
        onClose={() => setOpenShopModal(null)}
      />
    </div>
  );
}
