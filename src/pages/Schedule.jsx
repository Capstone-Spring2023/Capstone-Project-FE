import { read, utils } from "xlsx";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { addDays, endOfWeek, format, startOfWeek } from "date-fns";
import { Button, Form, message, Upload } from "antd";
import "./GoogleButton.css";
import { InboxOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
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
  const [startDate, setStartDate] = useState(new Date("2023-07-16"));
  const startOfWeekDate = startOfWeek(startDate);
  const endOfWeekDate = endOfWeek(startDate);

  const handleStartDateChange = (e) => {
    setStartDate(new Date(e.target.value));
  };

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

  const [schedule, setSchedule] = useState(
    Array(8)
      .fill(null)
      .map(() => new Array(7).fill(null))
  );

  useEffect(() => {
    fetchSchedule();
  }, [daysOfMonth]);

  const fetchSchedule = () => {
    fetch(`${BASE_URL_API}/schedule/lecturer/2/schedule`)
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        console.log("RESP", resp);
        resp.map((scheduleItem) => {
          const scheduleDate = moment(
            scheduleItem.scheduleDate,
            "YYYY-MM-DDTHH:mm:ss"
          ).format("YYYY-MM-DD");
          console.log("DATE", scheduleDate);
          const slotIndex = scheduleItem.slot;
          const dayIndex = daysOfMonth.indexOf(scheduleDate);
          timetable[slotIndex] = timetable[slotIndex] || [];
          setSchedule(timetable);
          timetable[slotIndex][dayIndex] = {
            scheduleId: scheduleItem.scheduleId,
            classCode: scheduleItem.classCode,
            classId: scheduleItem.classId,
            slot: scheduleItem.slot,
            scheduleDate: scheduleDate,
          };
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  for (const element of timetable) {
    for (let j = 0; j < element.length; j++) {
      const lesson = element[j];
      // console.log(lesson);
      if (lesson !== null) {
        element[j] = (
          <td key={`${daysOfMonth[j]}-${lesson.slot}`}>
            <div className="schedule-item">
              <div className="schedule-time">{`Slot ${lesson.slot} - ${moment(
                lesson.scheduleDate
              ).format("HH:mm")}`}</div>
              <div className="schedule-class">{lesson.classCode}</div>
            </div>
          </td>
        );
      } else {
        element[j] = <td key={`${daysOfMonth[j]}-null`} />;
      }

      // console.log(`timetable[${i}][${j}] = ${timetable[i][j]}`);
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
                    <th
                      key={`${day}-${daysOfWeek[index]}`}
                      className="text-center"
                    >
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
                      const lesson = schedule[index][dayIndex];
                      return (
                        <td
                          key={`slot-${index}-day-${dayIndex}`}
                          className={`td-style ${
                            lesson ? "bg-gray-100" : "bg-white"
                          }`}
                        >
                          {lesson &&
                            lesson?.scheduleDate === day &&
                            `slot-${lesson?.slot}` === slot.key && (
                              <div className="lesson">
                                <div className="lesson-code">{lesson?.key}</div>
                              </div>
                            )}
                          {lesson?.classCode}
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
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
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
