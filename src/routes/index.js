import React from "react";
import { AiOutlineCalendar, AiOutlineSchedule } from "react-icons/ai";
import { BiColorFill, BiNotepad } from "react-icons/bi";
import { BsPeople } from "react-icons/bs";
import { MdClass, MdDashboard, MdOutlineSubject } from "react-icons/md";
import {GiNotebook, GiStabbedNote} from "react-icons/gi";

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
      {
        name: "exam-schedule",
        icon: <BiNotepad />,
      },
      {
        name: "exam-submission",
        icon: <GiNotebook />,
      },
      {
        name: "exam-submission-view",
        icon: <GiStabbedNote />,
      },
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