// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { redirect } from "next/navigation";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../../firebase/firebaseClient";

export default async function handler(req, res) {
  const { url } = req.query;

  const citiesRef = firebase.firestore().collection("users");
  const snapshot = await citiesRef.where("url", "==", url).get();
  if (snapshot.empty) {
    res.status(404).json({
      error: "Page not found",
    });
  }

  res.status(200).json(snapshot.docs[0].data());
}
