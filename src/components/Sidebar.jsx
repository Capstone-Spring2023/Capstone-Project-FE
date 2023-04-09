import React from "react";
import { Link, NavLink } from "react-router-dom";
import { MdOutlineCancel } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { useStateContext } from "../contexts/ContextProvider";
import logo from "../assets/cft-logo.png";
import { links } from "../routes/index";

const Sidebar = () => {
  const { currentColor, activeMenu, setActiveMenu, screenSize } =
    useStateContext();
  const role = sessionStorage.getItem("roleName");

  const handleCloseSideBar = () => {
    if (activeMenu && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const activeLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md m-2";
  const normalLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2";
  console.log("LINK", links);
  console.log("ROLE", role);

  return (
    <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
      {activeMenu && (
        <>
          <div className="flex items-center justify-center mb-10 mt-5">
            <Link
              to="/"
              onClick={handleCloseSideBar}
              className="items-center gap-3 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900"
            >
              <img className="h-20 w-full" src={logo} alt="Logo" />
            </Link>
            <TooltipComponent content="Menu" position="BottomCenter">
              <button
                type="button"
                onClick={() => setActiveMenu((preActiveMenu) => !preActiveMenu)}
                style={{ color: currentColor }}
                className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
              >
                <MdOutlineCancel />
              </button>
            </TooltipComponent>
          </div>
          <div>
            {links.map((item) => (
              <div
                key={item.title}
                className="text-gray-400 m-3 mt-4 uppercase"
              >
                <p>{item.title}</p>
                {(item.links ?? []).map(
                  (Link) =>
                    Link &&
                    (Link.role === "General" || Link.role === role) && (
                      <NavLink
                        to={`/${Link.name}`}
                        key={Link.name}
                        onClick={handleCloseSideBar}
                        style={({ isActive }) => ({
                          backgroundColor: isActive ? currentColor : "",
                        })}
                        className={({ isActive }) =>
                          isActive ? activeLink : normalLink
                        }
                      >
                        {Link.icon}
                        <span className="capitalize">{Link.name}</span>
                      </NavLink>
                    )
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
