import React, { useEffect, useState } from "react";
import useTable from "../hooks/useTable";
import { Link, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { Header } from "../components";
import avatar from "../assets/banner.jpg";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import TableFooter from "../components/Table/TableFooter";

const ExamSchedule = () => {
  const [page, setPage] = useState(1);
  const [examScheduleData, setExamScheduleData] = useState([{}]);
  const { slice, range } = useTable(examScheduleData, page, 5);
  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate("/exam/schedule/edit/" + id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Do you want to delete?")) {
      toast.promise(
        fetch("http://localhost:8000/exams-schedule/" + id, {
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
    }
  };

  useEffect(() => {
    fetchTable();
  }, []);

  const fetchTable = () => {
    fetch("http://localhost:8000/exams-schedule")
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setExamScheduleData(resp);
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
                Status
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
                      Assign: HoaDNT
                    </div>
                    <div className="text-gray-400">Subject: {item.subject}</div>
                  </div>
                </td>
                <td className="px-3 py-3">{item.title}</td>
                <td className="px-3 py-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full ${
                      item.status
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-600"
                    }  px-2 py-1 text-xs font-semibold`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        item.status ? "bg-green-600" : "bg-red-600"
                      }`}
                    ></span>
                    {item.status ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-3 py-3">{item.deadline}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-start gap-4">
                    <TooltipComponent content="Edit" position="BottomCenter">
                      <a onClick={() => handleEdit(item.id)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="h-6 w-6"
                          x-tooltip="tooltip"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                          />
                        </svg>
                      </a>
                    </TooltipComponent>
                    <TooltipComponent content="Delete" position="BottomCenter">
                      <a onClick={() => handleDelete(item.id)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="h-6 w-6"
                          x-tooltip="tooltip"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </a>
                    </TooltipComponent>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
