import React, { useEffect, useState } from "react";
import useTable from "../hooks/useTable";
import { Toaster } from "react-hot-toast";
import { Header, ModalAnt2 } from "../components";
import avatar from "../assets/banner.jpg";
import { BASE_URL_API } from "../utils/constants";
import { Table } from "antd";
import moment from "moment/moment";

const ExamScheduleView = () => {
  const [examScheduleViewData, setExamScheduleViewData] = useState([{}]);

  useEffect(() => {
    fetchTable();
  }, []);

  const fetchTable = () => {
    fetch(
      `${BASE_URL_API}/user/${sessionStorage.getItem("userId")}/exam-schedule`
    )
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setExamScheduleViewData(resp);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const columns = [
    {
      title: "Basic Info",
      dataIndex: "subjectName",
      render: (_, record) => (
        <div className="flex gap-3 font-normal text-gray-900 items-center">
          <div className="relative h-10 w-10">
            <img
              className="h-full w-full rounded-full object-cover object-center"
              src={avatar}
              alt=""
            />
            <span className="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-green-400 ring ring-white"></span>
          </div>
          <div className="text-sm">
            <div className="font-medium text-gray-700">
              Assign: {record.leaderName}
            </div>
            <div className="text-gray-400">Subject: {record.subjectName}</div>
          </div>
        </div>
      ),
      filters: [
        {
          text: "HCM",
          value: "HCM",
        },
      ],
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.subjectName.indexOf(value) === 0,
      width: "30%",
    },
    {
      title: "Title",
      dataIndex: "tittle",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_, record) => (
        <span
          className={`inline-flex items-center gap-1 rounded-full ${
            record.status
              ? "bg-green-50 text-green-600"
              : "bg-red-50 text-red-600"
          }  px-2 py-1 text-xs font-semibold`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              record.status ? "bg-green-600" : "bg-red-600"
            }`}
          ></span>
          {record.status ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      render: (_, record) =>
        moment(record.deadline).format("YYYY/MM/DD hh:mm:ss"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <ModalAnt2
          examScheduleId={record.examScheduleId}
          tittle={record.tittle}
          deadline={record.deadline}
          leaderName={record.leaderName}
          subjectName={record.subjectName}
          examLink={record.examLink}
          type={record.typeId}
          status={record.status}
          title="Exam Schedule detail"
        />
      ),
    },
  ];

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <div>
        <Toaster />
      </div>
      <div className="flex justify-between items-center">
        <Header category="App" title="Exam Schedule View" />
      </div>
      <Table
        columns={columns}
        dataSource={examScheduleViewData}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default ExamScheduleView;
