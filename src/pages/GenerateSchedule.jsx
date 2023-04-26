import React, { useState } from "react";
import { Header } from "../components";
import {
  Button,
  Col,
  Form,
  message as messageAnt,
  Row,
  Steps,
  Table,
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
import { toast, Toaster } from "react-hot-toast";

const { Dragger } = Upload;

const GenerateSchedule = () => {
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState(new FormData());
  const [showUploadButtons, setShowUploadButtons] = useState(false);
  const [showUploadButtons2, setShowUploadButtons2] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadSuccess2, setUploadSuccess2] = useState(false);
  const [statistic, setStatistic] = useState([{}]);

  const handleButtonClick = async () => {
    try {
      const response = await fetch(`${BASE_URL_API}/auto-schedule/get-file`);
      const downloadUrl = await response.text();
      window.open(downloadUrl, "_blank");
      setShowUploadButtons(true);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStatistic = () => {
    fetch(`${BASE_URL_API}/statistic/all/semester/1`)
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setStatistic(resp);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const generateSchedule = () => {
    if (uploadSuccess && uploadSuccess2) {
      toast.promise(
        fetch(`${BASE_URL_API}/auto-schedule/main-flow-full?semesterId=1`, {
          method: "POST",
          body: formData,
        })
          .then((res) => {
            if (res.ok) {
              res.text().then((downloadUrl) => {
                window.open(downloadUrl, "_blank");
                fetchStatistic();
                setCurrent(current + 1);
              });
            } else if (res.status === 401) {
              alert("Oops! ");
            }
          })
          .catch((err) => {
            console.log(err);
          }),
        {
          loading: "Generating...",
          success: <b>Generate successfully</b>,
          error: <b>Generate fail</b>,
        }
      );
    } else {
      messageAnt.error(
        "Please ensure all files are uploaded before submitting."
      );
    }
  };

  const upLoadFile = ({ onSuccess, onProgress, onError, file }) => {
    if (!file) return;
    const fileExtension = file.name.split(".").pop();
    const fileNameParts = file.name.split("_");
    if (fileExtension !== "csv") {
      messageAnt.error("Only support for .csv file");
      return;
    }
    // if (file.name !== "register_subject_v1.csv") {
    if (fileNameParts[0] !== "register" || fileNameParts[1] !== "subject") {
      messageAnt.error("Only support for register_subject_(v1).csv file");
      return;
    }
    const storage = getStorage();
    setFormData((formData) => {
      formData.append("file", file);
      return formData;
    });

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
            setShowUploadButtons2(true);
            setUploadSuccess(true);
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
    setFormData((formData) => {
      formData.append("file", file);
      return formData;
    });

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
            setUploadSuccess2(true);
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

  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
    },
    {
      title: "No. Class Has Registered But Not Assign",
      dataIndex: "numNotRegisteredSubject",
    },
    {
      title: "No. Class has been assign",
      dataIndex: "numClass",
    },
    {
      title: "Satisfaction Level",
      dataIndex: "percentPoint",
      render: (_, record) => `${Number(record.percentPoint).toFixed(1)}%`,
    },
  ];

  const steps = [
    {
      title: "Generate schedule",
      content: (
        <Form
          name="basic"
          labelCol={{
            span: 16,
          }}
          wrapperCol={{
            span: 23,
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
                  <Dragger
                    customRequest={(e) => upLoadFile(e)}
                    onChange={(e) => console.log(e)}
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                      Click or drag file to this area to import file register
                    </p>
                    <p className="ant-upload-hint">
                      Only support for .csv file
                    </p>
                  </Dragger>
                </Form.Item>
              )}
            </Col>
            <Col span={12}>
              {showUploadButtons2 && (
                <Form.Item name="schedule">
                  <Dragger
                    customRequest={(e) => upLoadFile2(e)}
                    onChange={(e) => console.log(e)}
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                      Click or drag file to this area to import file CF-schedule
                    </p>
                    <p className="ant-upload-hint">
                      Only support for .csv file
                    </p>
                  </Dragger>
                </Form.Item>
              )}
            </Col>
          </Row>
        </Form>
      ),
    },
    {
      title: "Statistic",
      content: (
        <Table
          columns={columns}
          dataSource={statistic}
          pagination={{ pageSize: 5 }}
        />
      ),
    },
  ];
  const start = () => {
    setCurrent(0);
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
      <div>
        <Toaster />
      </div>
      <div className="flex flex-col gap-3">
        <Header category="Managements" title="Generate Schedule" />
        <Steps current={current} items={items} />
        <div style={contentStyle}>{steps[current].content}</div>
        <div
          style={{
            marginTop: 16,
          }}
        >
          {current < steps.length - 1 && showUploadButtons && (
            <Button type="default" onClick={() => generateSchedule()}>
              Generate
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateSchedule;
