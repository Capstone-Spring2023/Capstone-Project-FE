import React, { useState, useEffect } from "react";
import { Badge, Button, Descriptions, Modal, Select } from "antd";
import "./GoogleButton.css";
import { InfoOutlined } from "@ant-design/icons";
import ModalAnt6 from "./ModalAnt6";
import { BASE_URL_API } from "../utils/constants";
import { toast } from "react-hot-toast";
import { Navigate } from "react-router-dom";

const ModalAnt5 = ({
  title,
  scheduleId,
  slot,
  scheduleDate,
  classCode,
  classId,
  isModalOpen,
  setIsModalOpen,
  fetchSchedule
}) => {
  const handleOk = () => {
    setIsModalOpen(false);
    setIsSelectEnabled(false);
  };
  // const [selectedLesson, setSelectedLesson] = useState(null);
  // const [isRescheduleOpen, setIsRescheduleOpen] = useState(false); // Thêm state cho ModalAnt6
  // const [isModal6Open, setIsModal6Open] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isSaveButtonVisible, setIsSaveButtonVisible] = useState(false);
  const [teacherList, setTeacherList] = useState([]);
  const [isSelectEnabled, setIsSelectEnabled] = useState(false);
  const [isSaveWarningVisible, setIsSaveWarningVisible] = useState(false);
  const [isConfirmingSave, setIsConfirmingSave] = useState(false);
  const [teacher, setTeacher] = useState([{}]);

  const handleChangeClick = () => {
    setIsSelectEnabled(true);
    setIsSaveButtonVisible(true);
  };

  const handleSaveClick = () => {
    setIsSaveButtonVisible(false);
    setIsSelectEnabled(false);
    setIsSaveButtonVisible(false);
    setIsSaveWarningVisible(true);
    setIsSelectEnabled(false);
    setIsConfirmingSave(true);
  };

  const handleConfirmSave = () => {
    // setIsConfirmingSave(false);
    const examData = {
      classId: classId,
      userId: selectedTeacher
    };
    toast.promise(
      fetch(`${BASE_URL_API}/schedule/lecturer/schedule`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(examData),
      })
        .then((res) => {
          setIsConfirmingSave(false);
          console.log(res);
        })
        .catch((err) => {
          console.log(err.message);
        }),
      {
        loading: "Creating...",
        success: <b>Change successfully</b>,
        error: <b>Could not change.</b>,
      }
    );
  }

  const handleCancelSave = () => {
    setIsConfirmingSave(false);
  }

  const fetchSubject = () => {
    fetch(`${BASE_URL_API}/header/GetLecturersHaveRegisterSubject`)
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        console.log(resp.data);
        setTeacher(resp.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    fetchSubject();
  }, []);

  // const handleRescheduleOk = ({
  //   scheduleId,
  //   scheduleDate,
  //   slot,
  //   classCode,
  //   classId,
  // }) => {
  //   setSelectedLesson({
  //     scheduleId: scheduleId,
  //     slot: slot,
  //     scheduleDate: scheduleDate,
  //     classCode: classCode,
  //     classId: classId,
  //   });
  //   setIsModalOpen(true); // Mở Modal
  //   setIsRescheduleOpen(false); // Đóng ModalAnt6
  //   setIsModal6Open(false);
  // };

  return (
    <>
      <Modal
        centered={true}
        open={isModalOpen}
        title={`${title}`}
        onCancel={handleOk}
        footer={[
          <Button className="save-button987" type="primary" onClick={handleSaveClick} disabled={!isSaveButtonVisible}>
            Save
          </Button>,
          <Button key="change-teacher" type="primary" onClick={handleChangeClick} style={{ backgroundColor: '#FFFFFF', color: '#FFA500', borderColor: '#FFA500' }}>
            Change Teacher
          </Button>,
          <Button key="submit" type="default" onClick={handleOk} style={{ backgroundColor: '#FFFFFF', borderColor: '#00BFFF' }}>
            OK
          </Button>
        ]}
      >
        <Descriptions layout="vertical">
          <Descriptions.Item label="Slot">{slot}</Descriptions.Item>
          <Descriptions.Item label="Schedule Date">{scheduleDate}</Descriptions.Item>
          <Descriptions.Item label="Subject">
            {classCode && classCode.split("_")[0]}
          </Descriptions.Item>
          <Descriptions.Item label="Class">
            {classCode && classCode.split("_")[1]}
          </Descriptions.Item>
          <Descriptions.Item label="Change Teacher" style={{ display: isSelectEnabled ? 'block' : 'none' }}>
            <Select
              placeholder="Select teacher"
              onChange={value => setSelectedTeacher(value)}
              disabled={!isSelectEnabled}
              value={selectedTeacher}
              style={{ display: isSelectEnabled ? 'block' : 'none' }}
            >
              {teacher.length > 0 && (
                <>
                  {teacher.map(teacher => (
                    <Select.Option key={teacher.userId} value={teacher.userId}>
                      {teacher.fullName}
                    </Select.Option>
                  ))}
                </>
              )}
            </Select>
          </Descriptions.Item>
        </Descriptions>
        <Modal
          title="Warning"
          open={isSaveWarningVisible && isConfirmingSave}
          onCancel={handleCancelSave}
          footer={[
            <Button
              className="save-button987"
              key="cancel"
              onClick={handleCancelSave}
            >
              Cancel
            </Button>,
            <Button
              className="save-button987"
              key="ok"
              type="primary"
              onClick={handleConfirmSave}
            >
              OK
            </Button>
          ]}
        >
          <p>Are you sure you want to save?</p>
        </Modal>
      </Modal>
    </>
  );

};
export default ModalAnt5;
