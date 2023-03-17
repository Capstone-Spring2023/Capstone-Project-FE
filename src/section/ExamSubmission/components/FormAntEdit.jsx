import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Row,
  Space,
  message
} from "antd";
import SelectAnt from "./SelectAnt";
import UploadAnt from "./UploadAnt";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { DatePickerProps } from "antd";
import { getStorage, ref, uploadBytesResumable, listAll, deleteObject } from "firebase/storage";
import { getDownloadURL } from 'firebase/storage';
import { storage } from "../../../firebase/firebase";

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
const FormAntEdit = (editID) => {
  const { examid } = useParams(editID);
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState(true);
  const [assignee, setAssignee] = useState("HoaDNT");
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetch("https://fpt-cft.azurewebsites.net/v1/api/exams/" + examid)
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setId(resp.examPaperId);
        setTitle(resp.examContent);
        setSubject(resp.subject);
        setAssignee(resp.assignee);
        setDeadline(resp.deadline);
        setStatus(resp.status);
        console.log("TITLE", resp);
      })
      .catch((err) => {
        console.log(err.message);
      });
    console.log("ID", id);
    console.log("EXAMID", examid);
    // console.log("TITLE", title.toString());
  }, []);
  const handleUpdate = () => {
    const examData = { id, title, subject, assignee, deadline, status };
    toast.promise(
      fetch("http://localhost:8000/exams-schedule/" + examid, {
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
  const handleSubject = (value) => {
    setSubject(value);
  };
  const upLoadFile = async ({ onSuccess, onProgress, onError, file }) => {
    let folderRef = ref(
      storage,
      `/${sessionStorage.getItem("email")}/PE1`
    );
    let fileRef = ref(
      storage,
      `/${sessionStorage.getItem("email")}/PE1/${file.name}`
    );
    listAll(folderRef).then((res) => {
      if (res.items.length > 0) {
        const promises = [];
        res.items.forEach((itemRef) => {
          promises.push(deleteObject(itemRef));
        });
        Promise.all(promises)
          .then(() => {
            console.log("All files deleted successfully");
            const uploadTask = uploadBytesResumable(fileRef, file);
            uploadTask.on(
              "state_changed",
              function progress(snapshot) {
                onProgress(
                  {
                    percent: Math.floor(
                      (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    ),
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
                setFile(
                  `gs://capstone-cft.appspot.com/${sessionStorage.getItem(
                    "email"
                  )}/PE1`
                );
                message.success(`${file.name} file uploaded successfully.`);
              }
            );
          })
          .catch((error) => {
            console.error("Error deleting files:", error);
          });
      } else {
        const uploadTask = uploadBytesResumable(fileRef, file);
        uploadTask.on(
          "state_changed",
          function progress(snapshot) {
            onProgress(
              {
                percent: Math.floor(
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                ),
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
            setFile(
              `gs://capstone-cft.appspot.com/${sessionStorage.getItem(
                "email"
              )}/PE1`
            );
            message.success(`${file.name} file uploaded successfully.`);
          }
        );
      }
    });
  };
  const upLoadFile2 = async ({ onSuccess, onProgress, onError, file }) => {
    let folderRef = ref(
      storage,
      `/${sessionStorage.getItem("email")}/PE1/Given`
    );
    let fileRef = ref(
      storage,
      `/${sessionStorage.getItem("email")}/PE1/Given/${file.name}`
    );
    listAll(folderRef).then((res) => {
      if (res.items.length > 0) {
        const promises = [];
        res.items.forEach((itemRef) => {
          promises.push(deleteObject(itemRef));
        });
        Promise.all(promises)
          .then(() => {
            console.log("All files Given deleted successfully");
            const uploadTask = uploadBytesResumable(fileRef, file);
            uploadTask.on(
              "state_changed",
              function progress(snapshot) {
                onProgress(
                  {
                    percent: Math.floor(
                      (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    ),
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
                setFile(
                  `gs://capstone-cft.appspot.com/${sessionStorage.getItem(
                    "email"
                  )}/PE1`
                );
                message.success(`${file.name} file uploaded successfully.`);
              }
            );
          })
          .catch((error) => {
            console.error("Error deleting files:", error);
          });
      } else {
        const uploadTask = uploadBytesResumable(fileRef, file);
        uploadTask.on(
          "state_changed",
          function progress(snapshot) {
            onProgress(
              {
                percent: Math.floor(
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                ),
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
            setFile(
              `gs://capstone-cft.appspot.com/${sessionStorage.getItem(
                "email"
              )}/PE1`
            );
            message.success(`${file.name} file uploaded successfully.`);
          }
        );
      }
    });
  };
  const upLoadFile3 = async ({ onSuccess, onProgress, onError, file }) => {
    let folderRef = ref(
      storage,
      `/${sessionStorage.getItem("email")}/PE1/TestCase`
    );
    let fileRef = ref(
      storage,
      `/${sessionStorage.getItem("email")}/PE1/TestCase/${file.name}`
    );
    listAll(folderRef).then((res) => {
      if (res.items.length > 0) {
        const promises = [];
        res.items.forEach((itemRef) => {
          promises.push(deleteObject(itemRef));
        });
        Promise.all(promises)
          .then(() => {
            console.log("All files TestCase deleted successfully");
            const uploadTask = uploadBytesResumable(fileRef, file);
            uploadTask.on(
              "state_changed",
              function progress(snapshot) {
                onProgress(
                  {
                    percent: Math.floor(
                      (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    ),
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
                setFile(
                  `gs://capstone-cft.appspot.com/${sessionStorage.getItem(
                    "email"
                  )}/PE1`
                );
                message.success(`${file.name} file uploaded successfully.`);
              }
            );
          })
          .catch((error) => {
            console.error("Error deleting files:", error);
          });
      } else {
        const uploadTask = uploadBytesResumable(fileRef, file);
        uploadTask.on(
          "state_changed",
          function progress(snapshot) {
            onProgress(
              {
                percent: Math.floor(
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                ),
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
            setFile(
              `gs://capstone-cft.appspot.com/${sessionStorage.getItem(
                "email"
              )}/PE1`
            );
            message.success(`${file.name} file uploaded successfully.`);
          }
        );
      }
    });
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
      onFinish={handleUpdate}
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
              initialValues="scf"
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
            <SelectAnt defaultValue={`${subject}`} onChange={handleSubject} />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="center" align="center">
        <Col span={20} offset={6}>
          <Form.Item name="file" accept=".docx">
            <UploadAnt uploadFile={upLoadFile} description="Please only upload file with type docx" />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="center" align="center">
        <Col span={20} offset={6}>
          <Form.Item name="file" accept="application/pdf">
            <UploadAnt uploadFile={upLoadFile2} description="Please only upload file in your Given folder" />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="center" align="center">
        <Col span={20} offset={6}>
          <Form.Item name="file">
            <UploadAnt uploadFile={upLoadFile3} accept=".txt" description="Please only upload file in your TestCase folder" />
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
