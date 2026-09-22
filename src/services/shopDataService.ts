import { 
  ShopDataStore, 
  ProductItem, 
  CustomerItem, 
  BillRecord, 
  PaymentTransaction, 
  ShopSettings,
  PaymentMode,
  BillType,
  ReportDateFilter,
  ReportType
} from '../types/shop';
import { ShopOwner } from '../types';

const SHOP_DATA_PREFIX = 'zetaven_shop_data_v2_';
const SHOP_AUTH_PREFIX = 'zetaven_shop_session_';

// Initial Seed Data Generators
function getSeedProducts(shop: ShopOwner): ProductItem[] {
  const sub = shop.subdomain.toLowerCase();

  if (sub.includes('balaji') || sub.includes('market')) {
    return [
      { id: 'prd_1', name: 'Aashirvaad Superior MP Sharbati Atta (10kg)', category: 'Groceries', purchasePrice: 420, sellingPrice: 495, stock: 45, minStockLevel: 10, unit: 'bag' },
      { id: 'prd_2', name: 'Fortune Sunlite Refined Sunflower Oil (5L Jar)', category: 'Edible Oils', purchasePrice: 560, sellingPrice: 650, stock: 24, minStockLevel: 8, unit: 'jar' },
      { id: 'prd_3', name: 'Tata Salt Vacuum Evaporated (1kg)', category: 'Groceries', purchasePrice: 22, sellingPrice: 28, stock: 120, minStockLevel: 25, unit: 'pkt' },
      { id: 'prd_4', name: 'Daawat Rozana Gold Basmati Rice (5kg)', category: 'Rice & Grains', purchasePrice: 380, sellingPrice: 460, stock: 18, minStockLevel: 5, unit: 'bag' },
      { id: 'prd_5', name: 'Amul Pasteurised Butter (500g)', category: 'Dairy', purchasePrice: 240, sellingPrice: 275, stock: 6, minStockLevel: 10, unit: 'brick' }, // Low stock!
      { id: 'prd_6', name: 'Tata Tea Gold Leaf Pouch (1kg)', category: 'Beverages', purchasePrice: 480, sellingPrice: 560, stock: 4, minStockLevel: 8, unit: 'pkt' }, // Low stock!
      { id: 'prd_7', name: 'Surf Excel Quick Wash Detergent Powder (4kg)', category: 'Cleaning', purchasePrice: 490, sellingPrice: 580, stock: 32, minStockLevel: 10, unit: 'pkt' },
      { id: 'prd_8', name: 'Cadbury Celebrations Premium Box (286g)', category: 'Snacks', purchasePrice: 160, sellingPrice: 210, stock: 15, minStockLevel: 5, unit: 'box' },
    ];
  }

  if (sub.includes('apex') || sub.includes('electronic')) {
    return [
      { id: 'prd_1', name: 'Samsung 43" Crystal 4K UHD Smart TV', category: 'Televisions', purchasePrice: 24500, sellingPrice: 28990, stock: 8, minStockLevel: 3, unit: 'unit' },
      { id: 'prd_2', name: 'Philips 750W Mixer Grinder (3 Jars)', category: 'Home Appliances', purchasePrice: 2800, sellingPrice: 3499, stock: 14, minStockLevel: 4, unit: 'box' },
      { id: 'prd_3', name: 'Bajaj DX-7 1000W Dry Iron', category: 'Appliances', purchasePrice: 650, sellingPrice: 899, stock: 25, minStockLevel: 5, unit: 'box' },
      { id: 'prd_4', name: 'boAt Airdopes 141 True Wireless Earbuds', category: 'Audio', purchasePrice: 850, sellingPrice: 1299, stock: 3, minStockLevel: 8, unit: 'piece' }, // Low stock!
      { id: 'prd_5', name: 'Havells 1200mm Ceiling Fan (Pearl White)', category: 'Fans', purchasePrice: 1850, sellingPrice: 2350, stock: 16, minStockLevel: 5, unit: 'unit' },
      { id: 'prd_6', name: 'SanDisk 128GB Ultra USB 3.0 Flash Drive', category: 'Storage', purchasePrice: 680, sellingPrice: 949, stock: 5, minStockLevel: 10, unit: 'unit' }, // Low stock!
    ];
  }

  if (sub.includes('royal') || sub.includes('pharma')) {
    return [
      { id: 'prd_1', name: 'Dolo 650 Tablets (Strip of 15)', category: 'Analgesics', purchasePrice: 22, sellingPrice: 32, stock: 240, minStockLevel: 40, unit: 'strip' },
      { id: 'prd_2', name: 'Becosules Z Multivitamin Capsules (Strip of 20)', category: 'Vitamins', purchasePrice: 38, sellingPrice: 52, stock: 110, minStockLevel: 30, unit: 'strip' },
      { id: 'prd_3', name: 'Dettol Antiseptic Liquid (500ml)', category: 'First Aid', purchasePrice: 185, sellingPrice: 225, stock: 4, minStockLevel: 10, unit: 'bottle' }, // Low stock
      { id: 'prd_4', name: 'Accu-Chek Active Blood Glucose Monitor Kit', category: 'Devices', purchasePrice: 1150, sellingPrice: 1450, stock: 9, minStockLevel: 3, unit: 'kit' },
      { id: 'prd_5', name: 'Omron Digital Arm Blood Pressure Monitor', category: 'Devices', purchasePrice: 1890, sellingPrice: 2350, stock: 3, minStockLevel: 5, unit: 'unit' }, // Low stock
    ];
  }

  // General store default
  return [
    { id: 'prd_1', name: 'Premium Everyday Basmati Grain (5kg)', category: 'Food Staples', purchasePrice: 310, sellingPrice: 390, stock: 30, minStockLevel: 10, unit: 'bag' },
    { id: 'prd_2', name: 'Standard Refined Cooking Oil (1L)', category: 'Food Staples', purchasePrice: 115, sellingPrice: 140, stock: 40, minStockLevel: 15, unit: 'pouch' },
    { id: 'prd_3', name: 'Assam Strong CTC Tea (500g)', category: 'Beverages', purchasePrice: 170, sellingPrice: 220, stock: 5, minStockLevel: 10, unit: 'pkt' }, // Low stock
    { id: 'prd_4', name: 'Handcrafted Organic Soap (125g)', category: 'Personal Care', purchasePrice: 45, sellingPrice: 65, stock: 50, minStockLevel: 12, unit: 'bar' },
    { id: 'prd_5', name: 'Almond & Cashew Roasted Mix (250g)', category: 'Dry Fruits', purchasePrice: 210, sellingPrice: 290, stock: 4, minStockLevel: 8, unit: 'jar' }, // Low stock
  ];
}

