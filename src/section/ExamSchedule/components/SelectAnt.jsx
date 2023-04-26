import React, { useEffect, useState } from "react";
import { ConfigProvider, Select, Space } from "antd";
import { BASE_URL_API } from "../../../utils/constants";
import { SmileOutlined } from "@ant-design/icons";

const { Option } = Select;

const SelectAnt = ({ onChange, defaultValue,subjectId  }) => {
  const [subject, setSubject] = useState([{}]);
  const [examAvailableSubjectData, setAvailableSubjectData] = useState([{}]);
  const handleSubjectSelect = (value) => {
    fetchSubject();
    const filteredData = examAvailableSubjectData?.filter(
      (item) =>
        item?.subjectName?.toLowerCase()?.indexOf(value.toLowerCase()) >= 0
    );
    // Cập nhật lại state để hiển thị dữ liệu đã lọc trên bảng
    setAvailableSubjectData(filteredData);
  };
  const fetchSubject = () => {
    fetch(
      `${BASE_URL_API}/leader/${sessionStorage.getItem(
        "userId"
      )}/available-subject`
    )
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
  );
};

export default SelectAnt;
