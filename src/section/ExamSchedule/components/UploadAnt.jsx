import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import { storage } from "../../../firebase/firebase";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
import {getDownloadURL } from 'firebase/storage';
const { Dragger } = Upload;

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
              Math.floor(snapshot.bytesTransferred / snapshot.totalBytes).toFixed(
                2
              ) * 100,
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
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log(url);
          localStorage.setItem('url', url);
          message.success(`${file.name} file uploaded successfully.`);
        }).catch((error) => {
          console.log(error);
          message.error(`${file.name} file uploaded failed.`);
        });
      }
    );
};

const UploadAnt = () => (
  <Dragger customRequest={(e) => upLoadFile(e)}>
    <p className="ant-upload-drag-icon">
      <InboxOutlined />
    </p>
    <p className="ant-upload-text">Click or drag file to this area to upload</p>
    <p className="ant-upload-hint">Only support for docx and rar file</p>
  </Dragger>
);
export default UploadAnt;
