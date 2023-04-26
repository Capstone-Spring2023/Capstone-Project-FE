import React from "react";
import { AiOutlineSchedule } from "react-icons/ai";
import { BiNotepad } from "react-icons/bi";
import { MdDashboard, MdOutlineClass, MdSubject } from "react-icons/md";
import { GiNotebook } from "react-icons/gi";
import { GrNotes, GrScheduleNew, GrSchedulePlay } from "react-icons/gr";
import { RiNewspaperLine } from "react-icons/ri";

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
        icon: <MdSubject />,
        role: "Header",
      },
      {
        name: "import-schedule",
        icon: <GrScheduleNew />,
        role: "Header",
      },
      {
        name: "generate-schedule",
        icon: <GrSchedulePlay />,
        role: "Header",
      },
      {
        name: "exam-submission-view",
        icon: <GrNotes />,
        role: "General",
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
        name: "exam-submission",
        icon: <GiNotebook />,
        role: "General",
      },
      {
        name: "exam-schedule-request",
        icon: <BiNotepad />,
        role: "General",
      },
      {
        name: "register-class",
        icon: <MdOutlineClass />,
        role: "General",
      },
    ],
  },
];
