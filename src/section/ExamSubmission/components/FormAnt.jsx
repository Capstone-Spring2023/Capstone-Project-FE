import React, { useRef, useState,useEffect } from "react";
import { Button, Col, Form, message, Row } from "antd";
import SelectAnt from "./SelectAnt";
import UploadAnt from "./UploadAnt";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import SelectType from "./SelectType";
import { ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../../firebase/firebase";
import { BASE_URL_API } from "../../../utils/constants";

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
const FormAnt = () => {
  const [examContent, setExamContent] = useState("ESH201 Exam PE");
  const [availableSubjectId, setAvailableSubjectId] = useState("");
  const [availableSubjectName, setAvailableSubjectName] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState(true);
  const [examLink, setExamLink] = useState("");
  const navigate = useNavigate();
  const [examScheduleId,setExamScheduleId]=useState("");
  const [file, setFile] = useState("");
  const handleSubject = (value) => {
    setAvailableSubjectId(parseInt(value.split(",")[0]));
    setAvailableSubjectName(value.split(",")[1]);
  };

  const fetchSubject = () => {
    fetch(`https://fpt-cft.azurewebsites.net/api/user/28/exam-schedule`)
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setExamScheduleId(resp[0].examScheduleId);
        console.log("escde",resp[0].examScheduleId);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    fetchSubject();
    console.log("exsc",examScheduleId);
  }, []);

  const handleSubmit = () => {
    const examData = { examScheduleId, examContent, examLink };
    toast.promise(
      fetch(`${BASE_URL_API}/exam-submission/` + examScheduleId, {
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
    console.log("SUBJECTNAME", availableSubjectName);
    // let fileRef = ref(storage, file.name);
    let fileRef = ref(
      storage,
      `/${sessionStorage.getItem("email")}/${availableSubjectName}/PE1/${
        file.name
      }`
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
          `gs://capstone-cft.appspot.com/${sessionStorage.getItem(
            "email"
          )}/${availableSubjectName}/PE1`
        );
        setExamLink(sessionStorage.getItem("email"));
        console.log(examLink);
        message.success(`${file.name} file uploaded successfully.`);
      }
    );
  };

  const upLoadFile2 = async ({ onSuccess, onProgress, onError, file }) => {
    // let fileRef = ref(storage, file.name);
    let fileRef = ref(
      storage,
      `/${sessionStorage.getItem("email")}/${availableSubjectName}/PE1/Given/${
        file.name
      }`
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
      `/${sessionStorage.getItem(
        "email"
      )}/${availableSubjectName}/PE1/TestCases/${file.name}`
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
            <SelectType defaultValue="By computer" disabled={true} />
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
      <Row justify="center" align="center">
        <Col span={20} offset={6}>
          <Form.Item name="file" accept=".docx">
            <UploadAnt
              uploadFile={upLoadFile}
              description="Please only upload file with type docx"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="center" align="center">
        <Col span={20} offset={6}>
          <Form.Item name="file" accept="application/pdf">
            <UploadAnt
              uploadFile={upLoadFile2}
              description="Please only upload file in your Given folder"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="center" align="center">
        <Col span={20} offset={6}>
          <Form.Item name="file">
            <UploadAnt
              uploadFile={upLoadFile3}
              accept=".txt"
              description="Please only upload file in your TestCases folder"
            />
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
