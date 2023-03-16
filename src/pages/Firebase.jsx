import React from "react";
import { FirebaseProvider } from "@useweb/use-firebase";
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import { firebaseConfig } from "../utils/constants";

const Firebase = ({ children }) => {
  // firebaseConfig is required

  const firebaseApp = initializeApp(firebaseConfig);
  const messaging = getMessaging(firebaseApp);

  const envIsDev = process.env.NODE_ENV === "development";

  const vapidKey = process.env.REACT_APP_VAPID_KEY; // vapidKey is required
  return (
    <FirebaseProvider
      firebaseConfig={firebaseConfig}
      firebaseApp={firebaseApp}
      envIsDev={envIsDev}
      messaging={messaging}
      messagingOptions={{
        vapidKey,
      }}
    >
      {children}
    </FirebaseProvider>
  );
};

export default Firebase;
