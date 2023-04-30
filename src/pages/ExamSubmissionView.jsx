import React, { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Header, ModalAnt, Popup } from "../components";
import { APPROVED, BASE_URL_API } from "../utils/constants";
import { Popconfirm, Switch, Table, Tooltip } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import dataChange from "../utils/function";

const ExamSubmissionView = ({ socket }) => {
  const [examData, setExamData] = useState([{}]);
  const [examHistoryData, setExamHistoryData] = useState([{}]);
  const [isHistory, setIsHistory] = useState(false);
  const [noti, setNoti] = useState("Data Change");
  const { state } = useLocation();

  useEffect(() => {
    fetchTable();
    fetchHistoryTable();
  }, []);

  useEffect(() => {
    socket.on("dataChangeResponse", () => {
      fetchTable();
      fetchHistoryTable();
    });
  }, [socket]);

  const handleApprove = (id) => {
    const data = {
      commentModel: {
        leaderId: sessionStorage.getItem("userId"),
        approvalUserId: sessionStorage.getItem("userId"),
        examPaperId: id,
      },
      examUpdateApproveModel: {
        status: APPROVED,
      },
    };
    toast.promise(
      fetch(`${BASE_URL_API}/exam-submission-view/review-exam`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((resp) => {
          dataChange(socket);
          fetchTable();
        })
        .catch((err) => {
          console.log(err.message);
        }),
      {
        loading: "Approving...",
        success: <b>Approve successfully</b>,
        error: <b>Approve fail</b>,
      }
    );
  };

  const fetchTable = () => {
    fetch(
      `${BASE_URL_API}/approval-user/${sessionStorage.getItem(
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

  const handleChangeHistory = (checked) => {
    if (checked) {
      setIsHistory(true);
      fetchHistoryTable();
    } else {
      setIsHistory(false);
      fetchTable();
    }
  };

  const fetchHistoryTable = () => {
    fetch(
      `${BASE_URL_API}/approval-user/${sessionStorage.getItem(
        "userId"
      )}/exam-submission-approved`
    )
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setExamHistoryData(resp);
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
      ],
      defaultFilteredValue: [`${state?.subject ? state?.subject : ""}`],
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record?.subjectName?.indexOf(value) === 0,
    },
    {
      title: "Submitter",
      dataIndex: "lecturerName",
    },
    {
      title: "Title",
      dataIndex: "tittle",
    },
    {
      title: "Type",
      dataIndex: "type",
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
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex justify-start gap-4 content-center items-center">
          {isHistory ? (
            <ModalAnt title="Exam submission detail" id={record.examPaperId} />
          ) : (
            <>
              <Tooltip title="Approve">
                <Popconfirm
                  title="Approve the exam"
                  description="Are you sure to approve this exam?"
                  onConfirm={() => handleApprove(record.examPaperId)}
                  okText="Yes"
                  okType="default"
                  cancelText="No"
                >
                  <CheckOutlined
                    style={{ fontSize: 17, color: "lightgreen" }}
                    height={55}
                  />
                </Popconfirm>
              </Tooltip>
              <Popup
                title="Comment"
                fetchTable={fetchTable}
                examPaperId={record.examPaperId}
                examLink={record.examLink}
                subjectName={record.subjectName}
                socket={socket}
              />
              <ModalAnt
                title="Exam submission detail"
                id={record.examPaperId}
              />
            </>
          )}
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
        <Header category="App" title="Exam Submission View" />
      </div>
      <Switch
        style={{ marginBottom: "10px" }}
        checkedChildren="History"
        unCheckedChildren="Current"
        defaultChecked={false}
        onClick={handleChangeHistory}
      />
      <Table
        columns={columns}
        dataSource={isHistory ? examHistoryData : examData}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default ExamSubmissionView;
