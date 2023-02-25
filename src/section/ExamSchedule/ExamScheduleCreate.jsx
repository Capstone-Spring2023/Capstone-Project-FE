import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { Header } from "../../components";
import InputField from "../../components/InputField";
import { MdOutlineSubtitles, MdSubject } from "react-icons/md";
import { AiOutlineFieldTime } from "react-icons/ai";

const ExamScheduleCreate = () => {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState(true);
  const [assignee, setAssignee] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const examScheduleData = { title, subject, assignee, deadline, status };
    console.log("Data", examScheduleData);

    toast.promise(
      fetch("http://localhost:8000/exams-schedule", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(examScheduleData),
      })
        .then((res) => {
          navigate("/exam-schedule");
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
      <Header category="Exam Submission" title="Create Exam Submission" />
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <InputField
            label="title"
            title="Title"
            placeHolder="Enter exam schedule title"
            icon={<MdOutlineSubtitles />}
            required={true}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <InputField
            label="subject"
            title="Subject"
            placeHolder="Enter exam schedule subject"
            icon={<MdSubject />}
            required={true}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <div>
            <label
              htmlFor="assignee"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Assignee
            </label>
            <select
              onChange={(e) => setAssignee(e.target.value)}
              id="assignee"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option defaultValue>Choose a lecturer</option>
              <option value="HoaDNT">HoaDNT</option>
              <option value="HoangNT">HoangNT</option>
            </select>
          </div>
          <InputField
            type="date"
            label="deadline"
            title="Deadline"
            placeHolder="Enter deadline"
            icon={<AiOutlineFieldTime />}
            required={true}
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit
          </button>
          <Link
            to="/exam-schedule"
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

export default ExamScheduleCreate;
