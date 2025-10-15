import { useState, useEffect } from 'react';
import Table from '../components/Table';
import Form from '../components/Form';
import type { FormField } from '../components/Form';
import type { IPurchase } from '../types/models';
import { getPurchases, createPurchase, deletePurchase } from '../models/purchase';

const PurchasesPage = () => {
  const [purchases, setPurchases] = useState<IPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const columns = [
    { header: 'ID', accessor: 'id' as keyof IPurchase },
    { header: 'Product ID', accessor: 'productId' as keyof IPurchase },
    { header: 'Supplier ID', accessor: 'supplierId' as keyof IPurchase },
    { header: 'Quantity', accessor: 'quantity' as keyof IPurchase },
    { header: 'Cost Price', accessor: 'costPrice' as keyof IPurchase },
    { header: 'Total', accessor: 'total' as keyof IPurchase },
    { header: 'Date', accessor: 'date' as keyof IPurchase },
    { header: 'Invoice', accessor: 'invoiceNumber' as keyof IPurchase },
    {
      header: 'Actions',
      accessor: (row: IPurchase) => (
        <button
          onClick={() => handleDeletePurchase(row.id)}
          className="text-red-600 hover:text-red-800"
        >
          Delete
        </button>
      )
    }
  ];

  const purchaseFormFields: FormField<IPurchase>[] = [
    { name: 'productId', label: 'Product ID', type: 'text' },
    { name: 'supplierId', label: 'Supplier ID', type: 'text' },
    { name: 'quantity', label: 'Quantity', type: 'number' },
    { name: 'costPrice', label: 'Cost Price', type: 'number' },
    { name: 'invoiceNumber', label: 'Invoice Number', type: 'text' }
  ];

  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedPurchases = await getPurchases();
      setPurchases(fetchedPurchases);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load purchases');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPurchase = async (formData: Partial<IPurchase>) => {
    try {
      setError(null);
      const purchaseData = {
        productId: formData.productId || '',
        supplierId: formData.supplierId,
        quantity: formData.quantity || 0,
        costPrice: formData.costPrice || 0,
        total: (formData.quantity || 0) * (formData.costPrice || 0),
        date: new Date().toISOString(),
        invoiceNumber: formData.invoiceNumber
      };
      
      await createPurchase(purchaseData);
      await loadPurchases();
      setShowModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add purchase');
    }
  };

  const handleDeletePurchase = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this purchase?')) return;
    
    try {
      setError(null);
      await deletePurchase(id);
      await loadPurchases();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete purchase');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Purchases</h1>
        <button 
          onClick={() => setShowModal(true)} 
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Purchase
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
          data={purchases}
        />
      )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Purchase</h3>
              <div className="mt-2 px-7 py-3">
                <Form<IPurchase>
                  fields={purchaseFormFields}
                  onSubmit={handleAddPurchase}
                  initialData={{
                    id: '',
                    productId: '',
                    supplierId: '',
                    quantity: 0,
                    costPrice: 0,
                    total: 0,
                    date: new Date().toISOString(),
                    invoiceNumber: ''
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

export default PurchasesPage;
