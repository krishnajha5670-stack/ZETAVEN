import { ShopOwner, ActivityItem, DashboardStats, ShopStatus } from '../types';
import { INITIAL_SHOPS, INITIAL_ACTIVITIES } from '../data/seedShops';

const STORAGE_KEY_SHOPS = 'zetaven_admin_shops_v1';
const STORAGE_KEY_ACTIVITIES = 'zetaven_admin_activities_v1';
const STORAGE_KEY_AUTH = 'zetaven_admin_session_v1';

export function formatSubdomain(name: string): string {
  if (!name) return '';
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getStoredShops(): ShopOwner[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SHOPS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_SHOPS, JSON.stringify(INITIAL_SHOPS));
      return INITIAL_SHOPS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SHOPS;
  } catch {
    return INITIAL_SHOPS;
  }
}

export function saveStoredShops(shops: ShopOwner[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_SHOPS, JSON.stringify(shops));
  } catch (e) {
    console.error('Failed to save shops to localStorage', e);
  }
}

export function getStoredActivities(): ActivityItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACTIVITIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(INITIAL_ACTIVITIES));
      return INITIAL_ACTIVITIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_ACTIVITIES;
  } catch {
    return INITIAL_ACTIVITIES;
  }
}

export function addActivity(activity: Omit<ActivityItem, 'id' | 'timestamp'>): void {
  try {
    const activities = getStoredActivities();
    const newItem: ActivityItem = {
      ...activity,
      id: `act_${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    const updated = [newItem, ...activities].slice(0, 50);
    localStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save activity', e);
  }
}

export function checkSubdomainAvailability(subdomain: string, excludeShopId?: string): { available: boolean; reason?: string } {
  const clean = formatSubdomain(subdomain);
  if (!clean || clean.length < 3) {
    return { available: false, reason: 'Subdomain must be at least 3 characters' };
  }
  
  // Reserved subdomains
  const reserved = ['admin', 'api', 'app', 'dashboard', 'www', 'mail', 'support', 'billing', 'auth', 'root'];
  if (reserved.includes(clean)) {
    return { available: false, reason: 'This is a reserved system subdomain' };
  }

  const shops = getStoredShops();
  const collision = shops.find(s => s.subdomain.toLowerCase() === clean.toLowerCase() && s.id !== excludeShopId);
  if (collision) {
    return { available: false, reason: `Subdomain is already assigned to "${collision.shopName}"` };
  }

  return { available: true };
}

export function computeDashboardStats(shops: ShopOwner[]): DashboardStats {
  const totalShopOwners = shops.length;
  const activeShops = shops.filter(s => s.status === 'active').length;
  const inactiveShops = shops.filter(s => s.status === 'inactive').length;
  
  // Recent: created within the past 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentlyAddedShops = shops.filter(s => {
    try {
      const date = new Date(s.createdAt);
      return date >= thirtyDaysAgo;
    } catch {
      return false;
    }
  }).length;

  return {
    totalShopOwners,
    activeShops,
    inactiveShops,
    recentlyAddedShops,
    monthlyGrowth: 28.5
  };
}

export function createShopOwner(data: Omit<ShopOwner, 'id' | 'createdAt' | 'updatedAt' | 'workspaceId' | 'fullUrl'>): { success: boolean; shop?: ShopOwner; error?: string } {
  const cleanSubdomain = formatSubdomain(data.subdomain);
  const availability = checkSubdomainAvailability(cleanSubdomain);
  if (!availability.available) {
    return { success: false, error: availability.reason || 'Subdomain is not available' };
  }

  const shops = getStoredShops();
  const id = `shp_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();
  
  const newShop: ShopOwner = {
    ...data,
    id,
    subdomain: cleanSubdomain,
    fullUrl: `${cleanSubdomain}.zetaven.com`,
    workspaceId: `ws_${cleanSubdomain.replace(/-/g, '_')}_${Math.floor(10000 + Math.random() * 90000)}`,
    createdAt: now,
    updatedAt: now
  };

  const updatedShops = [newShop, ...shops];
  saveStoredShops(updatedShops);

  addActivity({
    type: 'create',
    title: 'New Shop Registered',
    description: `Admin created shop account for ${newShop.shopName} (${newShop.fullUrl})`,
    shopName: newShop.shopName,
    subdomain: newShop.subdomain
  });

  return { success: true, shop: newShop };
}

export function updateShopOwner(id: string, updates: Partial<ShopOwner>): { success: boolean; shop?: ShopOwner; error?: string } {
  const shops = getStoredShops();
  const index = shops.findIndex(s => s.id === id);
  if (index === -1) {
    return { success: false, error: 'Shop not found' };
  }

  if (updates.subdomain && updates.subdomain !== shops[index].subdomain) {
    const cleanSubdomain = formatSubdomain(updates.subdomain);
    const availability = checkSubdomainAvailability(cleanSubdomain, id);
    if (!availability.available) {
      return { success: false, error: availability.reason };
    }
    updates.subdomain = cleanSubdomain;
    updates.fullUrl = `${cleanSubdomain}.zetaven.com`;
  }

  const now = new Date().toISOString();
  const updatedShop: ShopOwner = {
    ...shops[index],
    ...updates,
    updatedAt: now
  };

  shops[index] = updatedShop;
  saveStoredShops(shops);

  addActivity({
    type: 'edit',
    title: 'Shop Updated',
    description: `Shop profile updated for ${updatedShop.shopName}`,
    shopName: updatedShop.shopName,
    subdomain: updatedShop.subdomain
  });

  return { success: true, shop: updatedShop };
}

export function toggleShopStatus(id: string, newStatus: ShopStatus): { success: boolean; shop?: ShopOwner } {
  const shops = getStoredShops();
  const shop = shops.find(s => s.id === id);
  if (!shop) return { success: false };

  shop.status = newStatus;
  shop.updatedAt = new Date().toISOString();
  saveStoredShops(shops);

  addActivity({
    type: 'status',
    title: newStatus === 'active' ? 'Shop Activated' : 'Shop Disabled',
    description: `Status changed to ${newStatus.toUpperCase()} for ${shop.shopName}`,
    shopName: shop.shopName,
    subdomain: shop.subdomain
  });

  return { success: true, shop };
}

export function resetShopPassword(id: string, newPassword: string): { success: boolean; shop?: ShopOwner } {
  const shops = getStoredShops();
  const shop = shops.find(s => s.id === id);
  if (!shop) return { success: false };

  shop.password = newPassword;
  shop.updatedAt = new Date().toISOString();
  saveStoredShops(shops);

  addActivity({
    type: 'password',
    title: 'Password Reset',
    description: `Shop credentials password updated for ${shop.shopName}`,
    shopName: shop.shopName,
    subdomain: shop.subdomain
  });

  return { success: true, shop };
}

export function getAdminSession(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY_AUTH) === 'authenticated';
  } catch {
    return false;
  }
}

export function setAdminSession(active: boolean): void {
  try {
    if (active) {
      localStorage.setItem(STORAGE_KEY_AUTH, 'authenticated');
    } else {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    }
  } catch (e) {
    console.error('Session save error', e);
  }
}
