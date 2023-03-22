import React, { useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { RiNotification3Line } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";

import avatar from "../assets/avatar.jpg";
import { Notification, UserProfile } from ".";
import { useStateContext } from "../contexts/ContextProvider";
import { SOCKET_URL } from "../utils/constants";
import { Badge } from "antd";

const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button
      type="button"
      onClick={customFunc}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray"
    >
      <span
        style={{ background: dotColor }}
        className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
      />
      {icon}
    </button>
  </TooltipComponent>
);

const Navbar = () => {
  const [notiData, setNotiData] = useState([{}]);
  const {
    currentColor,
    activeMenu,
    setActiveMenu,
    isClicked,
    handleClick,
    screenSize,
    setScreenSize,
    isShowNoti,
    setIsShowNoti
  } = useStateContext();

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [screenSize]);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  useEffect(() => {
    fetchNoti();
    setIsShowNoti(true);
  }, [notiData]);

  const fetchNoti = () => {
    fetch(`${SOCKET_URL}/noti`)
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setNotiData(resp.noti);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const handleActiveMenu = () => {
    setActiveMenu(!activeMenu);
    console.log("MENU", activeMenu);
  };
  return (
    <div className="flex justify-between p-2 md:mx-6 relative">
      <NavButton
        title="Menu"
        customFunc={handleActiveMenu}
        color={currentColor}
        icon={<AiOutlineMenu />}
      />
      <div className="flex">
        <Badge count={notiData.length} offset={["-15", "1"]} size="small">
          <NavButton
            title="Notification"
            customFunc={() => handleClick("notification")}
            color={currentColor}
            icon={<RiNotification3Line />}
          />
        </Badge>
        <TooltipComponent content="Profile" position="BottomCenter">
          <div
            className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
            onClick={() => handleClick("userProfile")}
          >
            <img src={avatar} className="rounded-full w-8 h-8" alt="Avatar" />
            <p>
              <span className="text-gray-400 text-14">Hi, </span>{" "}
              <span className="text-gray-400 font-bold ml-1 text-14">
                Lecturer
              </span>
            </p>
            <MdKeyboardArrowDown className="text-gray-400 text-14" />
          </div>
        </TooltipComponent>

        {isClicked.notification && <Notification notiData={notiData} />}
        {isClicked.userProfile && <UserProfile />}
      </div>
    </div>
  );
};

export default Navbar;
