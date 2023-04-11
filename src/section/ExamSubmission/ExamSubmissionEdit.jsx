import React from "react";
import { useParams } from "react-router-dom";
import { Header } from "../../components";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "react-hot-toast";
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
