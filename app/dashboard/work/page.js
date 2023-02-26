"use client";

import Header from "@/components/Header";
import { MultipleInput } from "@/components/MultipleInput";
import { countries } from "@/utils/countries";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../../../firebase/firebaseClient";
import Loading from "../../loading";

export default function Page() {
  const [user, userLoading] = useAuthState(firebase.auth());
  const [extendedUser, setExtendeduser] = useState(null);
  const [socialLinks, setSocialLinks] = useState([]);

  // If the user is not logged in, redirect to the login page
  useEffect(() => {
    if (!user && !userLoading) {
      redirect("/login");
    }
  }, []);

  // get the work field from the user
  // if the user does not have a work field, create one
  useEffect(() => {
    if (user) {
      firebase
        .firestore()
        .collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            if (doc.data().work) {
              setExtendeduser(doc.data().work);
            } else {
              firebase
                .firestore()
                .collection("users")
                .doc(user.uid)
                .set(
                  {
                    work: {},
                  },
                  { merge: true }
                )
                .then(() => {
                  console.log("Document successfully written!");
                })
                .catch((error) => {
                  console.error("Error writing document: ", error);
                });
              setExtendeduser({});
            }
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    }
  }, [user]);

  // a function that receive name and value and modify the state
  const handleChange = (e) => {
    setExtendeduser({ ...extendedUser, [e.target.id]: e.target.value });
    console.log(extendedUser);
  };

  // a function that receive the event and submit the form
  const handleSubmit = (e) => {
    e.preventDefault();
    firebase.firestore().collection("users").doc(user.uid).set(
      {
        work: extendedUser,
      },
      { merge: true }
    );
  };

  return (
    <>
      {extendedUser ? (
        <>
          <Header user={user} />
          <div className="mx-auto max-w-6xl my-8">
            <form
              className="space-y-8 divide-y divide-gray-200"
              onSubmit={handleSubmit}
            >
              <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                <div className="space-y-6 sm:space-y-5">
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Work
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      This information will be displayed publicly so be careful
                      what you share.
                    </p>
                  </div>

                  <div className="space-y-6 sm:space-y-5">
                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="industry"
                        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                      >
                        Industry
                      </label>
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <input
                          type="text"
                          name="industry"
                          id="industry"
                          autoComplete="industry"
                          value={extendedUser.industry}
                          onChange={handleChange}
                          className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <MultipleInput state={socialLinks} setState={setSocialLinks} />
                {/* 
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
                          name="ffirst_name"
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
                </div> */}

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

              <div className="pt-5">
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
    </>
  );
}
