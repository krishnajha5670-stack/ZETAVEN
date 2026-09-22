export type ShopStatus = 'active' | 'inactive';

export interface ShopOwner {
  id: string;
  // Owner Details
  ownerName: string;
  mobileNumber: string;
  email: string;
  aadhaarNumber?: string;
  panNumber?: string;
  
  // Shop Details
  shopName: string;
  shopLogo?: string;
  shopAddress: string;
  gstNumber?: string;
  businessMobileNumber?: string;
  
  // Login Details
  loginId: string;
  password?: string;
  
  // Shop Domain
  subdomain: string;
  fullUrl: string;
  
  // System Fields
  status: ShopStatus;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface DashboardStats {
  totalShopOwners: number;
  activeShops: number;
  inactiveShops: number;
  recentlyAddedShops: number;
  monthlyGrowth: number;
}

export interface ActivityItem {
  id: string;
  timestamp: string;
  type: 'create' | 'status' | 'password' | 'edit';
  title: string;
  description: string;
  shopName: string;
  subdomain: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}
