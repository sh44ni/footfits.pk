'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

const GA_MEASUREMENT_ID = 'G-J4HPCYTSY0';

function RouteTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Track internally in our database
        const trackInternal = async () => {
            try {
                let url = pathname;
                if (searchParams && searchParams.toString()) {
                    url += `?${searchParams.toString()}`;
                }

                // Check if it's a product page to extract potential ID (optional enhancement later)
                // For now, just record the path
                const isProductPage = pathname?.startsWith('/product/');

                await fetch('/api/analytics', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        event_type: isProductPage ? 'product_view' : 'page_view',
                        path: url,
                        // product_id will be extracted via a separate DB call in the future if needed, 
                        // or we just rely on the path for now
                    }),
                });
            } catch (error) {
                console.error('Failed to track internal analytics:', error);
            }
        };

        trackInternal();

        // Wait for gtag to be available
        if (typeof window !== 'undefined' && window.gtag) {
            let url = pathname;
            if (searchParams && searchParams.toString()) {
                url += `?${searchParams.toString()}`;
            }
            window.gtag('config', GA_MEASUREMENT_ID, {
                page_path: url,
            });
        }
    }, [pathname, searchParams]);

    return null;
}

export default function GoogleAnalytics() {
    return (
        <>
            {/* Raw script injection to completely bypass Next.js Script lifecycle issues */}
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
            <script
                dangerouslySetInnerHTML={{
                    __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
                }}
            />
            <Suspense fallback={null}>
                <RouteTracker />
            </Suspense>
        </>
    );
}

declare global {
    interface Window {
        gtag: (...args: any[]) => void;
        dataLayer: Record<string, any>[];
    }
}
