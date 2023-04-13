import React, { useEffect, useState } from "react";
import { Header } from "../components";
import { BASE_URL_API } from "../utils/constants";
import { Checkbox, ConfigProvider, Select, Space, Table } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import { toast } from "react-hot-toast";
import { CheckboxValueType } from "antd/es/checkbox/Group";

const { Option } = Select;
const { Column } = Table;
const LeaderSubject = () => {
  const [examAvailableSubjectData, setAvailableSubjectData] = useState([{}]);
  const [subject, setSubject] = useState([{}]);

  useEffect(() => {
    fetchSubject();
  }, []);

  const handleSubjectSelect = (value) => {
    fetchTable(value);
    const filteredData = examAvailableSubjectData?.filter(
      (item) =>
        item?.subjectName?.toLowerCase()?.indexOf(value.toLowerCase()) >= 0
    );
    // Cập nhật lại state để hiển thị dữ liệu đã lọc trên bảng
    setAvailableSubjectData(filteredData);
  };

  const fetchSubject = () => {
    fetch(`${BASE_URL_API}/AvailableSubject`)
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setSubject(resp);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const onChange = (checkedValues: CheckboxValueType[]) => {
    const availableSubjectId = checkedValues.target.value.split(",")[0];
    const userId = checkedValues.target.value.split(",")[1];
    handleLeader(availableSubjectId, userId);
  };
  const handleLeader = (availableSubjectId, userId) => {
    const leaderData = {
      availableSubjectId,
      userId,
    };
    toast.promise(
      fetch(`${BASE_URL_API}/leader`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(leaderData),
      })
        .then((res) => {
          fetchTable();
        })
        .catch((err) => {
          console.log(err.message);
        }),
      {
        loading: "Updating...",
        success: <b>Updated successfully</b>,
        error: <b>Could not update.</b>,
      }
    );
  };

  const fetchTable = (availableSubjectId) => {
    fetch(
      `${BASE_URL_API}/header/GetLecturersHaveRegisterSubjectByAvailableSubjectId/${availableSubjectId}`
    )
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setAvailableSubjectData(resp.data);
        console.log("RES", resp);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const columns = [
    {
      title: "FullName",
      dataIndex: "fullName",
      filters: [
        {
          text: "Han",
          value: "Han",
        },
      ],
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.fullName.indexOf(value) === 0,
      width: "30%",
    },
    {
      title: "Subject",
      dataIndex: "subjectName",
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "Semester",
      dataIndex: "semester",
      filters: [
        {
          text: "London",
          value: "London",
        },
        {
          text: "New York",
          value: "New York",
        },
      ],
      onFilter: (value, record) => record.address.startsWith(value),
      filterSearch: true,
      width: "20%",
    },
    {
      title: "isLeader",
      dataIndex: "isLeader",
      render: (_, record) => (
        <Checkbox
          onChange={onChange}
          value={`${record.availableSubjectId},${record.userId}`}
          checked={record?.isLeader}
        >
          isLeader
        </Checkbox>
      ),
    },
  ];
  const customizeRenderEmpty = () => (
    <div
      style={{
        textAlign: "center",
      }}
    >
      <SmileOutlined
        style={{
          fontSize: 20,
        }}
      />
      <p>Data Not Found</p>
    </div>
  );
  const style = {
    width: 200,
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <div className="flex justify-between items-center">
        <Header category="App" title="Available Subject" />
      </div>
      <div className="flex justify-start items-center mb-5">
        <ConfigProvider renderEmpty={customizeRenderEmpty}>
          <Select
            showSearch
            style={style}
            placeholder="Select subjects"
            onSelect={handleSubjectSelect}
            optionLabelProp="label"
            filterOption={(input, option) =>
              option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            optionFilterProp="label"
          >
            {subject?.map((item, index) => (
              <Option
                key={index}
                value={`${item?.availableSubjectId}`}
                label={`${item?.subjectName}`}
              >
                <Space>{item?.subjectName}</Space>
              </Option>
            ))}
          </Select>
        </ConfigProvider>
      </div>
      <Table
        columns={columns}
        dataSource={
          examAvailableSubjectData?.length > 1 ? examAvailableSubjectData : null
        }
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};
export default LeaderSubject;
