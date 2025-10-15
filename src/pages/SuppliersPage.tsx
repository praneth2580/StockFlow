import { useState, useEffect } from 'react';
import Table from '../components/Table';
import Form from '../components/Form';
import type { FormField } from '../components/Form';
import type { ISupplier } from '../types/models';
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../models/supplier';

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<ISupplier | null>(null);

  const columns = [
    { header: 'ID', accessor: 'id' as keyof ISupplier },
    { header: 'Name', accessor: 'name' as keyof ISupplier },
    { header: 'Contact Person', accessor: 'contactPerson' as keyof ISupplier },
    { header: 'Phone', accessor: 'phone' as keyof ISupplier },
    { header: 'Email', accessor: 'email' as keyof ISupplier },
    { header: 'Address', accessor: 'address' as keyof ISupplier },
    {
      header: 'Actions',
      accessor: (row: ISupplier) => (
        <div className="space-x-2">
          <button
            onClick={() => handleEdit(row)}
            className="text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteSupplier(row.id)}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  const supplierFormFields: FormField<ISupplier>[] = [
    { name: 'name', label: 'Supplier Name', type: 'text' },
    { name: 'contactPerson', label: 'Contact Person', type: 'text' },
    { name: 'phone', label: 'Phone', type: 'text' },
    { name: 'email', label: 'Email', type: 'text' },
    { name: 'address', label: 'Address', type: 'text' },
    { name: 'notes', label: 'Notes', type: 'text' }
  ];

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedSuppliers = await getSuppliers();
      setSuppliers(fetchedSuppliers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (supplier: ISupplier) => {
    setEditingSupplier(supplier);
    setShowModal(true);
  };

  const handleSubmit = async (formData: Partial<ISupplier>) => {
    try {
      setError(null);
      
      if (editingSupplier) {
        await updateSupplier({
          ...formData,
          id: editingSupplier.id
        });
      } else {
        await createSupplier({
          ...formData,
          name: formData.name || ''
        });
      }
      
      await loadSuppliers();
      setShowModal(false);
      setEditingSupplier(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save supplier');
    }
  };

  const handleDeleteSupplier = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this supplier?')) return;
    
    try {
      setError(null);
      await deleteSupplier(id);
      await loadSuppliers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete supplier');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Suppliers</h1>
        <button 
          onClick={() => setShowModal(true)} 
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Supplier
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
          data={suppliers}
        />
      )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
              </h3>
              <div className="mt-2 px-7 py-3">
                <Form<ISupplier>
                  fields={supplierFormFields}
                  onSubmit={handleSubmit}
                  initialData={editingSupplier || {
                    id: '',
                    name: '',
                    contactPerson: '',
                    phone: '',
                    email: '',
                    address: '',
                    notes: '',
                    createdAt: '',
                    updatedAt: ''
                  }}
                />
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingSupplier(null);
                  }}
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

export default SuppliersPage;
