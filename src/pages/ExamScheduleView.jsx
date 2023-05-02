import React, { useEffect, useRef, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Header, ModalAnt2 } from "../components";
import { BASE_URL_API } from "../utils/constants";
import { Table } from "antd";
import moment from "moment/moment";
import { useLocation } from "react-router-dom";
import { getColumnSearchProps } from "../utils/function";

const ExamScheduleView = () => {
  const [examScheduleViewData, setExamScheduleViewData] = useState([{}]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

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
      title: "Subject",
      dataIndex: "subjectName",
      key: "subjectName",
      ...getColumnSearchProps(
        "subjectName",
        setSearchText,
        setSearchedColumn,
        searchInput,
        searchedColumn,
        searchText
      ),
    },
    {
      title: "Leader",
      dataIndex: "leaderName",
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
        // moment(record.deadline).format("YYYY/MM/DD hh:mm:ss"),
        moment(record.deadline).format("YYYY/MM/DD"),
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
          typeName={record.typeName}
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
