export type PaymentMode = 'Cash' | 'UPI' | 'Card' | 'Credit/Udhar';

export interface ProductItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  sellingPrice: number;
  purchasePrice: number;
  stock: number;
  minStockLevel: number;
  unit?: string;
}

export type CustomerCategory = 'general' | 'udhar';

export interface CustomerItem {
  id: string;
  name: string;
  mobile: string;
  address?: string;
  totalSpent: number;
  totalDue: number;
  status: CustomerCategory; // automatically set based on totalDue > 0
  createdAt: string;
  lastTransactionAt?: string;
}

export interface BillItem {
  productId: string;
  productName: string;
  quantity: number;
  rate: number;
  discount: number;
  taxPercent: number;
  total: number;
}

export type BillType = 'sale' | 'purchase';
export type BillStatus = 'paid' | 'due' | 'partial' | 'cancelled';

export interface BillRecord {
  id: string;
  invoiceNumber: string;
  date: string;
  type: BillType;
  customerId: string;
  customerName: string;
  customerMobile: string;
  items: BillItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  grandTotal: number;
  paymentMode: PaymentMode;
  paidAmount: number;
  dueAmount: number;
  status: BillStatus;
  notes?: string;
}

export interface PaymentTransaction {
  id: string;
  billId?: string;
  invoiceNumber?: string;
  customerId: string;
  customerName: string;
  date: string;
  amount: number;
  paymentMode: PaymentMode;
  notes?: string;
}

export interface ShopSettings {
  taxRate: number; // e.g. 5 or 18%
  defaultDiscount: number; // e.g. 0 or 5% (shop owner discount applied after tax)
  currency: string;
  smsNotifications: boolean;
  whatsappAlerts: boolean;
  lowStockAlerts: boolean;
  themeColor: string; // 'blue' | 'purple' | 'green' | 'orange' | 'teal' | 'rose'
}

export interface ShopDataStore {
  shopId: string;
  products: ProductItem[];
  customers: CustomerItem[];
  bills: BillRecord[];
  payments: PaymentTransaction[];
  settings: ShopSettings;
}

export type ShopDashboardTab = 'overview' | 'billing' | 'customers' | 'products' | 'reports' | 'settings';
export type ShopNavigationTab = 'billing' | 'customers' | 'products' | 'reports' | 'settings';
export type ReportType = 'sales' | 'purchases' | 'profit' | 'customers' | 'stock' | 'payments';
export type ReportDateFilter = 'today' | 'week' | 'month' | 'year' | 'custom';
