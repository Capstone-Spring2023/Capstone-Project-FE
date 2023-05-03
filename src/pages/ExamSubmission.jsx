import React, { useEffect, useRef, useState } from "react";
import { Header, ModalAnt3 } from "../components";
import { Toaster } from "react-hot-toast";
import { Table, Tooltip } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL_API } from "../utils/constants";
import { EditOutlined } from "@ant-design/icons";
import { getColumnSearchProps } from "../utils/function";

const ExamSubmission = ({ socket }) => {
  const [examData, setExamData] = useState([{}]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate("/exam/submission/edit/" + id);
  };

  useEffect(() => {
    socket.on("dataChangeResponse", () => fetchTable());
  }, [socket]);

  useEffect(() => {
    fetchTable();
  }, []);

  const fetchTable = () => {
    fetch(
      `${BASE_URL_API}/exam-submission/user/${sessionStorage.getItem(
        "userId"
      )}/exam-submission`
    )
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setExamData(resp);
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
      title: "Status",
      dataIndex: "status",
      render: (_, record) => (
        <span
          className={`inline-flex items-center gap-1 rounded-full ${
            record.status === "Approved"
              ? "bg-green-50 text-green-600"
              : record.status === "Rejected"
              ? "bg-red-50 text-red-600"
              : record.status === "Pending"
              ? "bg-yellow-50 text-yellow-600"
              : "bg-gray-50 text-gray-600"
          }  px-2 py-1 text-xs font-semibold`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              record.status === "Approved"
                ? "bg-green-600"
                : record.status === "Rejected"
                ? "bg-red-600"
                : record.status === "Pending"
                ? "bg-yellow-600"
                : "bg-gray-600"
            }`}
          ></span>
          {record.status}
        </span>
      ),
    },
    {
      title: "Comment",
      dataIndex: "comment",
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex justify-start gap-4">
          {record.status === "Pending" ? (
            <Tooltip title="Edit">
              <EditOutlined
                onClick={() => handleEdit(record.examPaperId)}
                style={{ fontSize: 17, color: "lightblue" }}
                height={55}
              />
            </Tooltip>
          ) : null}
          {record.status === "Waiting-Instruction" ? (
            <Tooltip title="Info">
              <ModalAnt3
                fetchTable={fetchTable}
                examInstructionId={record.examPaperId}
                title="Exam instruction"
              />
            </Tooltip>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <div>
        <Toaster />
      </div>
      <div className="flex justify-between items-center">
        <Header category="App" title="Exam Submission" />
        <div>
          <Link
            to="/exam/submission/create"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Add
          </Link>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={examData}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default ExamSubmission;
