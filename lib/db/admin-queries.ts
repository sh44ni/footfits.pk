import { db } from '@/lib/db';
import { products, orders, customers, vouchers, sliders, admin_users, settings, analytics_events } from '@/lib/db/schema';
import { eq, desc, asc, ilike, and, sql, count, sum } from 'drizzle-orm';
import type { Product, Slider } from '@/types';

// ============== DASHBOARD ==============

export async function getDashboardStats() {
    try {
        const [productCount] = await db.select({ count: count() }).from(products).where(eq(products.status, 'active'));
        const [orderCount] = await db.select({ count: count() }).from(orders);
        const [revenueResult] = await db.select({ total: sum(orders.total) }).from(orders).where(eq(orders.status, 'delivered'));
        const [pendingCount] = await db.select({ count: count() }).from(orders).where(eq(orders.status, 'pending'));

        return {
            totalProducts: productCount?.count ?? 0,
            totalOrders: orderCount?.count ?? 0,
            totalRevenue: Number(revenueResult?.total ?? 0),
            pendingOrders: pendingCount?.count ?? 0,
        };
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return { totalProducts: 0, totalOrders: 0, totalRevenue: 0, pendingOrders: 0 };
    }
}

export async function getAnalyticsStats() {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // This requires importing `analytics_events` at the top of the file. We'll do that in another pass or rely on Drizzle's direct table access if it's already there (it's not).
        // Let's import it first in the next step, for now just returning default 0s if it fails
        const [pageViews] = await db
            .select({ count: count() })
            .from(analytics_events)
            .where(eq(analytics_events.event_type, 'page_view'));

        const [addToCarts] = await db
            .select({ count: count() })
            .from(analytics_events)
            .where(eq(analytics_events.event_type, 'add_to_cart'));

        // Count unique sessions for today
        const uniqueVisitorsQuery = await db.execute(sql`
            SELECT COUNT(DISTINCT session_id) as count 
            FROM analytics_events 
            WHERE created_at >= ${today.toISOString()}
        `);

        const visitorsToday = Number(uniqueVisitorsQuery.rows?.[0]?.count || 0);

        return {
            totalPageViews: pageViews?.count ?? 0,
            totalAddToCarts: addToCarts?.count ?? 0,
            visitorsToday,
        };
    } catch (error) {
        console.error('Error fetching analytics stats:', error);
        return { totalPageViews: 0, totalAddToCarts: 0, visitorsToday: 0 };
    }
}