function getSeedCustomers(): CustomerItem[] {
  return [
    {
      id: 'cust_1',
      name: 'Suresh Narayana Rao',
      mobile: '9844019283',
      address: 'Flat 302, Green Glen Layout, Bengaluru',
      totalSpent: 14250,
      totalDue: 2450, // Udhar customer!
      status: 'udhar',
      createdAt: '2026-08-16T10:00:00.000Z',
      lastTransactionAt: '2026-09-21T11:30:00.000Z'
    },
    {
      id: 'cust_2',
      name: 'Ananya Deshmukh',
      mobile: '9820394851',
      address: 'B-12, Palm Meadows, Indiranagar',
      totalSpent: 28400,
      totalDue: 0, // General customer
      status: 'general',
      createdAt: '2026-08-18T14:20:00.000Z',
      lastTransactionAt: '2026-09-22T09:15:00.000Z'
    },
    {
      id: 'cust_3',
      name: 'Maheshwari Caterers & Events',
      mobile: '9741289304',
      address: 'Plot 88, 100 Feet Road, HAL 2nd Stage',
      totalSpent: 64900,
      totalDue: 8200, // Udhar customer!
      status: 'udhar',
      createdAt: '2026-08-20T16:00:00.000Z',
      lastTransactionAt: '2026-09-20T17:40:00.000Z'
    },
    {
      id: 'cust_4',
      name: 'Priya Sundaram',
      mobile: '9901238475',
      address: 'No 45, 4th Cross, Defence Colony',
      totalSpent: 8750,
      totalDue: 0, // General customer
      status: 'general',
      createdAt: '2026-08-25T11:00:00.000Z',
      lastTransactionAt: '2026-09-19T14:10:00.000Z'
    },
    {
      id: 'cust_5',
      name: 'Karthik Ramanathan',
      mobile: '9611293847',
      address: 'Tower C, Brigade Gateway',
      totalSpent: 19800,
      totalDue: 1150, // Udhar customer!
      status: 'udhar',
      createdAt: '2026-08-29T10:30:00.000Z',
      lastTransactionAt: '2026-09-21T18:20:00.000Z'
    },
    {
      id: 'cust_6',
      name: 'Devraj Mendonca',
      mobile: '9880192847',
      address: 'Villa 14, Windmills of Your Mind',
      totalSpent: 35400,
      totalDue: 0, // General customer
      status: 'general',
      createdAt: '2026-09-02T13:45:00.000Z',
      lastTransactionAt: '2026-09-22T08:50:00.000Z'
    }
  ];
}

