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
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk2 = () => {
    setIsModalOpen(false);
  }
  const handleOk = () => {
    setIsModalOpen(false);
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
          onClick: () => {}
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
    <div className="nav-item absolute right-1 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg dark:text-gray-200">User Profile</p>
        <Button
          icon={<MdOutlineCancel />}
          color="rgb(153,171,180)"
          bgHoverColor="light-gray"
          size="2xl"
          borderRadius="50%"
        />
      </div>
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
      <div>
        {/* {userProfileData.map((item, index) => (
          <div
            key={index}
            className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer dark:hover:bg-[#42464D]"
          >
            <button
              type="button"
              style={{ color: item.iconColor, backgroundColor: item.iconBg }}
              className="text-xl rounded-lg p-3 hover:bg-light-gray"
            >
              {item.icon}
            </button>
            <div>
              <p className="font-semibold dark:text-gray-200">{item.title}</p>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                {item.desc}
              </p>
            </div>
          </div>
        ))} */}
        <div className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer dark:hover:bg-[#42464D]">
          <button
            onClick={showModal}
            className="hover:text-white hover:bg-blue-500"
            style={{
              color: "#03C9D7",
              backgroundColor: '#E5FAFB',
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              fontSize: "14px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
            }}
          >My Profile</button>

          <Modal
            centered={true}
            open={isModalOpen}
            title={`${fullName}`}
            onOk={handleOk}
            footer={[
              <button key="submit"
                type="default"
                onClick={handleOk}
                style={{
                  float: "left",
                  backgroundColor: "#fff",
                  color: "green",
                  padding: "8px 16px",
                  border: "2px solid #03c9d7",
                  borderRadius: "4px",
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)"
                }}>
                Update Profile
              </button>,
              <button type="default"
                onClick={handleOk2}
                style={{
                  backgroundColor: "#fff",
                  color: "#03c9d7",
                  padding: "8px 16px",
                  border: "2px solid #03c9d7",
                  borderRadius: "4px",
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)"
                }}>Ok</button>
            ]}
          >
            <Descriptions layout="vertical">
              <Descriptions.Item label="Full Name">
                <input type="text" value={fullName} onChange={handleFullNameChange} />
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                <input type="text" value={phone} onChange={handlePhoneChange} />
              </Descriptions.Item>
              <Descriptions.Item label="Address">
                <input type="text" value={address} onChange={handleAddressChange} />
              </Descriptions.Item>
            </Descriptions>
          </Modal>
        </div>
      </div>
      <div className="mt-5">
        <Button2
          className="google-btn"
          variant="primary"
          size="lg"
          onClick={onSuccess2}
        >
          <div className="google-icon-wrapper">
            <img
              className="google-icon"
              src="./logoGoogle.png"
              alt="Google Icon"
            />
          </div>
          <h4 className="btn-text">Sign Out</h4>
        </Button2>
      </div>
    </div>
  );
};

export default UserProfile;
