import { eq, and, ilike, desc, asc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { products as productsTable, sliders as slidersTable } from '@/lib/db/schema';
import { Product, Slider } from '@/types';

export async function getProducts(filters?: {
    brand?: string;
    gender?: string;
    condition?: string;
    sort?: string;
    limit?: number;
}): Promise<Product[]> {
    try {
        console.log('🔍 Fetching products with filters:', filters);

        // Build where conditions
        const conditions = [
            eq(productsTable.status, 'active'),
            eq(productsTable.is_visible, true),
        ];

        if (filters?.brand) {
            const searchBrand = filters.brand.replace(/-/g, ' ');
            conditions.push(ilike(productsTable.brand, `%${searchBrand}%`));
        }

        if (filters?.gender) {
            conditions.push(eq(productsTable.gender, filters.gender));
        }

        if (filters?.condition) {
            conditions.push(eq(productsTable.condition_label, filters.condition));
        }

        // Build query
        let query: any = db.select().from(productsTable).where(and(...conditions));

        // Add sorting
        switch (filters?.sort) {
            case 'price_asc':
                query = query.orderBy(asc(productsTable.price));
                break;
            case 'price_desc':
                query = query.orderBy(desc(productsTable.price));
                break;
            default:
                query = query.orderBy(desc(productsTable.created_at));
        }

        // Add limit
        if (filters?.limit) {
            query = query.limit(filters.limit);
        }

        const result = await query;
        console.log('✅ Products fetched:', result.length);

        return result as any as Product[];
    } catch (error) {
        console.error('❌ Error fetching products:', error);
        return [];
    }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
    try {
        const result = await db
            .select()
            .from(productsTable)
            .where(and(
                eq(productsTable.slug, slug),
                eq(productsTable.status, 'active'),
                eq(productsTable.is_visible, true)
            ))
            .limit(1);

        return (result[0] as any as Product) || null;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

export async function getSliders(): Promise<Slider[]> {
    try {
        console.log('🔍 Fetching sliders...');
        const result = await db
            .select()
            .from(slidersTable)
            .where(eq(slidersTable.is_active, true))
            .orderBy(asc(slidersTable.sort_order));

        console.log('✅ Sliders fetched:', result.length);
        return result as any as Slider[];
    } catch (error) {
        console.error('❌ Error fetching sliders:', error);
        return [];
    }
}
