import * as React from 'react';
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
} from '@react-email/components';

interface WelcomeEmailProps {
    userFirstname: string;
}

const baseUrl = process.env.NEXT_PUBLIC_URL ? `https://${process.env.NEXT_PUBLIC_URL}` : 'https://footfits.pk';

export const WelcomeEmail = ({
    userFirstname,
}: WelcomeEmailProps) => (
    <Html>
        <Head />
        <Preview>Welcome to FootFits! Step into quality.</Preview>
        <Body style={main}>
            <Container style={container}>
                <Section style={logoContainer}>
                    <Img
                        src="https://placehold.co/150x50/284E3D/ffffff?text=FootFits"
                        alt="FootFits Logo"
                        width="150"
                        height="50"
                        style={logo}
                    />
                </Section>
                <Heading style={h1}>Welcome, {userFirstname}!</Heading>
                <Text style={text}>
                    We're thrilled to have you join the FootFits community. You've taken the first step towards stepping out in style with our premium, authentic branded shoes.
                </Text>
                <Section style={statsContainer}>
                    <Text style={statText}>
                        📦 <b>Real-time Tracking</b>: Keep an eye on your orders.
                    </Text>
                    <Text style={statText}>
                        🚀 <b>Faster Checkout</b>: Save time on your next purchase.
                    </Text>
                    <Text style={statText}>
                        ⭐ <b>Exclusive Reviews</b>: Share your thoughts and help others.
                    </Text>
                </Section>
                <Section style={btnContainer}>
                    <Link style={button} href={`${baseUrl}/shop`}>
                        Start Shopping
                    </Link>
                </Section>
                <Text style={text}>
                    If you have any questions, feel free to reply to this email or contact us via WhatsApp at +92 313 1118814.
                </Text>
                <Text style={footer}>
                    &copy; {new Date().getFullYear()} FootFits. All rights reserved.
                </Text>
            </Container>
        </Body>
    </Html>
);

const main = {
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
    maxWidth: '560px',
};

const logoContainer = {
    marginBottom: '24px',
    textAlign: 'center' as const,
};

const logo = {
    margin: '0 auto',
};

const h1 = {
    color: '#1a1a1a',
    fontSize: '24px',
    fontWeight: '600',
    lineHeight: '40px',
    margin: '0 0 20px',
};

const text = {
    color: '#444',
    fontSize: '16px',
    lineHeight: '26px',
    margin: '16px 0',
};

const statsContainer = {
    background: '#f9f9f9',
    padding: '24px',
    borderRadius: '8px',
    margin: '24px 0',
};

const statText = {
    ...text,
    margin: '8px 0',
};

const btnContainer = {
    textAlign: 'center' as const,
    margin: '24px 0 32px',
};

const button = {
    backgroundColor: '#284E3D',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    padding: '12px 24px',
};

const footer = {
    color: '#8898aa',
    fontSize: '12px',
    lineHeight: '16px',
    marginTop: '48px',
    textAlign: 'center' as const,
};

export default WelcomeEmail;
