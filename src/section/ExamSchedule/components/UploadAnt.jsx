import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import { ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../../firebase/firebase";

const { Dragger } = Upload;

const upLoadFile = ({ onSuccess, onProgress, onError, file }) => {
  if (!file) return;
  const storageRef = ref(storage, `/sample/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

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
      message.success(`${file.name} file uploaded successfully.`);
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
