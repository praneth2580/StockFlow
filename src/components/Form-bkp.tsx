import React, { useEffect, useRef, useState } from 'react';
import { parseAttributes, useEmailChange, useGenericChange, useJSONChange, usePhoneChange } from '../utils';
import { JSONInput } from './JSONInput';

export interface OptionData {
  value: string | number;
  label: string;
}

export interface FormField<T> {
  name: keyof T;
  label: string;
  type: 'text' | 'number' | 'select' | 'radio' | 'phone' | 'email' | "json";
  options?: OptionData[];
  dependsOn?: keyof T;
  getOptions?: (value: any, allData: Record<string, string | number | any>) => OptionData[];
}

interface FormProps<T extends object> {
  fields: FormField<T>[];
  onSubmit: (data: Record<string, string | number | any>) => void;
  onClose: () => void;
  initialData: T;
}

const Form = <T extends object>({ fields, onSubmit, onClose, initialData }: FormProps<T>) => {
  const [formData, setFormData] = useState<Record<string, string | number | any>>(initialData);
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, OptionData[]>>({ 123: [{ value: "A", label: "aA" }] });
  const prevDataRef = useRef<Record<string, string | number | any>>(formData);
  const uniqueDependableInputs = fields.filter(data => data.dependsOn && data.getOptions).map(data => ({
    dependsOn: data.dependsOn,
    value: data.name,
    getOptions: data.getOptions
  }));
  const uniqueDependableInputKeys = uniqueDependableInputs.map(data => data.dependsOn);

  useEffect(() => {
    const prev = prevDataRef.current;

    Object.keys(formData).forEach(async key => {
      if (formData[key] !== prev[key]) {
        const idx = uniqueDependableInputKeys.indexOf(key);
        if (idx != -1) {
          const optiondata = await uniqueDependableInputs[idx]?.getOptions?.(formData[key], formData);
          setDynamicOptions(prev => ({
            ...prev,
            [String(uniqueDependableInputs[idx].value)]: optiondata || []
          }))
        }
      }
    });

    prevDataRef.current = formData;
  }, [formData]); // runs on every form change


  const handleChange = useGenericChange(setFormData);
  const handlePhoneChange = usePhoneChange(setFormData, 10);
  const handleEmailChange = useEmailChange(setFormData);
  // const handleAttributesChange = useJSONChange(setFormData);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(initialData);
    onClose();
  };

  const renderInput = (field: FormField<T>) => {
    switch (field.type) {
      case 'select': {
        const hasDynamic = field.dependsOn && field.getOptions;
        // console.log("hasDynamic:", field.label, field.dependsOn, field.getOptions, hasDynamic)

        // If dynamic select
        const finalOptions = hasDynamic ? dynamicOptions[String(field.name)] ?? [] : field.options;

        console.log("finalOptions:", field.label, finalOptions)

        return (
          <select
            id={String(field.name)}
            name={String(field.name)}
            value={String(formData[field.name as string] ?? '')}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg"
          >
            <option value="">Select an option</option>
            {finalOptions?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      }

      case "text":
        return <input
          id={String(field.name)}
          name={String(field.name)}
          type={field.type}
          value={String(formData[field.name as string] ?? '')}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

      case "number":
        return <input
          id={String(field.name)}
          name={String(field.name)}
          type={field.type}
          value={String(formData[field.name as string] ?? '')}
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
                value={String(formData[field.name as string] ?? '')}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <label htmlFor={String(field.name) + option}>{option}</label>
            </div>)}
        </div>

      case "phone":
        return <input
          id={String(field.name)}
          name={String(field.name)}
          type={field.type}
          value={String(formData[field.name as string] ?? '')}
          onChange={handlePhoneChange}
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

      case "email":
        return <input
          id={String(field.name)}
          name={String(field.name)}
          type={field.type}
          value={String(formData[field.name as string] ?? '')}
          onChange={handleEmailChange}
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

      case "json":
        return <JSONInput
          id={String(field.name)}
          name={String(field.name)}
          value={parseAttributes(JSON.stringify(formData[field.name as string]))}
          onChange={(data) => {
            setFormData(prev => ({
              ...prev,
              [String(field.name)]: JSON.stringify(data),
            }));
          }}
        />

      default:
        break;
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      // className="w-full max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg"
      className="w-full max-w-5xl mx-auto p-6 bg-white rounded-xl"
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
