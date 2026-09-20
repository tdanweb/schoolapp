import React from "react";


/* =========================================================
   FORM SECTION
========================================================= */

export function FormSection({ children, className = "" }) {
  return (
    <div
      className={`border-b border-gray-100 px-5 py-7 sm:px-8 ${className}`}
    >
      {children}
    </div>
  );
}


/* =========================================================
   INPUT
========================================================= */

export function Input({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  required = false,
  disabled = false,
  className = "",
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          {label}

          {required && (
            <span className="ml-1 text-red-500">*</span>
          )}
        </label>
      )}

      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition
        placeholder:text-gray-400
        focus:border-blue-500 focus:ring-2 focus:ring-blue-100
        disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
      />
    </div>
  );
}


/* =========================================================
   SELECT
========================================================= */

export function Select({
  label,
  value,
  onChange,
  options = [],
  placeholder = "",
  required = false,
  disabled = false,
  className = "",
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          {label}

          {required && (
            <span className="ml-1 text-red-500">*</span>
          )}
        </label>
      )}

      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition
        focus:border-blue-500 focus:ring-2 focus:ring-blue-100
        disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
      >
        <option value="">
          {placeholder || `Select ${label || "option"}`}
        </option>

        {options.map((option, index) => {
          const value =
            typeof option === "object"
              ? option.value
              : option;

          const label =
            typeof option === "object"
              ? option.label
              : option;

          return (
            <option
              key={option?.id || value || index}
              value={value}
            >
              {label}
            </option>
          );
        })}
      </select>
    </div>
  );
}
