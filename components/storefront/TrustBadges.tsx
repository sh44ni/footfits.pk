
import { Truck, ShieldCheck, RotateCcw } from 'lucide-react';

export default function TrustBadges() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-t border-gray-100 mt-8">
            <div className="flex flex-col items-center text-center space-y-2">
                <div className="p-3 bg-gray-50 rounded-full text-[#284E3D]">
                    <Truck className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900">Free Delivery</h3>
                <p className="text-sm text-gray-500">On Orders Above Rs. 5,000</p>
            </div>

            <div className="flex flex-col items-center text-center space-y-2">
                <div className="p-3 bg-gray-50 rounded-full text-[#284E3D]">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900">100% Original</h3>
                <p className="text-sm text-gray-500">Verified & Authenticated</p>
            </div>

            <div className="flex flex-col items-center text-center space-y-2">
                <div className="p-3 bg-gray-50 rounded-full text-[#284E3D]">
                    <RotateCcw className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900">3-Day Easy Returns</h3>
                <p className="text-sm text-gray-500">Unboxing Video Required</p>
            </div>
        </div>
    );
}
