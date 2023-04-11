import React, { useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  message as messageAnt,
  Row,
  Upload,
} from "antd";
import SelectAnt from "./SelectAnt";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { InboxOutlined } from "@ant-design/icons";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { BASE_URL_API } from "../../../utils/constants";
import checkPageStatus from "../../../utils/function";
import SelectAntLecturer from "./SelectAntLecturer";

const { Dragger } = Upload;
const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
const FormAnt = ({ socket }) => {
  const [tittle, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [deadline, setDeadline] = useState("");
  const [examLink, setExamLink] = useState("");
  const type = "Schedule";
  const message = "You have new Schedule request";
  const leaderId = sessionStorage.getItem("userId");
  const navigate = useNavigate();
  const onFinish = () => {
    const examScheduleData = {
      tittle,
      deadline,
      examLink,
      type,
      message,
      leaderId,
    };
    toast.promise(
      fetch(`${BASE_URL_API}/exam-schedule?availableId=` + subject, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(examScheduleData),
      })
        .then((res) => {
          // if (noti.trim() && sessionStorage.getItem("userId")) {
          //   socket.emit("message", {
          //     type: "Schedule",
          //     message: noti,
          //     id: sessionStorage.getItem("userId"),
          //   });
          //   //Here it is 👇🏻
          //   checkPageStatus(noti, sessionStorage.getItem("userId"));
          // }
          // setNoti("");
          console.log(res)
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

  const upLoadFile = ({ onSuccess, onProgress, onError, file }) => {
    if (!file) return;
    const storage = getStorage();
    let fileRef = ref(
      storage,
      `/${sessionStorage.getItem("email")}/ExamSchedule/${file.name}`
    );
    const uploadTask = uploadBytesResumable(fileRef, file);
    uploadTask.on(
      "state_changed",
      function progress(snapshot) {
        onProgress(
          {
            percent:
              Math.floor(
                snapshot.bytesTransferred / snapshot.totalBytes
              ).toFixed(2) * 100,
          },
          file
        );
      },
      function error(err) {
        onError(err, file);
        messageAnt.error(`${file.name} file uploaded failed.`);
      },
      function complete() {
        onSuccess(file);
        getDownloadURL(uploadTask.snapshot.ref)
          .then((url) => {
            console.log(url);
            setExamLink(url);
            messageAnt.success(`${file.name} file uploaded successfully.`);
          })
          .catch((error) => {
            console.log(error);
            messageAnt.error(`${file.name} file uploaded failed.`);
          });
      }
    );
    // }
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
      {/* <Col span={12}>
          <Form.Item
            label="Lecturer"
            name="Lecturer"
            rules={[
              {
                required: true,
                message: "Please input Lecturer!",
              },
            ]}
          >
            <SelectAntLecturer onChange={handleSubject} />
          </Form.Item>
        </Col> */}
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
            <Dragger customRequest={(e) => upLoadFile(e)}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">Only support for .docx file</p>
            </Dragger>
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
