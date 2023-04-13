import React from "react";
import { AiOutlineSchedule } from "react-icons/ai";
import { BiNotepad } from "react-icons/bi";
import { BsPeople } from "react-icons/bs";
import { MdClass, MdDashboard } from "react-icons/md";
import { GiNotebook, GiStabbedNote } from "react-icons/gi";

export const links = [
  {
    title: "Dashboard",
    links: [
      {
        name: "overview",
        icon: <MdDashboard />,
        role: "General",
      },
    ],
  },
  {
    title: "Managements",
    links: [
      // {
      //   name: "leaders",
      //   icon: <BsPeople />,
      //   role: "Header",
      // },
      {
        name: "schedules",
        icon: <AiOutlineSchedule />,
        role: "General",
      },
      {
        name: "available-subject",
        icon: <GiNotebook />,
        role: "Header",
      },
      {
        name: "import-schedule",
        icon: <GiNotebook />,
        role: "Header",
      },
      {
        name: "generate-schedule",
        icon: <GiNotebook />,
        role: "Header",
      },
    ],
  },
  {
    title: "Apps",
    links: [
      {
        name: "exam-schedule",
        icon: <BiNotepad />,
        role: "Leader",
      },
      {
        name: "exam-submission-view",
        icon: <GiStabbedNote />,
        role: "General",
      },
      {
        name: "exam-submission",
        icon: <GiNotebook />,
        role: "Lecturer",
      },
      {
        name: "exam-schedule-view",
        icon: <BiNotepad />,
        role: "Lecturer",
      },
      {
        name: "register-class",
        icon: <MdClass />,
        role: "General",
      },
    ],
  },
];
