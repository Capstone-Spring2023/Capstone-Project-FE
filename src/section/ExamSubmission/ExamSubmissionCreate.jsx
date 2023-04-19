import React from "react";
import { Header } from "../../components";
import { Toaster } from "react-hot-toast";
import "dropzone/dist/dropzone.css";
import FormAnt from "./components/FormAnt";

const ExamSubmissionCreate = ({ socket }) => {
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Toaster />
      <Header category="ExamSubmission" title="Create ExamSubmission" />
      <FormAnt socket={socket} />
    </div>
  );
};

export default ExamSubmissionCreate;
