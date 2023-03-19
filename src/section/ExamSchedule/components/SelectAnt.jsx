import React, { useEffect, useState } from "react";
import { Select, Space } from "antd";
import { BASE_URL_API } from "../../../utils/constants";

const { Option } = Select;

const SelectAnt = ({ onChange, defaultValue }) => {
  const [subject, setSubject] = useState([{}]);
  console.log("DEFAULT", defaultValue);
  const fetchSubject = () => {
    fetch(`${BASE_URL_API}/leader/5/available-subject`)
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
  return (
    <Select
      style={{
        width: "100%",
      }}
      placeholder="Select subjects"
      onChange={onChange}
      optionLabelProp="label"
      defaultValue=""
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
  );
};

export default SelectAnt;
