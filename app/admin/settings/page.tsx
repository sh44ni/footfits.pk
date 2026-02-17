'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, University, Landmark } from 'lucide-react';

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [bankDetails, setBankDetails] = useState({
        bankName: '',
        accountTitle: '',
        accountNumber: '',
        iban: '',
        instructions: 'Please transfer the total amount to the account above and upload the screenshot of the transaction as proof of payment.',
    });

    useEffect(() => {
        fetch('/api/settings?key=bank_details')
            .then(res => res.json())
            .then(data => {
                if (Object.keys(data).length > 0) {
                    setBankDetails(data);
                }
                setInitialLoading(false);
            })
            .catch(err => {
                console.error(err);
                setInitialLoading(false);
            });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setBankDetails({ ...bankDetails, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    key: 'bank_details',
                    value: bankDetails
                }),
            });

            if (!res.ok) throw new Error('Failed to save settings');
            alert('Settings saved successfully');
        } catch (error) {
            console.error(error);
            alert('Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#284E3D]" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Settings</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-[#284E3D]">
                        <Landmark className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Bank Transfer Details</h2>
                        <p className="text-sm text-gray-500">Configure the bank account details shown at checkout.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Bank Name</label>
                            <input
                                type="text"
                                name="bankName"
                                value={bankDetails.bankName}
                                onChange={handleChange}
                                placeholder="e.g. Meezan Bank"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Account Title</label>
                            <input
                                type="text"
                                name="accountTitle"
                                value={bankDetails.accountTitle}
                                onChange={handleChange}
                                placeholder="e.g. John Doe"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Account Number</label>
                            <input
                                type="text"
                                name="accountNumber"
                                value={bankDetails.accountNumber}
                                onChange={handleChange}
                                placeholder="e.g. 0101010101"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">IBAN (Optional)</label>
                            <input
                                type="text"
                                name="iban"
                                value={bankDetails.iban}
                                onChange={handleChange}
                                placeholder="PK..."
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Instructions</label>
                        <textarea
                            name="instructions"
                            rows={3}
                            value={bankDetails.instructions}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-medium transition-all disabled:opacity-50"
                            style={{ backgroundColor: '#284E3D' }}
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Settings
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
