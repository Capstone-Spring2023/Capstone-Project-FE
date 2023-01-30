import React from "react";
import { AiOutlineCalendar, AiOutlineSchedule } from "react-icons/ai";
import { BiColorFill, BiNotepad } from "react-icons/bi";
import { BsPeople } from "react-icons/bs";
import { IoMdContacts } from "react-icons/io";
import { MdClass, MdDashboard, MdOutlineSubject } from "react-icons/md";

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
        name: "exam",
        icon: <BiNotepad />,
      },
      {
        name: "lecturers",
        icon: <IoMdContacts />,
      },
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