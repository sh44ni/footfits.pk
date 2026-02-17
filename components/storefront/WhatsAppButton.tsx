'use client';

import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+923132319987';
    const message = encodeURIComponent('Hi! I have a question about your products.');

    return (
        <a
            href={`https://wa.me/${whatsappNumber.replace(/\+/g, '')}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-20 md:bottom-6 right-6 z-40 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-110 animate-pulse"
            aria-label="Chat on WhatsApp"
        >
            <MessageCircle className="w-6 h-6" />
        </a>
    );
}
