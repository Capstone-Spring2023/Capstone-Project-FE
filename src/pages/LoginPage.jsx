import React from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import axios from "axios";
import "./GoogleButton.css";
import Button from "react-bootstrap/Button";
import { firebaseConfig } from "../utils/constants";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const Login = () => {
  const navigate = useNavigate();
  const { setIsLoginPage, setActiveMenu } = useStateContext();
  const onSuccess = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        axios({
          url: "https://fpt-cft.azurewebsites.net/v1/api/authentication/login-google",
          method: "POST",
          data: {
            tokenId: result._tokenResponse.oauthIdToken,
          },
        })
          .then((value) => {
            sessionStorage.setItem("roleName", value.data.data.roleName);
            sessionStorage.setItem("userId", value.data.data.userId);
            sessionStorage.setItem("email", value.data.data.email);
            sessionStorage.setItem("fullName", value.data.data.fullName);
            setIsLoginPage(false);
            setActiveMenu(true);
            localStorage.setItem("isLogin", "false");
            localStorage.setItem("isActiveMenu", "true");
            localStorage.setItem("SidebarReset", "true");
            navigate("/overview");
          })
          .catch((error) => {
            window.alert("please login with FPT account");
            console.log(error);
          });
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  return (
    <div className="bg-[#f7bb60] h-[100vh] flex flex-nowrap login-container">
      <div className="m-auto items-center bg-[#FFFFFF] shadow-md rounded-lg">
        <div className="flex flex-row flex-wrap items-center">
          <div>
            <div style={{ borderRadius: "8px 0 0 8px", overflow: "hidden" }}>
              <img
                className="rounded-r-3xl w-780"
                src={process.env.PUBLIC_URL + "./FPTU-HCM.jpg"}
                alt="FPT image"
              />
            </div>
          </div>
          <div className="pl-20 pr-20 flex flex-col items-center rounded-lg">
            <img
              className="rounded d-block"
              src={process.env.PUBLIC_URL + "./logoFPT.png"}
              alt="Logo"
              width="160"
              height="200"
            />
            <h5 className="text-center text-l font-bold tracking-tight text-gray-900 dark:text-white">
              Welcome back
            </h5>
            <div className="p-1 pt-3 bg-danger text-white text-center rounded-lg">
              <Button
                className="google-btn"
                variant="primary"
                size="lg"
                onClick={onSuccess}
                value="Login"
              >
                <div className="google-icon-wrapper">
                  <img
                    className="google-icon"
                    src="./logoGoogle.png"
                    alt="Google Icon"
                  />
                </div>
                <h4 className="btn-text">Sign in with Google</h4>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
