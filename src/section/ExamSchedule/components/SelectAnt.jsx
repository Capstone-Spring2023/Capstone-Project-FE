import React, { useEffect, useState } from "react";
import { ConfigProvider, Select, Space } from "antd";
import { BASE_URL_API } from "../../../utils/constants";
import { SmileOutlined } from "@ant-design/icons";

const { Option } = Select;

const SelectAnt = ({ onChange, defaultValue }) => {
  const [subject, setSubject] = useState([{}]);
  console.log("DEFAULT", defaultValue);
  const fetchSubject = () => {
    fetch(`${BASE_URL_API}/leader/${sessionStorage.getItem("userId")}/available-subject`)
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setSubject(resp.data);
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
      <p>Data Not Found</p>
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
            value={`${item?.availableSubjectId}`}
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
