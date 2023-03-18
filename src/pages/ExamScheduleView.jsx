import React, { useEffect, useState } from "react";
import useTable from "../hooks/useTable";
import { Link, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { Header, ModalAnt2 } from "../components";
import avatar from "../assets/banner.jpg";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import TableFooter from "../components/Table/TableFooter";
import { ACTIVE_GREEN, BASE_URL_API, RED } from "../utils/constants";
import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider, Tooltip } from "antd";
import moment from "moment/moment";

const ExamScheduleView = () => {
  const [page, setPage] = useState(1);
  const [examScheduleViewData, setExamScheduleViewData] = useState([{}]);
  const { slice, range } = useTable(examScheduleViewData, page, 5);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTable();
  }, []);

  const fetchTable = () => {
    fetch(`${BASE_URL_API}/user/28/exam-schedule`)
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

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <div>
        <Toaster />
      </div>
      <div className="flex justify-between items-center">
        <Header category="App" title="Exam Schedule View" />
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
                      Assign: {item.assignee}
                    </div>
                    <div className="text-gray-400">Subject: {item.subject}</div>
                  </div>
                </td>
                <td className="px-3 py-3">{item.tittle}</td>
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
                <td className="px-3 py-3">
                  {moment(item.deadline).format("YYYY/MM/DD hh:mm:ss")}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-4 content-center items-center">
                    <Tooltip title="Info">
                      <ConfigProvider
                        theme={{
                          token: {
                            colorPrimary: "#ea1c1c",
                          },
                        }}
                      >
                        <StyleProvider hashPriority="high">
                          <ModalAnt2 title="Exam Schedule detail" />
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
        total={examScheduleViewData}
        range={range}
        slice={slice}
        setPage={setPage}
        page={page}
      />
    </div>
  );
};

export default ExamScheduleView;
