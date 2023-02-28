"use client";

import React, { useState } from "react";

export const MultipleInputArticles = ({ formValues, setFormValues }) => {
  console.log(formValues);

  const handleChange = (i, e) => {
    const newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);
  };

  const addFormFields = () => {
    setFormValues([
      ...formValues,
      { title: "", link: "", excerpt: "", date: "" },
    ]);
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
      {formValues.map((element, index) => (
        <div
          className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6"
          key={index}
        >
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
              htmlFor="link"
              className="block text-sm font-medium text-gray-700"
            >
              Link
            </label>
            <div className="mt-1">
              <input
                type="url"
                name="link"
                id="link"
                value={element.link || ""}
                onChange={(e) => handleChange(index, e)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="excerpt"
              className="block text-sm font-medium text-gray-700"
            >
              Excerpt
            </label>
            <div className="mt-1">
              <textarea
                name="excerpt"
                id="excerpt"
                value={element.excerpt || ""}
                onChange={(e) => handleChange(index, e)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Published Date
            </label>
            <div className="mt-1">
              <input
                type="date"
                name="date"
                id="date"
                value={element.date || ""}
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
