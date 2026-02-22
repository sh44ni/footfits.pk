'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

const GA_MEASUREMENT_ID = 'G-J4HPCYTSY0';

function RouteTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
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
