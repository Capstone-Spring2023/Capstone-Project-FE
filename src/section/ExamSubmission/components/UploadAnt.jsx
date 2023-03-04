import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import { initializeApp } from 'firebase/app';
import { getDownloadURL, getStorage, uploadBytesResumable } from 'firebase/storage';
import { ref } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import Dropzone from "dropzone";
import "dropzone/dist/dropzone.css";
import { useDropzone } from 'react-dropzone';
import { firebaseLoginConfig } from "../../../utils/constants";
import { useState } from "react";

const { Dragger } = Upload;
const app = initializeApp(firebaseLoginConfig);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);
const props = {
  name: "file",
  multiple: false,
  action: "",
  onChange(info){
    const { status } = info.file;
    console.log("FILE", info);
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
    // let file = info.target.files[0];
    // let fileRef = ref(storage, file.name);
    // const uploadTask = uploadBytesResumable(fileRef, file);
    // uploadTask.on('state_changed', (snapshot) => {
    //   const process = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //   console.log("Upload is" + process + "%done");
    // },
    //   (err) => console.log(err),
    //   () => {
    //     getDownloadURL(uploadTask.snapshot.ref).then((url) => {
    //       console.log(url);
    //       localStorage.setItem("url",url);
    //     })
    //   }
    // )
  }
  ,onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};

const UploadAnt = () => (
  <Dragger>
    <p className="ant-upload-drag-icon" {...props}>
    </p>
    <InboxOutlined />
    <p className="ant-upload-text">Click or drag file to this area to upload</p>
    <p className="ant-upload-hint">Only support for docx and rar file</p>
  </Dragger>
);
export default UploadAnt;

