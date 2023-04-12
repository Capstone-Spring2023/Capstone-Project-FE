import React, { useState } from "react";
import { Header } from "../components";
import {
  Button,
  Col,
  Form,
  message as messageAnt,
  Row,
  Steps,
  theme,
  Upload,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { BASE_URL_API } from "../utils/constants";

const { Dragger } = Upload;

const GenerateSchedule = () => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const formData = new FormData();
  const [showUploadButtons, setShowUploadButtons] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [downloadUrl2, setDownloadUrl2] = useState(null);

  const handleButtonClick = async () => {
    try {
      const options = {
        method: "POST"
      };
      const response = await fetch(`${BASE_URL_API}/auto-schedule/get-file`, options);
      const downloadUrl = await response.text();
      setDownloadUrl(downloadUrl);
      window.open(downloadUrl, '_blank');
      setShowUploadButtons(true);
    } catch (error) {
      console.error(error);
    }
  };

  const generateSchedule = () => {
    fetch(`${BASE_URL_API}/auto-schedule/main-flow`, {
      method: "POST",
      body: formData,
    }).then(
      function (res) {
        if (res.ok) {
          res.text().then((downloadUrl) => {
            setDownloadUrl2(downloadUrl);
            window.open(downloadUrl, '_blank');
          });
        } else if (res.status === 401) {
          alert("Oops! ");
        }
      },
      function (e) {
        alert("Error submitting form!");
      }
    );
  };

  const upLoadFile = ({ onSuccess, onProgress, onError, file }) => {
    if (!file) return;
    const fileExtension = file.name.split(".").pop();
    if (fileExtension !== "csv") {
      messageAnt.error("Only support for .csv file");
      return;
    }
    if (file.name !== "register_subject_v1.csv") {
      messageAnt.error("Only support for register_subject_v1.csv file");
      return;
    }
    const storage = getStorage();
    formData.append("file", file);

    let fileRef = ref(
      storage,
      `/${sessionStorage.getItem("email")}/EmptySchedule/${file.name}`
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
        messageAnt.error(`${file.name} file imported failed.`);
      },
      function complete() {
        onSuccess(file);
        getDownloadURL(uploadTask.snapshot.ref)
          .then((url) => {
            console.log(url);
            messageAnt.success(`${file.name} file imported successfully.`);
          })
          .catch((error) => {
            console.log(error);
            messageAnt.error(`${file.name} file imported failed.`);
          });
      }
    );
    // }
  };

  const upLoadFile2 = ({ onSuccess, onProgress, onError, file }) => {
    if (!file) return;
    const fileExtension = file.name.split(".").pop();
    const fileNameParts = file.name.split("-");
    if (fileExtension !== "csv") {
      messageAnt.error("Only support for .csv file");
      return;
    }
    if (fileNameParts[0] !== "CF" || fileNameParts[1] !== "Lịch") {
      messageAnt.error("Only support for CF-Lịch-(semester).csv file");
      return;
    }
    const storage = getStorage();
    formData.append("file", file);

    let fileRef = ref(
      storage,
      `/${sessionStorage.getItem("email")}/EmptySchedule/${file.name}`
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
        messageAnt.error(`${file.name} file imported failed.`);
      },
      function complete() {
        onSuccess(file);
        getDownloadURL(uploadTask.snapshot.ref)
          .then((url) => {
            console.log(url);
            messageAnt.success(`${file.name} file imported successfully.`);
          })
          .catch((error) => {
            console.log(error);
            messageAnt.error(`${file.name} file imported failed.`);
          });
      }
    );
    // }
  };

  const HandleFileInput = () => (
    <Form
      name="basic"
      labelCol={{
        span: 16,
      }}
      wrapperCol={{
        span: 30,
      }}
      initialValues={{
        remember: true,
      }}
      autoComplete="off"
    >
      <Row>
        {!showUploadButtons && ( // hiển thị nút tạm thời
          <Button type="default" onClick={handleButtonClick}>
            Download file
          </Button>
        )}
        <Col span={12}>
          {showUploadButtons && (
            <Form.Item name="schedule">
              <Dragger customRequest={(e) => upLoadFile(e)}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to import
                </p>
                <p className="ant-upload-hint">Only support for .csv file</p>
              </Dragger>
            </Form.Item>
          )}
        </Col>
        <Col span={12}>
          {showUploadButtons && (
            <Form.Item name="schedule">
              <Dragger customRequest={(e) => upLoadFile2(e)}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to import
                </p>
                <p className="ant-upload-hint">Only support for .csv file</p>
              </Dragger>
            </Form.Item>
          )}
        </Col>
      </Row>
    </Form>
  );

  const steps = [
    {
      title: "Generate schedule",
      content: <HandleFileInput />,
    },
    {
      title: "Export csv",
      content: "Last-content",
    },
  ];
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  const contentStyle = {
    marginTop: 16,
  };
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <div className="flex justify-between items-center">
        <Header category="Managements" title="Generate Schedule" />
      </div>
      <Steps current={current} items={items} />
      <div style={contentStyle}>{steps[current].content}</div>
      <div
        style={{
          marginTop: 24,
        }}
      >
        {current < steps.length - 1 && (
          <>
            <Button type="default" onClick={() => next()}>
              Next
            </Button>
            <Button type="default" onClick={() => generateSchedule()}>
              Generate
            </Button>
          </>
        )}
        {current === steps.length - 1 && (
          <Button
            type="default"
            onClick={() => messageAnt.success("Processing complete!")}
          >
            Done
          </Button>
        )}
        {current > 0 && (
          <Button
            style={{
              margin: "0 8px",
            }}
            onClick={() => prev()}
          >
            Previous
          </Button>
        )}
      </div>
    </div>
  );
};

export default GenerateSchedule;
