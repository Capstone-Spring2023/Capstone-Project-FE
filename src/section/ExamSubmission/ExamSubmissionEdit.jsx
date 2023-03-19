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

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Toaster />
      <Header category="Exam Submission" title="Update Exam Submission" />
      <FormAntEdit editID={examPaperId} />
    </div>
  );
};

export default ExamSubmissionEdit;
