import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { firebaseConfig } from "../utils/constants";
import {getStorage} from "firebase/storage";

const app =initializeApp(firebaseConfig);
export const storage = getStorage(app);

const messaging = getMessaging();

export const requestForToken = () => {
  return getToken(messaging, { vapidKey: process.env.REACT_APP_VAPID_KEY })
    .then((currentToken) => {
      if (currentToken) {
        return currentToken;
        // Perform any other neccessary action with the token
      } else {
        // Show permission request UI
        console.log(
          "No registration token available. Request permission to generate one."
        );
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
    });
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
