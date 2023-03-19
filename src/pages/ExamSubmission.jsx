import React, { useEffect, useState } from "react";
import { Header, ModalAnt3 } from "../components";
import TableFooter from "../components/Table/TableFooter";
import useTable from "../hooks/useTable";
import avatar from "../assets/banner.jpg";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { toast, Toaster } from "react-hot-toast";
import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider, Popconfirm, Tooltip } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BASE_URL_API } from "../utils/constants";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const ExamSubmission = () => {
  const { examPaperId } = useParams();
  const [page, setPage] = useState(1);
  const [examData, setExamData] = useState([{}]);
  const { slice, range } = useTable(examData, page, 5);
  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate("/exam/submission/edit/" + id);
  };

  const handleDelete = (id) => {
    toast.promise(
      fetch("http://localhost:8000/exams/" + id, {
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
    fetch(`${BASE_URL_API}/exam-submission/user/28/exam-submission`)
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

      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
        <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-3 py-3 font-medium text-gray-900">
                Basic Info
              </th>
              <th scope="col" className="px-3 py-3 font-medium text-gray-900">
                Status
              </th>
              <th scope="col" className="px-3 py-3 font-medium text-gray-900">
                Comment
              </th>
              <th scope="col" className="px-3 py-3 font-medium text-gray-900">
                Type
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
                      Lecturer: {item.lecturerName}
                    </div>
                    <div className="text-gray-400">
                      Subject: {item.subjectName}
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full ${
                      item.status === "Approved"
                        ? "bg-green-50 text-green-600"
                        : item.status === "Rejected"
                        ? "bg-red-50 text-red-600"
                        : item.status === "Pending"
                        ? "bg-yellow-50 text-yellow-600"
                        : "bg-gray-50 text-gray-600"
                    }  px-2 py-1 text-xs font-semibold`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        item.status === "Approved"
                          ? "bg-green-600"
                          : item.status === "Rejected"
                          ? "bg-red-600"
                          : item.status === "Pending"
                          ? "bg-yellow-600"
                          : "bg-gray-600"
                      }`}
                    ></span>
                    {item.status}
                  </span>
                </td>
                <td className="px-3 py-3" title="{item.comment}">
                  {item.comment?.length > 5
                    ? item.comment?.slice(0, 10) + "..."
                    : item.comment}
                </td>
                <td className="px-3 py-3">{item.type}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-start gap-4">
                    <Tooltip title="Edit">
                      <EditOutlined
                        onClick={() => handleEdit(item.examPaperId)}
                        style={{ fontSize: 17, color: "lightblue" }}
                        height={55}
                      />
                    </Tooltip>
                    <Tooltip title="Delete">
                      <Popconfirm
                        title="Delete the exam-submission"
                        description="Are you sure to delete this?"
                        onConfirm={() => handleDelete(item.id)}
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
                    {item.status === "Waiting-Instruction" ? (
                      <Tooltip title="Info">
                        <ModalAnt3 examInstructionId={item.examPaperId} title="Exam instruction" />
                      </Tooltip>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TableFooter
        total={examData}
        range={range}
        slice={slice}
        setPage={setPage}
        page={page}
      />
    </div>
  );
};

export default ExamSubmission;
