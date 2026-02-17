import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Banknote, CreditCard, Landmark } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="bg-[#284E3D] text-white mt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/20 text-center">
                    {/* Brand */}
                    <div className="space-y-2 px-4 py-3 md:py-0 flex flex-col items-center">
                        <Image
                            src="/logo-footer.svg"
                            alt="footfits.pk"
                            width={120}
                            height={34}
                            className="h-8 w-auto"
                        />
                        <p className="text-xs text-gray-300">
                            Authentic branded shoes from USA & Europe. Pre-loved & brand new at thrift prices.
                        </p>
                    </div>

                    {/* Column 2: Links */}
                    <div className="px-4 py-3 md:py-0">
                        <h3 className="text-white font-semibold mb-2 text-sm">Quick Links</h3>
                        <ul className="space-y-1">
                            <li>
                                <Link href="/shop" className="text-xs hover:text-white transition-colors">
                                    Shop
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-xs hover:text-white transition-colors">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-xs hover:text-white transition-colors">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="text-xs hover:text-white transition-colors">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link href="/return-policy" className="text-xs hover:text-white transition-colors">
                                    Return & Refund Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy-policy" className="text-xs hover:text-white transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Socials Only */}
                    <div className="px-4 py-3 md:py-0 flex flex-col items-center justify-center">
                        <h3 className="text-white font-semibold mb-2 text-sm">Follow Us</h3>
                        <div className="flex items-center space-x-4">
                            <a
                                href="https://instagram.com/footfits.pk"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-white transition-colors p-2 bg-white/10 rounded-full"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="https://facebook.com/footfits.pk"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-white transition-colors p-2 bg-white/10 rounded-full"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-700/50 mt-4 pt-4 flex flex-col md:flex-row justify-between items-center text-xs gap-4">
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                        <p className="text-gray-400">© 2025 footfits.pk. All rights reserved.</p>
                        <span className="hidden md:inline text-gray-700">|</span>
                        <p className="text-gray-500">
                            Powered by <a href="https://zenixa.pk" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">zenixa.pk</a>
                        </p>
                    </div>

                    {/* Payment Icons */}
                    <div className="flex items-center gap-3">
                        {/* Active: COD */}
                        <div className="w-10 h-10 bg-white rounded flex items-center justify-center p-1 shadow-sm overflow-hidden" title="Cash on Delivery">
                            <Banknote className="w-6 h-6 text-gray-700" />
                        </div>

                        {/* Active: Bank Transfer */}
                        <div className="w-10 h-10 bg-white rounded flex items-center justify-center p-1 shadow-sm overflow-hidden" title="Bank Transfer">
                            <Landmark className="w-6 h-6 text-gray-700" />
                        </div>

                        {/* Coming Soon: Card */}
                        <div className="relative group w-10 h-10 bg-gray-200 rounded flex items-center justify-center p-1 shadow-sm overflow-hidden cursor-not-allowed opacity-70">
                            <CreditCard className="w-6 h-6 text-gray-500" />
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                Coming Soon
                            </span>
                        </div>

                        {/* Coming Soon: JazzCash */}
                        <div className="relative group w-10 h-10 bg-gray-200 rounded flex items-center justify-center p-1 shadow-sm overflow-hidden cursor-not-allowed opacity-70">
                            <Image
                                src="/jazzcash.png"
                                alt="JazzCash"
                                width={40}
                                height={40}
                                className="w-full h-full object-contain grayscale"
                            />
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                Coming Soon
                            </span>
                        </div>

                        {/* Coming Soon: Easypaisa */}
                        <div className="relative group w-10 h-10 bg-gray-200 rounded flex items-center justify-center p-1 shadow-sm overflow-hidden cursor-not-allowed opacity-70">
                            <Image
                                src="/easypaisa.jpeg"
                                alt="Easypaisa"
                                width={40}
                                height={40}
                                className="w-full h-full object-contain grayscale"
                            />
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                Coming Soon
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
