import { read, utils } from "xlsx";
import React, { useState } from "react";
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
  const [startDate, setStartDate] = useState(new Date());
  const startOfWeekDate = startOfWeek(startDate);
  const endOfWeekDate = endOfWeek(startDate);

  const handleStartDateChange = (e) => {
    setStartDate(new Date(e.target.value));
  };

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const daysOfMonth = [];
    for (let i = 0; i < 7; i++) {
        const day = addDays(startOfWeekDate, i + 1);
        daysOfMonth.push(format(day, "dd/MM/yyyy"));
    }
    const slots = [];

  // Thêm các slot vào danh sách `slots`
  for (let i = 0; i < 8; i++) {
    slots.push(
      <td key={`slot-${i}`}>
        <div className="slot">Slot {i + 1}</div>
      </td>
    );
  }
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

    };

    useEffect(() => {
        fetchSchedule();
    }, []);

    const [schedule, setSchedule] = useState("");
    const fetchSchedule = () => {
        fetch(`${BASE_URL_API}/schedule/lecturer/2/schedule`)
            .then((res) => {
                return res.json();
            })
            .then((resp) => {
                setSchedule(resp);
                console.log(resp);
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    const timetable = [];
    if (schedule && schedule.length > 0) {
        for (let i = 0; i < schedule.length; i++) {
            const scheduleItem = schedule[i];
            const scheduleDate = moment(scheduleItem.scheduleDate).format("dd/MM/yyyy");
            const slotIndex = scheduleItem.slot - 1;
            const dayIndex = daysOfMonth.indexOf(scheduleDate);
            timetable[slotIndex] = timetable[slotIndex] || [];
            timetable[slotIndex][dayIndex] = (
                <td key={`schedule-${scheduleItem.scheduleId}`}>
                    <div className="schedule-item">
                        <div className="schedule-time">
                            {moment(scheduleItem.scheduleDate).format("HH:mm")}
                        </div>
                        <div className="schedule-class">{scheduleItem.classCode}</div>
                    </div>
                </td>
            );
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
                                    <input
                                        type="date"
                                        value={format(startDate, "yyyy-MM-dd")}
                                        onChange={handleStartDateChange}
                                        className="date-picker"
                                    />
                                    {daysOfWeek.map((day, index) => (
                                        <th key={`${day}-${daysOfMonth[index]}`} className="text-center">
                                            <div className="day-container">
                                                <div className="day">{day}</div>
                                                <div className="date">{daysOfMonth[index]}</div>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {slots.map((slot, index) => (
                                    <tr key={`slot-row-${index}`}>
                                        {slot}
                                        <td className="td-style"></td>
                                        <td className="td-style"></td>
                                        <td className="td-style"></td>
                                        <td className="td-style"></td>
                                        <td className="td-style"></td>
                                        <td className="td-style"></td>
                                        <td className="td-style"></td>
                                    </tr>
                                ))}
                                {timetable.map((row, index) => (
                                    <tr key={`schedule-row-${index}`}>{row}</tr>
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
                            <p className="ant-upload-hint">
                                Only support for excel file
                            </p>
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
            <table className="table">
              <thead>
                <tr>
                  <input
                    type="date"
                    value={format(startDate, "yyyy-MM-dd")}
                    onChange={handleStartDateChange}
                    className="date-picker"
                  />
                  {daysOfWeek.map((day, index) => (
                    <th
                      key={`${day}-${daysOfMonth[index]}`}
                      className="text-center"
                    >
                      <div className="day-container">
                        <div className="day">{day}</div>
                        <div className="date">{daysOfMonth[index]}</div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {slots.map((slot, index) => (
                  <tr key={`slot-row-${index}`}>
                    {slot}
                    <td className="td-style"></td>
                    <td className="td-style"></td>
                    <td className="td-style"></td>
                    <td className="td-style"></td>
                    <td className="td-style"></td>
                    <td className="td-style"></td>
                    <td className="td-style"></td>
                  </tr>
                ))}
                <tr>{timetable}</tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
        <>
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
      </div>
    </>
  );
};
export default Schedule