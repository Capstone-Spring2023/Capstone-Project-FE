import React, { useEffect, useState } from "react";
import { Button, Header } from "../components";
import TableFooter from "../components/Table/TableFooter";
import { customersData, employeesData } from "../data/dummy";
import useTable from "../hooks/useTable";
import { MdOutlineCancel } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/banner.jpg";
import moment from "moment/moment";
import { Popconfirm, Table, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { BASE_URL_API } from "../utils/constants";

const RegisterClass = () => {
  const [page, setPage] = useState(1);
  const [registerData, setRegisterData] = useState([{}]);
  const { slice, range } = useTable(registerData, page, 5);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(
      `${BASE_URL_API}/user/${sessionStorage.getItem(
        "userId"
      )}/register-subject-slot`
    )
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setRegisterData(resp.registerSubjects);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const columns = [
    {
      title: "Basic Info",
      dataIndex: "subjectName",
      render: (_, record) => (
        <div className="flex gap-3 font-normal text-gray-900 items-center">
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
              Register Date:{" "}
              {moment(record.registerDate, "YYYY-MM-DDTHH:mm:ss").format(
                "YYYY-MM-DD"
              )}
            </div>
            <div className="text-gray-400">Subject: {record.subjectName}</div>
          </div>
        </div>
      ),
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
      width: "40%",
    },
    {
      title: "Slot",
      dataIndex: "slot",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_, record) => (
        <span
          className={`inline-flex items-center gap-1 rounded-full ${
            record.status
              ? "bg-green-50 text-green-600"
              : "bg-red-50 text-red-600"
          }  px-2 py-1 text-xs font-semibold`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              record.status ? "bg-green-600" : "bg-red-600"
            }`}
          ></span>
          {record.status ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

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
      <Table
        columns={columns}
        dataSource={registerData}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default RegisterClass;
