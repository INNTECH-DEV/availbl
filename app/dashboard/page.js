"use client";

import Dashboard from "@/components/dashboard/Dashboard";
import Header from "@/components/Header";
import { countries } from "@/utils/countries";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../../firebase/firebaseClient";
import Loading from "../loading";

export default function Page() {
  const [user, userLoading] = useAuthState(firebase.auth());
  const [extendedUser, setExtendeduser] = useState(null);

  // If the user is not logged in, redirect to the login page
  useEffect(() => {
    if (!user && !userLoading) {
      redirect("/login");
    }
  }, []);

  // Create a document inside the users collection with the name of the uid of the user
  useEffect(() => {
    if (user) {
      firebase
        .firestore()
        .collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          setExtendeduser(doc.data());
        });
    }
  }, [user]);

  // a function that receive name and value and modify the state
  const handleChange = (e) => {
    setExtendeduser({ ...extendedUser, [e.target.id]: e.target.value });
    console.log(extendedUser);
  };

  // a function that send the state and save it in firestore
  const handleSubmit = (e) => {
    e.preventDefault();

    // before adding the user to the database, we need to check if the url is already taken by another user
    // if it is, we need to show an error message
    // if it is not, we can add the user to the database
    firebase

      .firestore()
      .collection("users")
      .where("username", "==", extendedUser.username)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.size === 0) {
          firebase
            .firestore()
            .collection("users")
            .doc(user.uid)
            .set(extendedUser, { merge: true })
            .then(() => {
              console.log("Document successfully written!");
            })
            .catch((error) => {
              console.error("Error writing document: ", error);
            });
        } else {
          // check if querysnapshot contains the current user
          // if it does, we can update the document
          // if it does not, we need to show an error message
          querySnapshot.forEach((doc) => {
            if (doc.id === user.uid) {
              firebase
                .firestore()
                .collection("users")
                .doc(user.uid)
                .set(extendedUser, { merge: true })
                .then(() => {
                  console.log("Document successfully written!");
                })
                .catch((error) => {
                  console.error("Error writing document: ", error);
                });
            } else {
              console.log("url already taken");
            }
          });
        }
      });
  };

  // create a function for uploading the image to firebase storage
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(file.name);
    fileRef.put(file).then(() => {
      // get download url of the file
      fileRef.getDownloadURL().then((url) => {
        // update the state with the new url
        setExtendeduser({ ...extendedUser, profile_image: url });
      });
    });
  };

  return (
    <Dashboard user={user} extendedUser={extendedUser}>
      {extendedUser ? (
        <>
          <div className="mx-auto max-w-6xl my-8 px-4 pb-12">
            <form
              className="space-y-8 divide-y divide-gray-200"
              onSubmit={handleSubmit}
            >
              <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                <div className="space-y-6 sm:space-y-5">
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Profile
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      This information will be displayed publicly so be careful
                      what you share.
                    </p>
                  </div>

                  <div className="space-y-6 sm:space-y-5">
                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Username
                      </label>
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <div className="flex max-w-lg rounded-md shadow-sm">
                          <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                            availbl.io/
                          </span>
                          <input
                            type="text"
                            name="username"
                            id="username"
                            autoComplete="username"
                            value={extendedUser.username}
                            onChange={handleChange}
                            className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="long_description"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        About (Long Description)
                      </label>
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <textarea
                          id="long_description"
                          name="long_description"
                          rows={4}
                          className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={extendedUser.long_description}
                          onChange={handleChange}
                        />
                        <p className="mt-2 text-sm text-gray-500">
                          Write a few sentences about yourself.
                        </p>
                      </div>
                    </div>

                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="short_description"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        About (Short Description)
                      </label>
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <textarea
                          id="short_description"
                          name="short_description"
                          rows={2}
                          className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={extendedUser.short_description}
                          onChange={handleChange}
                        />
                        <p className="mt-2 text-sm text-gray-500">
                          Write a few sentences about yourself.
                        </p>
                      </div>
                    </div>

                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="headline"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Headline
                      </label>
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <input
                          type="text"
                          name="headline"
                          id="headline"
                          autoComplete="headline"
                          value={extendedUser.headline}
                          onChange={handleChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="tags"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Profile tags (delimited by comma)
                      </label>
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <input
                          type="text"
                          name="tags"
                          id="tags"
                          autoComplete="tags"
                          value={extendedUser.tags}
                          onChange={handleChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="photo"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Photo
                      </label>
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <div className="flex items-center">
                          {/* <span className="h-12 w-12 overflow-hidden rounded-full bg-gray-100"> */}
                          {extendedUser.profile_image ? ( // if there is a profile image, show it
                            <img
                              src={extendedUser.profile_image}
                              className="h-28 w-28 overflow-hidden rounded-full bg-gray-100 object-cover"
                            />
                          ) : (
                            <svg
                              className="h-full w-full text-gray-300"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          )}
                          {/* </span> */}
                          <button
                            type="button"
                            className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            <label
                              htmlFor="profile_image"
                              className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                            >
                              <span>Upload profile picture</span>
                              <input
                                id="profile_image"
                                name="profile_image"
                                type="file"
                                className="sr-only"
                                onChange={handleImageUpload}
                              />
                            </label>
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* 
                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="cover-photo"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Cover photo
                      </label>
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <div className="flex max-w-lg justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                          <div className="space-y-1 text-center">
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                              aria-hidden="true"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="profile_image"
                                className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                              >
                                <span>Upload a file</span>
                                <input
                                  id="profile_image"
                                  name="profile_image"
                                  type="file"
                                  className="sr-only"
                                  onChange={handleImageUpload}
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF up to 10MB
                            </p>
                          </div>
                        </div>
                        <img
                          src={extendedUser.profile_image}
                          className="mt-4"
                        />
                      </div>
                    </div> */}
                  </div>
                </div>

                <div className="space-y-6 pt-8 sm:space-y-5 sm:pt-10">
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Personal Information
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      Use a permanent address where you can receive mail.
                    </p>
                  </div>
                  <div className="space-y-6 sm:space-y-5">
                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="first_name"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        First name
                      </label>
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <input
                          type="text"
                          name="first_name"
                          id="first_name"
                          autoComplete="first_name"
                          value={extendedUser.first_name}
                          onChange={handleChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="last_name"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Last name
                      </label>
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <input
                          type="text"
                          name="last_name"
                          id="last_name"
                          autoComplete="last_name"
                          value={extendedUser.last_name}
                          onChange={handleChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="public_email"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Email address
                      </label>
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <input
                          id="public_email"
                          name="public_email"
                          type="email"
                          autoComplete="public_email"
                          value={extendedUser.public_email}
                          onChange={handleChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="phone_number"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Phone number
                      </label>
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <input
                          id="phone_number"
                          name="public_email"
                          type="tel"
                          autoComplete="phone_number"
                          value={extendedUser.phone_number}
                          onChange={handleChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="website_link"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Website link
                      </label>
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <input
                          id="website_link"
                          name="website_link"
                          type="url"
                          autoComplete="website_link"
                          value={extendedUser.website_link}
                          onChange={handleChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="newsletter_link"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Newsletter link
                      </label>
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <input
                          id="newsletter_link"
                          name="newsletter_link"
                          type="url"
                          autoComplete="newsletter_link"
                          value={extendedUser.newsletter_link}
                          onChange={handleChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Country
                      </label>
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <select
                          id="country"
                          name="country"
                          autoComplete="country-name"
                          value={extendedUser.country}
                          defaultValue={extendedUser.country}
                          onChange={handleChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                        >
                          {countries.map((country) => {
                            return (
                              <option key={country.name}>{country.name}</option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div className="space-y-6 divide-y divide-gray-200 pt-8 sm:space-y-5 sm:pt-10">
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Notifications
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      We'll always let you know about important changes, but you
                      pick what else you want to hear about.
                    </p>
                  </div>
                  <div className="space-y-6 divide-y divide-gray-200 sm:space-y-5">
                    <div className="pt-6 sm:pt-5">
                      <div role="group" aria-labelledby="label-email">
                        <div className="sm:grid sm:grid-cols-3 sm:items-baseline sm:gap-4">
                          <div>
                            <div
                              className="text-base font-medium text-gray-900 sm:text-sm sm:text-gray-700"
                              id="label-email"
                            >
                              By Email
                            </div>
                          </div>
                          <div className="mt-4 sm:col-span-2 sm:mt-0">
                            <div className="max-w-lg space-y-4">
                              <div className="relative flex items-start">
                                <div className="flex h-5 items-center">
                                  <input
                                    id="comments"
                                    name="comments"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  />
                                </div>
                                <div className="ml-3 text-sm">
                                  <label
                                    htmlFor="comments"
                                    className="font-medium text-gray-700"
                                  >
                                    Comments
                                  </label>
                                  <p className="text-gray-500">
                                    Get notified when someones posts a comment
                                    on a posting.
                                  </p>
                                </div>
                              </div>
                              <div className="relative flex items-start">
                                <div className="flex h-5 items-center">
                                  <input
                                    id="candidates"
                                    name="candidates"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  />
                                </div>
                                <div className="ml-3 text-sm">
                                  <label
                                    htmlFor="candidates"
                                    className="font-medium text-gray-700"
                                  >
                                    Candidates
                                  </label>
                                  <p className="text-gray-500">
                                    Get notified when a candidate applies for a
                                    job.
                                  </p>
                                </div>
                              </div>
                              <div className="relative flex items-start">
                                <div className="flex h-5 items-center">
                                  <input
                                    id="offers"
                                    name="offers"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  />
                                </div>
                                <div className="ml-3 text-sm">
                                  <label
                                    htmlFor="offers"
                                    className="font-medium text-gray-700"
                                  >
                                    Offers
                                  </label>
                                  <p className="text-gray-500">
                                    Get notified when a candidate accepts or
                                    rejects an offer.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="pt-6 sm:pt-5">
                      <div role="group" aria-labelledby="label-notifications">
                        <div className="sm:grid sm:grid-cols-3 sm:items-baseline sm:gap-4">
                          <div>
                            <div
                              className="text-base font-medium text-gray-900 sm:text-sm sm:text-gray-700"
                              id="label-notifications"
                            >
                              Push Notifications
                            </div>
                          </div>
                          <div className="sm:col-span-2">
                            <div className="max-w-lg">
                              <p className="text-sm text-gray-500">
                                These are delivered via SMS to your mobile
                                phone.
                              </p>
                              <div className="mt-4 space-y-4">
                                <div className="flex items-center">
                                  <input
                                    id="push-everything"
                                    name="push-notifications"
                                    type="radio"
                                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <label
                                    htmlFor="push-everything"
                                    className="ml-3 block text-sm font-medium text-gray-700"
                                  >
                                    Everything
                                  </label>
                                </div>
                                <div className="flex items-center">
                                  <input
                                    id="push-email"
                                    name="push-notifications"
                                    type="radio"
                                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <label
                                    htmlFor="push-email"
                                    className="ml-3 block text-sm font-medium text-gray-700"
                                  >
                                    Same as email
                                  </label>
                                </div>
                                <div className="flex items-center">
                                  <input
                                    id="push-nothing"
                                    name="push-notifications"
                                    type="radio"
                                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <label
                                    htmlFor="push-nothing"
                                    className="ml-3 block text-sm font-medium text-gray-700"
                                  >
                                    No push notifications
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>

              <div className="pt-5 fixed bottom-4">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </>
      ) : (
        <Loading />
      )}
    </Dashboard>
  );
}
