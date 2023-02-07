import React from "react";
import { refreshTokenSetup } from "../utils/refreshTokenSetup";
import backGroundImage from "../assets/background.jpg";
import logo from "../assets/fptLogo.png";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import { useStateContext } from "../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";
import { gapi } from "gapi-script";

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
    setIsLoginPage(false);
    navigate("/overview");
    console.log("[Login Success] currentUser:", res.profileObj);
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
  const onSuccess2 = () => {
    localStorage.clear();
    // localStorage.removeItem('tokenId');
    window.gapi.load("client:auth2", () => {
      window.gapi.client.init({
        clientId: "your client id will be display here",
        plugin_name: "chat",
      });
    });
    console.log("Logout successfully");
    alert("Logout made successfully");
  };
  return (
    <div className='bg-[#FF9900] h-[100vh] flex'>
      <div className='container m-auto h-[90vh] items-center bg-[#FFFFFF] rounded-md shadow-md'>
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
    // <div className="justify-between h-full flex items-center bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-900">
    //   <div className="gap-5 flex flex-col justify-between p-8 leading-normal">
    //     <img src={logo} alt="Background Image" />
    //     <h5 className="text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
    //       Welcome back
    //     </h5>
    //     <GoogleLogin
    //       clientId={clientId}
    //       buttonText="Login"
    //       onSuccess={onSuccess}
    //       onFailure={onFailure}
    //       cookiePolicy={"single_host_origin"}
    //       style={{ marginTop: "100px" }}
    //       isSignedIn={true}
    //       prompt="select_account"
    //     />
    //     <GoogleLogout
    //       clientId={clientId}
    //       buttonText="Logout"
    //       onLogoutSuccess={onSuccess2}
    //     />
    //   </div>
    //   <div>
    //     <img
    //       className="object-cover rounded-l-3xl max-h-96"
    //       src={backGroundImage}
    //       alt="Background Image"
    //     />
    //   </div>
    // </div>
  );
};

export default LoginPage;
