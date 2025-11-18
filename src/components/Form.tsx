import React, { useState, useCallback, type MouseEventHandler } from 'react';

export interface FormField<T> {
  name: keyof T;
  label: string;
  type: 'text' | 'number' | 'select' | 'radio';
  options?: string[];
}

interface FormProps<T extends object> {
  fields: FormField<T>[];
  onSubmit: (data: T) => void;
  onClose: (data: MouseEventHandler) => void;
  initialData: T;
}

const Form = <T extends object>({ fields, onSubmit, onClose, initialData }: FormProps<T>) => {
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
    setFormData(initialData);
  };

  const renderInput = (field: FormField<T>) => {
    switch (field.type) {
      case 'select':
        return <select
          id={String(field.name)}
          name={String(field.name)}
          value={String(formData[field.name] ?? '')}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <option value="">Select an option</option>
          {field.options?.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

      case "text":
        return <input
          id={String(field.name)}
          name={String(field.name)}
          type={field.type}
          value={String(formData[field.name] ?? '')}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

      case "number":
        return <input
          id={String(field.name)}
          name={String(field.name)}
          type={field.type}
          value={String(formData[field.name] ?? '')}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

      case "radio":
        return <div className='flex gap-1 justify-center align-center'>
          {
            field.options?.map(option => <div className='flex gap-1'>
              <input
                id={String(field.name) + option}
                name={String(field.name)}
                type={field.type}
                value={String(formData[field.name] ?? '')}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <label htmlFor={String(field.name) + option}>{option}</label>
            </div>)}
        </div>

      default:
        break;
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {fields.map(field => (
          <div key={String(field.name)} className="flex flex-col">
            <label
              htmlFor={String(field.name)}
              className="mb-2 text-sm font-semibold text-gray-700"
            >
              {field.label}
            </label>
            {renderInput(field)}
          </div>
        ))}
      </div>

      <div className="flex gap-1 items-center px-4 py-3">
        <button
          type="submit"
          className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition"
        >
          Submit
        </button>
        <button
          onClick={onClose}
          className="mt-8 w-full bg-slate-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-slate-700 transition"
        >
          Close
        </button>
      </div>
    </form>
  );
};

export default Form;
