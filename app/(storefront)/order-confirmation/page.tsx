'use client';

import { Suspense, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
    CheckCircle,
    Home,
    Store,
    Loader2,
    Package,
    MapPin,
    CreditCard,
    User,
    Phone,
    Mail,
    Tag,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface OrderItem {
    product: {
        id: string;
        name: string;
        price: number;
        images?: string[];
    };
    size: string;
    quantity: number;
}

interface OrderData {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    paymentMethod: string;
    items: OrderItem[];
    subtotal: number;
    discount: number;
    total: number;
    voucherCode: string | null;
}

const PAYMENT_LABELS: Record<string, string> = {
    cod: 'Cash on Delivery (COD)',
    bank_transfer: 'Bank Transfer',
    jazzcash: 'JazzCash',
    easypaisa: 'Easypaisa',
};

function OrderConfirmationContent() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get('order');
    const encodedData = searchParams.get('d');

    const orderData = useMemo<OrderData | null>(() => {
        if (!encodedData) return null;
        try {
            return JSON.parse(decodeURIComponent(atob(encodedData)));
        } catch {
            return null;
        }
    }, [encodedData]);

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto space-y-5">

                {/* ── Success Header ── */}
                <div className="bg-[#284E3D] rounded-2xl p-8 text-center text-white shadow-lg">
                    <div className="flex justify-center mb-4">
                        <div className="bg-white/10 rounded-full p-4">
                            <CheckCircle className="w-14 h-14 text-[#DCAA2D]" strokeWidth={1.5} />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1">Order Received!</h1>
                    <p className="text-white/75 text-sm">
                        Thank you for shopping with Footfits. We&apos;re processing your order now.
                    </p>

                    {orderNumber && (
                        <div className="mt-5 inline-block bg-white/10 border border-white/20 rounded-xl px-6 py-3">
                            <p className="text-xs text-white/60 uppercase tracking-widest mb-0.5">Order Number</p>
                            <p className="text-2xl font-bold font-mono text-[#DCAA2D] tracking-wider">{orderNumber}</p>
                        </div>
                    )}
                </div>

                {orderData ? (
                    <>
                        {/* ── Customer Info ── */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                                <User className="w-4 h-4 text-[#284E3D]" />
                                <h2 className="font-semibold text-foreground text-sm uppercase tracking-wide">Customer Details</h2>
                            </div>
                            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                    <User className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-400 mb-0.5">Full Name</p>
                                        <p className="font-medium text-foreground">{orderData.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-400 mb-0.5">Phone</p>
                                        <p className="font-medium text-foreground">{orderData.phone}</p>
                                    </div>
                                </div>
                                {orderData.email && (
                                    <div className="flex items-start gap-3 sm:col-span-2">
                                        <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-400 mb-0.5">Email</p>
                                            <p className="font-medium text-foreground">{orderData.email}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── Shipping Info ── */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                                <MapPin className="w-4 h-4 text-[#284E3D]" />
                                <h2 className="font-semibold text-foreground text-sm uppercase tracking-wide">Shipping Address</h2>
                            </div>
                            <div className="p-5">
                                <p className="text-foreground font-medium">{orderData.address}</p>
                                <p className="text-gray-500 text-sm mt-0.5">{orderData.city}, Pakistan</p>
                            </div>
                        </div>

                        {/* ── Order Items ── */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                                <Package className="w-4 h-4 text-[#284E3D]" />
                                <h2 className="font-semibold text-foreground text-sm uppercase tracking-wide">
                                    Items Ordered ({orderData.items.length})
                                </h2>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {orderData.items.map((item, idx) => {
                                    const img = item.product.images?.[0];
                                    return (
                                        <div key={idx} className="flex items-center gap-4 px-5 py-4">
                                            <div className="w-16 h-16 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-100">
                                                {img ? (
                                                    <Image
                                                        src={img}
                                                        alt={item.product.name}
                                                        width={64}
                                                        height={64}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package className="w-6 h-6 text-gray-300" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-foreground text-sm truncate">{item.product.name}</p>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                                                        Size: {item.size}
                                                    </span>
                                                    <span className="text-xs text-gray-400">Qty: {item.quantity}</span>
                                                </div>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="font-bold text-foreground text-sm">
                                                    {formatPrice(item.product.price * item.quantity)}
                                                </p>
                                                {item.quantity > 1 && (
                                                    <p className="text-xs text-gray-400">{formatPrice(item.product.price)} each</p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ── Payment & Price Summary ── */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                                <CreditCard className="w-4 h-4 text-[#284E3D]" />
                                <h2 className="font-semibold text-foreground text-sm uppercase tracking-wide">Payment Summary</h2>
                            </div>
                            <div className="p-5 space-y-3">
                                {/* Payment method badge */}
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Payment Method</span>
                                    <span className="font-semibold text-foreground bg-gray-100 px-3 py-1 rounded-full text-xs">
                                        {PAYMENT_LABELS[orderData.paymentMethod] ?? orderData.paymentMethod}
                                    </span>
                                </div>

                                <div className="border-t border-dashed border-gray-100 pt-3 space-y-2">
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>Subtotal</span>
                                        <span>{formatPrice(orderData.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>Delivery Fee</span>
                                        <span className="flex items-center gap-1.5">
                                            <span className="line-through text-xs text-gray-300">Rs 270</span>
                                            <span className="text-[#284E3D] font-semibold">Free</span>
                                        </span>
                                    </div>
                                    {orderData.discount > 0 && (
                                        <div className="flex justify-between text-sm text-green-600">
                                            <span className="flex items-center gap-1">
                                                <Tag className="w-3.5 h-3.5" />
                                                Voucher {orderData.voucherCode && `(${orderData.voucherCode})`}
                                            </span>
                                            <span>−{formatPrice(orderData.discount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-base font-bold text-foreground border-t border-gray-100 pt-3 mt-2">
                                        <span>Total Paid</span>
                                        <span className="text-[#284E3D]">{formatPrice(orderData.total)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── COD notice ── */}
                        {orderData.paymentMethod === 'cod' && (
                            <div className="bg-[#DCAA2D]/10 border border-[#DCAA2D]/30 rounded-xl p-4 text-center">
                                <p className="text-sm font-medium text-[#284E3D]">
                                    💰 You will pay <strong>{formatPrice(orderData.total)}</strong> in cash upon delivery.
                                </p>
                            </div>
                        )}
                        {orderData.paymentMethod === 'bank_transfer' && (
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
                                <p className="text-sm font-medium text-blue-700">
                                    🏦 Your bank transfer is being verified. We&apos;ll confirm your order shortly.
                                </p>
                            </div>
                        )}
                    </>
                ) : (
                    /* Fallback when there's no encoded data */
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
                        <p className="text-gray-500 text-sm">
                            You will receive an email confirmation shortly.
                        </p>
                    </div>
                )}

                {/* ── Action Buttons ── */}
                <div className="grid grid-cols-2 gap-3">
                    <Link
                        href="/shop"
                        className="flex items-center justify-center gap-2 bg-[#DCAA2D] text-[#333333] font-semibold py-3.5 rounded-xl hover:bg-[#DCAA2D]/90 transition-all active:scale-95 shadow-sm"
                    >
                        <Store className="w-4 h-4" />
                        Shop More
                    </Link>
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-semibold py-3.5 rounded-xl hover:bg-gray-50 transition-all active:scale-95"
                    >
                        <Home className="w-4 h-4" />
                        Home
                    </Link>
                </div>

                {/* ── Footer note ── */}
                <p className="text-center text-xs text-gray-400 pb-2">
                    Need help? Contact us via WhatsApp or email. Keep your order number handy: <strong className="text-gray-600">{orderNumber}</strong>
                </p>
            </div>
        </div>
    );
}

export default function OrderConfirmationPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 bg-gray-50">
                <Loader2 className="w-12 h-12 animate-spin text-[#284E3D] mb-4" />
                <h2 className="text-xl font-semibold text-gray-700">Loading your order...</h2>
            </div>
        }>
            <OrderConfirmationContent />
        </Suspense>
    );
}
