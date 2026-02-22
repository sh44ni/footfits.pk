import { NextRequest, NextResponse } from 'next/server';
import { getAdvancedAnalytics } from '@/lib/db/admin-queries';
import { requireAuth } from '@/lib/auth/utils';

export async function GET(request: NextRequest) {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    try {
        const searchParams = request.nextUrl.searchParams;
        const period = (searchParams.get('period') || '7days') as 'today' | 'yesterday' | '7days' | '30days';

        const data = await getAdvancedAnalytics(period);

        if (!data) {
            return NextResponse.json({ error: 'Failed to aggregate analytics' }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Advanced Analytics API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
