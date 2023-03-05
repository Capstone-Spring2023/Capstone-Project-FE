import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import { getDownloadURL, getStorage } from 'firebase/storage';
// import { getAuth, GoogleAuthProvider } from "firebase/auth";
// import Dropzone from "dropzone";
// import "dropzone/dist/dropzone.css";
// import { useDropzone } from 'react-dropzone';
// import { firebaseLoginConfig } from "../../../utils/constants";
import { useState } from "react";
import { storage } from "../../../firebase/firebase";
import { ref, uploadBytesResumable } from "firebase/storage";
import FormAnt from "./FormAnt";
import { useDispatch } from "react-redux";

const { Dragger } = Upload;
// const upLoadFile = ({ onSuccess, onProgress, onError, file }) => {
//   if (!file) return;
//   const storageRef = ref(storage, `/exam/${file.name}`);
//   const uploadTask = uploadBytesResumable(storageRef, file);
//   uploadTask.on(
//     "state_changed",
//     function progress(snapshot) {
//       onProgress(
//         {
//           percent:
//             Math.floor(snapshot.bytesTransferred / snapshot.totalBytes).toFixed(
//               2
//             ) * 100,
//         },
//         file
//       );
//     },
//     function error(err) {
//       onError(err, file);
//       message.error(`${file.name} file uploaded failed.`);
//     },
//     function complete() {
//       onSuccess(file);
//       message.success(`${file.name} file uploaded successfully.`);
//       getDownloadURL(uploadTask.snapshot.ref).then((url) => {
//         console.log(url);
//         localStorage.setItem("url", url);
//       })
//     }
//   );
// };

const UploadAnt = () => (
  <Dragger >
    <p className="ant-upload-drag-icon">
      <InboxOutlined />
    </p>
    <InboxOutlined />
    <p className="ant-upload-text">Click or drag file to this area to upload</p>
    <p className="ant-upload-hint">Only support for docx and rar file</p>
  </Dragger>
);
export default UploadAnt;