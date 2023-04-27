import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  message,
  message as messageAnt,
  Row,
  Upload,
  Typography
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
import moment from "moment";

const { Dragger } = Upload;
const { Text } = Typography;

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
const FormAntEdit = ({ availableSubjectId }) => {
  const [tittle, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [deadline, setDeadline] = useState("");
  const [examLink, setFile] = useState("");
  const navigate = useNavigate();
  const [fileUploaded, setFileUploaded] = useState(false);

  useEffect(() => {
    fetch(
      `${BASE_URL_API}/exam-schedule/available-subject/${availableSubjectId}`
    )
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
    if (!fileUploaded) {
      messageAnt.error("Please upload a file before submitting.");
      return;
    }
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

  const isDisabledDate = (current) => {
    // Lấy ra ngày hiện tại
    const today = moment().startOf("day");
    // Tính toán ngày hết hạn tối thiểu
    const minDeadline = moment(today).add(1, "day"); // Tối thiểu ngày mai
    // Tính toán ngày hết hạn tối đa
    const maxDeadline = moment(today).add(4, "month"); // Tối đa 4 tháng sau
    // Kiểm tra current có nằm trong khoảng thời gian tối thiểu và tối đa không
    return (
      current && (current < minDeadline || current > maxDeadline || current.isSame(today))
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
        getDownloadURL(uploadTask.snapshot.ref)
          .then((url) => {
            console.log(url);
            setFile(url);
            setFileUploaded(true);
            message.success(`${file.name} file uploaded successfully.`);
          })
          .catch((error) => {
            console.log(error);
            setFileUploaded(false);
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
            <DatePicker defaultValue={`${deadline}`} onChange={onChange} disabledDate={isDisabledDate} />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="center" align="center">
        <Text type="danger" >
          ***You need to re-upload the entire file if you want to update
        </Text>
        <Col span={20} offset={6}>
          <Form.Item name="file">
            <Dragger customRequest={(e) => upLoadFile(e)}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Only support for docx and rar file
              </p>
            </Dragger>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button htmlType="submit" disabled={!fileUploaded}>
            Submit
          </Button>
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
