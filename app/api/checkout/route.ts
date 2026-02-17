import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, vouchers, customers } from '@/lib/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { eq, sql } from 'drizzle-orm';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, phone, address, city, paymentMethod, items, subtotal, deliveryFee, total, voucherCode, discount } = body;

        // Generate Order Number (FF-XXXXXX)
        const orderNumber = `FF-${Math.floor(100000 + Math.random() * 900000)}`;

        // Insert Order
        const [newOrder] = await db.insert(orders).values({
            order_number: orderNumber,
            customer_name: name,
            customer_email: email,
            customer_phone: phone,
            shipping_address: address,
            city: city,
            payment_method: paymentMethod,
            subtotal: subtotal.toString(),
            delivery_fee: deliveryFee.toString(),
            total: total.toString(),
            discount: discount ? discount.toString() : '0',
            voucher_code: voucherCode || null,
            payment_proof: body.paymentProofUrl || null,
            items: items.map((item: any) => ({
                name: item.product.name,
                price: item.product.price,
                image: item.product.images?.[0] || null,
                size: item.size,
                quantity: item.quantity,
                product_id: item.product.id
            })), // JSONB
            status: 'pending',
        }).returning();

        // Sync Customer Data
        const [existingCustomer] = await db.select().from(customers).where(eq(customers.phone, phone));

        if (existingCustomer) {
            await db.update(customers)
                .set({
                    name: name, // Update name in case it changed
                    email: email || existingCustomer.email, // Update email if provided
                    city: city, // Update city
                    total_orders: sql`${customers.total_orders} + 1`,
                    total_spent: sql`${customers.total_spent} + ${total}`
                })
                .where(eq(customers.phone, phone));
        } else {
            await db.insert(customers).values({
                name,
                email,
                phone,
                city,
                total_orders: 1,
                total_spent: total.toString(),
            });
        }

        // Increment Voucher Usage
        if (voucherCode) {
            await db.update(vouchers)
                .set({ used_count: sql`${vouchers.used_count} + 1` })
                .where(eq(vouchers.code, voucherCode));
        }

        return NextResponse.json({ success: true, orderNumber: newOrder.order_number });
    } catch (error) {
        console.error('Checkout error:', error);
        return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
    }
}