function getSeedBills(shop: ShopOwner, products: ProductItem[]): BillRecord[] {
  const p1 = products[0] || { id: 'p1', name: 'Item A', sellingPrice: 500 };
  const p2 = products[1] || { id: 'p2', name: 'Item B', sellingPrice: 650 };
  const p3 = products[2] || { id: 'p3', name: 'Item C', sellingPrice: 28 };

  return [
    {
      id: 'bill_101',
      invoiceNumber: 'INV-2026-0891',
      date: '2026-09-22T08:50:00.000Z',
      type: 'sale',
      customerId: 'cust_6',
      customerName: 'Devraj Mendonca',
      customerMobile: '9880192847',
      items: [
        { productId: p1.id, productName: p1.name, quantity: 2, rate: p1.sellingPrice, discount: 0, taxPercent: 5, total: p1.sellingPrice * 2 * 1.05 },
        { productId: p2.id, productName: p2.name, quantity: 1, rate: p2.sellingPrice, discount: 0, taxPercent: 5, total: p2.sellingPrice * 1.05 }
      ],
      subtotal: p1.sellingPrice * 2 + p2.sellingPrice,
      taxAmount: Math.round((p1.sellingPrice * 2 + p2.sellingPrice) * 0.05),
      discountAmount: 50,
      grandTotal: Math.round((p1.sellingPrice * 2 + p2.sellingPrice) * 1.05 - 50),
      paymentMode: 'UPI',
      paidAmount: Math.round((p1.sellingPrice * 2 + p2.sellingPrice) * 1.05 - 50),
      dueAmount: 0,
      status: 'paid'
    },
    {
      id: 'bill_102',
      invoiceNumber: 'INV-2026-0890',
      date: '2026-09-21T18:20:00.000Z',
      type: 'sale',
      customerId: 'cust_5',
      customerName: 'Karthik Ramanathan',
      customerMobile: '9611293847',
      items: [
        { productId: p1.id, productName: p1.name, quantity: 3, rate: p1.sellingPrice, discount: 0, taxPercent: 5, total: p1.sellingPrice * 3 * 1.05 }
      ],
      subtotal: p1.sellingPrice * 3,
      taxAmount: Math.round(p1.sellingPrice * 3 * 0.05),
      discountAmount: 0,
      grandTotal: Math.round(p1.sellingPrice * 3 * 1.05),
      paymentMode: 'Credit/Udhar',
      paidAmount: 500,
      dueAmount: Math.round(p1.sellingPrice * 3 * 1.05) - 500,
      status: 'due',
      notes: 'Customer will settle remaining amount next Sunday'
    },
    {
      id: 'bill_103',
      invoiceNumber: 'INV-2026-0889',
      date: '2026-09-21T11:30:00.000Z',
      type: 'sale',
      customerId: 'cust_1',
      customerName: 'Suresh Narayana Rao',
      customerMobile: '9844019283',
      items: [
        { productId: p2.id, productName: p2.name, quantity: 2, rate: p2.sellingPrice, discount: 50, taxPercent: 5, total: (p2.sellingPrice * 2 - 50) * 1.05 }
      ],
      subtotal: p2.sellingPrice * 2 - 50,
      taxAmount: Math.round((p2.sellingPrice * 2 - 50) * 0.05),
      discountAmount: 50,
      grandTotal: Math.round((p2.sellingPrice * 2 - 50) * 1.05),
      paymentMode: 'Credit/Udhar',
      paidAmount: 0,
      dueAmount: Math.round((p2.sellingPrice * 2 - 50) * 1.05),
      status: 'due'
    },
    {
      id: 'bill_104',
      invoiceNumber: 'INV-2026-0888',
      date: '2026-09-20T17:40:00.000Z',
      type: 'sale',
      customerId: 'cust_3',
      customerName: 'Maheshwari Caterers & Events',
      customerMobile: '9741289304',
      items: [
        { productId: p1.id, productName: p1.name, quantity: 10, rate: p1.sellingPrice, discount: 200, taxPercent: 5, total: (p1.sellingPrice * 10 - 200) * 1.05 }
      ],
      subtotal: p1.sellingPrice * 10 - 200,
      taxAmount: Math.round((p1.sellingPrice * 10 - 200) * 0.05),
      discountAmount: 200,
      grandTotal: Math.round((p1.sellingPrice * 10 - 200) * 1.05),
      paymentMode: 'Credit/Udhar',
      paidAmount: 1000,
      dueAmount: Math.round((p1.sellingPrice * 10 - 200) * 1.05) - 1000,
      status: 'due'
    },
    {
      id: 'bill_105',
      invoiceNumber: 'INV-2026-0887',
      date: '2026-09-19T14:10:00.000Z',
      type: 'sale',
      customerId: 'cust_4',
      customerName: 'Priya Sundaram',
      customerMobile: '9901238475',
      items: [
        { productId: p3.id, productName: p3.name, quantity: 4, rate: p3.sellingPrice, discount: 0, taxPercent: 5, total: p3.sellingPrice * 4 * 1.05 }
      ],
      subtotal: p3.sellingPrice * 4,
      taxAmount: Math.round(p3.sellingPrice * 4 * 0.05),
      discountAmount: 0,
      grandTotal: Math.round(p3.sellingPrice * 4 * 1.05),
      paymentMode: 'Cash',
      paidAmount: Math.round(p3.sellingPrice * 4 * 1.05),
      dueAmount: 0,
      status: 'paid'
    },
    {
      id: 'bill_106',
      invoiceNumber: 'PO-2026-0312',
      date: '2026-09-18T10:00:00.000Z',
      type: 'purchase',
      customerId: 'vendor_1',
      customerName: 'Karnataka Wholesale Agros Ltd',
      customerMobile: '9448102938',
      items: [
        { productId: p1.id, productName: p1.name, quantity: 30, rate: p1.purchasePrice, discount: 0, taxPercent: 5, total: p1.purchasePrice * 30 * 1.05 }
      ],
      subtotal: p1.purchasePrice * 30,
      taxAmount: Math.round(p1.purchasePrice * 30 * 0.05),
      discountAmount: 300,
      grandTotal: Math.round(p1.purchasePrice * 30 * 1.05 - 300),
      paymentMode: 'UPI',
      paidAmount: Math.round(p1.purchasePrice * 30 * 1.05 - 300),
      dueAmount: 0,
      status: 'paid'
    }
  ];
}

