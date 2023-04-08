import { read, utils, write } from "xlsx";
import { Header } from "../components";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import moment from "moment";
import { startOfWeek, endOfWeek, format, addDays } from "date-fns";
import { Badge, Button, Descriptions, Modal } from "antd";
import "./GoogleButton.css";
import { InfoOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import {
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Row,
  Space,
  message,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { Upload } from "antd";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { getDownloadURL } from "firebase/storage";
import { toast } from "react-hot-toast";
import { BASE_URL_API } from "../utils/constants";

const { sheet_to_json } = utils;
const Schedule = () => {
  const handleFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const workbook = read(event.target.result, { type: "binary" });
      const sheet1Name = workbook.SheetNames[0];
      const sheet1 = workbook.Sheets[sheet1Name];
      const data1 = utils.sheet_to_json(sheet1);

      const sheet2Name = workbook.SheetNames[1];
      const sheet2 = workbook.Sheets[sheet2Name];
      const data2 = utils.sheet_to_json(sheet2);

      console.log(data1); // In dữ liệu từ trang tính 1 ra console
      console.log(data2); // In dữ liệu từ trang tính 2 ra console

      // Ghép hai mảng JSON lại với nhau nếu cần
      const mergedData = [...data1, ...data2];
      console.log(mergedData); // In dữ liệu ghép lại ra console
    };
    reader.readAsBinaryString(file);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState("");
  const showModal = () => {
    setIsModalOpen(true);
  };
  const navigate = useNavigate();
  const handleOk2 = () => {
    setIsModalOpen(false);
    // const data = {
    //     examInstruction: file,
    // };
    // toast.promise(
    //     fetch(
    //         `${BASE_URL_API}/exam-submission/instruction/` + examInstructionId,
    //         {
    //             method: "PUT",
    //             headers: { "content-type": "application/json" },
    //             body: JSON.stringify(data),
    //         }
    //     )
    //         .then((res) => {
    //             console.log("RES", res);
    //             navigate("/exam-submission");
    //             setApprove();
    //         })
    //         .catch((err) => {
    //             console.log(err.message);
    //         }),
    //     {
    //         loading: "Saving...",
    //         success: <b>Update exam Instruction successfully</b>,
    //         error: <b>Could not save.</b>,
    //     }
    // );
  };
  const { Dragger } = Upload;
  const handleClose = () => {
    setIsModalOpen(false);
  };
  const upLoadFile = ({ onSuccess, onProgress, onError, file }) => {
    if (!file) return;
    const storage = getStorage();
    let fileRef = ref(
      storage,
      `/${sessionStorage.getItem("email")}/ExamSubmission/${file.name}`
    );
    const uploadTask = uploadBytesResumable(fileRef, file);
    uploadTask.on(
      "state_changed",
      function progress(snapshot) {
        onProgress(
          {
            percent:
              Math.floor(
                snapshot.bytesTransferred / snapshot.totalBytes
              ).toFixed(2) * 100,
          },
          file
        );
      },
      function error(err) {
        onError(err, file);
        message.error(`${file.name} file uploaded failed.`);
      },
      function complete() {
        onSuccess(file);
        getDownloadURL(uploadTask.snapshot.ref)
          .then((url) => {
            console.log(url);
            localStorage.setItem("url", url);
            setFile(url);
            message.success(`${file.name} file uploaded successfully.`);
          })
          .catch((error) => {
            console.log(error);
            message.error(`${file.name} file uploaded failed.`);
          });
      }
    );
  };

  //Schedule
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const [startDate, setStartDate] = useState(new Date());
  const startOfWeekDate = startOfWeek(startDate);
  const endOfWeekDate = endOfWeek(startDate);

    const handleStartDateChange = (e) => {
        setStartDate(new Date(e.target.value));
    };

    const daysOfMonth = [];
    for (let i = 0; i < 7; i++) {
        const day = addDays(startOfWeekDate, i);
        daysOfMonth.push(moment(day).format("DD-MM-YYYY"));
    }

  const daysOfMonth = [];
  for (let i = 0; i < 7; i++) {
    const day = addDays(startOfWeekDate, i);
    daysOfMonth.push(moment(day).format("YYYY-MM-DD"));
  }

  const timetable = new Array(8).fill(null).map(() => new Array(7).fill(null));
  const slots = [];

  // Thêm các slot vào danh sách `slots`
  for (let i = 0; i < 8; i++) {
    slots.push(
      <td key={`slot-${i}`}>
        <div className="slot">Slot {i + 1}</div>
      </td>
    );
  }

  const [schedule, setSchedule] = useState([]);


  useEffect(() => {
    fetchSchedule();
  }, []);
  
    const fetchSchedule = () => {
        fetch(`${BASE_URL_API}/schedule/lecturer/2/schedule`)
            .then((res) => {
                return res.json();
            })
            .then((resp) => {
                const timetable = new Array(8).fill(null).map(() => new Array(7).fill(null));
                const daysOfMonth = [];
                const startOfWeekDate = startOfWeek(new Date(), { weekStartsOn: 1 });
                for (let i = 0; i < 7; i++) {
                    const day = addDays(startOfWeekDate, i);
                    daysOfMonth.push(moment(day).format("DD-MM-YYYY"));
                }
                for (const scheduleItem of resp) {
                    const scheduleDate = moment(scheduleItem.scheduleDate, "YYYY-MM-DDTHH:mm:ss").format("DD-MM-YYYY");
                    const dayIndex = daysOfMonth.indexOf(scheduleDate);
                    if (dayIndex >= 0) {
                        const slotIndex = scheduleItem.slot - 1;
                        timetable[slotIndex][dayIndex] = {
                            scheduleId: scheduleItem.scheduleId,
                            classCode: scheduleItem.classCode,
                            classId: scheduleItem.classId,
                            slot: scheduleItem.slot,
                            scheduleDate: scheduleDate,
                        };
                    }
                }
                setSchedule(timetable);
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    for (let i = 0; i < timetable.length; i++) {
        for (let j = 0; j < timetable[i].length; j++) {
            const lesson = timetable[i][j];
            if (lesson !== null) {
                timetable[i][j] = (
                    <td key={`${daysOfMonth[j]}-${lesson.slot}`}>
                        <div className="schedule-item">
                            <div className="schedule-time">{moment(lesson.scheduleDate).format("HH:mm")}</div>
                            {daysOfMonth[j] === moment(lesson.scheduleDate).format("DD-MM-YYYY") && (
                                <div className="schedule-class">{lesson.classCode}</div>
                            )}
                        </div>
                    </td>
                );
            } else {
                timetable[i][j] = <td key={`${daysOfMonth[j]}-null`} />;
            }
        }
    }
  }

    return (
        <>
            <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
                <div className="app-container">
                    <div className="container">
                        <div className="header">
                            <h2>Timetable</h2>
                        </div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>
                                        <input
                                            type="date"
                                            value={format(startDate, "yyyy-MM-dd")}
                                            onChange={handleStartDateChange}
                                            className="date-picker"
                                        />
                                    </th>
                                    {daysOfMonth.map((day, index) => (
                                        <th key={`${day}-${daysOfWeek[index]}`} className="text-center">
                                            <div className="day-container">
                                                <div className="day">{daysOfWeek[index]}</div>
                                                <div className="date">{day}</div>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {slots.map((slot, index) => (
                                    <tr key={`slot-row-${index}`}>
                                        {slot}
                                        {daysOfMonth.map((day, dayIndex) => {
                                            const lesson = timetable[index][dayIndex];
                                            return (
                                                <td key={`slot-${index}-day-${dayIndex}`}
                                                className={`td-style ${lesson ? "bg-gray-100" :"bg-white"}`}>
                                                    {lesson && (
                                                        <div className="lesson">
                                                            {/* <div className='lesson-code'>
                                                                {lesson.classCode||lesson.classId}
                                                            </div> */}
                                                        </div>
                                                    )}
                                                </td>
                                            );
                                        })}

                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>
            <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
                <>
                    Import file schedule
                    <Form.Item name="file" accept=".docx">
                        <Dragger customRequest={(e) => upLoadFile(e)}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">Only support for excel file</p>
                        </Dragger>
                    </Form.Item>
                    <Button key="submit" type="default" onClick={handleOk2}>
                        Submit
                    </Button>
                </>
                Import file excel
                <div>
                    <input type="file" onChange={handleFile} />
                </div>
      </div>
    </>
    );
};
export default Schedule;
