import React, { useState } from "react";
import { Header } from "../../components";
import InputField from "../../components/InputField";
import { MdCategory, MdOutlineSubtitles, MdSubject } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

const LecturersCreate = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [campus, setCampus] = useState("");
  const [status, setStatus] = useState(true);
  const [subject, setSubject] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const lecturersData = { fullName, email, campus, status, subject };
    console.log({ fullName, email, campus, status });
    fetch("http://localhost:8000/lecturers", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(lecturersData),
    })
      .then((res) => {
        console.log("RES", res);
        alert("Create successfully");
        navigate("/lecturers");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Lecturers" title="Create Lecturers" />
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <InputField
            label="fullName"
            title="fullName"
            placeHolder="Enter lecturers fullname"
            icon={<MdOutlineSubtitles />}
            required={true}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <InputField
            label="Email"
            title="Email"
            placeHolder="Enter lecturers email"
            icon={<MdSubject />}
            required={true}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <InputField
            label="subject"
            title="subject"
            placeHolder="Enter lecturers subject"
            icon={<MdOutlineSubtitles />}
            required={true}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <div >
          <label
            htmlFor="type"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Campus
          </label>
          <select
            onChange={(e) => setCampus(e.target.value)}
            id="type"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option defaultValue>Choose a type</option>
            <option value="HCM">Ho Chi Minh</option>
            <option value="HL">Hoa Lac</option>
            <option value="DN">Da Nang</option>
          </select>
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit
          </button>
          <Link
            to="/lecturers"
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

export default LecturersCreate;
