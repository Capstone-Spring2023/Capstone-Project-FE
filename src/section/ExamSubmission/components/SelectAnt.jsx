import React, { useEffect, useState } from "react";
import { Select, Space } from "antd";
import { BASE_URL_API } from "../../../utils/constants";

const { Option } = Select;

const SelectAnt = ({ onChange ,setAvailableSubjectId }) => {
  const [subject, setSubject] = useState([{}]);
  const fetchSubject = () => {
    fetch(`https://fpt-cft.azurewebsites.net/api/user/28/exam-schedule/available-subject`)
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setSubject(resp);
        setAvailableSubjectId(resp.availableSubjectId);
        console.log(resp);
      })
      .catch((err) => {
        console.log(err.message);
      });
      console.log("as",subject);
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