function getSeedPayments(): PaymentTransaction[] {
  return [
    {
      id: 'pay_1',
      invoiceNumber: 'INV-2026-0888',
      customerId: 'cust_3',
      customerName: 'Maheshwari Caterers & Events',
      date: '2026-09-20T17:45:00.000Z',
      amount: 1000,
      paymentMode: 'UPI',
      notes: 'Initial token on bulk delivery'
    },
    {
      id: 'pay_2',
      invoiceNumber: 'INV-2026-0890',
      customerId: 'cust_5',
      customerName: 'Karthik Ramanathan',
      date: '2026-09-21T18:25:00.000Z',
      amount: 500,
      paymentMode: 'Cash',
      notes: 'Partial advance'
    }
  ];
}

// STORAGE API
export function getShopDataStore(shop: ShopOwner): ShopDataStore {
  const key = `${SHOP_DATA_PREFIX}${shop.id}`;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed reading shop data', e);
  }

  // Initialize seed store
  const products = getSeedProducts(shop);
  const customers = getSeedCustomers();
  const bills = getSeedBills(shop, products);
  const payments = getSeedPayments();
  const settings: ShopSettings = {
    taxRate: 5,
    defaultDiscount: 0,
    currency: '₹',
    smsNotifications: true,
    whatsappAlerts: true,
    lowStockAlerts: true,
    themeColor: 'blue'
  };

  const initialStore: ShopDataStore = {
    shopId: shop.id,
    products,
    customers,
    bills,
    payments,
    settings
  };

  saveShopDataStore(shop.id, initialStore);
  return initialStore;
}

export function saveShopDataStore(shopId: string, store: ShopDataStore): void {
  try {
    localStorage.setItem(`${SHOP_DATA_PREFIX}${shopId}`, JSON.stringify(store));
  } catch (e) {
    console.error('Failed saving shop data', e);
  }
}

