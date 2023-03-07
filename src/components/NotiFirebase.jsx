import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { requestForToken } from "../firebase/firebase";

const NotiFirebase = () => {
  const [isTokenFound, setIsTokenFound] = useState(false);

  console.log("Render upper here");
  useEffect(() => {
    let data;

    async function tokenFunc() {
      console.log("Go here");
      data = await requestForToken(isTokenFound);
      if (data) {
        console.log("Token is: ", data);
      }
      return data;
    }
    console.log("Render here");
    tokenFunc().then(() => setIsTokenFound(true));
  }, [isTokenFound]);
  return <Toaster />;
};

export default NotiFirebase;
