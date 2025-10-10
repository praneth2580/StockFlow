
import React, { useState, useCallback } from 'react';

export interface FormField<T> {
  name: keyof T;
  label: string;
  type: 'text' | 'number' | 'select';
  options?: string[];
}

interface FormProps<T extends object> {
  fields: FormField<T>[];
  onSubmit: (data: T) => void;
  initialData: T;
}

const Form = <T extends object>({ fields, onSubmit, initialData }: FormProps<T>) => {
  const [formData, setFormData] = useState<T>(initialData);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isNumeric = type === 'number';
    setFormData(prev => ({
      ...prev,
      [name]: isNumeric ? Number(value) : value,
    }));
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(initialData); // Reset form after submission
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow-md">
      {fields.map(field => (
        <div key={String(field.name)} className="flex flex-col">
          <label htmlFor={String(field.name)} className="mb-1 text-sm font-medium text-gray-700">
            {field.label}
          </label>
          {field.type === 'select' ? (
            <select
              id={String(field.name)}
              name={String(field.name)}
              value={String(formData[field.name] || '')}
              onChange={handleChange}
              className="p-2 border rounded"
            >
              <option value="">Select an option</option>
              {field.options?.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={String(field.name)}
              name={String(field.name)}
              type={field.type}
              value={String(formData[field.name] || '')}
              onChange={handleChange}
              className="p-2 border rounded"
            />
          )}
        </div>
      ))}
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Submit
      </button>
    </form>
  );
};

export default Form;
