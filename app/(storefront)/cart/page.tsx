'use client';

import { useCart } from '@/lib/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Minus, Plus, Footprints, Loader2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useState } from 'react';

export default function CartPage() {
    const { items, removeItem, updateQuantity, getSubtotal } = useCart();
    const [voucherCode, setVoucherCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [appliedVoucher, setAppliedVoucher] = useState('');
    const [voucherError, setVoucherError] = useState('');
    const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const subtotal = getSubtotal();
    const deliveryFee = subtotal >= 5000 ? 0 : 200;
    const total = subtotal + deliveryFee - discount;

    const handleApplyVoucher = async () => {
        setVoucherError('');
        setIsApplyingVoucher(true);
        try {
            const res = await fetch('/api/vouchers/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: voucherCode, subtotal }),
            });
            const data = await res.json();

            if (data.valid) {
                setDiscount(data.discount);
                setAppliedVoucher(data.code);
                setVoucherCode(data.code);
            } else {
                setDiscount(0);
                setAppliedVoucher('');
                setVoucherError(data.error || 'Invalid voucher');
            }
        } catch (error) {
            console.error('Voucher check error:', error);
            setVoucherError('Failed to apply voucher');
        } finally {
            setIsApplyingVoucher(false);
        }
    };

    const handleCheckout = () => {
        setIsCheckingOut(true);
        fetch('/api/auth/session')
            .then(res => res.json())
            .then(data => {
                if (data.authenticated) {
                    window.location.href = `/checkout${appliedVoucher ? `?voucher=${appliedVoucher}` : ''}`;
                } else {
                    window.location.href = '/checkout/auth';
                }
            })
            .catch(() => {
                window.location.href = '/checkout/auth';
            });
    };

    if (items.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center animate-fade-in-up">
                <h1 className="text-3xl font-bold text-foreground mb-4">Your Cart is Empty</h1>
                <p className="text-gray-600 mb-8">Add some products to get started!</p>
                <Link
                    href="/shop"
                    className="inline-block bg-secondary text-foreground font-semibold px-8 py-3 rounded-full hover:bg-secondary/90 transition-all btn-press"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item, idx) => (
                        <div
                            key={`${item.product.id}-${item.size}`}
                            className={`bg-white border border-gray-200 rounded-lg p-4 flex gap-3 sm:gap-4 animate-fade-in-up stagger-${(idx % 8) + 1}`}
                        >
                            {/* Image */}
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded flex-shrink-0 relative overflow-hidden">
                                {item.product.images && item.product.images.length > 0 ? (
                                    <Image
                                        src={Array.isArray(item.product.images) ? item.product.images[0] : item.product.images}
                                        alt={item.product.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Footprints className="w-8 h-8 text-gray-300" />
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 flex flex-col justify-between min-w-0">
                                <div className="flex justify-between items-start gap-2">
                                    <div className="min-w-0">
                                        <h3 className="font-semibold text-foreground truncate">{item.product.name}</h3>
                                        <p className="text-xs sm:text-sm text-gray-600 truncate">{item.product.brand}</p>
                                        <p className="text-xs sm:text-sm text-gray-600">Size: {item.size}</p>
                                        <p className="text-xs sm:text-sm text-gray-600">{item.product.condition_label}</p>
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.product.id, item.size)}
                                        className="text-red-500 hover:text-red-700 hover:scale-110 active:scale-90 transition-all p-1"
                                        aria-label="Remove item"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex items-end justify-between mt-2">
                                    <p className="font-bold text-foreground text-sm sm:text-base">{formatPrice(item.product.price)}</p>
                                    <div className="flex items-center border border-gray-300 rounded h-8">
                                        <button
                                            onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                                            className="px-2 hover:bg-gray-100 active:scale-90 transition-all h-full flex items-center"
                                        >
                                            <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                                        </button>
                                        <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                                            className="px-2 hover:bg-gray-100 active:scale-90 transition-all h-full flex items-center"
                                        >
                                            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 sticky top-20 animate-fade-in-up">
                        <h2 className="text-xl font-bold text-foreground mb-4">Order Summary</h2>

                        {/* Voucher Code */}
                        <div className="mb-4">
                            <label className="text-sm font-semibold text-foreground mb-2 block">
                                Voucher Code
                            </label>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={voucherCode}
                                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                                    placeholder="Enter code"
                                    className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:bg-gray-100"
                                    disabled={isApplyingVoucher}
                                />
                                <button
                                    onClick={handleApplyVoucher}
                                    disabled={!voucherCode || isApplyingVoucher}
                                    className="px-4 py-2 bg-primary text-white font-semibold rounded hover:bg-primary/90 transition-all btn-press disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isApplyingVoucher ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>...</span>
                                        </>
                                    ) : (
                                        'Apply'
                                    )}
                                </button>
                            </div>
                            {voucherError && <p className="text-xs text-red-500 mt-1 animate-fade-in-up">{voucherError}</p>}
                            {appliedVoucher && <p className="text-xs text-green-600 mt-1 animate-fade-in-up">Voucher applied!</p>}
                        </div>

                        {/* Summary */}
                        <div className="space-y-2 border-t border-gray-200 pt-4">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Delivery Fee</span>
                                <span>{deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-green-600 animate-fade-in-up">
                                    <span>Discount</span>
                                    <span>-{formatPrice(discount)}</span>
                                </div>
                            )}
                            {subtotal < 5000 && (
                                <p className="text-xs text-gray-500">
                                    Add {formatPrice(5000 - subtotal)} more for free delivery!
                                </p>
                            )}
                            <div className="flex justify-between text-lg font-bold text-foreground border-t border-gray-200 pt-2">
                                <span>Total</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                        </div>

                        {/* Checkout Button */}
                        <button
                            onClick={handleCheckout}
                            disabled={isCheckingOut}
                            className="block w-full mt-6 bg-secondary text-foreground font-bold py-3 rounded-lg text-center hover:bg-secondary/90 transition-all btn-press disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {isCheckingOut ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                'Proceed to Checkout'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
