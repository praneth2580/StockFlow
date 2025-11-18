
import { useState, useEffect } from 'react';
import Table from '../components/Table';
import Form from '../components/Form';
import type { FormField } from '../components/Form';
import { Product, Variant, type IProduct, type IVariant } from '../types/models';
import { getProducts, createProduct, deleteProduct } from '../models/product';
import { createVariant, deleteVariant, getVariants } from '../models/variants';
import Modal from '../components/Modal';

const ProductPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const fetchedProducts = await getProducts();
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
        { header: 'Type', accessor: 'type' as keyof Product },
        { header: 'Unit*', accessor: 'baseUnit' as keyof Product },
        { header: 'Selling Price*', accessor: 'defaultSellingPrice' as keyof Product },
        { header: 'Profit Margin*', accessor: (row: Product) => row.baseProfitMargin },
        {
            header: 'Varients',
            accessor: (row: Product) => (
                <button
                    onClick={() => handleViewVarient(row.id)}
                    className="text-red-600 hover:text-red-800"
                >
                    View
                </button>
            )
        },
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
        { name: 'type', label: 'Type', type: 'select', options: ['simple', 'measured', 'variant'] },
        { name: 'hasVariants', label: 'Has Variants', type: 'radio', options: ['True', 'False'] },
        { name: 'barcode', label: 'Barcode', type: 'text' },
        { name: 'baseUnit', label: 'Base Unit', type: 'text' },
        { name: 'defaultCostPrice', label: 'Default Cost Price', type: 'number' },
        { name: 'defaultSellingPrice', label: 'Default Selling Price', type: 'number' }
    ];

    const handleAddProduct = async (formData: Partial<IProduct>) => {
        try {
            setError(null);
            const productData = {
                name: formData.name || '',
                category: formData.category || '',
                description: formData.description,
                type: formData.type || 'simple',
                hasVariants: formData.hasVariants || false,
                barcode: formData.barcode,
                baseUnit: formData.baseUnit,
                defaultCostPrice: formData.defaultCostPrice || 0,
                defaultSellingPrice: formData.defaultSellingPrice || 0
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

    const handleViewVarient = async (id: string) => {
        try {
            setError(null);
            setSelectedProduct(id);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete product');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Product</h1>
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

            {/* {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="relative mx-auto p-5 border shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Product</h3>
                            <div className="mt-2 px-7 py-3">
                                <Form
                                    fields={productFormFields}
                                    onSubmit={handleAddProduct}
                                    onClose={() => setShowModal(false)}
                                    initialData={new Product({
                                        id: '',
                                        name: '',
                                        category: '',
                                        description: '',
                                        type: 'simple',
                                        hasVariants: false,
                                        barcode: '',
                                        baseUnit: '',
                                        defaultCostPrice: 0,
                                        defaultSellingPrice: 0,
                                        createdAt: new Date().toISOString(),
                                        updatedAt: new Date().toISOString()
                                    })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )} */}

            <Modal show={showModal} size='xl' onClose={() => setShowModal(false)} title='Add New Product'>
                <Form
                    fields={productFormFields}
                    onSubmit={handleAddProduct}
                    onClose={() => setShowModal(false)}
                    initialData={new Product({
                        id: '',
                        name: '',
                        category: '',
                        description: '',
                        type: 'simple',
                        hasVariants: false,
                        barcode: '',
                        baseUnit: '',
                        defaultCostPrice: 0,
                        defaultSellingPrice: 0,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    })}
                />
            </Modal>

            <Modal show={selectedProduct != null} size='xl' onClose={() => setSelectedProduct(null)} title='Variants'>
                <VariantsPage product_id={selectedProduct} />
            </Modal>
        </div>
    );
};

const VariantsPage = ({ product_id }: { product_id: string }) => {
    const [variants, setVariants] = useState<Variant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadVariants();
    }, []);

    const loadVariants = async () => {
        try {
            setLoading(true);
            setError(null);
            const fetchedVariants = await getVariants();
            setVariants(fetchedVariants.map(p => new Variant(p)));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { header: 'ID', accessor: 'id' as keyof Variant },
        // { header: 'Product ID', accessor: 'productId' as keyof Variant },
        { header: 'SKU', accessor: 'sku' as keyof Variant },
        {
            header: 'Attributes', accessor: (row: Variant) => <div className='flex gap-1 wrap'>{
                Object.entries(row.attributes)?.map(_variant => {
                    return <div className='rounded-full bg-blue-400 w-fit py-1 px-2 text-white uppercase font-bold'>{_variant[1]}</div>
                })}</div>
        },
        { header: 'Cost Price', accessor: 'costPrice' as keyof Variant },
        { header: 'Selling Price', accessor: 'sellingPrice' as keyof Variant },
        {
            header: 'Actions',
            accessor: (row: Variant) => (
                <button
                    onClick={() => handleDeleteVariant(row.id)}
                    className="text-red-600 hover:text-red-800"
                >
                    Delete
                </button>
            )
        }
    ];

    const variantFormFields: FormField<Variant>[] = [
        { name: 'sku', label: 'SKU', type: 'text' },
        { name: 'attributes', label: 'Attributes', type: 'text' },
        { name: 'costPrice', label: 'Cost Price', type: 'number' },
        { name: 'sellingPrice', label: 'Selling Price', type: 'number' },
    ];

    const handleAddProduct = async (formData: Partial<IVariant>) => {
        try {
            setError(null);
            const variantData = {
                productId: product_id,
                sku: formData.sku,
                attributes: formData.attributes || {},
                costPrice: formData.costPrice,
                sellingPrice: formData.sellingPrice,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            await createVariant(variantData);
            await loadVariants(); // Refresh the list
            setShowForm(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add product');
        }
    };

    const handleDeleteVariant = async (id: string) => {
        try {
            setError(null);
            await deleteVariant(id);
            await loadVariants(); // Refresh the list
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete product');
        }
    };

    return (
        <div className="container mx-auto p-4">
            {showForm ? (
                <>
                    <h3 className="text-lg leading-6 font-medium text-gray-900 text-center">Add New Variant</h3>
                    <div className="mt-2 px-7 py-3">
                        <Form
                            fields={variantFormFields}
                            onSubmit={handleAddProduct}
                            onClose={() => setShowForm(false)}
                            initialData={new Product({
                                id: '',
                                name: '',
                                category: '',
                                description: '',
                                type: 'simple',
                                hasVariants: false,
                                barcode: '',
                                baseUnit: '',
                                defaultCostPrice: 0,
                                defaultSellingPrice: 0,
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString()
                            })}
                        />
                    </div>
                </>
            ) : (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold"></h1>
                        <button
                            onClick={() => setShowForm(true)}
                            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Add Variant
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
                            data={variants}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

export default ProductPage;
