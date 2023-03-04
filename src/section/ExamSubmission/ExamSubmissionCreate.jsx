import React, { useState, useRef, useEffect } from "react";
import { Header } from "../../components";
import InputField from "../../components/InputField";
import { MdOutlineSubtitles, MdSubject } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { initializeApp } from 'firebase/app';
import { getDownloadURL, getStorage, uploadBytesResumable } from 'firebase/storage';
import { ref } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import Dropzone from "dropzone";
import "dropzone/dist/dropzone.css";
import { useDropzone } from 'react-dropzone';
import {firebaseLoginConfig} from "../../utils/constants";
import FormAnt from "./components/FormAnt";
// import axios from "axios";

const app = initializeApp(firebaseLoginConfig);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

const ExamSubmissionCreate = () => {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState(true);
  const [content, setContent] = useState("This is content");
  const navigate = useNavigate();
  const dropzoneRef = useRef(null);
  const [file, setFile] = useState(null);
  //
  // useEffect(() => {
  //   // Khởi tạo Dropzone
  //   var myDropzone = new Dropzone("#my-dropzone", {
  //     url: "/upload",
  //     maxFiles: 1,
  //     acceptedFiles: ".pdf,.doc,.docx,.txt",
  //     addRemoveLinks: true,
  //     dictDefaultMessage: "Drag and drop your file here or click to browse",
  //     dictRemoveFile: "Remove",
  //   });
  //
  //   myDropzone.on("addedfile", function (file) {
  //     // Tạo tham chiếu lưu trữ Firebase cho tệp
  //     let fileRef = ref(storage, file.name);
  //
  //     // Tải tệp lên Firebase Storage
  //     var uploadTask = uploadBytesResumable(fileRef, file);
  //
  //     // Đăng ký sự kiện khi tải lên hoàn thành
  //     uploadTask.on('state_changed', (snapshot) => {
  //       const process = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //       console.log("Upload is" + process + "%done");
  //     },
  //       (err) => console.log(err),
  //       () => {
  //         // Lấy URL tải xuống từ Firebase Storage và in ra console
  //         getDownloadURL(uploadTask.snapshot.ref).then((url) => {
  //           console.log(url);
  //           localStorage.setItem("url",url);
  //         })
  //       }
  //     )
  //   });
  // })

  const onInputChange = (e) => {
    let file = e.target.files[0];
    let fileRef = ref(storage, file.name);
    const uploadTask = uploadBytesResumable(fileRef, file);
    uploadTask.on('state_changed', (snapshot) => {
      const process = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is" + process + "%done");
    },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log(url);
          localStorage.setItem("url",url);
          setFile(url);
        })
      }
    )
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Toaster />
      <Header category="ExamSubmission" title="Create ExamSubmission" />
      <FormAnt/>
    </div>
  );
};

export default ExamSubmissionCreate;
