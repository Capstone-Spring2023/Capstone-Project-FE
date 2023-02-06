import React from "react";
import { refreshTokenSetup } from "../utils/refreshTokenSetup";
import backGroundImage from "../assets/background.jpg";
import logo from "../assets/fptLogo.png";
import { GoogleLogin } from "react-google-login";
import { useNavigate } from "react-router-dom";
import { gapi } from "gapi-script";
import { useStateContext } from "../contexts/ContextProvider";

const clientId =
  "197384081208-i1vn1iid7akchjifgqddici3ct19pcl7.apps.googleusercontent.com";

const LoginPage = () => {
  const { setIsLoginPage } = useStateContext();
  const navigate = useNavigate();
  const onSuccess = (res) => {
    window.gapi.load("client:auth2", () => {
      window.gapi.client.init({
        clientId: "your client id will be display here",
        plugin_name: "chat",
      });
    });
    fetch("", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(res),
    })
      .then((resp) => {
        console.log("RES", resp);
        alert("Login successfully");
        setIsLoginPage(true);
        navigate("/overview");
        // localStorage.setItem("isLogin", "false");
      })
      .catch((err) => {
        console.log(err.message);
      });
    refreshTokenSetup(res);
  };
  const onFailure = (res) => {
    localStorage.clear();
    window.gapi.load("client:auth2", () => {
      window.gapi.client.init({
        clientId: "your client id will be display here",
        plugin_name: "chat",
      });
    });
    console.log("[Login failed] res:", res);
  };
  return (
    <div className="justify-between flex items-center bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
      <div className="gap-5 flex flex-col justify-between p-8 leading-normal">
        <img src={logo} alt="Background Image" />
        <h5 className="text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Welcome back
        </h5>
        <GoogleLogin
          clientId={clientId}
          buttonText="Login"
          onSuccess={onSuccess}
          onFailure={onFailure}
          cookiePolicy={"single_host_origin"}
          style={{ marginTop: "100px" }}
          isSignedIn={true}
          prompt="select_account"
        />
      </div>
      <div>
        <img
          className="object-cover rounded-l-3xl max-h-96"
          src={backGroundImage}
          alt="Background Image"
        />
      </div>
    </div>
  );
};

export default LoginPage;
