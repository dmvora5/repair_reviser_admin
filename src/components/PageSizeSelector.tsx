"use client";

import React from "react";

interface PageSizeSelectorProps {
  value: number;
  onChange: (newPageSize: number) => void;
  options?: number[];
  className?: string;
}

const PageSizeSelector: React.FC<PageSizeSelectorProps> = ({
  value,
  onChange,
  options = [10, 20, 50, 100],
  className = "",
}) => {
  return (
    <div className={`flex items-center gap-2 text-white ${className}`}>
      <label htmlFor="pageSize" className="text-sm">
        Show:
      </label>
      <select
        id="pageSize"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="bg-[#1E1E2E] text-white px-3 py-2 rounded-md border border-gray-600 text-sm"
      >
        {options.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
      <span className="text-sm">records per page</span>
    </div>
  );
};

export default PageSizeSelector;
