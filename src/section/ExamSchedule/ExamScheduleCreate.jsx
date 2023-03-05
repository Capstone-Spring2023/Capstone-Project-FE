import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { Header, SelectAnt } from "../../components";
import InputField from "../../components/InputField";
import { MdOutlineSubtitles, MdSubject } from "react-icons/md";
import { AiOutlineFieldTime } from "react-icons/ai";
import Dropzone from "dropzone";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../utils/constants";
import FormAnt from "./components/FormAnt";

const ExamScheduleCreate = () => {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState(true);
  const [assignee, setAssignee] = useState("");
  const navigate = useNavigate();
  const app = initializeApp(firebaseConfig);
  const dropzoneRef = useRef(null);
  const storage = getStorage(app);

  const onInputChange = (e) => {
    let file = e.target.files[0];
    let fileRef = ref(storage, file.name);
    const uploadTask = uploadBytesResumable(fileRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const process = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is" + process + "%done");
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log(url);
          localStorage.setItem("url", url);
        });
      }
    );
  };

  // useEffect(() => {
  //   // Khởi tạo Dropzone
  //   let myDropzone = new Dropzone("#my-dropzone", {
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
  //     let uploadTask = uploadBytesResumable(fileRef, file);
  //
  //     // Đăng ký sự kiện khi tải lên hoàn thành
  //     uploadTask.on(
  //       "state_changed",
  //       (snapshot) => {
  //         const process =
  //           (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //         console.log("Upload is" + process + "%done");
  //       },
  //       (err) => console.log(err),
  //       () => {
  //         // Lấy URL tải xuống từ Firebase Storage và in ra console
  //         getDownloadURL(uploadTask.snapshot.ref).then((url) => {
  //           console.log(url);
  //           localStorage.setItem("url", url);
  //         });
  //       }
  //     );
  //   });
  // });


  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Toaster />
      <Header category="Exam Schedule" title="Create Exam Schedule" />
      <FormAnt />
    </div>
  );
};

export default ExamScheduleCreate;
