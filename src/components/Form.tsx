import React, { useEffect, useRef, useState } from "react";
import {
  parseAttributes,
  useEmailChange,
  useGenericChange,
  usePhoneChange,
} from "../utils";
import { JSONInput } from "./JSONInput";

export interface OptionData {
  value: string | number;
  label: string;
}

export interface FormField<T> {
  name: keyof T;
  label: string;
  type: "text" | "number" | "select" | "radio" | "phone" | "email" | "json";
  options?: OptionData[];
  dependsOn?: keyof T;
  getOptions?: (
    value: any,
    allData: Record<string, any>
  ) => OptionData[] | Promise<OptionData[]>;
}

interface FormProps<T extends object> {
  fields: FormField<T>[];
  onSubmit: (data: Record<string, any>) => void;
  onClose: () => void;
  initialData: T;
}

const Form = <T extends object>({
  fields,
  onSubmit,
  onClose,
  initialData,
}: FormProps<T>) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);

  const [dynamicOptions, setDynamicOptions] = useState<
    Record<string, OptionData[]>
  >({});

  const prevDataRef = useRef<Record<string, any>>(formData);

  // Extract dependent fields
  const dependentFields = fields.filter(
    (f) => f.dependsOn && f.getOptions
  ) as Array<{
    name: keyof T;
    label: string;
    dependsOn: keyof T;
    getOptions: (v: any, all: Record<string, any>) => OptionData[] | Promise<OptionData[]>;
  }>;

  /**
   * --- FIXED DYNAMIC OPTIONS LOADING ---
   */
  useEffect(() => {
    const prev = prevDataRef.current;

    Object.keys(formData).forEach(async (changedKey) => {
      if (formData[changedKey] !== prev[changedKey]) {
        // find dynamic field whose dependsOn matches changedKey
        const target = dependentFields.find(
          (f) => String(f.dependsOn) === changedKey
        );

        if (target) {
          const result = await target.getOptions(formData[changedKey], formData);
          console.log("OPTIONS FOR", target.name, result);

          setDynamicOptions((prev) => ({
            ...prev,
            [String(target.name)]: result ?? [],
          }));
        }
      }
    });

    prevDataRef.current = formData;
  }, [formData]);

  console.log("dynamicOptions: ", dynamicOptions)

  const handleChange = useGenericChange(setFormData);
  const handlePhoneChange = usePhoneChange(setFormData, 10);
  const handleEmailChange = useEmailChange(setFormData);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(initialData);
    onClose();
  };

  /**
   * --------------------
   *   INPUT RENDERER
   * --------------------
   */
  const renderInput = (field: FormField<T>) => {
    const key = String(field.name);
    console.log(field)

    switch (field.type) {
      case "select": {
        console.log("key, ", key)
        const isDynamic = field.dependsOn && field.getOptions;

        const dynamicKey = String(field.name);

        const finalOptions = isDynamic
          ? dynamicOptions[dynamicKey] ?? []
          : field.options ?? [];


        // console.log("SELECT RENDER → key:", dynamicKey, key);
        // console.log("SELECT OPTIONS:", finalOptions);

        return (
          <select
            id={key}
            name={key}
            value={formData[key] ?? ""}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg"
          >
            <option value="">Select an option</option>
            {finalOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      }

      case "text":
      case "number":
        return (
          <input
            id={key}
            name={key}
            type={field.type}
            value={formData[key] ?? ""}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg"
          />
        );

      case "radio":
        return (
          <div className="flex gap-3 items-center">
            {field.options?.map((opt) => (
              <div key={opt.value} className="flex items-center gap-2">
                <input
                  id={key + "_" + opt.value}
                  name={key}
                  type="radio"
                  value={opt.value}
                  checked={formData[key] === opt.value}
                  onChange={handleChange}
                />
                <label htmlFor={key + "_" + opt.value}>{opt.label}</label>
              </div>
            ))}
          </div>
        );

      case "phone":
        return (
          <input
            id={key}
            name={key}
            type="text"
            value={formData[key] ?? ""}
            onChange={handlePhoneChange}
            className="p-3 border border-gray-300 rounded-lg"
          />
        );

      case "email":
        return (
          <input
            id={key}
            name={key}
            type="email"
            value={formData[key] ?? ""}
            onChange={handleEmailChange}
            className="p-3 border border-gray-300 rounded-lg"
          />
        );

      case "json":
        return (
          <JSONInput
            id={key}
            name={key}
            value={parseAttributes(JSON.stringify(formData[key] ?? "{}"))}
            onChange={(data) => {
              setFormData((prev) => ({
                ...prev,
                [key]: JSON.stringify(data),
              }));
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-5xl mx-auto p-6 bg-white rounded-xl"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {fields.map((field) => (
          <div key={String(field.name)} className="flex flex-col">
            <label className="mb-2 text-sm font-semibold text-gray-700">
              {field.label}
            </label>
            {renderInput(field)}
          </div>
        ))}
      </div>

      <div className="flex gap-4 items-center px-4 py-3">
        <button
          type="submit"
          className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={onClose}
          className="mt-8 w-full bg-slate-500 text-white py-3 rounded-lg font-semibold text-lg"
        >
          Close
        </button>
      </div>
    </form>
  );
};

export default Form;
