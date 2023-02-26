// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import firebase from "../../firebase/firebaseClient";

export default async function handler(req, res) {
  const { username } = req.query;

  const usersRef = firebase.firestore().collection("users");
  const snapshot = await usersRef.where("username", "==", username).get();
  if (snapshot.empty) {
    res.status(404).json({
      error: "Page not found",
    });
  }

  res.status(200).json(snapshot.docs[0].data());
}
