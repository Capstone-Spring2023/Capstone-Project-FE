import React from "react";
import { AiOutlineCalendar, AiOutlineSchedule } from "react-icons/ai";
import { BiColorFill, BiNotepad } from "react-icons/bi";
import { BsPeople } from "react-icons/bs";
import { MdClass, MdDashboard, MdOutlineSubject } from "react-icons/md";
import { GiNotebook, GiStabbedNote } from "react-icons/gi";

export const links = [
  {
    title: "Dashboard",
    links: [
      {
        name: "overview",
        icon: <MdDashboard />,
      },
    ],
  },

  {
    title: "Managements",
    links: [
      {
        name: "leaders",
        icon: <BsPeople />,
      },
      {
        name: "schedules",
        icon: <AiOutlineSchedule />,
      },
      {
        name: "subjects",
        icon: <MdOutlineSubject />,
      },
    ],
  },
  {
    title: "Apps",
    links: [
      sessionStorage.getItem("roleName") === "Leader"
        ? 
        {
          name: "exam-schedule",
          icon: <BiNotepad />,
        }
        : null
      ,
      sessionStorage.getItem("roleName") === "Teacher"
        ?
        {
          name: "exam-schedule-view",
          icon: <BiNotepad />,
        }
        : null
      ,
      sessionStorage.getItem("roleName") === "Teacher"
        ?
        {
          name: "exam-submission",
          icon: <GiNotebook />,
        }
        : null
      ,
      sessionStorage.getItem("roleName") === "Leader"
        ?
        {
          name: "exam-submission-view",
          icon: <GiStabbedNote />,
        }
        : null
        ,
      {
        name: "calendar",
        icon: <AiOutlineCalendar />,
      },
      {
        name: "color-picker",
        icon: <BiColorFill />,
      },
      {
        name: "register-class",
        icon: <MdClass />,
      },
    ],
  },
];