export async function getAdvancedAnalytics(period: 'today' | 'yesterday' | '7days' | '30days' = '7days') {
    try {
        const now = new Date();
        let startDate = new Date();
        let previousStartDate = new Date();
        let previousEndDate = new Date();

        if (period === 'today') {
            startDate.setHours(0, 0, 0, 0);
            previousStartDate.setDate(now.getDate() - 1);
            previousStartDate.setHours(0, 0, 0, 0);
            previousEndDate.setDate(now.getDate() - 1);
            previousEndDate.setHours(23, 59, 59, 999);
        } else if (period === 'yesterday') {
            startDate.setDate(now.getDate() - 1);
            startDate.setHours(0, 0, 0, 0);
            now.setDate(now.getDate() - 1);
            now.setHours(23, 59, 59, 999);

            previousStartDate.setDate(startDate.getDate() - 1);
            previousStartDate.setHours(0, 0, 0, 0);
            previousEndDate.setDate(startDate.getDate() - 1);
            previousEndDate.setHours(23, 59, 59, 999);
        } else if (period === '7days') {
            startDate.setDate(now.getDate() - 7);
            previousStartDate.setDate(now.getDate() - 14);
            previousEndDate.setDate(now.getDate() - 7);
        } else if (period === '30days') {
            startDate.setDate(now.getDate() - 30);
            previousStartDate.setDate(now.getDate() - 60);
            previousEndDate.setDate(now.getDate() - 30);
        }

        const startIso = startDate.toISOString();
        const endIso = now.toISOString();
        const prevStartIso = previousStartDate.toISOString();
        const prevEndIso = previousEndDate.toISOString();

        // 1. Current Period Stats (Funnel)
        const currentStatsQuery = await db.execute(sql`
            WITH session_counts AS (
                SELECT session_id, COUNT(*) as event_count
                FROM analytics_events
                WHERE created_at BETWEEN ${startIso} AND ${endIso}
                GROUP BY session_id
            )
            SELECT 
                COUNT(DISTINCT a.session_id) as visitors,
                SUM(CASE WHEN a.event_type = 'page_view' THEN 1 ELSE 0 END) as page_views,
                SUM(CASE WHEN a.event_type = 'product_view' THEN 1 ELSE 0 END) as product_views,
                SUM(CASE WHEN a.event_type = 'add_to_cart' THEN 1 ELSE 0 END) as add_to_carts,
                SUM(CASE WHEN a.event_type = 'checkout_started' THEN 1 ELSE 0 END) as checkouts,
                SUM(CASE WHEN a.event_type = 'purchase' THEN 1 ELSE 0 END) as purchases,
                (SELECT COUNT(*) FROM session_counts WHERE event_count = 1) as bounced_sessions
            FROM analytics_events a
            WHERE a.created_at BETWEEN ${startIso} AND ${endIso}
        `);

        // 2. Previous Period Stats (for comparative trend)
        const prevStatsQuery = await db.execute(sql`
            WITH session_counts AS (
                SELECT session_id, COUNT(*) as event_count
                FROM analytics_events
                WHERE created_at BETWEEN ${prevStartIso} AND ${prevEndIso}
                GROUP BY session_id
            )
            SELECT 
                COUNT(DISTINCT a.session_id) as visitors,
                SUM(CASE WHEN a.event_type = 'add_to_cart' THEN 1 ELSE 0 END) as add_to_carts,
                SUM(CASE WHEN a.event_type = 'purchase' THEN 1 ELSE 0 END) as purchases,
                (SELECT COUNT(*) FROM session_counts WHERE event_count = 1) as bounced_sessions
            FROM analytics_events a
            WHERE a.created_at BETWEEN ${prevStartIso} AND ${prevEndIso}
        `);

        // 3. Traffic Trend (Daily aggregate for the chart)
        const trendQuery = await db.execute(sql`
            SELECT 
                DATE(created_at) as date,
                COUNT(DISTINCT session_id) as visitors,
                COUNT(*) as views
            FROM analytics_events
            WHERE created_at BETWEEN ${startIso} AND ${endIso}
            AND event_type IN ('page_view', 'product_view')
            GROUP BY DATE(created_at)
            ORDER BY DATE(created_at) ASC
        `);

        // 4. Top Products
        const topProductsQuery = await db.execute(sql`
            SELECT 
                p.id, 
                p.name, 
                p.slug,
                SUM(CASE WHEN a.event_type = 'product_view' THEN 1 ELSE 0 END) as views,
                SUM(CASE WHEN a.event_type = 'add_to_cart' THEN 1 ELSE 0 END) as add_to_carts
            FROM analytics_events a
            JOIN products p ON a.product_id = p.id
            WHERE a.created_at BETWEEN ${startIso} AND ${endIso}
            GROUP BY p.id, p.name, p.slug
            ORDER BY views DESC
            LIMIT 5
        `);

        const current = currentStatsQuery.rows[0];
        const prev = prevStatsQuery.rows[0];

        // Format chart data
        const chartData = trendQuery.rows.map(row => ({
            date: new Date(row.date as string).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            visitors: Number(row.visitors),
            views: Number(row.views)
        }));

        // Calculate rates
        const currentVisitors = Number(current?.visitors || 0);
        const prevVisitors = Number(prev?.visitors || 0);

        const bounceRate = currentVisitors > 0 ? (Number(current?.bounced_sessions || 0) / currentVisitors) * 100 : 0;
        const prevBounceRate = prevVisitors > 0 ? (Number(prev?.bounced_sessions || 0) / prevVisitors) * 100 : 0;

        const conversionRate = currentVisitors > 0 ? (Number(current?.purchases || 0) / currentVisitors) * 100 : 0;
        const prevConversionRate = prevVisitors > 0 ? (Number(prev?.purchases || 0) / prevVisitors) * 100 : 0;

        const calculateTrend = (curr: number, preval: number, inverted = false) => {
            if (preval === 0) return { value: curr > 0 ? 100 : 0, isPositive: curr > 0 ? !inverted : true };
            const diff = curr - preval;
            const percentage = (diff / preval) * 100;
            const value = Math.round(Math.abs(percentage) * 10) / 10;
            const isPositive = inverted ? diff <= 0 : diff >= 0;
            return { value, isPositive };
        };

        return {
            current: {
                visitors: currentVisitors,
                pageViews: Number(current?.page_views || 0),
                productViews: Number(current?.product_views || 0),
                addToCarts: Number(current?.add_to_carts || 0),
                checkouts: Number(current?.checkouts || 0),
                purchases: Number(current?.purchases || 0),
                bounceRate: Math.round(bounceRate * 10) / 10,
                conversionRate: Math.round(conversionRate * 100) / 100,
            },
            previous: {
                visitors: prevVisitors,
                addToCarts: Number(prev?.add_to_carts || 0),
                purchases: Number(prev?.purchases || 0),
                bounceRate: Math.round(prevBounceRate * 10) / 10,
                conversionRate: Math.round(prevConversionRate * 100) / 100,
            },
            trends: {
                visitors: calculateTrend(currentVisitors, prevVisitors),
                addToCarts: calculateTrend(Number(current?.add_to_carts || 0), Number(prev?.add_to_carts || 0)),
                bounceRate: calculateTrend(bounceRate, prevBounceRate, true), // inverted (lower bounce is better)
                conversionRate: calculateTrend(conversionRate, prevConversionRate),
            },
            chartData,
            topProducts: topProductsQuery.rows.map(row => ({
                id: row.id,
                name: row.name,
                views: Number(row.views),
                addToCarts: Number(row.add_to_carts),
            }))
        };
    } catch (error) {
        console.error('Error fetching advanced analytics:', error);
        return null;
    }
}

