import React, { useEffect, useState } from "react";
import useTable from "../hooks/useTable";
import { Link, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { Header } from "../components";
import avatar from "../assets/banner.jpg";
import TableFooter from "../components/Table/TableFooter";
import { BASE_URL_API } from "../utils/constants";
import moment from "moment";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Empty, Popconfirm, Tooltip } from "antd";

const ExamSchedule = () => {
  const [page, setPage] = useState(1);
  const [examScheduleData, setExamScheduleData] = useState([{}]);
  const { slice, range } = useTable(examScheduleData, page, 5);
  const navigate = useNavigate();

  const handleEdit = (examScheduleId) => {
    navigate("/exam/schedule/edit/" + examScheduleId);
  };

  const handleDelete = (examScheduleId) => {
    toast.promise(
      fetch("http://localhost:8000/exams-schedule/" + examScheduleId, {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(examScheduleData),
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
    fetch(`${BASE_URL_API}/leader/5/exam-schedule`)
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
      {slice?.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
          <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-3 font-medium text-gray-900">
                  Basic Info
                </th>
                <th scope="col" className="px-3 py-3 font-medium text-gray-900">
                  Title
                </th>
                <th scope="col" className="px-3 py-3 font-medium text-gray-900">
                  Deadline
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 border-t border-gray-100">
              {slice.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="flex gap-3 px-3 py-3 font-normal text-gray-900 items-center">
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
                        Assign: {item.leaderId}
                      </div>
                      <div className="text-gray-400">
                        Subject: {item.registerSubjectId}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">{item.tittle}</td>
                  <td className="px-3 py-3">
                    {moment(item.deadline).format("YYYY/MM/DD hh:mm:ss")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-start gap-4">
                      <Tooltip title="Edit">
                        <EditOutlined
                          onClick={() => handleEdit(item.examScheduleId)}
                          style={{ fontSize: 17, color: "lightblue" }}
                          height={55}
                        />
                      </Tooltip>
                      <Tooltip title="Delete">
                        <Popconfirm
                          title="Delete the exam-schedule"
                          description="Are you sure to delete this?"
                          onConfirm={() => handleDelete(item.examScheduleId)}
                          okText="Yes"
                          okType="default"
                          cancelText="No"
                        >
                          <DeleteOutlined
                            style={{ fontSize: 17, color: "red" }}
                            height={55}
                          />
                        </Popconfirm>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty />
      )}

      <TableFooter
        total={examScheduleData}
        range={range}
        slice={slice}
        setPage={setPage}
        page={page}
      />
    </div>
  );
};

export default ExamSchedule;
