import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  message,
  Row,
  Upload,
} from "antd";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { BASE_URL_API } from "../../../utils/constants";
import { InboxOutlined } from "@ant-design/icons";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

const { Dragger } = Upload;

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
const FormAntEdit = ({ availableSubjectId }) => {
  const [tittle, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [deadline, setDeadline] = useState("");
  const [examLink,setFile]=useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BASE_URL_API}/exam-schedule/available-subject/${availableSubjectId}`)
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        const data = resp.data;
        setTitle(data.tittle);
        setSubject(data.subjectName);
        setDeadline(data.deadline);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);
  const handleUpdate = () => {
    const examData = {
      tittle: tittle,
      deadline: deadline,
      examLink: examLink,
    };
    toast.promise(
      fetch(`${BASE_URL_API}/exam-schedule/` + availableSubjectId, {
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
                Math.floor(snapshot.bytesTransferred / snapshot.totalBytes).toFixed(
                  2
                ) * 100,
            },
            file
          );
        },
        function error(err) {
          onError(err, file);
          message.error(`${file.name} file uploaded failed.`);
        },
        function complete() {
          onSuccess(file);
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            console.log(url);
            setFile(url);
            message.success(`${file.name} file uploaded successfully.`);
          }).catch((error) => {
            console.log(error);
            message.error(`${file.name} file uploaded failed.`);
          });
        }
      );
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
          value: tittle,
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
            {subject}
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
            <Dragger customRequest={(e) => upLoadFile(e)}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">Only support for docx and rar file</p>
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

export default FormAntEdit;
