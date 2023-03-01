"use client";

import Header from "@/components/Header";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../../../firebase/firebaseClient";
import Loading from "../../loading";
import { Switch } from "@headlessui/react";
import { classNames } from "@/utils/utils";
import { MultipleInputPastWork } from "@/components/dashboard/work/MultipleInputPastWork";
import { MultipleInputSocial } from "@/components/dashboard/work/MultipleInputSocial";
import { MultipleInputArticles } from "@/components/dashboard/work/MultipleInputArticles";
import Dashboard from "@/components/dashboard/Dashboard";
import Head from "next/head";
import { Html } from "next/document";

export default function Page() {
  const [user, userLoading] = useAuthState(firebase.auth());
  const [extendedUser, setExtendeduser] = useState(null);
  const [extendedUserComplete, setExtendeduserComplete] = useState(null);

  const [socialLinks, setSocialLinks] = useState([{ platform: "", link: "" }]);
  const [pastWork, setPastWork] = useState([
    { company: "", period: "", position: "" },
  ]);
  const [pricing, setPricing] = useState([
    { currency: "", title: "", price: 0 },
  ]);
  const [articles, setArticles] = useState([
    { title: "", link: "", excerpt: "", date: "" },
  ]);

  // If the user is not logged in, redirect to the login page
  useEffect(() => {
    if (!user && !userLoading) {
      redirect("/login");
    }
  }, []);

  useEffect(() => {
    if (extendedUser) {
      if (extendedUser.past_work) {
        setPastWork(extendedUser.past_work);
      }

      if (extendedUser.social_links) {
        setSocialLinks(extendedUser.social_links);
      }

      if (extendedUser.pricing) {
        setPricing(extendedUser.pricing);
      }

      if (extendedUser.articles) {
        setArticles(extendedUser.articles);
      }
    }
  }, [extendedUser]);

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
              setExtendeduserComplete(doc.data());
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

  // a function that receive name and value and modify the state
  const handleHire = (e) => {
    setExtendeduser({
      ...extendedUser,
      ["available_to_hire"]: !extendedUser.available_to_hire,
    });
    console.log(extendedUser);
  };

  // a function that receive the event and submit the form
  const handleSubmit = (e) => {
    e.preventDefault();

    // add pastwork to the extendedUser object
    extendedUser.past_work = pastWork;

    // add social links to the extendedUser object
    extendedUser.social_links = socialLinks;

    // add pricing to the extendedUser object
    extendedUser.pricing = pricing;

    // add articles to the extendedUser object
    extendedUser.articles = articles;

    firebase.firestore().collection("users").doc(user.uid).set(
      {
        work: extendedUser,
      },
      { merge: true }
    );
  };

  return (
    <>
      <Dashboard user={user} extendedUser={extendedUserComplete}>
        {extendedUser ? (
          <>
            <div className="mx-auto max-w-6xl my-8 px-4 pb-11">
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
                        This information will be displayed publicly so be
                        careful what you share.
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
                            placeholder="Web Development"
                            value={extendedUser.industry}
                            onChange={handleChange}
                            className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6 sm:space-y-5">
                      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                        <label
                          htmlFor="current_position"
                          className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                        >
                          Your current position
                        </label>
                        <div className="mt-1 sm:col-span-2 sm:mt-0">
                          <input
                            type="text"
                            name="current_position"
                            id="current_position"
                            autoComplete="current_position"
                            placeholder="Senior Front-End Developer"
                            value={extendedUser.current_position}
                            onChange={handleChange}
                            className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6 sm:space-y-5">
                      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5"></div>
                      <Switch.Group
                        as="div"
                        className="flex items-center justify-between"
                      >
                        <span className="flex flex-grow flex-col">
                          <Switch.Label
                            as="span"
                            className="text-sm font-medium text-gray-900"
                            passive
                          >
                            Available to hire
                          </Switch.Label>
                          <Switch.Description
                            as="span"
                            className="text-sm text-gray-500"
                          >
                            Nulla amet tempus sit accumsan. Aliquet turpis sed
                            sit lacinia.
                          </Switch.Description>
                        </span>
                        <Switch
                          checked={extendedUser.available_to_hire}
                          onChange={handleHire}
                          id="available_to_hire"
                          className={classNames(
                            extendedUser.available_to_hire
                              ? "bg-indigo-600"
                              : "bg-gray-200",
                            "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={classNames(
                              extendedUser.available_to_hire
                                ? "translate-x-5"
                                : "translate-x-0",
                              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                            )}
                          />
                        </Switch>
                      </Switch.Group>
                    </div>
                  </div>

                  <MultipleInputPastWork
                    formValues={pastWork}
                    setFormValues={setPastWork}
                  />

                  <MultipleInputSocial
                    formValues={socialLinks}
                    setFormValues={setSocialLinks}
                  />

                  <MultipleInputArticles
                    formValues={articles}
                    setFormValues={setArticles}
                  />
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
    </>
  );
}
