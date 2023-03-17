import React, { useEffect, useState } from "react";
import useTable from "../hooks/useTable";
import { toast, Toaster } from "react-hot-toast";
import { Header, ModalAnt, Popup } from "../components";
import avatar from "../assets/banner.jpg";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import TableFooter from "../components/Table/TableFooter";
import { ACTIVE_GREEN, RED } from "../utils/constants";
import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider, Tooltip } from "antd";

const ExamSubmissionView = () => {
  const [page, setPage] = useState(1);
  const [examData, setExamData] = useState([{}]);
  const { slice, range } = useTable(examData, page, 5);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchTable();
  }, []);

  const handleApprove = (id) => {
    if (window.confirm("Do you want to approve this exam?")) {
      const data = {
        commentModel: {
          leaderId: 2,
          examPaperId: id,
          commentContent: "string"
        },
        examUpdateApproveModel: {
          isApproved: true
        }
      };
      toast.promise(
        fetch("https://fpt-cft.azurewebsites.net/v1/api/exams/review-exam", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        })
          .then((resp) => {
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
    }
  };

  const fetchTable = () => {
    fetch("https://fpt-cft.azurewebsites.net/v1/api/exams/leader/4?pageIndex=1")
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
        <Header category="App" title="Exam Submission View" />
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
        <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-3 py-3 font-medium text-gray-900">
                Avatar
              </th>
              <th scope="col" className="px-3 py-3 font-medium text-gray-900">
                Title
              </th>
              <th scope="col" className="px-3 py-3 font-medium text-gray-900">
                Type
              </th>
              <th scope="col" className="px-3 py-3 font-medium text-gray-900">
                Status
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
                      Lecturer: {item.examPaperId}
                    </div>
                    <div className="text-gray-400">Subject: {item.registerSubjectId}</div>
                  </div>
                </td>
                <td className="px-3 py-3">{item.examContent}</td>
                <td className="px-3 py-3">{item.type}</td>
                <td className="px-3 py-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full ${
                      item.isApproved
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-600"
                    }  px-2 py-1 text-xs font-semibold`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        item.isApproved ? "bg-green-600" : "bg-red-600"
                      }`}
                    ></span>
                    {item.isApproved ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-start gap-4 content-center items-center">
                    <TooltipComponent content="Approve" position="BottomCenter">
                      <a onClick={() => handleApprove(item.examPaperId)}>
                        <svg
                          className="svg-icon"
                          viewBox="0 0 20 20"
                          width={15}
                          height={15}
                        >
                          <path
                            fill={`${ACTIVE_GREEN}`}
                            d="M7.197,16.963H7.195c-0.204,0-0.399-0.083-0.544-0.227l-6.039-6.082c-0.3-0.302-0.297-0.788,0.003-1.087
							C0.919,9.266,1.404,9.269,1.702,9.57l5.495,5.536L18.221,4.083c0.301-0.301,0.787-0.301,1.087,0c0.301,0.3,0.301,0.787,0,1.087
							L7.741,16.738C7.596,16.882,7.401,16.963,7.197,16.963z"
                          ></path>
                        </svg>
                      </a>
                    </TooltipComponent>
                    <Tooltip title="Reject">
                      <ConfigProvider
                        theme={{
                          token: {
                            colorPrimary: "#ea1c1c",
                          },
                        }}
                      >
                        <StyleProvider hashPriority="high">
                          <Popup
                            title="Comment"
                            fetchTable={fetchTable}
                            id={item.examPaperId}
                          />
                        </StyleProvider>
                      </ConfigProvider>
                    </Tooltip>

                    <Tooltip title="Info">
                      <ConfigProvider
                        theme={{
                          token: {
                            colorPrimary: "#ea1c1c",
                          },
                        }}
                      >
                        <StyleProvider hashPriority="high">
                          <ModalAnt title="Exam submission detail" />
                        </StyleProvider>
                      </ConfigProvider>
                    </Tooltip>
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

export default ExamSubmissionView;
