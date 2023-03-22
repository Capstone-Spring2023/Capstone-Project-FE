import React from "react";
import { Toaster } from "react-hot-toast";
import { Header } from "../../components";
import FormAnt from "./components/FormAnt";

const ExamScheduleCreate = ({ socket }) => {
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Toaster />
      <Header category="Exam Schedule" title="Create Exam Schedule" />
      <FormAnt socket={socket} />
    </div>
  );
};
export default ExamScheduleCreate;
