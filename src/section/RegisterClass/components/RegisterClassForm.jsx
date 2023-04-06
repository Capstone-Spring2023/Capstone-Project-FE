import React, { useState } from "react";
import { Button, Col, DatePicker, DatePickerProps, Form, Row } from "antd";
import SelectAnt from "./SelectAnt";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Select } from 'antd';
const { Option } = Select;
const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
const RegisterClassForm = () => {
  const [semester, setSemester] = useState("");
  const [department, setDepartment] = useState("");
  const [subject, setSubject] = useState("");
  const [slot, setSlot] = useState("");
  const [status, setStatus] = useState(true);
  const [date, setDate] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const semesterItems = ["Spring", "Summer", "Fall"];
  const departmentItems = ["SE", "CN", "JP"];
  const subjectItems = ["PRF", "PRN", "MAE"];
  const slotItems = ["A1", "A2", "A3", "A4", "A5", "A6","P1", "P2", "P3", "P4", "P5", "P6"];
  const [selectedSlots, setSelectedSlots] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = () => {
    const registerData = {
      department,
      semester,
      subject,
      status,
      slot,
      date,
      createdDate,
    };
    console.log("DATA", registerData);
    toast.promise(
      fetch("http://localhost:8000/register-class", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(registerData),
      })
        .then((res) => {
          console.log("RES", res);
          navigate("/register-class");
        })
        .catch((err) => {
          console.log(err.message);
        }),
      {
        loading: "Creating...",
        success: <b>Created successfully</b>,
        error: <b>Could not create.</b>,
      }
    );
  };
  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    setDate(dateString);
  };
  const handleSubject = (value) => {
    setSubject(value);
  };
  const handleSemester = (value) => {
    setSemester(value);
  };
  const handleDepartment = (value) => {
    setDepartment(value);
  };
  const handleSlot = (value) => {
    setSlot(value);
  };
  const handleDate = (value) => {
    setDate(value);
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
          {/* <Form.Item label="Semester" name="semester">
            <SelectAnt
              placeholder="Select semester"
              items={semesterItems}
              onChange={handleSemester}
              disabled={true}
              defaultValue="SPRING"
            />
          </Form.Item> */}
          {/* <Form.Item
            label="Department"
            name="department"
            rules={[
              {
                required: true,
                message: "Please input your department!",
              },
            ]}
          >
            <SelectAnt
              placeholder="Select department"
              defaultValue="Select department"
              items={departmentItems}
              onChange={handleDepartment}
            />
          </Form.Item> */}
          <Form.Item
            label="Available Subject"
            name="subject"
            rules={[
              {
                required: true,
                message: "Please input your subject!",
              },
            ]}
          >
            <SelectAnt
              placeholder="Select your subject"
              defaultValue="Select your subject"
              items={subjectItems}
              onChange={handleSubject}
            />
          </Form.Item>
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
              // defaultValue="Select your Slot"
              onChange={handleSlot}
              value={selectedSlots}
            >
              {slotItems.map((item) => (
                <Option key={item} value={item}>
                  {item}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {/* <Form.Item
            label="Date"
            name="date"
            rules={[
              {
                required: true,
                message: "Please input your date!",
              },
            ]}
          >
            <DatePicker onChange={onChange} />
          </Form.Item> */}
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
