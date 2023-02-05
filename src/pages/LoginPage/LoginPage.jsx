import React from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBInput
}
  from 'mdb-react-ui-kit';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { refreshTokenSetup } from '../../utils/refreshTokenSetup';
import "./style.css";
import { gapi } from "gapi-script";

const clientId = "197384081208-i1vn1iid7akchjifgqddici3ct19pcl7.apps.googleusercontent.com";

function App1() {
  const onSuccess = (res) => {
    window.gapi.load('client:auth2', () => {
      window.gapi.client.init({
        clientId: 'your client id will be display here',
        plugin_name: "chat"
      })
    })
    console.log('[Login Success] currentUser:', res.profileObj);
    console.log(res.tokenId);
    refreshTokenSetup(res);
  };
  const onFailure = (res) => {
    window.gapi.load('client:auth2', () => {
      window.gapi.client.init({
        clientId: 'your client id will be display here',
        plugin_name: "chat"
      })
    })
    console.log('[Login failed] res:', res);
  };
  const onSuccess2 = (res) => {
    localStorage.clear();
    // localStorage.removeItem('tokenId');
    window.gapi.load('client:auth2', () => {
      window.gapi.client.init({
        clientId: 'your client id will be display here',
        plugin_name: "chat"
      })
    })
    console.log('Logout successfully');
    alert('Logout made successfully');
  };
  return (
    <div>
      <MDBContainer className='container p-4 my-5 border bg-info'>

        <MDBCard>
          <MDBRow className='g-0'>

            <MDBCol md='6'>
              <MDBCardImage src='https://image.thanhnien.vn/w1024/Uploaded/2023/puqgfdmzs-co/2022_04_24/fpt3-1647.jpg' alt="login form" className='rounded-start w-100 h-100' />
            </MDBCol>

            <MDBCol md='6'>
              <MDBCardBody className='d-flex flex-column'>

                <MDBCol className=''>
                  <MDBCardImage src='https://upload.wikimedia.org/wikipedia/vi/1/1d/Logo_%C4%90%E1%BA%A1i_h%E1%BB%8Dc_FPT.png' className='rounded-start w-100 h-100' />
                </MDBCol>

                <h5 className="fw-normal my-4 pb-3 text-center" style={{ letterSpacing: '1px', color: 'green' }}>Sign In</h5>

                <div>

                  <GoogleLogin
                    clientId={clientId}
                    buttonText="Login"
                    onSuccess={onSuccess}
                    onFailure={onFailure}
                    cookiePolicy={'single_host_origin'}
                    style={{ marginTop: '100px' }}
                    isSignedIn={true}
                  />
                </div>
                <div>
                  <GoogleLogout
                    clientId={clientId}
                    buttonText="Logout"
                    onLogoutSuccess={onSuccess2}
                  ></GoogleLogout>
                </div>

                <div className='d-flex flex-row justify-content-start'>
                  <a href="#!" className="small text-muted me-1">Terms of use.</a>
                  <a href="#!" className="small text-muted">Privacy policy</a>
                </div>
              </MDBCardBody>
            </MDBCol>

          </MDBRow>
        </MDBCard>

      </MDBContainer>
    </div>
  );
}

// function Logout(){
//   const onSuccess=()=>{
//     alert('Logout made successfully');
//   };
//   return(
//     <div>
//       <GoogleLogout 
//       clientId={clientId}
//       buttonText="Logout"
//       onLogoutSuccess={onSuccess}
//       ></GoogleLogout>
//     </div>
//   );
// }

export default App1;