// BILLING ACTIONS
export function createBill(
  shop: ShopOwner,
  billData: Omit<BillRecord, 'id' | 'invoiceNumber' | 'date'>
): { success: boolean; bill: BillRecord } {
  const store = getShopDataStore(shop);
  const id = `bill_${Date.now()}`;
  const count = store.bills.length + 892;
  const prefix = billData.type === 'purchase' ? 'PO' : 'INV';
  const invoiceNumber = `${prefix}-2026-${count.toString().padStart(4, '0')}`;
  const now = new Date().toISOString();

  const newBill: BillRecord = {
    ...billData,
    id,
    invoiceNumber,
    date: now
  };

  // 1. Stock Adjustment
  // Sales automatically reduce stock, Purchases automatically increase stock
  newBill.items.forEach(item => {
    const prd = store.products.find(p => p.id === item.productId);
    if (prd) {
      if (newBill.type === 'sale') {
        prd.stock = Math.max(0, prd.stock - item.quantity);
      } else if (newBill.type === 'purchase') {
        prd.stock = prd.stock + item.quantity;
      }
    }
  });

  // 2. Customer Update & Auto-Classification
  // When a bill has due: automatically move to Udhar Customers
  if (newBill.customerId) {
    let customer = store.customers.find(c => c.id === newBill.customerId);
    if (!customer && newBill.customerName) {
      customer = {
        id: `cust_${Date.now()}`,
        name: newBill.customerName,
        mobile: newBill.customerMobile || '',
        totalSpent: 0,
        totalDue: 0,
        status: 'general',
        createdAt: now
      };
      store.customers.push(customer);
    }

    if (customer) {
      if (newBill.type === 'sale') {
        customer.totalSpent += newBill.grandTotal;
        customer.totalDue += newBill.dueAmount;
        customer.lastTransactionAt = now;

        // Auto-classification rule:
        // When due > 0: status is 'udhar'. When due == 0: status is 'general'
        if (customer.totalDue > 0) {
          customer.status = 'udhar';
        } else {
          customer.status = 'general';
        }
      }
    }
  }

  // 3. Payment record if partial/full payment received
  if (newBill.paidAmount > 0) {
    store.payments.unshift({
      id: `pay_${Date.now()}`,
      billId: newBill.id,
      invoiceNumber: newBill.invoiceNumber,
      customerId: newBill.customerId,
      customerName: newBill.customerName,
      date: now,
      amount: newBill.paidAmount,
      paymentMode: newBill.paymentMode,
      notes: `Bill payment for ${newBill.invoiceNumber}`
    });
  }

  store.bills.unshift(newBill);
  saveShopDataStore(shop.id, store);
  return { success: true, bill: newBill };
}

// RECEIVE PAYMENT FOR CUSTOMER
export function receiveCustomerPayment(
  shop: ShopOwner,
  customerId: string,
  amount: number,
  paymentMode: PaymentMode,
  notes?: string
): { success: boolean; customer?: CustomerItem } {
  const store = getShopDataStore(shop);
  const customer = store.customers.find(c => c.id === customerId);
  if (!customer) return { success: false };

  const now = new Date().toISOString();
  customer.totalDue = Math.max(0, customer.totalDue - amount);
  customer.lastTransactionAt = now;

  // Auto-classification:
  // When due becomes 0, the customer automatically returns to General Customers!
  if (customer.totalDue === 0) {
    customer.status = 'general';
  }

  // Update unpaid bills for this customer
  let remainingSettlement = amount;
  for (const bill of store.bills) {
    if (bill.customerId === customerId && bill.dueAmount > 0 && remainingSettlement > 0) {
      const settleAmount = Math.min(bill.dueAmount, remainingSettlement);
      bill.paidAmount += settleAmount;
      bill.dueAmount -= settleAmount;
      remainingSettlement -= settleAmount;
      if (bill.dueAmount === 0) {
        bill.status = 'paid';
      }
    }
  }

  // Record payment transaction
  store.payments.unshift({
    id: `pay_${Date.now()}`,
    customerId: customer.id,
    customerName: customer.name,
    date: now,
    amount,
    paymentMode,
    notes: notes || `Payment received towards outstanding balance`
  });

  saveShopDataStore(shop.id, store);
  return { success: true, customer };
}

