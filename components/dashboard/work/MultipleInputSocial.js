"use client";

import { socialPlatforms } from "@/utils/utils";
import React, { useState } from "react";

export const MultipleInputSocial = ({ formValues, setFormValues }) => {
  console.log(formValues);

  const handleChange = (i, e) => {
    const newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);
  };

  const addFormFields = () => {
    setFormValues([
      ...formValues,
      { platform: socialPlatforms[0].name, link: "" },
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
              htmlFor="platform"
              className="block text-sm font-medium text-gray-700"
            >
              Platform
            </label>
            <div className="mt-1">
              <select
                id="platform"
                name="platform"
                value={element.platform || ""}
                defaultValue={element.platform || socialPlatforms[0].name}
                onChange={(e) => handleChange(index, e)}
                className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
              >
                {socialPlatforms.map((social) => {
                  return <option key={social.name}>{social.name}</option>;
                })}
              </select>
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
        <button className="button submit" type="submit">
          Submit
        </button>
      </div>
    </div>
  );
};
