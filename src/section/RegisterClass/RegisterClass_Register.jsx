import React, { useState } from "react";
import { Header } from "../../components";
import InputField from "../../components/InputField";
import { MdCategory, MdOutlineSubtitles, MdSubject } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

const RegisterClass_Register = () => {
    const [department, setDepartment] = useState("");
    const [semester, setSemester] = useState("");
    const [subject, setSubject] = useState("");
    const [status, setStatus] = useState(null);
    const [slot, setSlot] = useState("");
    const [dateTime, setDateTime] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const registerData = { department, semester, subject, status, slot, dateTime };
        // console.log({ subjectName, examId, type, departmentId, status });
        fetch("http://localhost:8000/register-class", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(registerData),
        })
            .then((res) => {
                console.log("RES", res);
                alert("Send successfully");
                navigate("/register-class");
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    return (
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
            <Header category="Class" title="Register" />
            <form onSubmit={handleSubmit}>
            <div className="grid gap-6 mb-6 md:grid-cols-2">
                    <label
                        htmlFor="type"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Semester
                    </label>
                    <select
                        onChange={(e) => setSemester(e.target.value)}
                        id="type"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                        <option defaultValue>Choose a type</option>
                        <option value="Spring2023">Spring2023</option>
                        <option value="Summer2023">Summer2023</option>
                        <option value="Fall2023">Fall2023</option>
                    </select>
                </div>
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                    <label
                        htmlFor="type"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Department
                    </label>
                    <select
                        onChange={(e) => setDepartment(e.target.value)}
                        id="type"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                        <option defaultValue>Choose a type</option>
                        <option value="Software Engineering">Software Engineering</option>
                        <option value="Chinese">Chinese</option>
                    </select>
                </div>
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                    <label
                        htmlFor="type"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Subject
                    </label>
                    <select
                        onChange={(e) => setSubject(e.target.value)}
                        id="type"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                        <option defaultValue>Choose a type</option>
                        <option value="CEA102">CEA102</option>
                        <option value="DBI201">DBI201</option>
                        <option value="DBW291">DBW291</option>
                    </select>
                </div>
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                    <label
                        htmlFor="type"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Slot
                    </label>
                    <select
                        onChange={(e) => setSlot(e.target.value)}
                        id="type"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                        <option defaultValue="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                </div>
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                    <label
                        htmlFor="type"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Date Time
                    </label>
                    <select
                        onChange={(e) => setDateTime(e.target.value)}
                        id="type"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                        <menuItem defaultValue="Monday-Thursday">Monday-Thursday</menuItem>
                        <menuItem value="Tuesday-Friday">Tuesday-Friday</menuItem>
                        <menuItem value="Wednesday-Saturday">Wednesday-Saturday</menuItem>
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
                        to="/register-class"
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

export default RegisterClass_Register;
