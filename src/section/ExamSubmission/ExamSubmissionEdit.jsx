import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Header } from "../../components";
import InputField from "../../components/InputField";
import { MdOutlineSubtitles, MdSubject } from "react-icons/md";
import "react-toastify/dist/ReactToastify.css";
import { toast, Toaster } from "react-hot-toast";
import FormAntEdit from "./components/FormAntEdit";

const ExamSubmissionEdit = () => {
  const { examPaperId } = useParams();
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Toaster />
      <Header category="Exam Submission" title="Update Exam Submission" />
      <FormAntEdit
        editID={examPaperId}
        editTitle={title}
        editSubject={subject}
        editDeadline={deadline}
        editStatus={status}
      />
    </div>
  );
};

export default ExamSubmissionEdit;
