import React, { useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  Row,
  message
} from "antd";
import SelectAnt from "./SelectAnt";
import UploadAnt from "./UploadAnt";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { getDownloadURL } from 'firebase/storage';

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
const FormAnt = () => {
  const [tittle, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState(true);
  const [assignee, setAssignee] = useState("HoaDNT");
  const [examLink, setExamLink] = useState(null);
  const [typeId, setTypeID] = useState("1");
  const navigate = useNavigate();
  const onFinish = () => {
    // const examScheduleData = { tittle, subject, assignee, deadline, examLink };
    const examScheduleData = { tittle, deadline, examLink, typeId };
    console.log("Data", examScheduleData);
    toast.promise(
      fetch("https://fpt-cft.azurewebsites.net/api/leader/exams-schedule?availableId=" + subject, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(examScheduleData),
      })
        .then((res) => {
          navigate("/exam-schedule");
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
    setDeadline(dateString);
  };
  const handleSubject = (value) => {
    setSubject(value);
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
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Row>
        <Col span={12}>
          <Form.Item
            label="Exam title"
            name="title"
            rules={[
              {
                required: true,
                message: "Please input your title!",
              },
            ]}
          >
            <Input
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title here"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Subject"
            name="subject"
            rules={[
              {
                required: true,
                message: "Please input your subject!",
              },
            ]}
          >
            <SelectAnt onChange={handleSubject} />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Form.Item
            label="Deadline"
            name="deadline"
            rules={[
              {
                required: true,
                message: "Please input your deadline!",
              },
            ]}
          >
            <DatePicker onChange={onChange} />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="center" align="center">
        <Col span={20} offset={6}>
          <Form.Item name="file" accept=".docx">
            <UploadAnt description="Please only upload file with type docx" />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button htmlType="submit">Submit</Button>
        </Col>
        <Col offset={18}>
          <Button danger onClick={() => navigate("/exam-schedule")}>
            Cancel
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default FormAnt;
