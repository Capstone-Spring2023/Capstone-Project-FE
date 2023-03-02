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
// import axios from "axios";

const firebaseConfig = {
  apiKey: "AIzaSyCoQVZnZFVPgJbdCR0_cT7N8qEkUE_W7Gk",
  authDomain: "capstone-cft.firebaseapp.com",
  databaseURL: "https://capstone-cft-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "capstone-cft",
  storageBucket: "capstone-cft.appspot.com",
  messagingSenderId: "240001179952",
  appId: "1:240001179952:web:a47e364ed5086f3848e8f5",
  measurementId: "G-Q1YQBVJXWP"
};
const app = initializeApp(firebaseConfig);
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

  // useEffect(() => {
  //   const dropzone = new Dropzone(dropzoneRef.current, {
  //     url: "/upload",
  //     maxFiles: 1,
  //     acceptedFiles: ".pdf,.doc,.docx,.txt",
  //     addRemoveLinks: true,
  //     dictDefaultMessage: "Drag and drop your file here or click to browse",
  //     dictRemoveFile: "Remove",
  //   });
  //   dropzone.on("addedFile", (addedFile) => {
  //     setFile(addedFile);
  //   });

  //   return () => {
  //     dropzone.removeAllFiles();
  //   };
  // }, []);

  useEffect(() => {
    // Khởi tạo Dropzone
    var myDropzone = new Dropzone("#my-dropzone", {
      url: "/upload",
      maxFiles: 1,
      acceptedFiles: ".pdf,.doc,.docx,.txt",
      addRemoveLinks: true,
      dictDefaultMessage: "Drag and drop your file here or click to browse",
      dictRemoveFile: "Remove",
    });

    myDropzone.on("addedfile", function (file) {
      // Tạo tham chiếu lưu trữ Firebase cho tệp
      let fileRef = ref(storage, file.name);
    
      // Tải tệp lên Firebase Storage
      var uploadTask = uploadBytesResumable(fileRef, file);
    
      // Đăng ký sự kiện khi tải lên hoàn thành
      uploadTask.on('state_changed', (snapshot) => {
        const process = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is" + process + "%done");
      },
        (err) => console.log(err),
        () => {
          // Lấy URL tải xuống từ Firebase Storage và in ra console
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            console.log(url);
            localStorage.setItem("url",url);
          })
        }
      )
    });
  })

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
        })
      }
    )
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const examData = { title, subject, type, content, status };
    console.log({ title, subject, type, status });
    toast.promise(
      fetch("http://localhost:8000/exams", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(examData),
      })
        .then((res) => {
          navigate("/exam-submission");
          console.log(res);
        })
        .catch((err) => {
          console.log(err.message);
        }),
      {
        loading: "Creating...",
        success: <b>Created successfully</b>,
        error: <b>Could not create.</b>,
      }
    );
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Toaster />
      <Header category="ExamSubmission" title="Create ExamSubmission" />
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <InputField
            label="title"
            title="Title"
            placeHolder="Enter exam title"
            icon={<MdOutlineSubtitles />}
            required={true}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <InputField
            label="subject"
            title="Subject"
            placeHolder="Enter exam subject"
            icon={<MdSubject />}
            required={true}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <div>
            <label
              htmlFor="type"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Type
            </label>
            <select
              onChange={(e) => setType(e.target.value)}
              id="type"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option defaultValue>Choose a type</option>
              <option value="By hand">By hand</option>
              <option value="By computer">By computer</option>
            </select>
          </div>
        </div>
        <div className="mb-6" id="my-dropzone" ref={dropzoneRef}>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="content"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  aria-hidden="true"
                  className="w-10 h-10 mb-3 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop your exam content here
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Docx or Rar
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                multiple
                accept=".docx,.rar"
                onChange={onInputChange}
              />
            </label>
          </div>
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit
          </button>
          <Link
            to="/exam-submission"
            type="submit"
            className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ExamSubmissionCreate;
