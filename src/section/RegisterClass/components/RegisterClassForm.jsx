import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Select, Space, message } from "antd";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { BASE_URL_API } from "../../../utils/constants";

const { Option } = Select;
const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
const RegisterClassForm = () => {
  const slotItems = ["A1", "A3", "A5", "P1", "P3", "P5"];
  const [availableSubjectIds, setAvailableSubjectIds] = useState([]);
  const [registerSlots, setRegisterSlots] = useState([]);
  const [subjectItems, setSubjectItems] = useState([]);
  const userId = sessionStorage.getItem("userId");
  const navigate = useNavigate();
  const [showSubjects, setShowSubjects] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const submitDisabled =
    registerSlots.length === 0 || selectedSubjects.length === 0;

  const [examAvailableSubjectData, setAvailableSubjectData] = useState([{}]);
  const handleSubjectSelect = (value) => {
    fetchAvailableSubject();
    const filteredData = examAvailableSubjectData?.filter(
      (item) =>
        item?.subjectName?.toLowerCase()?.indexOf(value.toLowerCase()) >= 0
    );
    // Cập nhật lại state để hiển thị dữ liệu đã lọc trên bảng
    setAvailableSubjectData(filteredData);
  };

  useEffect(() => {
    fetchAvailableSubject();
  }, []);

  const fetchAvailableSubject = () => {
    fetch(`${BASE_URL_API}/user/${userId}/semester/1/available-subject`)
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setSubjectItems(resp);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleSubmit = (values) => {
    if (registerSlots.length === 0 || availableSubjectIds.length === 0) {
      message.error("Please select both slot and subject.");
    } else {
      const registerData = {
        userId,
        availableSubjectIds,
        registerSlots,
      };
      toast.promise(
        fetch(`${BASE_URL_API}/schedule/register-subject-slot`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(registerData),
        })
          .then((res) => {
            navigate("/register-class");
          })
          .catch((err) => {
            console.log(err.message);
          }),
        {
          loading: "Register...",
          success: <b>Register successfully</b>,
          error: <b>Could not register.</b>,
        }
      );
    }
  };
  const handleSubject = (value) => {
    setAvailableSubjectIds(value);
    setSelectedSubjects([]);
  };
  const handleSlot = (value) => {
    setRegisterSlots(value);
    setAvailableSubjectIds([]);
    setSelectedSubjects([]);
    setShowSubjects(true);
  };
  return (
    <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      style={{
        maxWidth: 1500,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={handleSubmit}
      onFinishFailed={onFinishFailed}
      autoComplete="on"
    >
      <Row>
        <Col span={16}>
          <Form.Item
            label="Slot"
            name="slot"
            rules={[
              {
                required: true,
                message: "Please input your slot!",
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select your Slot"
              onChange={handleSlot}
              value={registerSlots}
            >
              {slotItems.map((item, index) => (
                <Option key={index} value={item}>
                  {item}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {showSubjects && (
            <Form.Item
              label="Teachable Subject"
              name="subject"
              rules={[
                {
                  required: true,
                  message: "Please input your subject!",
                },
              ]}
            >
              <Select
                mode="multiple"
                placeholder="Select your subject"
                value={availableSubjectIds}
                onChange={handleSubject}
                onSelect={handleSubjectSelect}
                optionLabelProp="label"
                filterOption={(input, option) =>
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                optionFilterProp="label"
              >
                {subjectItems?.map((item, index) => (
                  <Option
                    key={index}
                    value={item.availableSubjectId}
                    label={item.subjectName}
                  >
                    <Space>{item?.subjectName}</Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          <Button htmlType="submit">Submit</Button>
        </Col>
        <Col offset={18}>
          <Button danger onClick={() => navigate("/register-class")}>
            Cancel
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default RegisterClassForm;
