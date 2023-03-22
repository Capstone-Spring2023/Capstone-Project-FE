import React from "react";
import { useParams } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Header } from "../../components";
import FormAntEdit from "./components/FormAntEdit";

const ExamScheduleEdit = () => {
  const { availableSubjectId } = useParams();

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Toaster />
      <Header category="Exam Schedule" title="Update Exam Schedule" />
      <FormAntEdit availableSubjectId={availableSubjectId} />
    </div>
  );
};

export default ExamScheduleEdit;
