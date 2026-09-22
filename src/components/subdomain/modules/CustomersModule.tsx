import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  CircleDollarSign, 
  Receipt, 
  Clock, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  ArrowRight
} from 'lucide-react';
import { ShopOwner } from '../../../types';
import { CustomerItem, PaymentMode } from '../../../types/shop';
import { ThemeConfig } from '../../../utils/theme';
import { 
  getShopDataStore, 
  saveCustomer, 
  receiveCustomerPayment 
} from '../../../services/shopDataService';

interface CustomersModuleProps {
  shop: ShopOwner;
  theme: ThemeConfig;
  onSelectCustomerForBill: (customerId: string) => void;
}

export const CustomersModule: React.FC<CustomersModuleProps> = ({
  shop,
  theme,
  onSelectCustomerForBill
}) => {
  const store = getShopDataStore(shop);
  const [activeTab, setActiveTab] = useState<'all' | 'general' | 'udhar'>('udhar');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustMobile, setNewCustMobile] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');

  // Payment Settlement Modal
  const [settlingCustomer, setSettlingCustomer] = useState<CustomerItem | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('UPI');
  const [paymentNotes, setPaymentNotes] = useState('');

  // View Customer Ledger
  const [viewingCustomer, setViewingCustomer] = useState<CustomerItem | null>(null);

  // Success Toast
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Filter customers
  const filteredCustomers = store.customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.mobile.includes(searchTerm);
    if (!matchesSearch) return false;
    if (activeTab === 'general') return c.status === 'general' && c.totalDue === 0;
    if (activeTab === 'udhar') return c.status === 'udhar' || c.totalDue > 0;
    return true;
  });

  const udharCount = store.customers.filter(c => c.totalDue > 0).length;
  const generalCount = store.customers.filter(c => c.totalDue === 0).length;
  const totalUdharOutstanding = store.customers.reduce((acc, c) => acc + c.totalDue, 0);

  const handleAddCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim() || !newCustMobile.trim()) return;

    saveCustomer(shop, {
      name: newCustName.trim(),
      mobile: newCustMobile.trim(),
      address: newCustAddress.trim()
    });

    setIsAddCustomerOpen(false);
    setNewCustName('');
    setNewCustMobile('');
    setNewCustAddress('');
    setSuccessToast('New customer added successfully!');
  };

  const handleOpenReceivePayment = (customer: CustomerItem) => {
    setSettlingCustomer(customer);
    setPaymentAmount(customer.totalDue);
    setPaymentMode('UPI');
    setPaymentNotes('');
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settlingCustomer || paymentAmount <= 0) return;

    const result = receiveCustomerPayment(
      shop, 
      settlingCustomer.id, 
      paymentAmount, 
      paymentMode, 
      paymentNotes
    );

    if (result.success) {
      const remaining = settlingCustomer.totalDue - paymentAmount;
      if (remaining <= 0) {
        setSuccessToast(`Payment of ₹${paymentAmount} recorded! All dues cleared. Customer moved to General Customers.`);
      } else {
        setSuccessToast(`Payment of ₹${paymentAmount} recorded! Remaining balance: ₹${remaining}.`);
      }
      setSettlingCustomer(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
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

      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-outfit">Customers & Udhar Book</h2>
          <p className="text-xs text-slate-500">
            Intelligent customer ledger with auto-classification based on outstanding due
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAddCustomerOpen(true)}
            className="px-4 py-2.5 rounded-xl font-bold text-white text-xs shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
            style={{ backgroundColor: theme.hex }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Customer</span>
          </button>
        </div>
      </div>

      {/* Udhar Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500">Total Udhar Outstanding</div>
          <div className="text-2xl font-extrabold text-amber-600 font-mono">
            ₹{totalUdharOutstanding.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400">Total balance to collect</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500">Udhar Customers (Due &gt; 0)</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {udharCount} Accounts
          </div>
          <div className="text-[11px] text-amber-600 font-medium">Automatic balance tracking</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500">General Customers (Settled)</div>
          <div className="text-2xl font-extrabold text-emerald-600 font-mono">
            {generalCount} Accounts
          </div>
          <div className="text-[11px] text-emerald-600 font-medium">Dues completely cleared</div>
        </div>
      </div>

      {/* Tabs & Search Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Category Switcher Tabs */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-bold w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('udhar')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'udhar'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Udhar Customers</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-600 text-white">
              {udharCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'general'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>General Customers</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-700 text-white">
              {generalCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({store.customers.length})
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:bg-white transition-all"
            style={{ '--tw-ring-color': theme.hex } as React.CSSProperties}
          />
        </div>
      </div>

      {/* Customer List Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-200">
              <tr>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Address / Area</th>
                <th className="p-4 text-right">Lifetime Spent</th>
                <th className="p-4 text-right">Current Due</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400">
                    No customers found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => {
                  const isUdhar = cust.totalDue > 0;
                  return (
                    <tr key={cust.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-slate-900 text-sm">{cust.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>+91 {cust.mobile}</span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-500 max-w-xs truncate">
                        {cust.address ? (
                          <div className="flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{cust.address}</span>
                          </div>
                        ) : (
                          <span className="text-slate-300 italic">No address on file</span>
                        )}
                      </td>
                      <td className="p-4 text-right font-mono font-semibold text-slate-900">
                        ₹{cust.totalSpent.toLocaleString('en-IN')}
                      </td>
                      <td className="p-4 text-right">
                        <span className={`font-mono font-bold text-sm ${isUdhar ? 'text-amber-600' : 'text-slate-400'}`}>
                          ₹{cust.totalDue.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {isUdhar ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            <span>Udhar Account</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>General (Settled)</span>
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isUdhar && (
                            <button
                              type="button"
                              onClick={() => handleOpenReceivePayment(cust)}
                              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <CircleDollarSign className="w-3 h-3" />
                              <span>Receive Pay</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => onSelectCustomerForBill(cust.id)}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Receipt className="w-3 h-3" />
                            <span>+ Bill</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setViewingCustomer(cust)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900"
                            title="View Transaction History"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Receive Payment */}
      {settlingCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Receive Customer Payment</h3>
                <p className="text-xs text-slate-500">Record cash or digital payment against balance</p>
              </div>
              <button 
                type="button" 
                onClick={() => setSettlingCustomer(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200/80 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-slate-900">{settlingCustomer.name}</div>
                <div className="text-slate-500 font-mono">+91 {settlingCustomer.mobile}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-amber-800 uppercase font-bold">Total Due</div>
                <div className="font-mono font-extrabold text-amber-700 text-base">
                  ₹{settlingCustomer.totalDue.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <form onSubmit={handleConfirmPayment} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Amount Received (₹)</label>
                <input
                  type="number"
                  required
                  min="1"
                  max={settlingCustomer.totalDue}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Math.min(settlingCustomer.totalDue, Math.max(1, parseInt(e.target.value) || 0)))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-mono font-bold text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Payment Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['UPI', 'Cash', 'Card'] as PaymentMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPaymentMode(mode)}
                      className={`p-2 rounded-xl border text-center font-bold transition-all ${
                        paymentMode === mode
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-slate-600">Notes / Receipt Reference</label>
                <input
                  type="text"
                  placeholder="e.g. Settle grocery dues via GPay"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600">
                <strong>Auto-rule:</strong> When the remaining due becomes 0, <strong>{settlingCustomer.name}</strong> will automatically return to <strong>General Customers</strong>.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSettlingCustomer(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md transition-colors"
                >
                  Confirm Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Customer */}
      {isAddCustomerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add New Customer</h3>
              <button 
                type="button" 
                onClick={() => setIsAddCustomerOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomerSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Mobile Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 9876543210"
                  value={newCustMobile}
                  onChange={(e) => setNewCustMobile(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-slate-600">Address / Location</label>
                <input
                  type="text"
                  placeholder="e.g. 4th Cross, Malleshwaram"
                  value={newCustAddress}
                  onChange={(e) => setNewCustAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddCustomerOpen(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl font-bold text-white shadow-sm"
                  style={{ backgroundColor: theme.hex }}
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Customer Transaction History Ledger */}
      {viewingCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">{viewingCustomer.name}</h3>
                <p className="text-xs text-slate-500 font-mono">+91 {viewingCustomer.mobile}</p>
              </div>
              <button 
                type="button" 
                onClick={() => setViewingCustomer(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="text-slate-400 font-semibold text-[10px]">LIFETIME SPENT</div>
                <div className="font-extrabold text-slate-900 font-mono text-base">₹{viewingCustomer.totalSpent}</div>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl">
                <div className="text-amber-800 font-semibold text-[10px]">CURRENT OUTSTANDING</div>
                <div className="font-extrabold text-amber-700 font-mono text-base">₹{viewingCustomer.totalDue}</div>
              </div>
            </div>

            {/* Invoices list */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700">Past Invoices & Receipts:</div>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                {store.bills
                  .filter(b => b.customerId === viewingCustomer.id || b.customerName === viewingCustomer.name)
                  .map((b) => (
                    <div key={b.id} className="p-3 flex items-center justify-between hover:bg-slate-50">
                      <div>
                        <div className="font-mono font-bold text-slate-900">{b.invoiceNumber}</div>
                        <div className="text-[10px] text-slate-400">{new Date(b.date).toLocaleDateString()} • {b.paymentMode}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-slate-900">₹{b.grandTotal}</div>
                        <span className={`text-[10px] font-bold ${b.dueAmount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {b.dueAmount > 0 ? `Due: ₹${b.dueAmount}` : 'Paid In Full'}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setViewingCustomer(null)}
              className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
            >
              Close Ledger
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
