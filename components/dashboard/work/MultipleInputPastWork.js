"use client";

import React, { useState } from "react";

export const MultipleInputPastWork = ({ formValues, setFormValues }) => {
  console.log(formValues);

  const handleChange = (i, e) => {
    const newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);
  };

  const addFormFields = () => {
    setFormValues([...formValues, { company: "", period: "", position: "" }]);
  };

  const removeFormFields = (i) => {
    const newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(JSON.stringify(formValues));
  };

  return (
    <div>
      <div className="pt-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Past Work
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          This information will be displayed publicly so be careful what you
          share.
        </p>
      </div>
      {formValues.map((element, index) => (
        <div
          className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-4"
          key={index}
        >
          <div>
            <label
              htmlFor="company"
              className="block text-sm font-medium text-gray-700"
            >
              Company
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="company"
                id="company"
                value={element.company || ""}
                onChange={(e) => handleChange(index, e)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="period"
              className="block text-sm font-medium text-gray-700"
            >
              Period
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="period"
                id="period"
                value={element.period || ""}
                onChange={(e) => handleChange(index, e)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="position"
              className="block text-sm font-medium text-gray-700"
            >
              Position
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="position"
                id="position"
                value={element.position || ""}
                onChange={(e) => handleChange(index, e)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          {index ? (
            <div>
              <button
                type="button"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-4"
                onClick={() => removeFormFields(index)}
              >
                Remove
              </button>
            </div>
          ) : null}
        </div>
      ))}

      <div className="button-section">
        <button
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-4 mt-4"
          type="button"
          onClick={() => addFormFields()}
        >
          Add new past work
        </button>
      </div>
    </div>
  );
};
