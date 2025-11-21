import { useEffect, useState } from "react";
import DarkModeToggle from "../components/DarkModeToggle";
import { getVariants } from "../models/variants";
import { Variant } from "../types/models";

const POSPage = () => {
    const [posItems, setPOSItems] = useState<Variant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadVariants();
    }, [])

    const loadVariants = async () => {
        try {
            setLoading(true);
            setError(null);
            const fetchedVariants = await getVariants();
            setPOSItems(fetchedVariants.map(p => new Variant(p)));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    return <div className="p-4 h-screen bg-gray-100 dark:bg-gray-950 relative">
        <div className="flex flex-row justify-between items-center px-10">
            <div
                className="bg-[url('/Storix/pos-banner.png')] h-12 w-36 bg-cover bg-center rounded"
            />
            <div className="flex flex-col items-center w-150 gap-1 relative">
                <input
                    type="text"
                    placeholder="Search Products..."
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 
                        rounded-lg bg-white dark:bg-gray-800 
                        text-gray-900 dark:text-gray-200 
                        focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />

                {/* Dropdown */}
                <div
                    className="absolute top-full left-0 w-full mt-1 hidden
                        bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 
                        rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto py-2"
                >
                    {posItems.map((variant, index) => (
                        <div
                            key={index}
                            className="flex justify-between items-center px-4 py-2 
                                hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        >
                            <div>
                                <p className="text-lg font-semibold">{variant.product?.name}</p>
                                <p className="text-sm opacity-60">{Object.values(variant.attributes).join(" - ")}</p>
                            </div>
                            <p className="text-lg font-bold">₹200</p>
                        </div>
                    ))}
                </div>

                {/* Hidden Dark Mode */}
                <div className="hidden">
                    <DarkModeToggle />
                </div>
            </div>

        </div>

        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 absolute bottom-5 right-5">
                {error}
            </div>
        )}
    </div>
}

export default POSPage;
