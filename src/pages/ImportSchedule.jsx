import React, { useState } from "react";
import { Header } from "../components";
import { InboxOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  DatePickerProps,
  message as messageAnt,
  Upload,
  Form,
  Steps,
  Result,
} from "antd";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { read, utils } from "xlsx";
import { saveAs } from "file-saver";
import { BASE_URL_API } from "../utils/constants";
import moment from "moment/moment";
import { toast, Toaster } from "react-hot-toast";

const { Dragger } = Upload;
const ImportSchedule = () => {
  const [deadLine, setDeadLine] = useState("");
  const [formData, setFormData] = useState(new FormData());
  const [current, setCurrent] = useState(0);
  const upLoadFile = ({ onSuccess, onProgress, onError, file }) => {
    if (!file) return;
    const storage = getStorage();
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
            handleFile(file);
            messageAnt.success(`${file.name} file imported successfully.`);
          })
          .catch((error) => {
            console.log(error);
            messageAnt.error(`${file.name} file imported failed.`);
          });
      }
    );
  };

  const sendNotification = () => {
    importSchedule();
    setRegisterDeadLine();
  };

  const setRegisterDeadLine = () => {
    const deadLineData = {
      semesterId: 1,
      deadline: deadLine,
    };
    toast.promise(
      fetch(`${BASE_URL_API}/schedule/deadline`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(deadLineData),
      })
        .then((res) => {
          setCurrent(current + 1);
          console.log(res);
        })
        .catch((err) => {
          console.log(err.message);
        }),
      {
        loading: "Sending Notification...",
        success: <b>Sent successfully</b>,
        error: <b>Sent fail</b>,
      }
    );
  };
  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    setDeadLine(dateString);
  };
  const importSchedule = () => {
    fetch(`${BASE_URL_API}/auto-schedule/import-file/semester/1`, {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleFile = (file) => {
    const reader = new FileReader();
    setFormData((formData) => {
      formData.append("file", file);
      return formData;
    });
    reader.onload = (event) => {
      const workbook = read(event.target.result, { type: "binary" });
      const sheet1Name = workbook.SheetNames[0];
      const sheet1 = workbook.Sheets[sheet1Name];
      const data1 = utils.sheet_to_csv(sheet1);

      console.log("CSV", data1); // In dữ liệu từ trang tính 1 ra console
      // const csvBlob = new Blob([data1], { type: "text/csv;charset=utf-8" });
      // saveAs(csvBlob, file.name.replace(".xlsx", "") + ".csv");
    };
    reader.readAsBinaryString(file);
  };

  const contentStyle: React.CSSProperties = {
    marginTop: 16,
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
      current &&
      (current < minDeadline || current > maxDeadline || current.isSame(today))
    );
  };

  const steps = [
    {
      title: "Import Empty Schedule",
      content: (
        <Form name="basic" onFinish={sendNotification} autoComplete="off">
          <Form.Item
            name="deadline"
            rules={[
              {
                required: true,
                message: "Please input register deadline!",
              },
            ]}
          >
            <DatePicker
              onChange={onChange}
              placeholder="Select register deadline"
              style={{ width: "200px" }}
              disabledDate={isDisabledDate}
            />
          </Form.Item>
          <Form.Item
            name="file"
            rules={[
              {
                required: true,
                message: "Please import your empty schedule here!",
              },
            ]}
          >
            <Dragger customRequest={(e) => upLoadFile(e)}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to import
              </p>
              <p className="ant-upload-hint">
                Only support for .xlsx or .csv file
              </p>
            </Dragger>
          </Form.Item>
          <Button htmlType="submit" className="w-fit">
            Send Notification
          </Button>
        </Form>
      ),
    },
    {
      title: "Success",
      content: (
        <Result
          status="success"
          title="All operation has been success!"
          subTitle="You can continue your work now."
          extra={[<Button key="buy">Home</Button>]}
        />
      ),
    },
  ];

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Toaster />
      <div className="flex flex-col gap-3">
        <Header category="Managements" title="Import Schedule" />
        <Steps current={current} items={items} />
        <div style={contentStyle}>{steps[current].content}</div>
      </div>
    </div>
  );
};

export default ImportSchedule;
