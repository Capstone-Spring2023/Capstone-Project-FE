import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { Header } from "../../components";
import InputField from "../../components/InputField";
import { MdOutlineSubtitles, MdSubject } from "react-icons/md";
import { AiOutlineFieldTime } from "react-icons/ai";
import FormAntEdit from "./components/FormAntEdit";

const ExamScheduleEdit = () => {
  const { examid } = useParams();
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState(true);
  const [assignee, setAssignee] = useState("");
  const navigate = useNavigate();

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Toaster />
      <Header category="Exam Schedule" title="Update Exam Schedule" />
      <FormAntEdit
        editTitle={title}
        editSubject={subject}
        editAssignee={assignee}
        editDeadline={deadline}
        editStatus={status}
      />
    </div>
  );
};

export default ExamScheduleEdit;
