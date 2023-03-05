import React, { useRef, useState, useDispatch } from "react";
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
import SelectType from "./SelectType";
import { message, Upload } from "antd";
import { getDownloadURL, getStorage } from 'firebase/storage';
import { storage } from "../../../firebase/firebase";
import { ref, uploadBytesResumable } from "firebase/storage";

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
const FormAnt = (props) => {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState(true);
  const [content, setContent] = useState("This is content");
  const navigate = useNavigate();
  const dropzoneRef = useRef(null);
  const [file, setFile] = useState("");

  const handleSubmit = () => {
    const examData = { title, subject, status, file };
    console.log({ title, subject, status, file });
    toast.promise(
      fetch("http://localhost:8000/exams", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(examData),
      })
        .then((res) => {
          navigate("/exam-submission");
          console.log(res);
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

  const upLoadFileF = (e) => {
    let file = e.target.files[0];
    let fileRef = ref(storage, file.name);
    const uploadTask = uploadBytesResumable(fileRef, file);
    uploadTask.on('state_changed', (snapshot) => {
      const process = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is" + process + "%done");
    },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log(url);
          localStorage.setItem("url",url);
          setFile(url);
        })
      }
    )
        };

  const handleSubject = (value) => {
    setSubject(value);
  };
  const handleType = (value) => {
    setType(value);
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
        myField: 'default value'
      }}
      onFinish={handleSubmit}
      onFinishFailed={onFinishFailed}
      autoComplete="on"
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
            initialValue="PRF"
            rules={[
              {
                required: true,
                message: "Please input your subject!",
              },
            ]}
          >
            <SelectAnt
              defaultValue="PRF"
              disabled={true}
              onChange={handleSubject}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Form.Item
            label="Type"
            name="type"
            initialValue="By computer"
            rules={[
              {
                required: true,
                message: "Please input your type!",
              },
            ]}
          >
            <SelectType
              defaultValue="By computer"
              disabled={true}
              onChange={handleType}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="center" align="center">
        <Col span={20} offset={6}>
          <Form.Item name="file" onChange={upLoadFileF}>
            <UploadAnt />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button htmlType="submit">Submit</Button>
        </Col>
        <Col offset={18}>
          <Button danger onClick={() => navigate("/exam-submission")}>
            Cancel
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default FormAnt;
