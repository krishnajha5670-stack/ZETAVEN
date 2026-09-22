import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  Minus, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpDown, 
  Layers, 
  Tag, 
  TrendingUp,
  Boxes
} from 'lucide-react';
import { ShopOwner } from '../../../types';
import { ProductItem } from '../../../types/shop';
import { ThemeConfig } from '../../../utils/theme';
import { 
  getShopDataStore, 
  saveProduct, 
  updateProductStock 
} from '../../../services/shopDataService';

interface ProductsModuleProps {
  shop: ShopOwner;
  theme: ThemeConfig;
}

export const ProductsModule: React.FC<ProductsModuleProps> = ({
  shop,
  theme
}) => {
  const store = getShopDataStore(shop);
  const [activeTab, setActiveTab] = useState<'all' | 'low'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Add/Edit Product Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  // Form State
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('Groceries');
  const [prodPurchasePrice, setProdPurchasePrice] = useState(100);
  const [prodSellingPrice, setProdSellingPrice] = useState(120);
  const [prodStock, setProdStock] = useState(25);
  const [prodMinStock, setProdMinStock] = useState(5);
  const [prodUnit, setProdUnit] = useState('unit');

  // Success Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Categories list
  const categories = Array.from(new Set(store.products.map(p => p.category)));

  // Filter products
  const filteredProducts = store.products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (activeTab === 'low') return p.stock <= p.minStockLevel;
    return true;
  });

  const lowStockProducts = store.products.filter(p => p.stock <= p.minStockLevel);
  const totalStockUnits = store.products.reduce((acc, p) => acc + p.stock, 0);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setProdName('');
    setProdCategory(categories[0] || 'General');
    setProdPurchasePrice(100);
    setProdSellingPrice(130);
    setProdStock(20);
    setProdMinStock(5);
    setProdUnit('unit');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: ProductItem) => {
    setEditingProduct(product);
    setProdName(product.name);
    setProdCategory(product.category);
    setProdPurchasePrice(product.purchasePrice);
    setProdSellingPrice(product.sellingPrice);
    setProdStock(product.stock);
    setProdMinStock(product.minStockLevel);
    setProdUnit(product.unit || 'unit');
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    saveProduct(
      shop,
      {
        name: prodName.trim(),
        category: prodCategory.trim(),
        purchasePrice: prodPurchasePrice,
        sellingPrice: prodSellingPrice,
        stock: prodStock,
        minStockLevel: prodMinStock,
        unit: prodUnit
      },
      editingProduct ? editingProduct.id : undefined
    );

    setIsModalOpen(false);
    setToastMessage(editingProduct ? 'Product updated successfully!' : 'New product created in catalog!');
  };

  const handleQuickStockAdjustment = (productId: string, delta: number) => {
    updateProductStock(shop, productId, delta);
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

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-outfit">Products & Stock Inventory</h2>
          <p className="text-xs text-slate-500">
            Real-time stock deduction on sales, automatic restocking on purchases, and low inventory alarms
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl font-bold text-white text-xs shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
          style={{ backgroundColor: theme.hex }}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500">Total Products in Catalog</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {store.products.length} Items
          </div>
          <div className="text-[11px] text-slate-400">Unique SKUs active</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500">Total Units in Stock</div>
          <div className="text-2xl font-extrabold text-blue-600 font-mono">
            {totalStockUnits.toLocaleString('en-IN')} Units
          </div>
          <div className="text-[11px] text-blue-500 font-medium">Physical inventory</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500">Low Stock Warnings</div>
          <div className="text-2xl font-extrabold text-red-600 font-mono">
            {lowStockProducts.length} Items
          </div>
          <div className="text-[11px] text-red-500 font-medium">Below reorder threshold</div>
        </div>
      </div>

      {/* Filter and Tab Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Tab switch */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors ${
                activeTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              All Products ({store.products.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('low')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'low' ? 'bg-white text-red-600 shadow-xs font-extrabold' : 'text-slate-500'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
              <span>Low Stock Alert ({lowStockProducts.length})</span>
            </button>
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:bg-white transition-all"
            style={{ '--tw-ring-color': theme.hex } as React.CSSProperties}
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-200">
              <tr>
                <th className="p-4">Product Name & Category</th>
                <th className="p-4 text-right">Purchase Price</th>
                <th className="p-4 text-right">Selling Price</th>
                <th className="p-4 text-center">Gross Margin</th>
                <th className="p-4 text-center">Available Stock</th>
                <th className="p-4 text-center">Quick Adjust</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    No products found. Add a product or clear search filter.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isLow = p.stock <= p.minStockLevel;
                  const marginPercent = Math.round(((p.sellingPrice - p.purchasePrice) / p.sellingPrice) * 100);

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-slate-900 text-sm">{p.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                            {p.category}
                          </span>
                          {p.unit && (
                            <span className="text-[11px] text-slate-400 font-mono">
                              Unit: {p.unit}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-4 text-right font-mono text-slate-500">
                        ₹{p.purchasePrice.toLocaleString('en-IN')}
                      </td>

                      <td className="p-4 text-right font-mono font-bold text-slate-900 text-sm">
                        ₹{p.sellingPrice.toLocaleString('en-IN')}
                      </td>

                      <td className="p-4 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          marginPercent >= 20 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                        }`}>
                          +{marginPercent}%
                        </span>
                      </td>

                      <td className="p-4 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <span className={`font-mono font-extrabold text-sm ${isLow ? 'text-red-600' : 'text-slate-900'}`}>
                            {p.stock}
                          </span>
                          {isLow && (
                            <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded">
                              LOW
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-4 text-center">
                        <div className="inline-flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                          <button
                            type="button"
                            onClick={() => handleQuickStockAdjustment(p.id, -1)}
                            className="p-1 hover:bg-white rounded text-slate-600 hover:text-slate-900 transition-colors"
                            title="Stock Out (-1)"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 font-mono text-[11px] font-bold text-slate-700">
                            {p.stock}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuickStockAdjustment(p.id, 1)}
                            className="p-1 hover:bg-white rounded text-slate-600 hover:text-slate-900 transition-colors"
                            title="Stock In (+1)"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(p)}
                          className="px-2.5 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg font-semibold transition-colors"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Add / Edit Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingProduct ? 'Edit Catalog Product' : 'Add New Product'}
              </h3>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Product Name / Description (Free Text) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aashirvaad Superior MP Sharbati Atta (10kg)"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-600">Category</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Groceries"
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-600">Unit (kg, pkt, jar)</label>
                  <input
                    type="text"
                    placeholder="e.g. bag, unit, pkt"
                    value={prodUnit}
                    onChange={(e) => setProdUnit(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-600">Purchase Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={prodPurchasePrice}
                    onChange={(e) => setProdPurchasePrice(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Selling Price (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={prodSellingPrice}
                    onChange={(e) => setProdSellingPrice(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Initial Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={prodStock}
                    onChange={(e) => setProdStock(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-600">Low Stock Alert Level</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={prodMinStock}
                    onChange={(e) => setProdMinStock(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl font-bold text-white shadow-sm"
                  style={{ backgroundColor: theme.hex }}
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