export async function getRecentOrders(limit = 5) {
    try {
        return await db.select().from(orders).orderBy(desc(orders.created_at)).limit(limit);
    } catch (error) {
        console.error('Error fetching recent orders:', error);
        return [];
    }
}

// ============== PRODUCTS ==============

export async function adminGetProducts(filters?: {
    search?: string;
    status?: string;
    brand?: string;
    page?: number;
    limit?: number;
}) {
    try {
        const page = filters?.page || 1;
        const limit = filters?.limit || 20;
        const offset = (page - 1) * limit;

        const conditions: any[] = [];
        if (filters?.status) conditions.push(eq(products.status, filters.status));
        if (filters?.brand) conditions.push(ilike(products.brand, `%${filters.brand}%`));
        if (filters?.search) conditions.push(ilike(products.name, `%${filters.search}%`));

        const where = conditions.length > 0 ? and(...conditions) : undefined;

        const [data, [totalResult]] = await Promise.all([
            db.select().from(products).where(where).orderBy(desc(products.created_at)).limit(limit).offset(offset),
            db.select({ count: count() }).from(products).where(where),
        ]);

        return {
            products: data,
            total: totalResult?.count ?? 0,
            page,
            totalPages: Math.ceil((totalResult?.count ?? 0) / limit),
        };
    } catch (error) {
        console.error('Error fetching admin products:', error);
        return { products: [], total: 0, page: 1, totalPages: 0 };
    }
}

