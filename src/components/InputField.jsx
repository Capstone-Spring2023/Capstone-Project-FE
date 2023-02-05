import React from "react";
import { FaRocket } from "react-icons/fa";

const InputField = ({ label, title, placeHolder, icon, required, value, onChange }) => {
  return (
    <div>
      <label
        htmlFor={`${label}`}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {title}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          {icon}
        </div>
        <input
          type="text"
          id={`${label}`}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder={`${placeHolder}`}
          value={value}
          onChange={onChange}
          required={required}
        />
      </div>
    </div>
  );
};

export default InputField;
