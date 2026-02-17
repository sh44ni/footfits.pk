-- footfits.pk Database Schema for Neon PostgreSQL
-- Run this in your Neon SQL Editor: https://console.neon.tech/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('Men', 'Women', 'Kids', 'Unisex')),
  category TEXT NOT NULL,
  condition_label TEXT NOT NULL,
  condition_score INTEGER NOT NULL CHECK (condition_score >= 1 AND condition_score <= 10),
  sizes JSONB NOT NULL DEFAULT '[]'::jsonb,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  color TEXT NOT NULL,
  description TEXT NOT NULL,
  condition_notes TEXT NOT NULL,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  rating DECIMAL(3,2),
  review_count INTEGER DEFAULT 0,
  is_new BOOLEAN DEFAULT false,
  is_sale BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft', 'sold', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  city TEXT NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cod', 'jazzcash', 'easypaisa', 'bank_transfer')),
  subtotal DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  voucher_code TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned')),
  items JSONB NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL UNIQUE,
  city TEXT NOT NULL,
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create vouchers table
CREATE TABLE IF NOT EXISTS vouchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  min_order_amount DECIMAL(10,2) DEFAULT 0,
  max_uses INTEGER DEFAULT 0,
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sliders table
CREATE TABLE IF NOT EXISTS sliders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  cta_text TEXT NOT NULL,
  cta_link TEXT NOT NULL,
  background_color TEXT NOT NULL DEFAULT '#284E3D',
  image_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create banners table
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  background_color TEXT NOT NULL DEFAULT '#284E3D',
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(customer_phone);
