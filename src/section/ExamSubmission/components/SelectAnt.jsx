import React, { useEffect, useState } from "react";
import { ConfigProvider, Select, Space } from "antd";
import { BASE_URL_API } from "../../../utils/constants";
import { SmileOutlined } from "@ant-design/icons";

const { Option } = Select;

const SelectAnt = ({ onChange }) => {
  const [subject, setSubject] = useState([{}]);
  const fetchSubject = () => {
    fetch(`${BASE_URL_API}/user/${sessionStorage.getItem("userId")}/exam-schedule/available-subject`)
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

  useEffect(() => {
    fetchSubject();
  }, []);
  
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
      <p>There are no request</p>
    </div>
  );
  const style = {
    width: 200,
  };
  return (
    <ConfigProvider renderEmpty={customizeRenderEmpty}>
      <Select
        showSearch
        style={style}
        placeholder="Select subjects"
        onChange={onChange}
        optionLabelProp="label"
      >
        {subject?.map((item, index) => (
          <Option
            key={index}
            value={`${item?.examScheduleId},${item?.typeName}`}
            label={`${item?.subjectName}`}
          >
            <Space>{item?.subjectName}</Space>
          </Option>
        ))}
      </Select>
    </ConfigProvider>
  );
};

export default SelectAnt;
