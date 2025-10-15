
import { useState, useEffect } from 'react';
import Table from '../components/Table';
import Form from '../components/Form';
import type { FormField } from '../components/Form';
import { Product, type IProduct } from '../types/models';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../models/product';

const InventoryPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const fetchedProducts = await getProducts();
            console.log(fetchedProducts)
            setProducts(fetchedProducts.map(p => new Product(p)));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { header: 'ID', accessor: 'id' as keyof Product },
        { header: 'Name', accessor: 'name' as keyof Product },
        { header: 'Category', accessor: 'category' as keyof Product },
        { header: 'SKU', accessor: 'sku' as keyof Product },
        { header: 'Quantity', accessor: 'quantity' as keyof Product },
        { header: 'Cost Price', accessor: 'costPrice' as keyof Product },
        { header: 'Selling Price', accessor: 'sellingPrice' as keyof Product },
        { header: 'Profit Margin', accessor: (row: Product) => row.profitMargin },
        { header: 'Stock Status', accessor: (row: Product) => row.isLowStock() ? 'Low Stock' : 'In Stock' },
        { 
            header: 'Actions', 
            accessor: (row: Product) => (
                <button
                    onClick={() => handleDeleteProduct(row.id)}
                    className="text-red-600 hover:text-red-800"
                >
                    Delete
                </button>
            )
        }
    ];

    const productFormFields: FormField<Product>[] = [
        { name: 'name', label: 'Product Name', type: 'text' },
        { name: 'category', label: 'Category', type: 'select', options: ['Electronics', 'Furniture', 'Kitchenware', 'Stationery'] },
        { name: 'description', label: 'Description', type: 'text' },
        { name: 'sku', label: 'SKU', type: 'text' },
        { name: 'barcode', label: 'Barcode', type: 'text' },
        { name: 'quantity', label: 'Quantity', type: 'number' },
        { name: 'costPrice', label: 'Cost Price', type: 'number' },
        { name: 'sellingPrice', label: 'Selling Price', type: 'number' },
        { name: 'supplierId', label: 'Supplier ID', type: 'text' },
        { name: 'lowStockThreshold', label: 'Low Stock Alert Threshold', type: 'number' }
    ];

    const handleAddProduct = async (formData: Partial<IProduct>) => {
        try {
            setError(null);
            const productData = {
                name: formData.name || '',
                category: formData.category || '',
                description: formData.description,
                sku: formData.sku,
                barcode: formData.barcode,
                quantity: formData.quantity || 0,
                costPrice: formData.costPrice || 0,
                sellingPrice: formData.sellingPrice || 0,
                supplierId: formData.supplierId,
                lowStockThreshold: formData.lowStockThreshold
            };
            
            await createProduct(productData);
            await loadProducts(); // Refresh the list
            setShowModal(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add product');
        }
    };

    const handleDeleteProduct = async (id: string) => {
        try {
            setError(null);
            await deleteProduct(id);
            await loadProducts(); // Refresh the list
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete product');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Inventory</h1>
                <button 
                    onClick={() => setShowModal(true)} 
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Add Product
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <Table 
                    columns={columns} 
                    data={products}
                />
            )}

            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Product</h3>
                            <div className="mt-2 px-7 py-3">
                                <Form
                                    fields={productFormFields}
                                    onSubmit={handleAddProduct}
                                    initialData={new Product({
                                        id: '',
                                        name: '',
                                        category: '',
                                        description: '',
                                        sku: '',
                                        barcode: '',
                                        quantity: 0,
                                        costPrice: 0,
                                        sellingPrice: 0,
                                        supplierId: '',
                                        lowStockThreshold: 0,
                                        createdAt: new Date().toISOString(),
                                        updatedAt: new Date().toISOString()
                                    })}
                                />
                            </div>
                            <div className="items-center px-4 py-3">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryPage;
