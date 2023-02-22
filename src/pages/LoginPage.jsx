import React, { useState } from "react";
import { refreshTokenSetup } from "../utils/refreshTokenSetup";
import backGroundImage from "../assets/background.jpg";
import logo from "../assets/fptLogo.png";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import { useStateContext } from "../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";
import { gapi } from "gapi-script";
import axios from 'axios';

const clientId =
  "197384081208-i1vn1iid7akchjifgqddici3ct19pcl7.apps.googleusercontent.com";

const LoginPage = () => {
  const { setIsLoginPage } = useStateContext();
  const navigate = useNavigate();
  const setUsers = useState([]);
  const onSuccess = (res) => {
    // fetch('https://fpt-cft.herokuapp.com/v1/api/authentication/login-google', {
    //   method: "POST",
    //   headers: { "content-type": "application/json" },
    //   body: JSON.stringify("tokenId" , res.tokenId),
    // })
    //   .then((resp) => {
    //     console.log("RES", resp);
    //     alert("Login successfully");
    //     setIsLoginPage(true);
    //     navigate("/overview");
    //     console.log(res.tokenId);
    //     localStorage.setItem("isLogin", "false");
    //   })
    //   .catch((err) => {
    //     console.log(err.message);
    //   });
    // axios({
    //   url: 'https://fpt-cft.herokuapp.com/v1/api/authentication/login-google',
    //   method: 'POST',
    //   data: {
    //     tokenId: res.tokenId,
    //   }
    // }).then((value) => {
      console.log(res);
      alert("Login successfully");
      setIsLoginPage(true);
      navigate("/overview");
      if(res.googleId === "100421662222806025199"){
      console.log("Admin");
      }else{
        console.log("user");
      }
    // })
    // .catch((err) => {
    //       console.log(err.message);
    //     });
    console.log(res.tokenId);
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
    <div className='bg-[#f7bb60] h-[100vh] flex flex-nowrap'>
      <div className='rounded m-auto items-center bg-[#FFFFFF] shadow-md'>
        <div className='flex flex-row flex-wrap items-center'>
          <div>
            <div>
              <img className="rounded-r-2xl w-780" src={process.env.PUBLIC_URL + './FPTU.jpg'} alt="FPT image" />
            </div>
          </div>
          <div className="pl-20 pr-20 flex flex-col items-center">
            <img className="rounded d-block" src={process.env.PUBLIC_URL + './logoFPT.png'} alt="Logo" width="160" height="200" />
            <h5 className="text-center text-l font-bold tracking-tight text-gray-900 dark:text-white">
              Welcome back
            </h5>
            <div className="p-1 pt-3 bg-danger text-white text-center">
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
