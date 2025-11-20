import React, { useState, useCallback } from "react";

type JSONValue = string | number;

interface JSONInputProps {
  id: string;
  name: string;
  value?: Record<string, JSONValue>;
  onChange: (data: Record<string, JSONValue>) => void;
}

export const JSONInput: React.FC<JSONInputProps> = ({
//   id, 
//   name,
  value = {},
  onChange,
}) => {
  const [rows, setRows] = useState<[string, JSONValue][]>(
    Object.entries(value)
  );

  // Handle key or value change for a row
  const handleRowChange = useCallback(
    (index: number, key: string, value: JSONValue) => {
      const newRows = [...rows];
      newRows[index] = [key, typeof value === 'string' ? value.toUpperCase() : value];
      setRows(newRows);

      // Convert array back to object
      const jsonObject = Object.fromEntries(newRows) as Record<string, JSONValue>;
      onChange(jsonObject);
    },
    [rows, onChange]
  );

  // Add new row
  const addRow = useCallback(() => {
    const newRows = [...rows, ["", ""]];
    const converted = newRows.filter((r): r is [string, JSONValue] => Array.isArray(r) && r.length === 2);
    setRows(converted);
  }, [rows]);

  // Remove row
  const removeRow = useCallback(
    (index: number) => {
      const newRows = rows.filter((_, i) => i !== index);
      setRows(newRows);
      onChange(Object.fromEntries(newRows) as Record<string, JSONValue>);
    },
    [rows, onChange]
  );

  return (
    <div className="p-3 w-full border rounded-lg bg-gray-50 w-full">
      {/* <h3 className="font-semibold mb-3">JSON Key-Value Editor</h3> */}

      <div className="flex flex-col gap-3">
        {rows.map(([k, v], index) => (
          <div
            key={index}
            className="grid grid-cols-3 gap-2 items-center"
          >
            {/* Key Input */}
            <input
              type="text"
              placeholder="Key"
              value={k}
              onChange={(e) =>
                handleRowChange(index, e.target.value, v)
              }
              className="border p-2 rounded"
            />

            {/* Value Input (string or number) */}
            <input
              type="text"
              placeholder="Value"
              value={String(v)}
              onChange={(e) => {
                const value = e.target.value;
                const parsed: JSONValue =
                  value.trim() === "" ? "" : isNaN(Number(value)) ? value : Number(value);

                handleRowChange(index, k, parsed);
              }}
              className="border p-2 rounded"
            />

            {/* Delete */}
            <button
              onClick={() => removeRow(index)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              X
            </button>
          </div>
        ))}
      </div>

      {/* Add Row */}
      <button
        onClick={addRow}
        type="button"
        className="mt-3 bg-blue-600 text-white w-full py-1 px-2 rounded"
      >
        ＋
      </button>
    </div>
  );
};
