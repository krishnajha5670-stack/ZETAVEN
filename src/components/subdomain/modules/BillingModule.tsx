import React, { useState } from 'react';
import { 
  Receipt, 
  Plus, 
  Minus,
  Trash2, 
  Printer, 
  Share2, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  ArrowRight,
  Clock,
  CircleDollarSign,
  UserCheck,
  Package,
  Sparkles
} from 'lucide-react';
import { ShopOwner } from '../../../types';
import { 
  BillRecord, 
  BillItem, 
  ProductItem, 
  CustomerItem, 
  PaymentMode, 
  BillType 
} from '../../../types/shop';
import { ThemeConfig } from '../../../utils/theme';
import { getShopDataStore, createBill } from '../../../services/shopDataService';
import { generateInvoicePdf } from '../../../utils/invoicePdfGenerator';

interface BillingModuleProps {
  shop: ShopOwner;
  theme: ThemeConfig;
  preselectedCustomerId?: string | null;
  onNavigateToCustomers?: () => void;
}

export const BillingModule: React.FC<BillingModuleProps> = ({
  shop,
  theme,
  preselectedCustomerId,
  onNavigateToCustomers
}) => {
  const store = getShopDataStore(shop);

  // Bill Form State
  const [billType, setBillType] = useState<BillType>('sale');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(preselectedCustomerId || '');
  const [customCustomerName, setCustomCustomerName] = useState('');
  const [customCustomerMobile, setCustomCustomerMobile] = useState('');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('UPI');
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [notes, setNotes] = useState('');

  // Items List
  const [items, setItems] = useState<BillItem[]>([]);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Free-Text Item Composer State (Issue 1)
  const [itemDescription, setItemDescription] = useState('');
  const [itemRate, setItemRate] = useState<string | number>('');
  const [itemQty, setItemQty] = useState(1);
  const [itemDiscount, setItemDiscount] = useState<string | number>(0);
  const [itemTaxPercent, setItemTaxPercent] = useState<number>(shop.gstNumber ? 5 : 0);
  const [linkedProductId, setLinkedProductId] = useState('');

  // Active completed invoice preview modal
  const [createdInvoice, setCreatedInvoice] = useState<BillRecord | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Selected customer object
  const currentCustomer = store.customers.find(c => c.id === selectedCustomerId);
  // Optional linked inventory product
  const linkedProduct = store.products.find(p => p.id === linkedProductId);

  // Calculation Math
  const itemsSubtotal = items.reduce((acc, item) => acc + (item.rate * item.quantity), 0);
  const itemsDiscountTotal = items.reduce((acc, item) => acc + (item.discount || 0), 0);
  const subtotal = Math.max(0, itemsSubtotal - itemsDiscountTotal);
  const taxAmount = Math.round(items.reduce((acc, item) => {
    const lineNet = Math.max(0, (item.rate * item.quantity) - (item.discount || 0));
    const t = typeof item.taxPercent === 'number' ? item.taxPercent : (shop.gstNumber ? 5 : 0);
    return acc + (lineNet * (t / 100));
  }, 0));
  const grandTotal = Math.max(0, subtotal + taxAmount - discountAmount);
  const dueAmount = Math.max(0, grandTotal - paidAmount);

  // Select an inventory product (optional link)
  const handleSelectInventoryProduct = (productId: string) => {
    if (!productId) {
      setLinkedProductId('');
      return;
    }
    const prd = store.products.find(p => p.id === productId);
    if (!prd) return;
    setItemDescription(prd.name);
    setItemRate(billType === 'sale' ? prd.sellingPrice : prd.purchasePrice);
    setLinkedProductId(prd.id);
  };

  // When user types in description
  const handleDescriptionChange = (text: string) => {
    setItemDescription(text);
    // If the text no longer matches the linked product name, unlink from inventory
    if (linkedProductId) {
      const prd = store.products.find(p => p.id === linkedProductId);
      if (prd && prd.name.toLowerCase() !== text.trim().toLowerCase()) {
        setLinkedProductId('');
      }
    }
  };

  // Handle adding an item to the invoice (Free-text or linked)
  const handleAddItem = () => {
    const desc = itemDescription.trim();
    if (!desc) {
      alert('Please enter an Item Description / Product or Service.');
      return;
    }

    const qty = Math.max(1, itemQty);
    const rate = Math.max(0, Number(itemRate) || 0);
    const discount = Math.max(0, Number(itemDiscount) || 0);
    const tax = Number(itemTaxPercent) || 0;
    const lineTotal = Math.max(0, (qty * rate) - discount);

    const newItem: BillItem = {
      productId: linkedProductId || '', // If empty, stock will NOT be changed!
      productName: desc,
      quantity: qty,
      rate,
      discount,
      taxPercent: tax,
      total: lineTotal
    };

    const updatedItems = [...items, newItem];
    setItems(updatedItems);

    // Auto set paid amount if user hasn't changed it
    const newItemsSub = updatedItems.reduce((acc, it) => acc + (it.rate * it.quantity), 0);
    const newItemsDisc = updatedItems.reduce((acc, it) => acc + (it.discount || 0), 0);
    const newSub = Math.max(0, newItemsSub - newItemsDisc);
    const newTax = Math.round(updatedItems.reduce((acc, it) => {
      const lineNet = Math.max(0, (it.rate * it.quantity) - (it.discount || 0));
      return acc + (lineNet * (it.taxPercent || 0) / 100);
    }, 0));
    const newGrand = Math.max(0, newSub + newTax - discountAmount);

    if (paymentMode !== 'Credit/Udhar') {
      setPaidAmount(newGrand);
    }

    // Reset item composer
    setItemDescription('');
    setItemRate('');
    setItemQty(1);
    setItemDiscount(0);
    setLinkedProductId('');
  };

  // Update item in table directly
  const handleUpdateItemQty = (index: number, newQty: number) => {
    const q = Math.max(1, newQty);
    setItems(prev => {
      const next = [...prev];
      const it = { ...next[index], quantity: q };
      it.total = Math.max(0, (it.quantity * it.rate) - (it.discount || 0));
      next[index] = it;
      return next;
    });
  };

  const handleUpdateItemRate = (index: number, newRate: number) => {
    const r = Math.max(0, newRate);
    setItems(prev => {
      const next = [...prev];
      const it = { ...next[index], rate: r };
      it.total = Math.max(0, (it.quantity * it.rate) - (it.discount || 0));
      next[index] = it;
      return next;
    });
  };

  const handleUpdateItemDiscount = (index: number, newDisc: number) => {
    const d = Math.max(0, newDisc);
    setItems(prev => {
      const next = [...prev];
      const it = { ...next[index], discount: d };
      it.total = Math.max(0, (it.quantity * it.rate) - d);
      next[index] = it;
      return next;
    });
  };

  const handleRemoveItem = (index: number) => {
    setItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleProcessBill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (items.length === 0) {
      alert('Please add at least one item to create the invoice.');
      return;
    }

    const customerName = currentCustomer ? currentCustomer.name : (customCustomerName.trim() || 'Walk-in Customer');
    const customerMobile = currentCustomer ? currentCustomer.mobile : customCustomerMobile.trim();

    const result = createBill(shop, {
      type: billType,
      customerId: selectedCustomerId || '',
      customerName,
      customerMobile,
      items,
      subtotal,
      taxAmount,
      discountAmount,
      grandTotal,
      paymentMode,
      paidAmount,
      dueAmount,
      status: dueAmount > 0 ? (paidAmount > 0 ? 'partial' : 'due') : 'paid',
      notes
    });

    if (result.success) {
      setCreatedInvoice(result.bill);
      setSuccessToast(`Invoice ${result.bill.invoiceNumber} created successfully!`);
      // Reset form
      setItems([]);
      setDiscountAmount(0);
      setPaidAmount(0);
      setNotes('');
      setCustomCustomerName('');
      setCustomCustomerMobile('');
      setSelectedCustomerId('');
      setItemDescription('');
      setItemRate('');
      setItemQty(1);
      setItemDiscount(0);
      setLinkedProductId('');
    }
  };

  // Issue 2: Functional Print, PDF, WhatsApp actions
  const handlePrintInvoice = () => {
    if (!createdInvoice) return;
    window.print();
  };

  const handleDownloadPdf = () => {
    if (!createdInvoice) return;
    try {
      const doc = generateInvoicePdf(shop, createdInvoice);
      doc.save(`${createdInvoice.invoiceNumber}.pdf`);
      setSuccessToast(`Invoice ${createdInvoice.invoiceNumber}.pdf downloaded successfully!`);
    } catch (err) {
      console.error('PDF error:', err);
      alert('Failed to generate PDF. You can also use Print -> Save as PDF.');
    }
  };

  const handleShareWhatsApp = async () => {
    if (!createdInvoice) return;

    const phone = (createdInvoice.customerMobile || '').replace(/\D/g, '');
    const formattedPhone = phone.length === 10 ? `91${phone}` : phone;

    const dateStr = new Date(createdInvoice.date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    const itemsSummary = createdInvoice.items
      .map((it, i) => `${i + 1}. ${it.productName} (x${it.quantity}) - Rs. ${it.total.toLocaleString('en-IN')}`)
      .join('\n');

    const messageText = 
`🧾 *TAX INVOICE — ${shop.shopName.toUpperCase()}*
━━━━━━━━━━━━━━━━━━━━━
*Invoice No:* ${createdInvoice.invoiceNumber}
*Date:* ${dateStr}
*Customer:* ${createdInvoice.customerName}
${createdInvoice.customerMobile ? `*Mobile:* +91 ${createdInvoice.customerMobile}\n` : ''}
*ITEMS:*
${itemsSummary}
━━━━━━━━━━━━━━━━━━━━━
*Subtotal:* Rs. ${createdInvoice.subtotal.toLocaleString('en-IN')}
${createdInvoice.taxAmount > 0 ? `*GST (5%):* Rs. ${createdInvoice.taxAmount.toLocaleString('en-IN')}\n` : ''}
${createdInvoice.discountAmount > 0 ? `*Discount:* -Rs. ${createdInvoice.discountAmount.toLocaleString('en-IN')}\n` : ''}
*Grand Total:* Rs. ${createdInvoice.grandTotal.toLocaleString('en-IN')}
*Payment Mode:* ${createdInvoice.paymentMode}
*Amount Paid:* Rs. ${createdInvoice.paidAmount.toLocaleString('en-IN')}
${createdInvoice.dueAmount > 0 ? `*Pending Due:* Rs. ${createdInvoice.dueAmount.toLocaleString('en-IN')}\n` : '*Status:* Fully Paid ✓\n'}
━━━━━━━━━━━━━━━━━━━━━
Thank you for your business!
Store: https://${shop.subdomain}.zetaven.com`;

    // Try Web Share with real PDF file if supported
    if (navigator.canShare) {
      try {
        const doc = generateInvoicePdf(shop, createdInvoice);
        const pdfBlob = doc.output('blob');
        const pdfFile = new File([pdfBlob], `${createdInvoice.invoiceNumber}.pdf`, { type: 'application/pdf' });

        if (navigator.canShare({ files: [pdfFile] })) {
          await navigator.share({
            files: [pdfFile],
            title: `Invoice ${createdInvoice.invoiceNumber}`,
            text: messageText
          });
          return;
        }
      } catch {
        // Fallback to WhatsApp direct link below
      }
    }

    // Direct WhatsApp share URL
    const encoded = encodeURIComponent(messageText);
    const whatsappUrl = formattedPhone
      ? `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner / Toast */}
      {successToast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successToast}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setSuccessToast(null)}
            className="text-emerald-600 hover:text-emerald-950 font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Billing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Bill Item Composer (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          
          {/* Header Controls: Bill Type Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 font-outfit">New Billing Invoice</h2>
              <p className="text-xs text-slate-500">Fast 1-click POS terminal with auto-inventory adjustment</p>
            </div>

            <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setBillType('sale')}
                className={`px-3.5 py-1.5 rounded-lg transition-colors ${
                  billType === 'sale' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Customer Sale
              </button>
              <button
                type="button"
                onClick={() => setBillType('purchase')}
                className={`px-3.5 py-1.5 rounded-lg transition-colors ${
                  billType === 'purchase' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Vendor Purchase (Stock In)
              </button>
            </div>
          </div>

          {/* Customer Selection Block */}
          <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Customer Selection</span>
              <span className="text-[11px] text-slate-500">Existing or Walk-in</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Select Existing Customer
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => {
                    setSelectedCustomerId(e.target.value);
                    if (e.target.value) {
                      setCustomCustomerName('');
                      setCustomCustomerMobile('');
                    }
                  }}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2"
                  style={{ '--tw-ring-color': theme.hex } as React.CSSProperties}
                >
                  <option value="">-- Choose registered customer or enter below --</option>
                  {store.customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.mobile}) {c.totalDue > 0 ? `• [Udhar Due: ₹${c.totalDue}]` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {!selectedCustomerId ? (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh"
                      value={customCustomerName}
                      onChange={(e) => setCustomCustomerName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2"
                      style={{ '--tw-ring-color': theme.hex } as React.CSSProperties}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 9876543210"
                      value={customCustomerMobile}
                      onChange={(e) => setCustomCustomerMobile(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 font-mono"
                      style={{ '--tw-ring-color': theme.hex } as React.CSSProperties}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{currentCustomer?.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">+91 {currentCustomer?.mobile}</div>
                  </div>
                  {currentCustomer && currentCustomer.totalDue > 0 ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      Udhar: ₹{currentCustomer.totalDue}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Clear
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Add Product / Service Line Section (Issue 1) */}
          <div className="p-4 sm:p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <span>Add Items to Invoice</span>
                {linkedProduct ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    <Package className="w-3 h-3 text-blue-600" />
                    <span>Linked: {linkedProduct.name} ({linkedProduct.stock} in stock)</span>
                    <button 
                      type="button" 
                      onClick={() => setLinkedProductId('')} 
                      className="ml-1 text-blue-500 hover:text-blue-800 cursor-pointer"
                      title="Unlink from inventory"
                    >
                      ✕
                    </button>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-200/80 text-slate-700">
                    <span>Free-Text Item (Bill only)</span>
                  </span>
                )}
              </div>

              {/* Optional Quick-Select from Inventory */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-500 font-medium">Link Inventory:</span>
                <select
                  value={linkedProductId}
                  onChange={(e) => handleSelectInventoryProduct(e.target.value)}
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-700 focus:outline-none focus:ring-1 cursor-pointer"
                >
                  <option value="">-- Optional: Choose catalog item --</option>
                  {store.products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (₹{billType === 'sale' ? p.sellingPrice : p.purchasePrice} | Stock: {p.stock} {p.unit || ''})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Input Row: Description, Rate, Quantity (+/-), Discount, Add button */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              
              {/* Item Description (Free-text) */}
              <div className="sm:col-span-5">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Item Description / Product or Service <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Aashirvaad Atta 10kg, Plumbing Work, Repair Service..."
                  value={itemDescription}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddItem(); } }}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 font-medium"
                  style={{ '--tw-ring-color': theme.hex } as React.CSSProperties}
                />
              </div>

              {/* Rate (Editable manually) */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Rate (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={itemRate}
                  onChange={(e) => setItemRate(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value) || 0))}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddItem(); } }}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 text-right"
                  style={{ '--tw-ring-color': theme.hex } as React.CSSProperties}
                />
              </div>

              {/* Quantity with +/- controls and manual entry */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-1 text-center">
                  Quantity
                </label>
                <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2" style={{ '--tw-ring-color': theme.hex } as React.CSSProperties}>
                  <button
                    type="button"
                    onClick={() => setItemQty(Math.max(1, itemQty - 1))}
                    className="px-2.5 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer text-xs font-bold"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={itemQty}
                    onChange={(e) => setItemQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full py-2 bg-transparent text-center font-mono font-bold text-xs text-slate-900 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setItemQty(itemQty + 1)}
                    className="px-2.5 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer text-xs font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Item Discount (optional) */}
              <div className="sm:col-span-1">
                <label className="block text-[11px] font-semibold text-slate-500 mb-1 text-right">
                  Disc (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={itemDiscount}
                  onChange={(e) => setItemDiscount(e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-2 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:ring-1 text-right"
                />
              </div>

              {/* Add Item Button */}
              <div className="sm:col-span-2">
                <button
                  type="button"
                  onClick={handleAddItem}
                  disabled={!itemDescription.trim()}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs disabled:opacity-40 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Item</span>
                </button>
              </div>
            </div>
          </div>

          {/* Invoice Items Table with all requested columns */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-200 tracking-wider">
                  <tr>
                    <th className="p-3">Item Description / Service</th>
                    <th className="p-3 text-center w-28">Quantity</th>
                    <th className="p-3 text-right w-24">Rate (₹)</th>
                    <th className="p-3 text-right w-20">Discount</th>
                    <th className="p-3 text-center w-16">Tax</th>
                    <th className="p-3 text-right w-24">Total (₹)</th>
                    <th className="p-3 text-center w-12">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        <Receipt className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                        <span>No items added yet. Type any item or service above and click <strong>+ Add Item</strong>.</span>
                      </td>
                    </tr>
                  ) : (
                    items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3">
                          <div className="font-semibold text-slate-900">{item.productName}</div>
                          {item.productId ? (
                            <span className="inline-flex items-center gap-1 text-[10px] text-blue-600 font-medium">
                              <Package className="w-2.5 h-2.5" />
                              <span>Inventory Linked (Stock will reduce)</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-medium">
                              Manual / Service (Bill only • No stock change)
                            </span>
                          )}
                        </td>
                        
                        {/* Quantity with +/- and direct input */}
                        <td className="p-3 text-center">
                          <div className="inline-flex items-center bg-slate-100/80 rounded-lg p-0.5 border border-slate-200">
                            <button
                              type="button"
                              onClick={() => handleUpdateItemQty(idx, item.quantity - 1)}
                              className="w-5 h-5 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white rounded transition-colors text-xs font-bold cursor-pointer"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleUpdateItemQty(idx, parseInt(e.target.value) || 1)}
                              className="w-10 text-center font-mono font-bold text-xs bg-transparent focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleUpdateItemQty(idx, item.quantity + 1)}
                              className="w-5 h-5 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white rounded transition-colors text-xs font-bold cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        {/* Rate (Editable manually) */}
                        <td className="p-3 text-right">
                          <input
                            type="number"
                            min="0"
                            value={item.rate}
                            onChange={(e) => handleUpdateItemRate(idx, parseFloat(e.target.value) || 0)}
                            className="w-20 px-1.5 py-1 text-right font-mono text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:ring-1"
                          />
                        </td>

                        {/* Discount (Editable manually) */}
                        <td className="p-3 text-right">
                          <input
                            type="number"
                            min="0"
                            value={item.discount || 0}
                            onChange={(e) => handleUpdateItemDiscount(idx, parseFloat(e.target.value) || 0)}
                            className="w-16 px-1 py-1 text-right font-mono text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:ring-1"
                          />
                        </td>

                        {/* Tax */}
                        <td className="p-3 text-center font-mono text-[11px] text-slate-500">
                          {item.taxPercent || (shop.gstNumber ? 5 : 0)}%
                        </td>

                        {/* Total */}
                        <td className="p-3 text-right font-mono font-bold text-slate-900">
                          ₹{item.total.toLocaleString('en-IN')}
                        </td>

                        {/* Remove item */}
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Payment Settlement & Bill Summary (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900">Payment & Settlement</h3>
            <p className="text-[11px] text-slate-500">Calculate totals, apply discounts and record payment mode</p>
          </div>

          {/* Subtotal, Tax, Discount Calculations */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Items Subtotal</span>
              <span className="font-mono font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>GST Tax (5%)</span>
              <span className="font-mono">₹{taxAmount.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <span className="text-slate-600">Owner Discount (₹)</span>
              <input
                type="number"
                min="0"
                value={discountAmount}
                onChange={(e) => {
                  const d = Math.max(0, parseInt(e.target.value) || 0);
                  setDiscountAmount(d);
                  if (paymentMode !== 'Credit/Udhar') {
                    setPaidAmount(Math.max(0, subtotal + taxAmount - d));
                  }
                }}
                className="w-24 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-right font-mono font-bold text-xs"
              />
            </div>

            <div className="flex justify-between text-base font-extrabold text-slate-950 border-t border-slate-200 pt-3">
              <span>Grand Total</span>
              <span className="font-mono" style={{ color: theme.hex }}>
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Payment Mode Selector */}
          <div className="space-y-1.5 pt-2">
            <label className="block text-xs font-bold text-slate-700">Payment Mode</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {(['UPI', 'Cash', 'Card', 'Credit/Udhar'] as PaymentMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => {
                    setPaymentMode(mode);
                    if (mode === 'Credit/Udhar') {
                      setPaidAmount(0); // Udhar defaults to 0 paid
                    } else if (paidAmount === 0) {
                      setPaidAmount(grandTotal);
                    }
                  }}
                  className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                    paymentMode === mode
                      ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Paid Amount & Due Calculation */}
          <div className="space-y-3 p-4 bg-slate-50/80 rounded-2xl border border-slate-200/90 text-xs">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700">Paid Now (₹)</label>
              <input
                type="number"
                min="0"
                max={grandTotal}
                value={paidAmount}
                onChange={(e) => setPaidAmount(Math.min(grandTotal, Math.max(0, parseInt(e.target.value) || 0)))}
                className="w-28 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-right font-mono font-bold text-xs"
              />
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 font-bold">
              <span className="text-slate-600">Pending Due:</span>
              <span className={`font-mono text-sm ${dueAmount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                ₹{dueAmount.toLocaleString('en-IN')}
              </span>
            </div>

            {dueAmount > 0 && (
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 leading-tight">
                <strong>Udhar Warning:</strong> Customer will automatically be placed into <strong>Udhar Customers</strong> until this balance is settled.
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Invoice Note / Memo
            </label>
            <input
              type="text"
              placeholder="e.g. Delivery next day, partial advance"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
            />
          </div>

          {/* ONE CLICK PROCESS BUTTON */}
          <button
            type="button"
            onClick={handleProcessBill}
            disabled={items.length === 0}
            className="w-full py-3.5 rounded-xl font-bold text-white text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            style={{ backgroundColor: theme.hex }}
          >
            <Receipt className="w-4 h-4" />
            <span>Create Invoice in 1-Click</span>
          </button>
        </div>
      </div>

      {/* POPUP MODAL: Created Invoice View / Print / PDF / Share */}
      {createdInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Invoice Generated</span>
                <h3 className="text-lg font-extrabold text-slate-900 font-mono">{createdInvoice.invoiceNumber}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  createdInvoice.dueAmount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {createdInvoice.status.toUpperCase()}
                </span>
                <button
                  type="button"
                  onClick={() => setCreatedInvoice(null)}
                  className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Invoice Printable Preview Container (Issue 2) */}
            <div id="printable-invoice" className="p-5 bg-white rounded-2xl border border-slate-200 text-xs space-y-4 shadow-xs">
              
              {/* Shop & Invoice Header */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-3.5">
                <div>
                  <div className="font-extrabold text-slate-900 text-lg tracking-tight">{shop.shopName}</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    {shop.shopAddress || 'Retail & Commercial Merchant'}
                  </div>
                  <div className="text-slate-500 font-mono text-[11px]">GSTIN: {shop.gstNumber || '29ABCDE1234F1Z5'}</div>
                  <div className="text-slate-500 font-mono text-[11px]">Phone: +91 {shop.mobileNumber}</div>
                  <div className="text-blue-600 text-[11px] font-mono">https://{shop.subdomain}.zetaven.com</div>
                </div>
                <div className="text-right text-[11px] text-slate-500 space-y-0.5">
                  <div className="text-base font-extrabold text-slate-900 font-mono">TAX INVOICE</div>
                  <div className="font-bold text-slate-700 font-mono">{createdInvoice.invoiceNumber}</div>
                  <div>Date: {new Date(createdInvoice.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                  <div className="font-semibold text-slate-800">Mode: {createdInvoice.paymentMode}</div>
                  <div>
                    Status:{' '}
                    <span className={`font-bold ${createdInvoice.dueAmount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {createdInvoice.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Billed To Customer */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Billed To (Customer)</div>
                  <div className="font-bold text-slate-900 text-sm">{createdInvoice.customerName}</div>
                </div>
                {createdInvoice.customerMobile && (
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mobile</div>
                    <div className="text-slate-700 font-mono text-xs">+91 {createdInvoice.customerMobile}</div>
                  </div>
                )}
              </div>

              {/* Items Table in Modal */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] text-slate-600 font-bold uppercase border-b border-slate-200 tracking-wider">
                    <tr>
                      <th className="p-2.5">#</th>
                      <th className="p-2.5">Item Description / Service</th>
                      <th className="p-2.5 text-center">Qty</th>
                      <th className="p-2.5 text-right">Rate</th>
                      <th className="p-2.5 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {createdInvoice.items.map((it, i) => (
                      <tr key={i}>
                        <td className="p-2.5 text-slate-400 font-mono">{i + 1}</td>
                        <td className="p-2.5 font-medium text-slate-900">{it.productName}</td>
                        <td className="p-2.5 text-center font-mono">{it.quantity}</td>
                        <td className="p-2.5 text-right font-mono">₹{it.rate.toLocaleString('en-IN')}</td>
                        <td className="p-2.5 text-right font-mono font-bold text-slate-900">₹{it.total.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Summary */}
              <div className="space-y-1 text-right text-xs pt-1 border-t border-slate-100">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-mono font-bold">₹{createdInvoice.subtotal.toLocaleString('en-IN')}</span>
                </div>
                {createdInvoice.taxAmount > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>GST (5%):</span>
                    <span className="font-mono">₹{createdInvoice.taxAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {createdInvoice.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount:</span>
                    <span className="font-mono">- ₹{createdInvoice.discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-extrabold text-slate-900 border-t border-slate-200 pt-1.5">
                  <span>Grand Total:</span>
                  <span className="font-mono">₹{createdInvoice.grandTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Amount Paid:</span>
                  <span className="font-mono">₹{createdInvoice.paidAmount.toLocaleString('en-IN')}</span>
                </div>
                {createdInvoice.dueAmount > 0 && (
                  <div className="flex justify-between text-amber-700 font-bold bg-amber-50 p-2 rounded-lg mt-1">
                    <span>Balance Due:</span>
                    <span className="font-mono">₹{createdInvoice.dueAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>

              {/* Notes & Footer */}
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-end">
                <div>
                  {createdInvoice.notes ? (
                    <div><strong>Note:</strong> {createdInvoice.notes}</div>
                  ) : (
                    <div>Thank you for your business!</div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Authorized Signature</div>
                  <div className="h-6"></div>
                  <div className="border-t border-slate-300 w-28 text-center text-[10px] text-slate-400">Sign / Stamp</div>
                </div>
              </div>
            </div>

            {/* Actions: Print, PDF, WhatsApp (Issue 2) */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 no-print">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="btn-print-invoice"
                  onClick={handlePrintInvoice}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button
                  type="button"
                  id="btn-pdf-invoice"
                  onClick={handleDownloadPdf}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </button>
                <button
                  type="button"
                  id="btn-whatsapp-invoice"
                  onClick={handleShareWhatsApp}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>

              <button
                type="button"
                id="btn-done-invoice"
                onClick={() => setCreatedInvoice(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white transition-opacity shadow-xs cursor-pointer"
                style={{ backgroundColor: theme.hex }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
