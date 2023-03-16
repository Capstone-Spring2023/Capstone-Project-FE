import React, { useEffect, useState } from "react";
import useTable from "../hooks/useTable";
import { Toaster } from "react-hot-toast";
import { Header, ModalAnt } from "../components";
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

  const fetchTable = () => {
    fetch("https://fpt-cft.azurewebsites.net/v1/api/exams/leader/2?pageIndex=1")
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

  const approve = (id) => {
    // fetch(`https://fpt-cft.azurewebsites.net/v1/api/exams/review-exam/${id}`, {
      fetch(`https://fpt-cft.azurewebsites.net/v1/api/exams/review-exam/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved: true })
    })
    .then(response => response.json())
    .then(data => {
      // Cập nhật trạng thái của items sau khi approve thành công
      setItems(items.map(item => {
        if (item.id === id) {
          return { ...item, approved: true };
        } else {
          return item;
        }
      }));
    })
    .catch(error => console.log(error));
  };

  // Hàm gọi API reject
  const reject = (id) => {
    fetch(`/api/reject/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved: false })
    })
    .then(response => response.json())
    .then(data => {
      // Cập nhật trạng thái của items sau khi reject thành công
      setItems(items.map(item => {
        if (item.id === id) {
          return { ...item, approved: false };
        } else {
          return item;
        }
      }));
    })
    .catch(error => console.log(error));
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
                <td className="px-3 py-3" title="{item.examContent}">{item.examContent?.substring(0,5)}...</td>
                <td className="px-3 py-3">{item.type}</td>
                <td className="px-3 py-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full ${item.status
                      ? "bg-green-50 text-green-600"
                      : "bg-red-50 text-red-600"
                      }  px-2 py-1 text-xs font-semibold`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${item.status ? "bg-green-600" : "bg-red-600"
                        }`}
                    ></span>
                    {item.status ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-start gap-4 content-center items-center">
                    <TooltipComponent content="Approve" position="BottomCenter">
                      {/* <a onClick={() => approve(item.id)}> */}
                      <a onClick={() => approve(2)}>
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
                    <TooltipComponent content="Reject" position="BottomCenter">
                      <a>
                        <svg
                          className="svg-icon"
                          viewBox="0 0 20 20"
                          width={15}
                          height={15}
                        >
                          <path
                            fill={`${RED}`}
                            d="M11.469,10l7.08-7.08c0.406-0.406,0.406-1.064,0-1.469c-0.406-0.406-1.063-0.406-1.469,0L10,8.53l-7.081-7.08
							c-0.406-0.406-1.064-0.406-1.469,0c-0.406,0.406-0.406,1.063,0,1.469L8.531,10L1.45,17.081c-0.406,0.406-0.406,1.064,0,1.469
							c0.203,0.203,0.469,0.304,0.735,0.304c0.266,0,0.531-0.101,0.735-0.304L10,11.469l7.08,7.081c0.203,0.203,0.469,0.304,0.735,0.304
							c0.267,0,0.532-0.101,0.735-0.304c0.406-0.406,0.406-1.064,0-1.469L11.469,10z"
                          ></path>
                        </svg>
                      </a>
                    </TooltipComponent>
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
