import React, { useMemo } from 'react';
import { 
  Users, 
  Store, 
  CheckCircle2, 
  Clock, 
  Plus, 
  ArrowUpRight, 
  Globe, 
  ShieldCheck, 
  Activity, 
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { ShopOwner, DashboardStats, ActivityItem } from '../types';

interface DashboardViewProps {
  shops: ShopOwner[];
  stats: DashboardStats;
  activities: ActivityItem[];
  onOpenAddModal: () => void;
  onNavigateToShops: () => void;
  onViewShop: (shop: ShopOwner) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  shops,
  stats,
  activities,
  onOpenAddModal,
  onNavigateToShops,
  onViewShop
}) => {

  // Monthly registration breakdown derived from actual shops data
  const monthlyData = useMemo(() => {
    const months = ['Jul', 'Aug', 'Sep', 'Oct'];
    const counts: { [key: string]: number } = { Jul: 0, Aug: 0, Sep: 0, Oct: 0 };
    
    shops.forEach(shop => {
      try {
        const d = new Date(shop.createdAt);
        const m = d.toLocaleString('default', { month: 'short' });
        if (counts[m] !== undefined) {
          counts[m]++;
        } else {
          counts['Sep'] = (counts['Sep'] || 0) + 1;
        }
      } catch {
        counts['Sep']++;
      }
    });

    const maxVal = Math.max(...Object.values(counts), 1);
    return months.map(m => ({
      month: m,
      count: counts[m],
      heightPct: Math.max(12, Math.round((counts[m] / maxVal) * 100))
    }));
  }, [shops]);

  // Status breakdown percentages
  const activePercent = stats.totalShopOwners > 0 
    ? Math.round((stats.activeShops / stats.totalShopOwners) * 100) 
    : 0;
  const inactivePercent = 100 - activePercent;

  // Recent 4 shops
  const recentShops = useMemo(() => {
    return [...shops].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4);
  }, [shops]);

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Welcome Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-outfit tracking-tight">
            Zetaven Admin Central
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Real-time management for all tenant shops, dedicated subdomains, and isolated workspaces.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenAddModal}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Shop Owner</span>
          </button>
        </div>
      </div>

      {/* 4 SUMMARY STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Shop Owners */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Shop Owners
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900 font-outfit">{stats.totalShopOwners}</div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Registered accounts</span>
            </div>
          </div>
        </div>

        {/* Card 2: Active Shops */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Shops
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-emerald-600 font-outfit">{stats.activeShops}</div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-1">
              <Globe className="w-3.5 h-3.5 text-emerald-500" />
              <span>{activePercent}% of total running</span>
            </div>
          </div>
        </div>

        {/* Card 3: Inactive Shops */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Inactive Shops
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-amber-600 font-outfit">{stats.inactiveShops}</div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-1">
              <span>{inactivePercent}% paused/disabled</span>
            </div>
          </div>
        </div>

        {/* Card 4: Recently Added Shops */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Recently Added Shops
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-indigo-900 font-outfit">{stats.recentlyAddedShops}</div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-1">
              <span>Added in last 30 days</span>
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS & ANALYTICS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Onboarding Growth Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-outfit">Shop Onboarding & Registration</h3>
              <p className="text-xs text-slate-500">Monthly new shop accounts provisioned on Zetaven</p>
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
              Live Database Data
            </span>
          </div>

          {/* SVG Bar Chart Visualization */}
          <div className="h-56 flex items-end justify-between gap-6 pt-6 px-4 pb-2 border-b border-slate-100">
            {monthlyData.map((item) => (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div className="text-xs font-bold text-slate-600 group-hover:text-blue-600 transition-colors">
                  {item.count} {item.count === 1 ? 'shop' : 'shops'}
                </div>
                <div className="w-full max-w-[56px] bg-slate-100 group-hover:bg-blue-100 rounded-t-xl transition-all relative overflow-hidden flex items-end justify-center" style={{ height: `${item.heightPct}%` }}>
                  <div className="w-full bg-blue-600 group-hover:bg-blue-700 transition-all rounded-t-xl h-full shadow-xs" />
                </div>
                <span className="text-xs font-medium text-slate-500">{item.month} 2026</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span>All registered shops on platform</span>
            </div>
            <span className="font-semibold text-slate-700">Total: {stats.totalShopOwners} shops</span>
          </div>
        </div>

        {/* Status Distribution & Tenant Security Card */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-outfit">Platform Status Ratio</h3>
            <p className="text-xs text-slate-500">Operational active vs disabled shops</p>

            {/* Visual ratio bar */}
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-emerald-700">Active: {activePercent}%</span>
                <span className="text-amber-700">Inactive: {inactivePercent}%</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div style={{ width: `${activePercent}%` }} className="bg-emerald-500 h-full transition-all" />
                <div style={{ width: `${inactivePercent}%` }} className="bg-amber-400 h-full transition-all" />
              </div>
            </div>

            {/* Status counts */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                <div className="text-[11px] text-emerald-800 font-medium">Active Subdomains</div>
                <div className="text-xl font-bold text-emerald-950 mt-0.5">{stats.activeShops}</div>
              </div>
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100">
                <div className="text-[11px] text-amber-800 font-medium">Inactive Shops</div>
                <div className="text-xl font-bold text-amber-950 mt-0.5">{stats.inactiveShops}</div>
              </div>
            </div>
          </div>

          {/* Data Separation Highlight */}
          <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Multi-Tenant Workspace Security</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Every shop owner operates within an isolated tenant workspace. Business data, invoices, and customers are partitioned strictly by tenant ID.
            </p>
          </div>
        </div>
      </div>

      {/* RECENT SHOPS & AUDIT FEED */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Shop Owners table preview */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-outfit">Recent Shop Owners</h3>
              <p className="text-xs text-slate-500">Latest accounts onboarded on Zetaven</p>
            </div>
            <button
              type="button"
              onClick={onNavigateToShops}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>View All Shops</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3">Shop & Subdomain</th>
                  <th className="px-4 py-3">Owner</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentShops.map((shop) => (
                  <tr key={shop.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 shrink-0 overflow-hidden">
                          {shop.shopLogo ? (
                            <img src={shop.shopLogo} alt={shop.shopName} className="w-full h-full object-cover" />
                          ) : (
                            shop.shopName.substring(0, 2).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 text-xs sm:text-sm">{shop.shopName}</div>
                          <div className="text-xs font-mono text-blue-600 flex items-center gap-1">
                            <span>{shop.fullUrl}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-xs text-slate-700">
                      <div className="font-medium text-slate-900">{shop.ownerName}</div>
                      <div className="text-slate-400 font-mono text-[11px]">+91 {shop.mobileNumber}</div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          shop.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${shop.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {shop.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => onViewShop(shop)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Log Feed */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 font-outfit">System Activity Log</h3>
              </div>
              <span className="text-[11px] text-slate-400">Real-time</span>
            </div>

            <div className="mt-3 space-y-3">
              {activities.slice(0, 4).map((act) => (
                <div key={act.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <div className="flex items-center justify-between font-semibold text-slate-800">
                    <span>{act.title}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {new Date(act.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-0.5 text-[11px]">{act.description}</p>
                  <div className="mt-1 font-mono text-[10px] text-blue-600">
                    {act.subdomain}.zetaven.com
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <span className="text-xs text-slate-400 font-medium">All tenant activities are securely logged</span>
          </div>
        </div>
      </div>
    </div>
  );
};
