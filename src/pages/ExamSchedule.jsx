import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { Header } from "../components";
import { BASE_URL_API } from "../utils/constants";
import moment from "moment";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Popconfirm, Table, Tooltip } from "antd";

const ExamSchedule = () => {
  const [examScheduleData, setExamScheduleData] = useState([{}]);
  const navigate = useNavigate();

  const handleEdit = (availableSubjectId) => {
    navigate("/exam/schedule/edit/" + availableSubjectId);
  };

  const handleDelete = (availableSubjectId) => {
    toast.promise(
      fetch(`${BASE_URL_API}/exam-schedule/` + availableSubjectId, {
        method: "DELETE",
        headers: { "content-type": "application/json" },
      })
        .then((res) => {
          fetchTable();
        })
        .catch((err) => {
          console.log(err.message);
        }),
      {
        loading: "Deleting...",
        success: <b>Delete successfully</b>,
        error: <b>Delete fail</b>,
      }
    );
  };

  useEffect(() => {
    fetchTable();
  }, []);

  const fetchTable = () => {
    fetch(
      `${BASE_URL_API}/leader/${sessionStorage.getItem("userId")}/exam-schedule`
    )
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        if (resp?.data?.length > 0) {
          setExamScheduleData(resp.data);
        } else {
          setExamScheduleData(resp);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const columns = [
    {
      title: "Subject",
      dataIndex: "subjectName",
      filters: [
        {
          text: "HCM",
          value: "HCM",
        },
        {
          text: "VNR",
          value: "VNR",
        },
      ],
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.subjectName?.indexOf(value) === 0,
    },
    {
      title: "Title",
      dataIndex: "tittle",
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
        <div className="flex justify-start gap-4">
          <Tooltip title="Edit">
            <EditOutlined
              onClick={() => handleEdit(record.availableSubjectId)}
              style={{ fontSize: 17, color: "lightblue" }}
              height={55}
            />
          </Tooltip>
          {/* <Tooltip title="Delete">
            <Popconfirm
              title="Delete the exam-schedule"
              description="Are you sure to delete this?"
              onConfirm={() => handleDelete(record.availableSubjectId)}
              okText="Yes"
              okType="default"
              cancelText="No"
            >
              <DeleteOutlined
                style={{ fontSize: 17, color: "red" }}
                height={55}
              />
            </Popconfirm>
          </Tooltip> */}
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
        <Header category="App" title="Exam Schedule" />
        <div>
          <Link
            to="/exam/schedule/create"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Add
          </Link>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={examScheduleData}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default ExamSchedule;
