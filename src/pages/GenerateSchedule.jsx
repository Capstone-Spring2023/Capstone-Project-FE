import React, { useState } from "react";
import { Header } from "../components";
import {
  Button,
  message as messageAnt,
  message,
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

const { Dragger } = Upload;
const ImportSchedule = () => (
  <Dragger customRequest={(e) => upLoadFile(e)}>
    <p className="ant-upload-drag-icon">
      <InboxOutlined />
    </p>
    <p className="ant-upload-text">Click or drag file to this area to import</p>
    <p className="ant-upload-hint">Only support for .xlsx file</p>
  </Dragger>
);
const steps = [
  {
    title: "Import empty schedule",
    content: <ImportSchedule />,
  },
  {
    title: "Generate schedule",
    content: "Second-content",
  },
  {
    title: "Export csv",
    content: "Last-content",
  },
];

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
            Math.floor(snapshot.bytesTransferred / snapshot.totalBytes).toFixed(
              2
            ) * 100,
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
      getDownloadURL(uploadTask.snapshot.ref)
        .then((url) => {
          console.log(url);
          messageAnt.success(`${file.name} file uploaded successfully.`);
        })
        .catch((error) => {
          console.log(error);
          messageAnt.error(`${file.name} file uploaded failed.`);
        });
    }
  );
  // }
};
const GenerateSchedule = () => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
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
          <Button type="default" onClick={() => next()}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button
            type="default"
            onClick={() => message.success("Processing complete!")}
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
