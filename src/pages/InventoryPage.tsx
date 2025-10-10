
import { useState } from 'react';
import Table from '../components/Table';
import Form from '../components/Form';
import type { FormField } from '../components/Form';
import { Product } from '../types/models';

const InventoryPage = () => {
    const [products, setProducts] = useState<Product[]>([]);

    const [showModal, setShowModal] = useState(false);

    const columns = [
        { header: 'ID', accessor: 'id' as const },
        { header: 'Name', accessor: 'name' as const },
        { header: 'Category', accessor: 'category' as const },
        { header: 'Price', accessor: 'price' as const },
        { header: 'Quantity', accessor: 'quantity' as const },
    ];

    const productFormFields: FormField<Product>[] = [
        { name: 'name', label: 'Product Name', type: 'text' },
        { name: 'category', label: 'Category', type: 'select', options: ['Electronics', 'Furniture', 'Kitchenware', 'Stationery'] },
        { name: 'price', label: 'Price', type: 'number' },
        { name: 'quantity', label: 'Quantity', type: 'number' },
    ];

    const handleAddProduct = (newProduct: Product) => {
        const productWithId = { ...newProduct, id: products.length + 1 };
        setProducts(prev => [...prev, productWithId]);
        setShowModal(false);
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Inventory</h1>
                <button onClick={() => setShowModal(true)} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Add Product
                </button>
            </div>

            <Table<Product> columns={columns} data={products} />

            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Product</h3>
                            <div className="mt-2 px-7 py-3">
                                <Form<Product>
                                    fields={productFormFields}
                                    onSubmit={handleAddProduct}
                                    initialData={{ id: 0, name: '', category: '', price: 0, quantity: 0 }}
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
