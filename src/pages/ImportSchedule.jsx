import React from "react";
import { Header } from "../components";
import { InboxOutlined } from "@ant-design/icons";
import { Button, message as messageAnt, Upload } from "antd";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { read, utils } from "xlsx";
import { saveAs } from "file-saver";

const { Dragger } = Upload;
const ImportSchedule = () => {
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
    // }
  };

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const workbook = read(event.target.result, { type: "binary" });
      const sheet1Name = workbook.SheetNames[0];
      const sheet1 = workbook.Sheets[sheet1Name];
      const data1 = utils.sheet_to_csv(sheet1);

      console.log("CSV", data1); // In dữ liệu từ trang tính 1 ra console
      const csvBlob = new Blob([data1], { type: "text/csv;charset=utf-8" });
      saveAs(csvBlob, file.name.replace(".xlsx", "") + ".csv");
    };
    reader.readAsBinaryString(file);
  };
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <div className="flex justify-between items-center">
        <Header category="Managements" title="Import Schedule" />
      </div>
      <Dragger customRequest={(e) => upLoadFile(e)}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to import
        </p>
        <p className="ant-upload-hint">Only support for .xlsx file</p>
      </Dragger>
      <Button>Send Noti</Button>
    </div>
  );
};

export default ImportSchedule;
