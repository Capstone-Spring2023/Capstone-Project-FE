import { utils } from "xlsx";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { addDays, endOfWeek, format, startOfWeek } from "date-fns";
import { Select, Space, Descriptions } from "antd";
import "./GoogleButton.css";
import { BASE_URL_API } from "../utils/constants";
import ModalAnt5 from "../components/ModalAnt5";

const { sheet_to_json } = utils;
const Schedule = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  //Schedule
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    // "Sunday",
  ];
  const [startDate, setStartDate] = useState(new Date());
  const startOfWeekDate = startOfWeek(startDate);
  const endOfWeekDate = endOfWeek(startDate);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showModal2, setShowModal] = useState(false);
  const [lecturerList, setLecturerList] = useState([]);
  const [selectedLecturer, setSelectedLecturer] = useState(sessionStorage.getItem("fullName"));
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleLessonClick = (lesson) => {
    if (lesson) {
      setSelectedLesson({
        scheduleId: lesson?.scheduleId,
        slot: lesson?.slot,
        scheduleDate: lesson?.scheduleDate,
        classCode: lesson?.classCode,
        classId: lesson?.classId,
      });
      setIsModalOpen(true); // Mở Modal
    }
  };

  const handleStartDateChange = (e) => {
    setStartDate(new Date(e.target.value));
    setShouldFetchSchedule(true);
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

  const [shouldFetchSchedule, setShouldFetchSchedule] = useState(false);
  const [lecturerFilter, setlecturerFilter] = useState([{}]);
  const handleSubjectSelect = (value) => {
    fetchLecturer(value);
    const filteredData = lecturerFilter?.filter(
      (item) =>
        item?.subjectName?.toLowerCase()?.indexOf(value.toLowerCase()) >= 0
    );
    // Cập nhật lại state để hiển thị dữ liệu đã lọc trên bảng
    setlecturerFilter(filteredData);
  };

  useEffect(() => {
    fetchLecturer();
    fetchSchedule();
    if (shouldFetchSchedule) {
      setShouldFetchSchedule(false);
    }
  }, [shouldFetchSchedule]);

  useEffect(() => {
    if (shouldFetchSchedule) {
      fetchSchedule();
    }
    // set shouldFetchSchedule thành false sau khi gọi fetchSchedule để ngăn chặn việc gọi fetchSchedule khi không cần thiết
    setShouldFetchSchedule(false);
  }, [shouldFetchSchedule]);

  const handleLecturerChange = (value) => {
    setSelectedUserId(value);
    setShouldFetchSchedule(true); // đặt shouldFetchSchedule thành true khi chọn giảng viên trong Select
  };

  const [lecturer, setLecturer] = useState("");
  const { Option } = Select;
  const style = {
    width: 200,
  };
  const fetchLecturer = () => {
    fetch(`${BASE_URL_API}/header/GetLecturersHaveRegisterSubject`)
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setLecturer(resp.data);
        setLecturerList(resp.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const fetchSchedule = () => {
    const userId = selectedUserId || sessionStorage.getItem("userId");
    fetch(`${BASE_URL_API}/schedule/lecturer/${userId}`)
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        resp.map((scheduleItem) => {
          const scheduleDate = moment(
            scheduleItem.scheduleDate,
            "YYYY-MM-DDTHH:mm:ss"
          ).format("YYYY-MM-DD");
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
        setShouldFetchSchedule(false);
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
            {sessionStorage.getItem("roleName") === "Header" && (
            <Descriptions layout="vertical">
            <Descriptions.Item label="Choose a Lecturer to see the schedule">
              <Select
                showSearch
                style={style}
                // placeholder="Select lecturer"
                // placeholder={sessionStorage.getItem("fullName")}
                optionLabelProp="label"
                onChange={handleLecturerChange}
                onSelect={handleSubjectSelect}
                filterOption={(input, option) =>
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                optionFilterProp="label"
                defaultValue={sessionStorage.getItem("fullName")}
              >
                {lecturer &&
                  lecturer?.map((item, index) => (
                    <Option
                      key={index}
                      value={`${item?.userId}`}
                      label={`${item?.fullName}`}
                    >
                      <Space>{item?.fullName}</Space>
                    </Option>
                  ))}
              </Select>
            </Descriptions.Item>
            </Descriptions>
            )}
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
                          className={`td-style ${lesson ? "bg-gray-100" : "bg-white"
                            }`}
                          onClick={() => handleLessonClick(lesson)} // Gọi hàm xử lý khi người dùng click
                        >
                          {lesson &&
                            lesson?.scheduleDate === day &&
                            `slot-${lesson?.slot}` === slot.key && (
                              <div className="lesson">
                                <div className="lesson-code">
                                  <a
                                    style={{
                                      color: "#0066FF",
                                      textDecoration: "none",
                                    }}
                                    onMouseEnter={(e) => (
                                      (e.target.style.color = "#0000ff"),
                                      (e.target.style.textDecoration =
                                        "underline")
                                    )}
                                    onMouseLeave={(e) => (
                                      (e.target.style.color = "#0066FF"),
                                      (e.target.style.textDecoration = "none")
                                    )}
                                  >
                                    {lesson?.classCode}
                                  </a>
                                </div>
                              </div>
                            )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            {selectedLesson?.scheduleId && (
              <ModalAnt5
                scheduleId={selectedLesson?.scheduleId}
                slot={selectedLesson?.slot + 1}
                scheduleDate={selectedLesson?.scheduleDate}
                classCode={selectedLesson?.classCode}
                classId={selectedLesson?.classId}
                title={"Schedule Information"}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                fetchSchedule={fetchSchedule}
                selectedUserId={parseInt(selectedUserId)}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default Schedule;
