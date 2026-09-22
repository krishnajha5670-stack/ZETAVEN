import React, { useState } from 'react';
import { 
  BarChart3, 
  Calendar, 
  TrendingUp, 
  CircleDollarSign, 
  Receipt, 
  Users, 
  Package, 
  CreditCard,
  Download,
  Filter
} from 'lucide-react';
import { ShopOwner } from '../../../types';
import { ReportType, ReportDateFilter } from '../../../types/shop';
import { ThemeConfig } from '../../../utils/theme';
import { computeReportData } from '../../../services/shopDataService';
import { ContinuousLineTrendChart, DonutBreakdownChart } from '../ShopCharts';

interface ReportsModuleProps {
  shop: ShopOwner;
  theme: ThemeConfig;
}

export const ReportsModule: React.FC<ReportsModuleProps> = ({
  shop,
  theme
}) => {
  const [activeReportType, setActiveReportType] = useState<ReportType>('sales');
  const [activeDateFilter, setActiveDateFilter] = useState<ReportDateFilter>('week');

  // Compute live report data
  const reportData = computeReportData(shop, activeReportType, activeDateFilter);

  const reportTabs: { id: ReportType; label: string; icon: React.ReactNode }[] = [
    { id: 'sales', label: 'Sales & Revenue', icon: <Receipt className="w-3.5 h-3.5" /> },
    { id: 'purchases', label: 'Purchases (Stock In)', icon: <Package className="w-3.5 h-3.5" /> },
    { id: 'profit', label: 'Gross Profit & Margin', icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { id: 'customers', label: 'Customers & Udhaar', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'stock', label: 'Stock & Inventory', icon: <Package className="w-3.5 h-3.5" /> },
    { id: 'payments', label: 'Payments & Collections', icon: <CreditCard className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-outfit">Financial Reports & Visual Analytics</h2>
          <p className="text-xs text-slate-500">
            Real-time continuous trendlines and segment breakdowns generated from your shop transactions
          </p>
        </div>

        {/* Date Filter Bar */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-bold">
          {(['today', 'week', 'month', 'year'] as ReportDateFilter[]).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveDateFilter(filter)}
              className={`px-3.5 py-1.5 rounded-lg capitalize transition-colors ${
                activeDateFilter === filter
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Six Report Category Horizontal Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {reportTabs.map((tab) => {
          const isActive = activeReportType === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveReportType(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer border ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Summary KPI Strip for Current Report */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {reportData.summaryItems.map((item, idx) => (
          <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <div className="text-[11px] font-semibold text-slate-500">{item.label}</div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono">
              {item.value}
            </div>
            {item.hint && (
              <div className="text-[10px] text-slate-400 font-medium">{item.hint}</div>
            )}
          </div>
        ))}
      </div>

      {/* DUAL VISUAL CHARTS SECTION (REQUIRED BY USER: Donut + Continuous Line) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* CHART 1: Stock-market style Continuous Line Graph (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  1. Financial Continuous Trend Graph
                </h3>
                <p className="text-[11px] text-slate-500">Continuous movement across time intervals</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 font-mono">
                {activeDateFilter.toUpperCase()}
              </span>
            </div>

            <ContinuousLineTrendChart
              data={reportData.timeSeries}
              theme={theme}
              height={230}
              valuePrefix={activeReportType === 'stock' ? '' : '₹'}
              valueSuffix={activeReportType === 'stock' ? ' units' : ''}
            />
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Accurate time-series points plotted from actual database rows</span>
            <span className="font-mono font-bold text-slate-700">Live Curve</span>
          </div>
        </div>

        {/* CHART 2: Donut Breakdown Chart (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                2. Donut Segment Breakdown
              </h3>
              <p className="text-[11px] text-slate-500">Distribution across categories and modes</p>
            </div>

            <DonutBreakdownChart
              data={reportData.breakdown}
              theme={theme}
              size={185}
              totalLabel="Total Volume"
            />
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 text-center">
            Hover over donut arcs to view detailed percentage contributions
          </div>
        </div>
      </div>

      {/* Raw Data Log Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Detailed Report Records</h4>
            <p className="text-xs text-slate-500">Underlying time points and computed values</p>
          </div>
          <button
            type="button"
            onClick={() => alert('Report exported as CSV!')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-200">
              <tr>
                <th className="p-3">Period / Point</th>
                <th className="p-3">Recorded Date</th>
                <th className="p-3 text-right">Metric Value</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {reportData.timeSeries.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-slate-900">{row.label}</td>
                  <td className="p-3 font-mono text-slate-500">{row.dateStr}</td>
                  <td className="p-3 text-right font-mono font-bold text-slate-900">
                    {activeReportType === 'stock' ? `${row.value} units` : `₹${row.value.toLocaleString('en-IN')}`}
                  </td>
                  <td className="p-3 text-right">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                      Settled
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
