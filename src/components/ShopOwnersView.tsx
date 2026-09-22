import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Globe, 
  MoreVertical, 
  Eye, 
  Edit3, 
  KeyRound, 
  Power, 
  ExternalLink, 
  Copy, 
  Check, 
  Store,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ShopOwner } from '../types';

interface ShopOwnersViewProps {
  shops: ShopOwner[];
  onOpenAddModal: () => void;
  onViewShop: (shop: ShopOwner) => void;
  onEditShop: (shop: ShopOwner) => void;
  onResetPassword: (shop: ShopOwner) => void;
  onToggleStatus: (shop: ShopOwner) => void;
  onOpenShop: (shop: ShopOwner) => void;
}

export const ShopOwnersView: React.FC<ShopOwnersViewProps> = ({
  shops,
  onOpenAddModal,
  onViewShop,
  onEditShop,
  onResetPassword,
  onToggleStatus,
  onOpenShop
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [copiedSubdomain, setCopiedSubdomain] = useState<string | null>(null);

  // Filtered and searched shops
  const filteredShops = useMemo(() => {
    return shops.filter((shop) => {
      // Status match
      if (statusFilter !== 'all' && shop.status !== statusFilter) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesShop = shop.shopName.toLowerCase().includes(query);
        const matchesOwner = shop.ownerName.toLowerCase().includes(query);
        const matchesMobile = shop.mobileNumber.includes(query);
        const matchesEmail = shop.email.toLowerCase().includes(query);
        const matchesSubdomain = shop.subdomain.toLowerCase().includes(query);
        return matchesShop || matchesOwner || matchesMobile || matchesEmail || matchesSubdomain;
      }
      return true;
    });
  }, [shops, statusFilter, searchQuery]);

  const handleCopySubdomain = (url: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`https://${url}`);
    setCopiedSubdomain(id);
    setTimeout(() => setCopiedSubdomain(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-slate-900 font-outfit tracking-tight">Shop Owners Directory</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              {filteredShops.length} Registered
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Manage merchant accounts, provision subdomains, and monitor isolated shop workspaces.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddModal}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Shop Owner</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by shop name, owner, mobile, email, or subdomain..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold self-start md:self-auto">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({shops.length})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              statusFilter === 'active'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            Active ({shops.filter(s => s.status === 'active').length})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('inactive')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              statusFilter === 'inactive'
                ? 'bg-white text-amber-800 shadow-xs'
                : 'text-slate-600 hover:text-amber-700'
            }`}
          >
            Inactive ({shops.filter(s => s.status === 'inactive').length})
          </button>
        </div>
      </div>

      {/* Main Shop Owners Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredShops.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Store className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No shop owners found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No shops match your current search query or filter. Try clearing filters or add a new shop owner.
            </p>
            <button
              type="button"
              onClick={onOpenAddModal}
              className="mt-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-xl"
            >
              + Add Shop Owner
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto min-h-[380px]">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Shop Name</th>
                  <th className="px-4 py-3.5">Owner Name</th>
                  <th className="px-4 py-3.5">Contact Details</th>
                  <th className="px-4 py-3.5">Subdomain</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Created Date</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredShops.map((shop) => {
                  const createdDateFormatted = new Date(shop.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  });

                  return (
                    <tr key={shop.id} className="hover:bg-slate-50/70 transition-colors">
                      
                      {/* 1. Shop Name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-sm text-slate-700 overflow-hidden shrink-0">
                            {shop.shopLogo ? (
                              <img src={shop.shopLogo} alt={shop.shopName} className="w-full h-full object-cover" />
                            ) : (
                              shop.shopName.substring(0, 2).toUpperCase()
                            )}
                          </div>
                          <div>
                            <span 
                              onClick={() => onViewShop(shop)}
                              className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer block"
                            >
                              {shop.shopName}
                            </span>
                            <span className="text-[11px] text-slate-500 line-clamp-1 max-w-[200px]">
                              {shop.shopAddress}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 2. Owner Name */}
                      <td className="px-4 py-4">
                        <div className="font-semibold text-slate-800 text-xs sm:text-sm">{shop.ownerName}</div>
                        {shop.panNumber && (
                          <div className="text-[11px] font-mono text-slate-400">PAN: {shop.panNumber}</div>
                        )}
                      </td>

                      {/* 3. Mobile & Email */}
                      <td className="px-4 py-4 text-xs">
                        <div className="font-mono text-slate-800 font-medium">+91 {shop.mobileNumber}</div>
                        <div className="text-slate-500 truncate max-w-[170px]">{shop.email}</div>
                      </td>

                      {/* 4. Subdomain (Visually highlighted badge) */}
                      <td className="px-4 py-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 font-mono text-xs font-semibold">
                          <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{shop.fullUrl}</span>
                          <button
                            type="button"
                            onClick={(e) => handleCopySubdomain(shop.fullUrl, shop.id, e)}
                            className="p-1 hover:bg-blue-100 rounded text-blue-700 transition-colors"
                            title="Copy Shop URL"
                          >
                            {copiedSubdomain === shop.id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* 5. Status (Highlighted Badge) */}
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                            shop.status === 'active'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              shop.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                          />
                          {shop.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      {/* 6. Created Date */}
                      <td className="px-4 py-4 text-xs text-slate-500 font-medium">
                        {createdDateFormatted}
                      </td>

                      {/* 7. Actions Menu */}
                      <td className="px-4 py-4 text-right relative">
                        <div className="inline-block text-left">
                          <button
                            type="button"
                            onClick={() => setActiveMenuId(activeMenuId === shop.id ? null : shop.id)}
                            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* Dropdown Menu */}
                          {activeMenuId === shop.id && (
                            <>
                              <div
                                className="fixed inset-0 z-20"
                                onClick={() => setActiveMenuId(null)}
                              />
                              <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 text-xs font-semibold text-slate-700 animate-in fade-in zoom-in-95 duration-150">
                                
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    onViewShop(shop);
                                  }}
                                  className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                                  <span>View Details</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    onEditShop(shop);
                                  }}
                                  className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                                  <span>Edit Shop</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    onResetPassword(shop);
                                  }}
                                  className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                                  <span>Reset Password</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    onToggleStatus(shop);
                                  }}
                                  className={`w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2 ${
                                    shop.status === 'active' ? 'text-amber-700' : 'text-emerald-700'
                                  }`}
                                >
                                  <Power className="w-3.5 h-3.5" />
                                  <span>{shop.status === 'active' ? 'Disable Account' : 'Enable Account'}</span>
                                </button>

                                <div className="border-t border-slate-100 my-1" />

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    onOpenShop(shop);
                                  }}
                                  className="w-full px-3.5 py-2 text-left hover:bg-blue-50 text-blue-700 flex items-center gap-2"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  <span>Open Shop</span>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
