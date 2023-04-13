import React, { useState } from "react";
import { Header } from "../../components";
import InputField from "../../components/InputField";
import { MdOutlineSubtitles, MdSubject } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { read, utils } from "xlsx";

const { sheet_to_json } = utils;

const SubjectCreate = () => {
  const [departmentId, setDepartmentId] = useState("");
  const [examId, setEXamId] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState(true);
  const [subjectName, setSubjectName] = useState("");
  const navigate = useNavigate();
  const handleFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const workbook = read(event.target.result, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = utils.sheet_to_json(sheet);
      console.log(data); // In dữ liệu JSON ra console
    };
    reader.readAsBinaryString(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const subjectData = { departmentId, examId, type, status, subjectName };
    console.log({ subjectName, examId, type, departmentId, status });
    fetch("http://localhost:8000/subjects", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(subjectData),
    })
      .then((res) => {
        console.log("RES", res);
        alert("Create successfully");
        navigate("/subjects");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Subjects" title="Create Subjects" />
      <form onSubmit={handleSubmit}>
        <div>
          <input type="file" onChange={handleFile} />
        </div>
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <InputField
            label="Subject Name"
            title="Subject Name"
            placeHolder="Subject Name"
            icon={<MdOutlineSubtitles />}
            required={true}
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
          />
          <InputField
            label="Department ID"
            title="Department ID"
            placeHolder="Enter Department ID"
            icon={<MdSubject />}
            required={true}
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
          />
        </div>
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <InputField
            label="Exam ID"
            title="Exam ID"
            placeHolder="Enter Exam ID"
            icon={<MdOutlineSubtitles />}
            required={true}
            value={examId}
            onChange={(e) => setEXamId(e.target.value)}
          />
        </div>
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
        <div className="flex justify-between">
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit
          </button>
          <Link
            to="/subjects"
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

export default SubjectCreate;
