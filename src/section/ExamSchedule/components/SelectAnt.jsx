import React, { useEffect, useState } from "react";
import { Select, Space } from "antd";
import { BASE_URL_API } from "../../../utils/constants";

const { Option } = Select;

const SelectAnt = ({ onChange }) => {
  const [subject, setSubject] = useState([{}]);
  const fetchSubject = () => {
    fetch(`${BASE_URL_API}available-subjects/api/availableSubject/getAllAvailableSubjectByLeaderId/2`)
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setSubject(resp.data);
        console.log(resp);
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
    >
      {subject?.map((item, index) => (
        <Option
          key={index}
          value={`${item?.subjectId}`}
          label={`${item?.subjectName}`}
        >
          <Space>{item?.subjectName}</Space>
        </Option>
      ))}
    </Select>
  );
};

export default SelectAnt;