// PRODUCT STOCK MANAGEMENT
export function updateProductStock(
  shop: ShopOwner,
  productId: string,
  delta: number
): { success: boolean; product?: ProductItem } {
  const store = getShopDataStore(shop);
  const product = store.products.find(p => p.id === productId);
  if (!product) return { success: false };

  product.stock = Math.max(0, product.stock + delta);
  saveShopDataStore(shop.id, store);
  return { success: true, product };
}

export function saveProduct(
  shop: ShopOwner,
  productData: Omit<ProductItem, 'id'>,
  productId?: string
): { success: boolean; product: ProductItem } {
  const store = getShopDataStore(shop);
  if (productId) {
    const idx = store.products.findIndex(p => p.id === productId);
    if (idx !== -1) {
      store.products[idx] = { ...productData, id: productId };
      saveShopDataStore(shop.id, store);
      return { success: true, product: store.products[idx] };
    }
  }

  const newPrd: ProductItem = {
    ...productData,
    id: `prd_${Date.now()}`
  };
  store.products.unshift(newPrd);
  saveShopDataStore(shop.id, store);
  return { success: true, product: newPrd };
}

// CUSTOMER MANAGEMENT
export function saveCustomer(
  shop: ShopOwner,
  customerData: { name: string; mobile: string; address?: string }
): { success: boolean; customer: CustomerItem } {
  const store = getShopDataStore(shop);
  const now = new Date().toISOString();
  const newCust: CustomerItem = {
    id: `cust_${Date.now()}`,
    name: customerData.name,
    mobile: customerData.mobile,
    address: customerData.address,
    totalSpent: 0,
    totalDue: 0,
    status: 'general',
    createdAt: now
  };

  store.customers.unshift(newCust);
  saveShopDataStore(shop.id, store);
  return { success: true, customer: newCust };
}

// SETTINGS MANAGEMENT
export function updateShopSettings(
  shop: ShopOwner,
  settings: Partial<ShopSettings>
): ShopSettings {
  const store = getShopDataStore(shop);
  store.settings = { ...store.settings, ...settings };
  saveShopDataStore(shop.id, store);
  return store.settings;
}

// AUTHENTICATION FOR THIS SPECIFIC SHOP SUBDOMAIN ONLY
export function shopLogin(
  shop: ShopOwner,
  loginIdOrMobile: string,
  passwordInput: string
): { success: boolean; error?: string } {
  // Must authenticate against THIS specific shop owner belonging to this subdomain
  const cleanInput = loginIdOrMobile.trim().toLowerCase();
  const shopLogin = (shop.loginId || '').toLowerCase();
  const shopMobile = (shop.mobileNumber || '').toLowerCase();
  const shopEmail = (shop.email || '').toLowerCase();

  const idMatches = cleanInput === shopLogin || cleanInput === shopMobile || cleanInput === shopEmail;
  if (!idMatches) {
    return { success: false, error: `Invalid credentials for ${shop.shopName}. Only the registered owner can sign in here.` };
  }

  // Check password
  const expectedPassword = shop.password || 'Password@123';
  if (passwordInput !== expectedPassword) {
    return { success: false, error: 'Incorrect password. Please verify and try again.' };
  }

  // Save session
  try {
    sessionStorage.setItem(`${SHOP_AUTH_PREFIX}${shop.id}`, 'authenticated');
  } catch (e) {
    console.error('Session error', e);
  }

  return { success: true };
}

export function isShopLoggedIn(shopId: string): boolean {
  try {
    return sessionStorage.getItem(`${SHOP_AUTH_PREFIX}${shopId}`) === 'authenticated';
  } catch {
    return false;
  }
}

export function shopLogout(shopId: string): void {
  try {
    sessionStorage.removeItem(`${SHOP_AUTH_PREFIX}${shopId}`);
  } catch (e) {
    console.error('Logout error', e);
  }
}

// REPORT & ANALYTICS COMPUTATION
export interface ComputedReportData {
  title: string;
  totalVolume: number;
  totalCount: number;
  timeSeries: { label: string; value: number; dateStr: string }[];
  breakdown: { label: string; value: number; color?: string }[];
  summaryItems: { label: string; value: string; hint?: string }[];
}

