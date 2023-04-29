import React, { useEffect, useState } from "react";
import { ConfigProvider, Select, Space } from "antd";
import { BASE_URL_API } from "../../../utils/constants";
import { SmileOutlined } from "@ant-design/icons";

const { Option } = Select;

const SelectAntLecturer = ({ onChange, defaultValue,subjectId,isSubjectSelected }) => {
  const [lecturer, setLecturer] = useState([{}]);
  const [lecturerFilter, setLecturerFilter] = useState([{}]);
  const [subject,setSubject]=useState("");
  // const [defaultLecturer, setDefaultLecturer] = useState({
  //   value: sessionStorage.getItem("userId"),
  //   label: sessionStorage.getItem("fullName")
  // });
  const [defaultLecturer, setDefaultLecturer] = useState(sessionStorage.getItem("userId"));

  const handleSubjectSelect = (value) => {
    fetchSubject();
    const filteredData = lecturerFilter?.filter(
      (item) =>
        item?.subjectName?.toLowerCase()?.indexOf(value.toLowerCase()) >= 0
    );
    // Cập nhật lại state để hiển thị dữ liệu đã lọc trên bảng
    setLecturerFilter(filteredData);
  };
  
  const fetchSubject = () => {
    fetch(`${BASE_URL_API}/header/GetLecturersHaveRegisterSubjectByAvailableSubjectId/${subjectId}`)
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
    if (subjectId) {
      fetchSubject();
    }
  }, [subjectId]);

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
        placeholder={sessionStorage.getItem("fullName")}
        onChange={onChange}
        onSelect={handleSubjectSelect}
        disabled={!isSubjectSelected}
        optionLabelProp="label"
        filterOption={(input, option) =>
          option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        optionFilterProp="label"
        defaultValue={defaultLecturer}
        // value={defaultLecturer}
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
