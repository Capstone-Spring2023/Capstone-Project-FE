
import React, { useEffect, useState } from "react";
import { Button, Header } from "../components";
import TableFooter from "../components/Table/TableFooter";
import { customersData, employeesData } from "../data/dummy";
import useTable from "../hooks/useTable";
import { MdOutlineCancel } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

const RegisterClass = () => {
  const [page, setPage] = useState(1);
  const [registerData, setRegisterData] = useState([{}]);
  const { slice, range } = useTable(registerData, page, 5);
  const navigate = useNavigate();


  useEffect(() => {
    fetch("http://localhost:8000/register-class")
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setRegisterData(resp);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <div className="flex justify-between items-center">
        <Header category="Register" title="Class" />
        <div>
          <Link
            to="/register-class/register"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Register Class
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
        <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-3 py-2 font-medium text-gray-900"
              >Basic info</th>
              <th scope="col" className="px-3 py-2 font-medium text-gray-900">
                Semester
              </th>
              <th scope="col" className="px-3 py-2 font-medium text-gray-900">
                Department
              </th>
              <th scope="col" className="px-3 py-2 font-medium text-gray-900">
                Slot
              </th>
              <th scope="col" className="px-3 py-2 font-medium text-gray-900">
                Date time
              </th>
              <th scope="col" className="px-3 py-2 font-medium text-gray-900">
                PROCESSNOTE
              </th>
              <th scope="col" className="px-3 py-2 font-medium text-gray-900">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 border-t border-gray-100">
            {slice.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <th className="flex gap-3 px-6 py-4 font-normal text-gray-900 items-center">
                  <div className="relative h-10 w-10">
                    <img
                      className="h-full w-full rounded-full object-cover object-center"
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                    <span className="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-green-400 ring ring-white"></span>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-700">
                    Subject: {item.subject}
                    </div>
                    <div className="text-gray-400">Created Date: {item.createDate}</div>
                  </div>
                </th>
                <td className="px-3 py-2">{item.semester}</td>
                <td className="px-3 py-2">{item.department}</td>
                <td className="px-3 py-2">{item.slot}</td>
                <td className="px-3 py-2">{item.dateTime}</td>
                <td className="px-3 py-2">{item.processNote}</td>
                <td className="px-3 py-2">
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
                    {item.status ? "Approved" : "Rejected" }
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TableFooter
        total={registerData}
        range={range}
        slice={slice}
        setPage={setPage}
        page={page}
      />
    </div>
  );
};

export default RegisterClass;