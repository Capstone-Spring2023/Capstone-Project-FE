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
    <div className='bg-[#FF9900] h-[100vh] flex'>
      <div className='container m-auto h-[80vh] items-center bg-[#FFFFFF] rounded-md shadow-md'>
        <div className='lg:grid grid-cols-2 gap-5 items-center'>
          <div className='h-[80vh] p-4'>
            <div className='bg-[#F6F6F6] rounded-sm'>
              <img className="w-full rounded" src={process.env.PUBLIC_URL + './FPTU.jpg'} alt="Show info" />
            </div>
          </div>
          <div className="px-25">
            <img className="rounded mx-auto d-block" src={process.env.PUBLIC_URL + './logoFPT.png'} alt="Cinque Terre" width="160" height="200" />
            <h5 className="text-center text-l font-bold tracking-tight text-gray-900 dark:text-white">
              Welcome back
            </h5>
            <div className="mx-auto p-1 bg-danger text-white text-center">
              <GoogleLogin
                clientId={clientId}
                buttonText="Login with Google"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={"single_host_origin"}
                style={{ marginTop: "100px" }}
                isSignedIn={true}
                prompt="select_account"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
