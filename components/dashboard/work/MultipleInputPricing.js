"use client";

import { currencies } from "@/utils/currencies";
import { socialPlatforms } from "@/utils/utils";
import React, { useState } from "react";

export const MultipleInpuPricing = ({ formValues, setFormValues }) => {
  const handleChange = (i, e) => {
    const newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);
  };

  const addFormFields = () => {
    setFormValues([
      ...formValues,
      { currency: currencies[0].cc, title: "", price: 0 },
    ]);
  };

  const removeFormFields = (i) => {
    const newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };

  return (
    <div>
      {formValues.map((element, index) => (
        <div
          className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6"
          key={index}
        >
          <div className="sm:col-span-2">
            <label
              htmlFor="currency"
              className="block text-sm font-medium text-gray-700"
            >
              Currency
            </label>
            <div className="mt-1">
              <select
                id="currency"
                name="currency"
                value={element.currency || ""}
                // defaultValue={element.currency || currencies[0].name}
                onChange={(e) => handleChange(index, e)}
                className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
              >
                {currencies.map((currency) => {
                  return (
                    <option key={currency.cc}>
                      {currency.cc} ({currency.name})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="title"
                id="title"
                value={element.title || ""}
                onChange={(e) => handleChange(index, e)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="price"
                id="price"
                value={element.price || ""}
                onChange={(e) => handleChange(index, e)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          {index ? (
            <button
              type="button"
              className="sm:col-span-3"
              onClick={() => removeFormFields(index)}
            >
              Remove
            </button>
          ) : null}
        </div>
      ))}

      <div className="button-section">
        <button
          className="button add"
          type="button"
          onClick={() => addFormFields()}
        >
          Add
        </button>
      </div>
    </div>
  );
};
