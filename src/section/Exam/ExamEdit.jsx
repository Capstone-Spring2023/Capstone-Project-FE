import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Header } from "../../components";
import InputField from "../../components/InputField";
import { MdOutlineSubtitles, MdSubject } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";

const ExamEdit = () => {
  const { examid } = useParams();
  const [examData, setExamData] = useState({});
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState(true);
  const [content, setContent] = useState("This is content");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/exams/" + examid)
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setId(resp.id);
        setTitle(resp.title);
        setSubject(resp.subject);
        setType(resp.type);
        setContent(resp.content);
        setStatus(resp.status);
        console.log("ID", id);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);
  const handleUpdate = (e) => {
    e.preventDefault();
    const examData = { id, title, subject, type, content, status };
    fetch("http://localhost:8000/exams/" + examid, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(examData),
    })
      .then((res) => {
        console.log("RES", res);
        alert("Saved successfully");
        navigate("/exam");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const notify = () => {
    console.log("HELLO");
    toast("Test");
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Exam" title="Update Exam" />
      <form onSubmit={handleUpdate}>
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
              <option selected={type === "By hand"} value="By hand">
                By hand
              </option>
              <option selected={type === "By computer"} value="By computer">
                By computer
              </option>
            </select>
          </div>
        </div>
        <div className="mb-6">
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
                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                multiple
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
            to="/exam"
            type="submit"
            className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
          >
            Cancel
          </Link>
        </div>
        {/*<Toast />*/}
      </form>
      <button onClick={notify}>Click</button>
      <ToastContainer />
    </div>
  );
};

export default ExamEdit;
