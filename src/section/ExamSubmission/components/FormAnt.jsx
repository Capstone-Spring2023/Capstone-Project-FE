import React, { useRef, useState } from "react";
import { Button, Col, Form, Input, message, Row } from "antd";
import SelectAnt from "./SelectAnt";
import UploadAnt from "./UploadAnt";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import SelectType from "./SelectType";
import { ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../../firebase/firebase";

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
const FormAnt = () => {
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
      fetch("https://fpt-cft.azurewebsites.net/v1/api/exams", {
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

  const upLoadFile = async ({ onSuccess, onProgress, onError, file }) => {
    // let fileRef = ref(storage, file.name);
    let fileRef = ref(
      storage,
      `/${sessionStorage.getItem("email")}/PE1/${file.name}`
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
        message.error(`${file.name} file uploaded failed.`);
      },
      function complete() {
        onSuccess(file);
        // getDownloadURL(uploadTask.snapshot.ref).then((url) => {
        //   console.log(url);
        //   localStorage.setItem("url", url);
        //   setFile(url);
        // })
        setFile(
          `gs://capstone-cft.appspot.com/${sessionStorage.getItem("email")}/PE1`
        );
        message.success(`${file.name} file uploaded successfully.`);
      }
    );
  };

  const upLoadFile2 = async ({ onSuccess, onProgress, onError, file }) => {
    // let fileRef = ref(storage, file.name);
    let fileRef = ref(
      storage,
      `/${sessionStorage.getItem("email")}/PE1/Given/${file.name}`
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
        message.error(`${file.name} file uploaded failed.`);
      },
      function complete() {
        onSuccess(file);
        // getDownloadURL(uploadTask.snapshot.ref).then((url) => {
        //   console.log(url);
        //   localStorage.setItem("url", url);
        //   setFile(url);
        // })
        message.success(`${file.name} file uploaded successfully.`);
      }
    );
  };

  const upLoadFile3 = async ({ onSuccess, onProgress, onError, file }) => {
    // let fileRef = ref(storage, file.name);
    let fileRef = ref(
      storage,
      `/${sessionStorage.getItem("email")}/PE1/Testcase/${file.name}`
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
        message.error(`${file.name} file uploaded failed.`);
      },
      function complete() {
        onSuccess(file);
        // getDownloadURL(uploadTask.snapshot.ref).then((url) => {
        //   console.log(url);
        //   localStorage.setItem("url", url);
        //   setFile(url);
        // })
        message.success(`${file.name} file uploaded successfully.`);
      }
    );
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
      initialValues={{
        remember: true,
        myField: "default value",
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
          <Form.Item name="file" accept=".docx">
            <UploadAnt uploadFile={upLoadFile} description="Please only upload file with type docx"/>
          </Form.Item>
        </Col>
      </Row>
      <Row justify="center" align="center">
        <Col span={20} offset={6}>
          <Form.Item name="file" accept="application/pdf">
            <UploadAnt uploadFile={upLoadFile2} description="Please only upload file in your Given folder"/>
          </Form.Item>
        </Col>
      </Row>
      <Row justify="center" align="center">
        <Col span={20} offset={6}>
          <Form.Item name="file">
            <UploadAnt uploadFile={upLoadFile3} accept=".txt" description="Please only upload file in your TestCase folder"/>
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
