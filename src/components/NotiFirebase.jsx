import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { requestForToken } from "../firebase/firebase";

const NotiFirebase = () => {
  const [isTokenFound, setIsTokenFound] = useState(false);

  console.log("Token found", isTokenFound);

  useEffect(() => {
    let data;
    async function tokenFunc() {
      console.log('Go here');
      data = await requestForToken(setIsTokenFound);
      if (data) {
        console.log("Token is: ", data);
      }
      return data;
    }

    tokenFunc();
  }, [setIsTokenFound]);
  return <Toaster />;
};

export default NotiFirebase;
