import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import WhatsAppWidget from '@/components/storefront/WhatsAppWidget';

export default function StorefrontLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <div className="bg-[#284E3D] text-white text-center py-2 text-sm font-medium tracking-wide">
                Free Delivery all over Pakistan - Limited Time Only
            </div>
            <Navbar />
            <main className="min-h-screen">
                {children}
            </main>
            <Footer />
            <WhatsAppWidget />
        </>
    );
}
