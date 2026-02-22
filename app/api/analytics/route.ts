import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { analytics_events } from '@/lib/db/schema';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { event_type, path, product_id } = body;

        if (!event_type || !path) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Get or create session ID
        let sessionId = request.cookies.get('ff_analytics_session')?.value;
        let isNewSession = false;

        if (!sessionId) {
            sessionId = uuidv4();
            isNewSession = true;
        }

        // Insert event into database
        await db.insert(analytics_events).values({
            session_id: sessionId,
            event_type,
            path,
            product_id: product_id || null,
        });

        // Set cookie if new session
        const response = NextResponse.json({ success: true, session_id: sessionId });
        if (isNewSession) {
            // Cookie expires in 30 days
            const expires = new Date();
            expires.setDate(expires.getDate() + 30);

            response.cookies.set({
                name: 'ff_analytics_session',
                value: sessionId,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                expires: expires,
                path: '/',
            });
        }

        return response;
    } catch (error) {
        console.error('Analytics tracking error:', error);
        return NextResponse.json({ error: 'Failed to record event' }, { status: 500 });
    }
}
