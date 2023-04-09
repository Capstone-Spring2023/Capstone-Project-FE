import React, { useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";

import avatar from "../assets/avatar.jpg";
import { Notification, UserProfile } from ".";
import { useStateContext } from "../contexts/ContextProvider";
import { BASE_URL_API } from "../utils/constants";
import { Badge, Popover } from "antd";
import { BellOutlined } from "@ant-design/icons";

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
  const [openNoti, setOpenNoti] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const {
    currentColor,
    activeMenu,
    setActiveMenu,
    isClicked,
    handleClick,
    screenSize,
    setScreenSize,
    isShowNoti,
    setIsShowNoti,
  } = useStateContext();
  const fullName = sessionStorage.getItem("fullName");

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
  }, [notiData]);

  const fetchNoti = () => {
    fetch(`${BASE_URL_API}/Notifications/` + sessionStorage.getItem("userId"))
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setNotiData(resp.data);
        setIsShowNoti(true);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const hide = () => {
    setOpenNoti(false);
  };
  const handleOpenNotiChange = (newOpen) => {
    setOpenNoti(newOpen);
  };

  const handleOpenProfileChange = (open) => {
    setOpenProfile(open);
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
      <div className="flex items-center gap-3">
        <Badge count={notiData?.length} size="small">
          <Popover
            content={<Notification notiData={notiData} />}
            trigger="click"
            open={openNoti}
            onOpenChange={handleOpenNotiChange}
            placement="bottomRight"
          >
            <BellOutlined style={{ fontSize: 17, color: "cadetblue" }} />
          </Popover>
        </Badge>
        <Popover
          content={<UserProfile />}
          trigger="click"
          open={openProfile}
          onOpenChange={handleOpenProfileChange}
          placement="bottomRight"
        >
          <div className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg">
            <img src={avatar} className="rounded-full w-8 h-8" alt="Avatar" />
            <p>
              <span className="text-gray-400 text-14">Hi, </span>{" "}
              <span className="text-gray-400 font-bold ml-1 text-14">
                {fullName}
              </span>
            </p>
            <MdKeyboardArrowDown className="text-gray-400 text-14" />
          </div>
        </Popover>
      </div>
    </div>
  );
};

export default Navbar;
