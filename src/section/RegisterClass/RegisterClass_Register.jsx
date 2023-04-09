import React from "react";
import { Header } from "../../components";
import RegisterClassForm from "./components/RegisterClassForm";
import { Toaster } from "react-hot-toast";

const RegisterClass_Register = () => {
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Toaster />
      <Header category="Class" title="Register" />
      <RegisterClassForm />
    </div>
  );
};

export default RegisterClass_Register;