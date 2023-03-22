import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  Row,
} from "antd";
import SelectAnt from "./SelectAnt";
import UploadAnt from "./UploadAnt";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { BASE_URL_API } from "../../../utils/constants";

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
const FormAntEdit = ({ availableSubjectId }) => {
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState(true);
  const [assignee, setAssignee] = useState("HoaDNT");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BASE_URL_API}/exam-schedule/available-subject/${availableSubjectId}`)
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        const data = resp.data;
        console.log("DATA", data);
        setId(data.examPaperId);
        setTitle(data.tittle);
        setSubject(data.tittle);
        setAssignee(data.assignee);
        setDeadline(data.deadline);
        setStatus(data.status);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);
  const handleUpdate = () => {
    const examData = { id, title, subject, assignee, deadline, status };
    toast.promise(
      fetch("http://localhost:8000/exams-schedule/" + availableSubjectId, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(examData),
      })
        .then((res) => {
          console.log("RES", res);
          navigate("/exam-schedule");
        })
        .catch((err) => {
          console.log(err.message);
        }),
      {
        loading: "Saving...",
        success: <b>Update exam successfully</b>,
        error: <b>Could not save.</b>,
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
      style={{
        maxWidth: 1500,
      }}
      fields={[
        {
          name: ["examTitle"],
          value: title,
        },
        {
          name: ["examSubject"],
          value: subject,
        },
      ]}
      onFinish={handleUpdate}
      onFinishFailed={onFinishFailed}
      autoComplete="on"
    >
      <Row>
        <Col span={12}>
          <Form.Item
            label="Exam title"
            name="examTitle"
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
            name="examSubject"
            rules={[
              {
                required: true,
                message: "Please input your subject!",
              },
            ]}
          >
            <SelectAnt onChange={handleSubject} defaultValue={subject} />
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
            <DatePicker defaultValue={`${deadline}`} onChange={onChange} />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="center" align="center">
        <Col span={20} offset={6}>
          <Form.Item name="file">
            <UploadAnt />
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

export default FormAntEdit;
