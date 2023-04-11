import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, message, Row } from "antd";
import UploadAnt from "./UploadAnt";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  deleteObject,
  listAll,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../../../firebase/firebase";
import { BASE_URL_API } from "../../../utils/constants";

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
const FormAntEdit = ({ editID }) => {
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [assignee, setAssignee] = useState("");
  const [examScheduleID, setExamScheduleID] = useState("");
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL_API}/exam-submission/` + editID)
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setId(resp.examPaperId);
        setTitle(resp.examContent);
        setSubjectName(resp.subjectName);
        setAssignee(resp.examLink);
        setExamScheduleID(resp.subjectName);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);
  const handleUpdate = () => {
    const examData = {
      examContent: title,
      examLink: assignee,
    };

    toast.promise(
      fetch(`${BASE_URL_API}/exam-submission/` + id, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(examData),
      })
        .then((res) => {
          navigate("/exam-submission");
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
  const upLoadFile = async ({ onSuccess, onProgress, onError, file }) => {
    let folderRef = ref(storage, `/` + assignee + `/${examScheduleID}/PE1`);
    let fileRef = ref(
      storage,
      `/` + assignee + `/${examScheduleID}/PE1/${file.name}`
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
                  `gs://capstone-cft.appspot.com/${assignee}/${examScheduleID}/PE1`
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
              `gs://capstone-cft.appspot.com/${assignee}/${examScheduleID}/PE1`
            );
            console.log(file);
            message.success(`${file.name} file uploaded successfully.`);
          }
        );
      }
    });
  };
  const upLoadFile2 = async ({ onSuccess, onProgress, onError, file }) => {
    let folderRef = ref(
      storage,
      `/` + assignee + `/${examScheduleID}/PE1/Given`
    );
    let fileRef = ref(
      storage,
      `/` + assignee + `/${examScheduleID}/PE1/Given/${file.name}`
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
                  )}/${examScheduleID}/PE1`
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
              `gs://capstone-cft.appspot.com/${assignee}/${examScheduleID}/PE1`
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
      `/` + assignee + `/${examScheduleID}/PE1/TestCases`
    );
    let fileRef = ref(
      storage,
      `/` + assignee + `/${examScheduleID}/PE1/TestCases/${file.name}`
    );
    listAll(folderRef).then((res) => {
      if (res.items.length > 0) {
        const promises = [];
        res.items.forEach((itemRef) => {
          promises.push(deleteObject(itemRef));
        });
        Promise.all(promises)
          .then(() => {
            console.log("All files TestCases deleted successfully");
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
                  `gs://capstone-cft.appspot.com/${assignee}/${examScheduleID}/PE1`
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
              `gs://capstone-cft.appspot.com/${assignee}/${examScheduleID}/PE1`
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
            // name="title"
            rules={[
              {
                required: true,
                message: "Please input your title!",
              },
            ]}
          >
            <Input
              style={{
                backgroundColor: "#fff",
                color: "#000",
                border: "1px solid #ccc",
              }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              // placeholder="Enter title here"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Subject"
            rules={[
              {
                required: true,
                message: "Please input your subject!",
              },
            ]}
          >
            {/* <SelectAnt defaultValue={subjectName} onChange={handleSubject} /> */}
            {subjectName}
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

export default FormAntEdit;