export async function adminGetProductById(id: string) {
    try {
        const [product] = await db.select().from(products).where(eq(products.id, id)).limit(1);
        return product || null;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

function sanitizeProductData(data: any) {
    return {
        slug: data.slug,
        name: data.name,
        brand: data.brand,
        gender: data.gender,
        category: data.category,
        condition_label: data.condition_label,
        condition_score: data.condition_score,
        sizes: data.sizes ?? [],
        price: data.price,
        original_price: data.original_price || null,
        color: data.color,
        description: data.description,
        condition_notes: data.condition_notes ?? '',
        images: data.images ?? [],
        status: data.status ?? 'active',
        stock: data.stock !== undefined ? Number(data.stock) : 1,
        is_visible: data.is_visible !== undefined ? Boolean(data.is_visible) : true,
        is_new: data.is_new ?? false,
        is_sale: data.is_sale ?? false,
    };
}

export async function adminCreateProduct(data: any) {
    try {
        const [product] = await db.insert(products).values(sanitizeProductData(data)).returning();
        return product;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
}

export async function adminUpdateProduct(id: string, data: any) {
    try {
        const [product] = await db
            .update(products)
            .set({ ...sanitizeProductData(data), updated_at: new Date() })
            .where(eq(products.id, id))
            .returning();
        return product;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
}

export async function adminDeleteProduct(id: string) {
    try {
        await db.update(products).set({ status: 'archived', updated_at: new Date() }).where(eq(products.id, id));
        return true;
    } catch (error) {
        console.error('Error archiving product:', error);
        throw error;
    }
}

export async function adminPermanentDeleteProduct(id: string) {
    try {
        await db.delete(products).where(eq(products.id, id));
        return true;
    } catch (error) {
        console.error('Error permanently deleting product:', error);
        throw error;
    }
}

export async function adminToggleProductVisibility(id: string, is_visible: boolean) {
    try {
        const [product] = await db
            .update(products)
            .set({ is_visible, updated_at: new Date() })
            .where(eq(products.id, id))
            .returning();
        return product;
    } catch (error) {
        console.error('Error toggling visibility:', error);
        throw error;
    }
}

// ============== ORDERS ==============

export async function adminGetOrders(filters?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
}) {
    try {
        const page = filters?.page || 1;
        const limit = filters?.limit || 20;
        const offset = (page - 1) * limit;

        const conditions: any[] = [];
        if (filters?.status) conditions.push(eq(orders.status, filters.status));
        if (filters?.search) {
            conditions.push(
                ilike(orders.customer_name, `%${filters.search}%`)
            );
        }

        const where = conditions.length > 0 ? and(...conditions) : undefined;

        const [data, [totalResult]] = await Promise.all([
            db.select().from(orders).where(where).orderBy(desc(orders.created_at)).limit(limit).offset(offset),
            db.select({ count: count() }).from(orders).where(where),
        ]);

        return {
            orders: data,
            total: totalResult?.count ?? 0,
            page,
            totalPages: Math.ceil((totalResult?.count ?? 0) / limit),
        };
    } catch (error) {
        console.error('Error fetching orders:', error);
        return { orders: [], total: 0, page: 1, totalPages: 0 };
    }
}

export async function adminGetOrderById(id: string) {
    try {
        const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
        return order || null;
    } catch (error) {
        console.error('Error fetching order:', error);
        return null;
    }
}

export async function adminUpdateOrderStatus(id: string, status: string) {
    try {
        const [order] = await db.update(orders).set({ status, updated_at: new Date() }).where(eq(orders.id, id)).returning();
        return order;
    } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
}

// ============== CUSTOMERS ==============

export async function adminGetCustomers(filters?: {
    search?: string;
    page?: number;
    limit?: number;
}) {
    try {
        const page = filters?.page || 1;
        const limit = filters?.limit || 20;
        const offset = (page - 1) * limit;

        const conditions: any[] = [];
        if (filters?.search) {
            conditions.push(ilike(customers.name, `%${filters.search}%`));
        }

        const where = conditions.length > 0 ? and(...conditions) : undefined;

        const [data, [totalResult]] = await Promise.all([
            db.select().from(customers).where(where).orderBy(desc(customers.created_at)).limit(limit).offset(offset),
            db.select({ count: count() }).from(customers).where(where),
        ]);

        return {
            customers: data,
            total: totalResult?.count ?? 0,
            page,
            totalPages: Math.ceil((totalResult?.count ?? 0) / limit),
        };
    } catch (error) {
        console.error('Error fetching customers:', error);
        return { customers: [], total: 0, page: 1, totalPages: 0 };
    }
}

// ============== VOUCHERS ==============

export async function adminGetVouchers() {
    try {
        return await db.select().from(vouchers).orderBy(desc(vouchers.created_at));
    } catch (error) {
        console.error('Error fetching vouchers:', error);
        return [];
    }
}

export async function adminCreateVoucher(data: any) {
    try {
        const [voucher] = await db.insert(vouchers).values(data).returning();
        return voucher;
    } catch (error) {
        console.error('Error creating voucher:', error);
        throw error;
    }
}

export async function adminUpdateVoucher(id: string, data: any) {
    try {
        const [voucher] = await db.update(vouchers).set(data).where(eq(vouchers.id, id)).returning();
        return voucher;
    } catch (error) {
        console.error('Error updating voucher:', error);
        throw error;
    }
}

export async function adminDeleteVoucher(id: string) {
    try {
        await db.delete(vouchers).where(eq(vouchers.id, id));
        return true;
    } catch (error) {
        console.error('Error deleting voucher:', error);
        throw error;
    }
}

// ============== SLIDERS ==============

export async function adminGetSliders() {
    try {
        return await db.select().from(sliders).orderBy(asc(sliders.sort_order));
    } catch (error) {
        console.error('Error fetching sliders:', error);
        return [];
    }
}

export async function adminCreateSlider(data: any) {
    try {
        const [slider] = await db.insert(sliders).values(data).returning();
        return slider;
    } catch (error) {
        console.error('Error creating slider:', error);
        throw error;
    }
}

export async function adminUpdateSlider(id: string, data: any) {
    try {
        const [slider] = await db.update(sliders).set(data).where(eq(sliders.id, id)).returning();
        return slider;
    } catch (error) {
        console.error('Error updating slider:', error);
        throw error;
    }
}

export async function adminDeleteSlider(id: string) {
    try {
        await db.delete(sliders).where(eq(sliders.id, id));
        return true;
    } catch (error) {
        console.error('Error deleting slider:', error);
        throw error;
    }
}

// ============== SETTINGS ==============

export async function getSettings(key: string) {
    try {
        const [setting] = await db.select().from(settings).where(eq(settings.key, key));
        return setting?.value || null;
    } catch (error) {
        console.error('Error fetching settings:', error);
        return null;
    }
}

export async function updateSettings(key: string, value: any) {
    try {
        const [existing] = await db.select().from(settings).where(eq(settings.key, key));

        if (existing) {
            const [updated] = await db.update(settings).set({ value, updated_at: new Date() }).where(eq(settings.key, key)).returning();
            return updated;
        } else {
            const [inserted] = await db.insert(settings).values({ key, value }).returning();
            return inserted;
        }
    } catch (error) {
        console.error('Error updating settings:', error);
        throw error;
    }
}
