import React, { useEffect, useRef, useState } from "react";
import { Header } from "../components";
import { Link } from "react-router-dom";
import moment from "moment/moment";
import { Table, Typography } from "antd";
import { BASE_URL_API } from "../utils/constants";
import { getColumnSearchProps } from "../utils/function";

const { Text } = Typography;

const RegisterClass = () => {
  const [registerData, setRegisterData] = useState([{}]);
  const [deadlineRegister, setDeadlineRegister] = useState([{}]);
  const [deadlinePassed, setDeadlinePassed] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [registerSlot, setRegisterSlot] = useState([]);
  const searchInput = useRef(null);

  useEffect(() => {
    fetchRegister();
    fetchDeadlineRegister();
  }, []);

  useEffect(() => {
    if (moment().isAfter(moment(deadlineRegister))) {
      setDeadlinePassed(true);
    }
  }, [deadlineRegister]);

  const fetchRegister = () => {
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
        setRegisterSlot(resp.registerSlots);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const fetchDeadlineRegister = () => {
    fetch(`${BASE_URL_API}/schedule/deadline-checking?semesterId=1`)
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setDeadlineRegister(resp.deadline);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const columns = [
    {
      title: "Subject",
      dataIndex: "subjectName",
      key: "subjectName",
      ...getColumnSearchProps(
        "subjectName",
        setSearchText,
        setSearchedColumn,
        searchInput,
        searchedColumn,
        searchText
      ),
    },
    {
      title: "Register Date",
      dataIndex: "registerDate",
      render: (_, record) =>
        moment(record.registerDate, "YYYY-MM-DDTHH:mm:ss").format("YYYY-MM-DD"),
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
        <Header category="Apps" title="Register Class" />
        <div>
          {deadlinePassed ? null : (
            <Link
              to="/register-class/register"
              className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800`}
            >
              Register
            </Link>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <Text type="warning" strong={true}>
          Register Slot: {registerSlot?.join(", ")}
        </Text>
        <Table
          columns={columns}
          dataSource={registerData}
          pagination={{ pageSize: 5 }}
        />
      </div>
    </div>
  );
};

export default RegisterClass;
