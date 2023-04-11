import React, { useEffect, useState } from "react";
import { ConfigProvider, Select, Space } from "antd";
import { BASE_URL_API } from "../../../utils/constants";
import { SmileOutlined } from "@ant-design/icons";

const { Option } = Select;

const SelectAntLecturer = ({ onChange, defaultValue }) => {
  const [lecturer, setLecturer] = useState([{}]);
  console.log("DEFAULT", defaultValue);
  const fetchSubject = () => {
    fetch(`${BASE_URL_API}/header/GetLecturersHaveRegisterSubject`)
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setLecturer(resp.data);
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
        placeholder="Select lecturer"
        onChange={onChange}
        optionLabelProp="label"
      >
        {lecturer?.map((item, index) => (
          <Option
            key={index}
            value={`${item?.userId}`}
            label={`${item?.fullName}`}
          >
            <Space>{item?.fullName}</Space>
          </Option>
        ))}
      </Select>
    </ConfigProvider>
  );
};

export default SelectAntLecturer;
