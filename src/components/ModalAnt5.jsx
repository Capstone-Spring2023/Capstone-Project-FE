import React, { useEffect, useState } from "react";
import { Button, Descriptions, Modal, Select } from "antd";
import "./GoogleButton.css";
import { BASE_URL_API } from "../utils/constants";
import { toast } from "react-hot-toast";
import ModalAnt6 from "./ModalAnt6";

const ModalAnt5 = ({
  title,
  scheduleId,
  slot,
  scheduleDate,
  classCode,
  classId,
  isModalOpen,
  setIsModalOpen,
  fetchSchedule,
  selectedTeacherId,
  selectedUserId
}) => {
  const handleOk = () => {
    setIsModalOpen(false);
    setIsSelectEnabled(false);
  };
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isSaveButtonVisible, setIsSaveButtonVisible] = useState(false);
  const [teacherList, setTeacherList] = useState([]);
  const [isSelectEnabled, setIsSelectEnabled] = useState(false);
  const [isSaveWarningVisible, setIsSaveWarningVisible] = useState(false);
  const [isConfirmingSave, setIsConfirmingSave] = useState(false);
  const [teacher, setTeacher] = useState([{}]);
  const userRole = sessionStorage.getItem("roleName");
  const isHeader = userRole === "Header";
  const [lecturerName, setLecturerName] = useState("");

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

  useEffect(() => {
    fetch(`${BASE_URL_API}/header/profile/getHeader/` + selectedUserId)
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        console.log(resp.data.fullName);
        setLecturerName(resp.data.fullName);
      })
      .catch((err) => {
        console.log(err.message);
        toast.error("Failed to fetch lecturer information.");
      });
  }, [selectedUserId]);

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
    setSelectedTeacher(selectedTeacherId);
  }, [selectedTeacherId]);

  return (
    <>
      <Modal
        centered={true}
        open={isModalOpen}
        title={`${title}`}
        onCancel={handleOk}
        footer={[
          isHeader && (
            <Button
              className="save-button987"
              type="primary"
              onClick={handleSaveClick}
              disabled={!isSaveButtonVisible || !selectedTeacher}
            >
              Save
            </Button>
          ),
          isHeader && (
            <Button
              key="change-teacher"
              type="primary"
              onClick={handleChangeClick}
              style={{
                backgroundColor: "#FFFFFF",
                color: "#FFA500",
                borderColor: "#FFA500",
              }}
            >
              Change Teacher
            </Button>
          ),
          <Button
            key="submit"
            type="default"
            onClick={handleOk}
            style={{ backgroundColor: "#FFFFFF", borderColor: "#00BFFF" }}
          >
            OK
          </Button>,
        ]}
      >
        <Descriptions layout="vertical">
          <Descriptions.Item label="Slot">{slot}</Descriptions.Item>
          <Descriptions.Item label="Schedule Date">
            {scheduleDate}
          </Descriptions.Item>
          <Descriptions.Item label="Subject">
            {classCode && classCode.split("_")[0]}
          </Descriptions.Item>
          <Descriptions.Item label="Class">
            {classCode && classCode.split("_")[1]}
          </Descriptions.Item>
          <Descriptions.Item label="Teacher">
            {lecturerName}
          </Descriptions.Item>
          <Descriptions.Item
            label="Change Teacher"
            style={{ display: isSelectEnabled ? "block" : "none" }}
          >
            <Select
              placeholder="Select teacher"
              onChange={(value) => setSelectedTeacher(value)}
              disabled={!isSelectEnabled}
              // value={selectedTeacher}
              value={selectedTeacher}
              style={{ display: isSelectEnabled ? "block" : "none" }}
            >
              {teacher.length > 0 && (
                <>
                  {teacher.map((teacher) => (
                    <Select.Option key={teacher.userId} value={teacher.userId}>
                      {teacher.fullName}
                    </Select.Option>
                  ))}
                </>
              )}
            </Select>
          </Descriptions.Item>
        </Descriptions>
        {/* <Modal
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
            </Button>,
          ]}
        >
          <p>Are you sure you want to save?</p>
        </Modal> */}
        <ModalAnt6
          classId={classId}
          userId={selectedTeacher}
          isModalOpen={isSaveWarningVisible && isConfirmingSave}
          setIsModalOpen={setIsConfirmingSave}
          fetchSchedule={fetchSchedule}
          selectedUserId={selectedUserId}
        />
      </Modal>
    </>
  );
};
export default ModalAnt5;
