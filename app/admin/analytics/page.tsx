'use client';

import { useState, useEffect } from 'react';
import {
    Users, MousePointerClick, ShoppingBag, CreditCard,
    ArrowUpRight, ArrowDownRight, Activity, Percent, Filter
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    BarChart, Bar
} from 'recharts';
import Link from 'next/link';

interface TrendData {
    value: number;
    isPositive: boolean;
}

interface AnalyticsData {
    current: {
        visitors: number;
        pageViews: number;
        productViews: number;
        addToCarts: number;
        checkouts: number;
        purchases: number;
        bounceRate: number;
        conversionRate: number;
    };
    trends: {
        visitors: TrendData;
        addToCarts: TrendData;
        bounceRate: TrendData;
        conversionRate: TrendData;
    };
    chartData: { date: string; visitors: number; views: number }[];
    topProducts: { id: string; name: string; views: number; addToCarts: number }[];
}

const periods = [
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'Last 7 Days', value: '7days' },
    { label: 'Last 30 Days', value: '30days' },
];

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [period, setPeriod] = useState('7days');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        let interval: NodeJS.Timeout;

        async function fetchAnalytics(isInitial = false) {
            if (isInitial) setLoading(true);
            try {
                const res = await fetch(`/api/admin/analytics?period=${period}`);
                if (res.ok) {
                    const json = await res.json();
                    if (isMounted) setData(json);
                }
            } catch (error) {
                console.error('Failed to fetch analytics', error);
            } finally {
                if (isMounted && isInitial) setLoading(false);
            }
        }

        fetchAnalytics(true);

        // Poll every 10 seconds for real-time updates
        interval = setInterval(() => {
            if (isMounted) fetchAnalytics(false);
        }, 10000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [period]);

    const renderTrend = (trend: TrendData, suffix = '%') => {
        const colorClass = trend.isPositive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
        const Icon = trend.isPositive ? ArrowUpRight : ArrowDownRight;
        return (
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colorClass}`}>
                <Icon className="w-3 h-3 mr-1" />
                {trend.value}{suffix} vs previous
            </span>
        );
    };

    if (loading && !data) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#284E3D]"></div>
            </div>
        );
    }

    if (!data) return <div>Failed to load data</div>;

    const summaryCards = [
        { title: 'Unique Visitors', value: data.current.visitors, icon: Users, trend: data.trends.visitors },
        { title: 'Bounce Rate', value: `${data.current.bounceRate}%`, icon: Activity, trend: data.trends.bounceRate },
        { title: 'Added to Cart', value: data.current.addToCarts, icon: ShoppingBag, trend: data.trends.addToCarts },
        { title: 'Conversion Rate', value: `${data.current.conversionRate}%`, icon: Percent, trend: data.trends.conversionRate },
    ];

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header & Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                    <p className="text-gray-500 mt-1">Detailed performance and customer behavior</p>
                </div>
                <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
                    <div className="px-3 text-sm font-medium text-gray-500 border-r border-gray-200 flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Live
                    </div>
                    {periods.map(p => (
                        <button
                            key={p.value}
                            onClick={() => setPeriod(p.value)}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${period === p.value
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {loading && (
                <div className="w-full h-1 bg-gray-100 overflow-hidden rounded-full absolute top-0 left-0">
                    <div className="h-full bg-[#284E3D] animate-pulse w-1/3"></div>
                </div>
            )}

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {summaryCards.map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div className="p-2 bg-gray-50 rounded-lg">
                                    <Icon className="w-5 h-5 text-gray-700" />
                                </div>
                                {renderTrend(card.trend)}
                            </div>
                            <div className="mt-4">
                                <h3 className="text-3xl font-black text-gray-900">{card.value}</h3>
                                <p className="text-sm font-medium text-gray-500 mt-1">{card.title}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Traffic Trend */}
                <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Traffic & Views Trend</h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#284E3D" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#284E3D" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                                <RechartsTooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="views" name="Page Views" stroke="#284E3D" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                                <Area type="monotone" dataKey="visitors" name="Unique Visitors" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorVisitors)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* E-commerce Funnel */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Conversion Funnel</h2>
                    <div className="flex-1 flex flex-col justify-between">
                        {[
                            { label: 'Site Visitors', value: data.current.visitors, color: 'bg-blue-100 text-blue-800' },
                            { label: 'Product Views', value: data.current.productViews, color: 'bg-indigo-100 text-indigo-800' },
                            { label: 'Added to Cart', value: data.current.addToCarts, color: 'bg-yellow-100 text-yellow-800' },
                            { label: 'Checkout Started', value: data.current.checkouts, color: 'bg-orange-100 text-orange-800' },
                            { label: 'Purchased', value: data.current.purchases, color: 'bg-green-100 text-green-800' },
                        ].map((step, i, arr) => {
                            const percentOfTotal = arr[0].value > 0 ? (step.value / arr[0].value) * 100 : 0;
                            return (
                                <div key={step.label} className="relative flex items-center mb-4 last:mb-0">
                                    <div className="flex-1 z-10 flex justify-between items-center py-2 relative">
                                        <span className="text-sm font-semibold text-gray-700 z-10 drop-shadow-sm">{step.label}</span>
                                        <div className="flex items-center gap-3 z-10">
                                            <span className="font-bold text-gray-900">{step.value}</span>
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${step.color} min-w-[3rem] text-center`}>
                                                {Math.round(percentOfTotal)}%
                                            </span>
                                        </div>
                                    </div>
                                    {/* Progress Background */}
                                    <div
                                        className="absolute left-0 top-0 h-full bg-gray-50 rounded"
                                        style={{ width: `${Math.max(percentOfTotal, 5)}%`, transition: 'width 1s ease-in-out' }}
                                    ></div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>

            {/* Bottom Section: Top Products */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Top Performing Products</h2>
                    <p className="text-sm text-gray-500">Most viewed and interacted products in this period</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-4 rounded-tl-lg">Product Name</th>
                                <th className="px-6 py-4">Total Views</th>
                                <th className="px-6 py-4 text-right">Add to Carts</th>
                                <th className="px-6 py-4 text-right rounded-tr-lg">Cart Rate</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.topProducts.map((product) => {
                                const cartRate = product.views > 0 ? (product.addToCarts / product.views) * 100 : 0;
                                return (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{product.views}</td>
                                        <td className="px-6 py-4 text-right font-medium text-gray-900">{product.addToCarts}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <span className="text-gray-600">{Math.round(cartRate)}%</span>
                                                <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-500 rounded-full"
                                                        style={{ width: `${cartRate}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                            {data.topProducts.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        No product data for this period.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