export function computeReportData(
  shop: ShopOwner,
  type: ReportType,
  filter: ReportDateFilter
): ComputedReportData {
  const store = getShopDataStore(shop);

  // Time Series generator
  let days = 7;
  let labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  if (filter === 'today') {
    labels = ['9 AM', '11 AM', '1 PM', '3 PM', '5 PM', '7 PM', '9 PM'];
    days = 1;
  } else if (filter === 'month') {
    labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    days = 30;
  } else if (filter === 'year') {
    labels = ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'];
    days = 365;
  }

  const salesBills = store.bills.filter(b => b.type === 'sale');
  const purchaseBills = store.bills.filter(b => b.type === 'purchase');

  const totalSales = salesBills.reduce((acc, b) => acc + b.grandTotal, 0);
  const totalPurchases = purchaseBills.reduce((acc, b) => acc + b.grandTotal, 0);
  const totalDue = store.customers.reduce((acc, c) => acc + c.totalDue, 0);
  const totalCollected = store.payments.reduce((acc, p) => acc + p.amount, 0);

  if (type === 'sales') {
    // Continuous financial line data
    const baseValue = Math.round(totalSales / labels.length);
    const timeSeries = labels.map((label, idx) => {
      const variance = Math.sin(idx * 1.3) * (baseValue * 0.35);
      return {
        label,
        value: Math.max(1200, Math.round(baseValue + variance + (idx * 180))),
        dateStr: `2026-09-${16 + idx}`
      };
    });

    const paymentModes: Record<string, number> = {};
    salesBills.forEach(b => {
      paymentModes[b.paymentMode] = (paymentModes[b.paymentMode] || 0) + b.grandTotal;
    });

    const breakdown = [
      { label: 'UPI / Digital', value: paymentModes['UPI'] || 14200, color: '#2563eb' },
      { label: 'Cash In Hand', value: paymentModes['Cash'] || 8600, color: '#059669' },
      { label: 'Credit (Udhar)', value: paymentModes['Credit/Udhar'] || 11800, color: '#ea580c' },
      { label: 'Debit / Card', value: paymentModes['Card'] || 4200, color: '#9333ea' }
    ];

    return {
      title: 'Sales & Revenue Report',
      totalVolume: totalSales,
      totalCount: salesBills.length,
      timeSeries,
      breakdown,
      summaryItems: [
        { label: 'Gross Sales', value: `₹${totalSales.toLocaleString('en-IN')}`, hint: 'All processed invoices' },
        { label: 'Realized Cash & UPI', value: `₹${(totalSales - totalDue).toLocaleString('en-IN')}`, hint: 'Settled instantly' },
        { label: 'Outstanding Dues', value: `₹${totalDue.toLocaleString('en-IN')}`, hint: 'Udhar pending' },
        { label: 'Avg Ticket Size', value: `₹${Math.round(totalSales / Math.max(1, salesBills.length)).toLocaleString('en-IN')}`, hint: 'Per invoice' }
      ]
    };
  }

  if (type === 'purchases') {
    const baseValue = Math.round(totalPurchases / labels.length);
    const timeSeries = labels.map((label, idx) => ({
      label,
      value: Math.max(2000, Math.round(baseValue + Math.cos(idx * 1.5) * (baseValue * 0.4))),
      dateStr: `2026-09-${16 + idx}`
    }));

    const breakdown = [
      { label: 'Food & Staples', value: Math.round(totalPurchases * 0.5), color: '#2563eb' },
      { label: 'Dairy & Perishables', value: Math.round(totalPurchases * 0.25), color: '#059669' },
      { label: 'FMCG & Hygiene', value: Math.round(totalPurchases * 0.15), color: '#ea580c' },
      { label: 'Packaging & Misc', value: Math.round(totalPurchases * 0.1), color: '#9333ea' }
    ];

    return {
      title: 'Purchases & Procurement',
      totalVolume: totalPurchases,
      totalCount: purchaseBills.length,
      timeSeries,
      breakdown,
      summaryItems: [
        { label: 'Total Procured', value: `₹${totalPurchases.toLocaleString('en-IN')}`, hint: 'Stock intake' },
        { label: 'Vendor Orders', value: `${purchaseBills.length} Invoices`, hint: 'Supplier POs' },
        { label: 'Average Restock', value: `₹${Math.round(totalPurchases / Math.max(1, purchaseBills.length)).toLocaleString('en-IN')}`, hint: 'Per order' }
      ]
    };
  }

  if (type === 'profit') {
    const grossProfit = Math.max(8500, Math.round(totalSales * 0.22));
    const baseValue = Math.round(grossProfit / labels.length);
    const timeSeries = labels.map((label, idx) => ({
      label,
      value: Math.max(800, Math.round(baseValue + Math.sin(idx * 1.1) * (baseValue * 0.25) + idx * 90)),
      dateStr: `2026-09-${16 + idx}`
    }));

    const breakdown = [
      { label: 'Net Margin', value: Math.round(grossProfit * 0.65), color: '#059669' },
      { label: 'Operating Costs', value: Math.round(grossProfit * 0.22), color: '#ea580c' },
      { label: 'Taxes & Levies', value: Math.round(grossProfit * 0.13), color: '#2563eb' }
    ];

    return {
      title: 'Gross Margin & Profit',
      totalVolume: grossProfit,
      totalCount: salesBills.length,
      timeSeries,
      breakdown,
      summaryItems: [
        { label: 'Gross Margin', value: `₹${grossProfit.toLocaleString('en-IN')}`, hint: '22% average margin' },
        { label: 'Margin Ratio', value: '22.4%', hint: 'On retail selling price' },
        { label: 'Est. Net Return', value: `₹${Math.round(grossProfit * 0.65).toLocaleString('en-IN')}`, hint: 'Post overheads' }
      ]
    };
  }

  if (type === 'customers') {
    const udharCount = store.customers.filter(c => c.status === 'udhar').length;
    const generalCount = store.customers.filter(c => c.status === 'general').length;

    const timeSeries = labels.map((label, idx) => ({
      label,
      value: Math.round(1800 + idx * 600 + Math.sin(idx) * 400),
      dateStr: `2026-09-${16 + idx}`
    }));

    const breakdown = [
      { label: 'General Customers (Clear)', value: generalCount, color: '#059669' },
      { label: 'Udhar Customers (Due > 0)', value: udharCount, color: '#ea580c' }
    ];

    return {
      title: 'Customer Accounts & Udhaar Breakdown',
      totalVolume: totalDue,
      totalCount: store.customers.length,
      timeSeries,
      breakdown,
      summaryItems: [
        { label: 'Total Registered', value: `${store.customers.length}`, hint: 'Active customer profiles' },
        { label: 'Udhar Customers', value: `${udharCount}`, hint: 'Accounts with pending dues' },
        { label: 'Total Outstanding', value: `₹${totalDue.toLocaleString('en-IN')}`, hint: 'To be collected' }
      ]
    };
  }

  if (type === 'stock') {
    const totalUnits = store.products.reduce((acc, p) => acc + p.stock, 0);
    const lowStockCount = store.products.filter(p => p.stock <= p.minStockLevel).length;

    const timeSeries = labels.map((label, idx) => ({
      label,
      value: Math.round(totalUnits - idx * 6 + Math.sin(idx * 2) * 5),
      dateStr: `2026-09-${16 + idx}`
    }));

    const breakdown = [
      { label: 'Healthy Stock', value: store.products.length - lowStockCount, color: '#059669' },
      { label: 'Low Stock Alert', value: lowStockCount, color: '#e11d48' }
    ];

    return {
      title: 'Inventory & Stock Health',
      totalVolume: totalUnits,
      totalCount: store.products.length,
      timeSeries,
      breakdown,
      summaryItems: [
        { label: 'Total SKUs', value: `${store.products.length} Products`, hint: 'Active catalog' },
        { label: 'Units in Stock', value: `${totalUnits} Units`, hint: 'Total inventory' },
        { label: 'Low Stock Items', value: `${lowStockCount} Items`, hint: 'Action needed' }
      ]
    };
  }

  // Default: Payments
  const timeSeries = labels.map((label, idx) => ({
    label,
    value: Math.round(1500 + idx * 450 + Math.cos(idx) * 300),
    dateStr: `2026-09-${16 + idx}`
  }));

  const breakdown = [
    { label: 'UPI / QR Code', value: 58, color: '#2563eb' },
    { label: 'Cash In Hand', value: 32, color: '#059669' },
    { label: 'Card Swipe', value: 10, color: '#9333ea' }
  ];

  return {
    title: 'Payment Inflows & Collections',
    totalVolume: totalCollected,
    totalCount: store.payments.length,
    timeSeries,
    breakdown,
    summaryItems: [
      { label: 'Collections Received', value: `₹${totalCollected.toLocaleString('en-IN')}`, hint: 'Cash & digital' },
      { label: 'Transactions', value: `${store.payments.length}`, hint: 'Recorded entries' },
      { label: 'Udhar Settled', value: '₹3,400', hint: 'Past dues recovered' }
    ]
  };
}
