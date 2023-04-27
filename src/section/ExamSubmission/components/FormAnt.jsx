import React, { useEffect, useState } from "react";
import { Button, Col, Form, message as messageAnt, Row } from "antd";
import SelectAnt from "./SelectAnt";
import UploadAnt from "./UploadAnt";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../../firebase/firebase";
import { BASE_URL_API } from "../../../utils/constants";
import checkPageStatus from "../../../utils/function";

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
const FormAnt = ({ socket }) => {
  const [examContent, setExamContent] = useState("Exam PE");
  const [availableSubjectName, setAvailableSubjectName] = useState(""); //id
  const [availableSubjectName2, setAvailableSubjectName2] = useState("");
  const [examLink, setExamLink] = useState("");
  const navigate = useNavigate();
  const [file, setFile] = useState("");
  const [subjectType, setSubjectType] = useState("");
  const [fileUploaded1, setFileUploaded1] = useState(false);
  const [fileUploaded2, setFileUploaded2] = useState(false);
  const [fileUploaded3, setFileUploaded3] = useState(false);
  const [noti, setNoti] = useState("Submission");
  const type = "Submission";
  const message = "Have submit the exam for";

  const handleSubject = (value) => {
    setAvailableSubjectName(value.split(",")[0]);
    setSubjectType(value.split(",")[1]);
    setAvailableSubjectName2(value.split(",")[2]);
  };

  const fetchSubject = () => {
    fetch(
      `https://fpt-cft.azurewebsites.net/api/user/${sessionStorage.getItem(
        "userId"
      )}/exam-schedule`
    )
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        console.log(resp);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    fetchSubject();
  }, []);

  const handleSubmit = () => {
    if (fileUploaded1 && fileUploaded2 && fileUploaded3) {
      const examData = {
        availableSubjectName,
        examContent,
        examLink,
        type,
        message,
      };
      toast.promise(
        fetch(`${BASE_URL_API}/exam-submission/` + availableSubjectName, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(examData),
        })
          .then((res) => {
            if (noti.trim() && sessionStorage.getItem("fullName")) {
              socket.emit("message", {
                type: "Submission",
                message: noti,
                userName: sessionStorage.getItem("fullName"),
              });
              // checkPageStatus(noti, sessionStorage.getItem("fullName"));
            }
            setNoti("");
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
    } else {
      messageAnt.error(
        "Please ensure all files are uploaded before submitting."
      );
    }
  };

  const upLoadFile = async ({ onSuccess, onProgress, onError, file }) => {
    console.log("SUBJECTNAME", availableSubjectName2);
    // let fileRef = ref(storage, file.name);
    let fileRef = ref(
      storage,
      `/SP23/${sessionStorage.getItem(
        "email"
      )}/${availableSubjectName2.trim()}/PE1/${file.name}`
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
        setFile(
          `gs://capstone-cft.appspot.com/SP23/${sessionStorage.getItem(
            "email"
          )}/${availableSubjectName2.trim()}/PE1`
        );
        setFileUploaded1(true);
        setExamLink(sessionStorage.getItem("email"));
        console.log(examLink);
        messageAnt.success(`${file.name} file uploaded successfully.`);
      }
    );
  };

  const upLoadFile2 = async ({ onSuccess, onProgress, onError, file }) => {
    let fileRef = ref(
      storage,
      `/SP23/${sessionStorage.getItem(
        "email"
      )}/${availableSubjectName2.trim()}/PE1/Given/${file.name}`
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
        setFileUploaded2(true);
        messageAnt.success(`${file.name} file uploaded successfully.`);
      }
    );
  };

  const upLoadFile3 = async ({ onSuccess, onProgress, onError, file }) => {
    let fileRef = ref(
      storage,
      `/SP23/${sessionStorage.getItem(
        "email"
      )}/${availableSubjectName2.trim()}/PE1/TestCases/${file.name}`
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
        setFileUploaded3(true);
        messageAnt.success(`${file.name} file uploaded successfully.`);
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
        <Col span={12}>
          <Form.Item label="Type" name="type">
            {subjectType}
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
