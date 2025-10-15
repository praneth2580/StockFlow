import { useState, useEffect } from 'react';
import Table from '../components/Table';
import Form from '../components/Form';
import type { FormField } from '../components/Form';
import type { ISale } from '../types/models';
import { getSales, createSale, updateSale, deleteSale } from '../models/sale';

const SalesPage = () => {
  const [sales, setSales] = useState<ISale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const columns = [
    { header: 'ID', accessor: 'id' as keyof ISale },
    { header: 'Product ID', accessor: 'productId' as keyof ISale },
    { header: 'Quantity', accessor: 'quantity' as keyof ISale },
    { header: 'Selling Price', accessor: 'sellingPrice' as keyof ISale },
    { header: 'Total', accessor: 'total' as keyof ISale },
    { header: 'Date', accessor: 'date' as keyof ISale },
    { header: 'Customer', accessor: 'customerName' as keyof ISale },
    { header: 'Payment Method', accessor: 'paymentMethod' as keyof ISale },
    {
      header: 'Actions',
      accessor: (row: ISale) => (
        <button
          onClick={() => handleDeleteSale(row.id)}
          className="text-red-600 hover:text-red-800"
        >
          Delete
        </button>
      )
    }
  ];

  const saleFormFields: FormField<ISale>[] = [
    { name: 'productId', label: 'Product ID', type: 'text' },
    { name: 'quantity', label: 'Quantity', type: 'number' },
    { name: 'sellingPrice', label: 'Selling Price', type: 'number' },
    { name: 'customerName', label: 'Customer Name', type: 'text' },
    { 
      name: 'paymentMethod', 
      label: 'Payment Method', 
      type: 'select',
      options: ['cash', 'card', 'upi', 'other']
    }
  ];

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedSales = await getSales();
      setSales(fetchedSales);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sales');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSale = async (formData: Partial<ISale>) => {
    try {
      setError(null);
      const saleData = {
        productId: formData.productId || '',
        quantity: formData.quantity || 0,
        sellingPrice: formData.sellingPrice || 0,
        total: (formData.quantity || 0) * (formData.sellingPrice || 0),
        date: new Date().toISOString(),
        customerName: formData.customerName,
        paymentMethod: formData.paymentMethod as "cash" | "card" | "upi" | "other"
      };
      
      await createSale(saleData);
      await loadSales();
      setShowModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add sale');
    }
  };

  const handleDeleteSale = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this sale?')) return;
    
    try {
      setError(null);
      await deleteSale(id);
      await loadSales();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete sale');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Sales</h1>
        <button 
          onClick={() => setShowModal(true)} 
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Sale
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
          data={sales}
        />
      )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Sale</h3>
              <div className="mt-2 px-7 py-3">
                <Form<ISale>
                  fields={saleFormFields}
                  onSubmit={handleAddSale}
                  initialData={{
                    id: '',
                    productId: '',
                    quantity: 0,
                    sellingPrice: 0,
                    total: 0,
                    date: new Date().toISOString(),
                    customerName: '',
                    paymentMethod: 'cash'
                  }}
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

export default SalesPage;
