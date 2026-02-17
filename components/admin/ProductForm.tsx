'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, ArrowLeft, Plus, X, Upload } from 'lucide-react';
import Link from 'next/link';

const BRANDS = [
    'New Balance',
    'Adidas',
    'Skechers',
    'Puma',
    'Nike',
    'Under Armour',
    'Other'
];

const COLORS = [
    'Black', 'White', 'Grey', 'Blue', 'Red', 'Green', 'Yellow', 'Orange', 'Purple', 'Pink', 'Brown', 'Beige', 'Multi', 'Other'
];

interface ProductFormProps {
    initialData?: any;
    isEdit?: boolean;
}

export default function ProductForm({ initialData, isEdit }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        slug: initialData?.slug || '',
        brand: initialData?.brand || '',
        gender: initialData?.gender || 'Men',
        category: initialData?.category || '',
        condition_label: initialData?.condition_label || 'Excellent 9/10',
        condition_score: initialData?.condition_score || 9,
        price: initialData?.price || '',
        original_price: initialData?.original_price || '',
        color: initialData?.color || '',
        description: initialData?.description || '',
        condition_notes: initialData?.condition_notes || '',
        status: initialData?.status || 'active',
        sizes: initialData?.sizes || [] as string[],
        images: initialData?.images || [],
    });

    const [sizeUK, setSizeUK] = useState('');
    const [sizeEUR, setSizeEUR] = useState('');
    const [newImage, setNewImage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddSize = () => {
        if (sizeUK && sizeEUR) {
            const sizeString = `UK ${sizeUK} | EUR ${sizeEUR}`;
            if (!formData.sizes.includes(sizeString)) {
                setFormData(prev => ({ ...prev, sizes: [...prev.sizes, sizeString] }));
                setSizeUK('');
                setSizeEUR('');
            }
        }
    };

    const handleRemoveSize = (sizeToRemove: string) => {
        setFormData(prev => ({ ...prev, sizes: prev.sizes.filter((s: string) => s !== sizeToRemove) }));
    };

    const handleAddImage = () => {
        if (newImage && !formData.images.includes(newImage)) {
            setFormData(prev => ({ ...prev, images: [...prev.images, newImage] }));
            setNewImage('');
        }
    };

    const handleRemoveImage = (imageToRemove: string) => {
        setFormData(prev => ({ ...prev, images: prev.images.filter((i: string) => i !== imageToRemove) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Generate slug if empty
        if (!formData.slug) {
            formData.slug = formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }

        try {
            const url = isEdit ? `/api/admin/products/${initialData.id}` : '/api/admin/products';
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Failed to save product');

            router.push('/admin/products');
            router.refresh();
        } catch (error) {
            console.error('Save error:', error);
            alert('Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">{isEdit ? 'Edit Product' : 'New Product'}</h1>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-medium transition-all disabled:opacity-50"
                    style={{ backgroundColor: '#284E3D' }}
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Product
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                        <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-4">Basic Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Brand</label>
                                <select
                                    name="brand"
                                    required
                                    value={formData.brand}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                                >
                                    <option value="">Select Brand</option>
                                    {BRANDS.map(brand => (
                                        <option key={brand} value={brand}>{brand}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                name="description"
                                required
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Slug (URL)</label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    placeholder="Auto-generated if empty"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Category</label>
                                <input
                                    type="text"
                                    name="category"
                                    required
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                        <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-4">Images</h2>
                        <div className="space-y-4">
                            {/* File Upload */}
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={async (e) => {
                                        if (!e.target.files?.length) return;
                                        setLoading(true);
                                        const files = Array.from(e.target.files);
                                        try {
                                            const uploadPromises = files.map(async (file) => {
                                                const formData = new FormData();
                                                formData.append('file', file);
                                                const res = await fetch('/api/upload', { method: 'POST', body: formData });
                                                if (!res.ok) throw new Error('Upload failed');
                                                const data = await res.json();
                                                return data.url;
                                            });
                                            const newUrls = await Promise.all(uploadPromises);
                                            setFormData(prev => ({ ...prev, images: [...prev.images, ...newUrls] }));
                                        } catch (error) {
                                            console.error('Upload error:', error);
                                            alert('Failed to upload images');
                                        } finally {
                                            setLoading(false);
                                        }
                                    }}
                                />
                                <div className="flex flex-col items-center justify-center pointer-events-none">
                                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                    <p className="text-sm font-medium text-gray-700">Click to upload images</p>
                                    <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (max. 5MB)</p>
                                </div>
                            </div>

                            {/* URL Input (Fallback) */}
                            <div className="flex gap-2">
                                <input
                                    type="url"
                                    placeholder="Or add Image URL"
                                    value={newImage}
                                    onChange={(e) => setNewImage(e.target.value)}
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddImage}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium border border-gray-200 text-sm"
                                >
                                    Add URL
                                </button>
                            </div>

                            {formData.images.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                                    {formData.images.map((img: string, idx: number) => (
                                        <div key={idx} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(img)}
                                                className="absolute top-2 right-2 p-1 bg-white/90 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                        <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-4">Pricing & Inventory</h2>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Price (PKR)</label>
                            <input
                                type="number"
                                name="price"
                                required
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Original Price (Optional)</label>
                            <input
                                type="number"
                                name="original_price"
                                value={formData.original_price}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                            >
                                <option value="active">Active</option>
                                <option value="draft">Draft</option>
                                <option value="sold">Sold</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                        <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-4">Details</h2>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                            >
                                <option value="Men">Men</option>
                                <option value="Women">Women</option>
                                <option value="Kids">Kids</option>
                                <option value="Unisex">Unisex</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Condition Label</label>
                            <input
                                type="text"
                                name="condition_label"
                                value={formData.condition_label}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Condition Score (1-10)</label>
                            <input
                                type="number"
                                name="condition_score"
                                min="1"
                                max="10"
                                step="0.1"
                                value={formData.condition_score}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Color</label>
                            <select
                                name="color"
                                value={formData.color}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                            >
                                <option value="">Select Color</option>
                                {COLORS.map(color => (
                                    <option key={color} value={color}>{color}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                        <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-4">Sizes</h2>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="UK"
                                value={sizeUK}
                                onChange={(e) => setSizeUK(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                            <input
                                type="text"
                                placeholder="EUR"
                                value={sizeEUR}
                                onChange={(e) => setSizeEUR(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                            <button
                                type="button"
                                onClick={handleAddSize}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium border border-gray-200"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.sizes.map((size: string) => (
                                <span key={size} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700 border border-gray-200">
                                    {size}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSize(size)}
                                        className="text-gray-400 hover:text-red-500"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
