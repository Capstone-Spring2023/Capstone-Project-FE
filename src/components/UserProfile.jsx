import React, { useEffect, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { Button, ModalAnt3 } from "./index";
import { MdOutlineCancel } from "react-icons/md";
import avatar from "../assets/avatar.jpg";
import { userProfileData } from "../data/dummy";
import { useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import "firebase/firestore";
import { getAuth } from "firebase/auth";
import Button2 from "react-bootstrap/Button";
import "./GoogleButton.css";
import { firebaseConfig } from "../utils/constants";
import { BASE_URL_API } from "../utils/constants";
import { Badge, Descriptions, Modal } from "antd";
import { toast } from "react-hot-toast";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const UserProfile = () => {
  const navigate = useNavigate();

  const { setIsClicked, initialState, setIsLoginPage, setActiveMenu } = useStateContext();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [roleId, setRoleId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk2 = () => {
    setIsModalOpen(false);
  }
  const handleOk = () => {
    setIsModalOpen(false);
    setIsInputDisabled(true);
    confirmAlert({
      title: 'Confirm',
      message: 'Are you sure you want to update your profile?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            const examData = {
              fullName: fullName,
              phone: phone,
              address: address,
              roldId: roleId
            };
            toast.promise(
              fetch(`${BASE_URL_API}/leader/profile/updateLeader/5`, {
                method: "PUT",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(examData),
              })
                .then((res) => {
                  console.log("RES", res);
                  setIsModalOpen(true);
                })
                .catch((err) => {
                  console.log(err.message);
                }),
              {
                loading: "Saving...",
                success: <b>Update Profile successfully</b>,
                error: <b>Could not save.</b>,
              }
            );
          }
        },
        {
          label: 'No',
          onClick: () => { }
        }
      ]
    });
  };
  const handleFullNameChange = (event) => {
    setFullName(event.target.value);
  };
  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };
  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };
  useEffect(() => {
    fetch(`${BASE_URL_API}/leader/profile/getLeader/5`)
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setFullName(resp.data.fullName);
        setPhone(resp.data.phone);
        setAddress(resp.data.address);
        setRoleId(resp.data.roldId);
        console.log(resp);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const onSuccess2 = () => {
    setIsClicked(initialState);
    setIsLoginPage(true);
    setActiveMenu(false);
    sessionStorage.removeItem("email");
    localStorage.setItem("isLogin", "true");
    localStorage.setItem("isActiveMenu", "false");
    navigate("/");
  };
  return (
    <>
      <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
        <img className="rounded-full h-24 w-24" src={avatar} alt="Avatar" />
        <div>
          <p className="font-semibold text-xl dark:text-gray-200">{fullName}</p>
          <p className="text-gray-500 text-sm dark:text-gray-400">Admin</p>
          <p className="text-gray-500 text-sm font-semibold dark:text-gray-400">
            {sessionStorage.getItem("email")}
          </p>
        </div>
      </div>
      <div >
        <div>
          <label htmlFor="fullName" className="text-sm font-medium mb-1">Full Name</label>
          <input id="fullName" type="text" value={fullName} onChange={handleFullNameChange} className="border rounded-md px-3 py-2 w-full" disabled={isInputDisabled} />
        </div>

        <div>
          <label htmlFor="phone" className="text-sm font-medium mb-1">Phone</label>
          <input id="phone" type="text" value={phone} onChange={handlePhoneChange} className="border rounded-md px-3 py-2 w-full" disabled={isInputDisabled} />
        </div>

        <div>
          <label htmlFor="address" className="text-sm font-medium mb-1">Address</label>
          <input id="address" type="text" value={address} onChange={handleAddressChange} className="border rounded-md px-3 py-2 w-full" disabled={isInputDisabled} />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div className="my-5">
          <button
            key="submit"
            type="default"
            onClick={handleOk}
            style={{
              backgroundColor: "#fff",
              color: "#A9A9A9",
              padding: "6px 8px",
              border: "2px solid #A9A9A9",
              borderRadius: "4px",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            }}
          >
            <span>Update Profile</span>
          </button>
        </div>

        <hr className="mb-5" style={{ height: "1px", width: "300px", backgroundColor: "black" }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Button2
            className="google-btn"
            variant="primary"
            size="sm"
            onClick={onSuccess2}
            style={{
              backgroundColor: "#fff",
              color: "#000000",
              border: "2px solid #000000",
              borderRadius: "4px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              height: "40px",
              width: "200px"
            }}
          >
            <div className="google-icon-wrapper">
              <img
                className="google-icon"
                src="./logoGoogle.png"
                alt="Google Icon"
              />
            </div>
            <h4 className="btn-text" style={{ color: "#000000" }}>Sign Out</h4>
          </Button2>

        </div>
      </div>

    </>
  );
};

export default UserProfile;
