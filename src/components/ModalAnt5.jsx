import React, { useState } from "react";
import { Badge, Button, Descriptions, Modal } from "antd";
import "./GoogleButton.css";
import { InfoOutlined } from "@ant-design/icons";
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
    fetchSchedule 
  }) => {
    const handleOk = () => {
      setIsModalOpen(false);
    };
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [isRescheduleOpen, setIsRescheduleOpen] = useState(false); // Thêm state cho ModalAnt6
    const [isModal6Open, setIsModal6Open] = useState(false);

    const handleRescheduleClick = () => {
      setIsModalOpen(false);
      setIsRescheduleOpen(true);
    }
  
    const handleRescheduleOk = ({scheduleId,scheduleDate,slot,classCode,classId}) => {
      setSelectedLesson({
        scheduleId: scheduleId,
        slot: slot,
        scheduleDate: scheduleDate,
        classCode: classCode,
        classId:classId,
      });
      setIsModalOpen(true); // Mở Modal
      setIsRescheduleOpen(false); // Đóng ModalAnt6
      setIsModal6Open(false);
    };
  
    return (
      <>
        <Modal
          centered={true}
          open ={isModalOpen}
          title={`${title}`}
          onCancel={handleOk}
          footer={[
            <Button key="reschedule" type="primary" onClick={handleRescheduleClick} style={{ backgroundColor: '#FFFFFF', color: '#FFA500', borderColor: '#FFA500' }}>
              Reschedule
            </Button>,
            <Button key="submit" type="default" onClick={handleOk}>
              OK
            </Button>
          ]}
        >
          <Descriptions layout="vertical">
            {/* <Descriptions.Item label="Schedule Id">{scheduleId}</Descriptions.Item> */}
            <Descriptions.Item label="Slot">{slot}</Descriptions.Item>
            <Descriptions.Item label="Schedule Date">{scheduleDate}</Descriptions.Item>
            {/* <Descriptions.Item label="Schedule Code">{classCode}</Descriptions.Item> */}
            <Descriptions.Item label="Subject">
              {classCode && classCode.split("_")[0]}
            </Descriptions.Item>
            <Descriptions.Item label="Class">
              {classCode && classCode.split("_")[1]}
            </Descriptions.Item>
            {/* <Descriptions.Item label="Class ID">{classId}</Descriptions.Item> */}
          </Descriptions>
        </Modal>
  
        {/* Render ModalAnt6 nếu nó được mở */}
        {isRescheduleOpen && (
          <ModalAnt6
            scheduleId={scheduleId}
            slot={slot + 1}
            scheduleDate={scheduleDate}
            classCode={classCode}
            classId={classId}
            title={"Reschedule"}
            isModalOpen={isRescheduleOpen}
            setIsModalOpen={setIsRescheduleOpen}
            handleOk={handleRescheduleOk} // Truyền hàm handleRescheduleOk cho ModalAnt6
            fetchSchedule={fetchSchedule}
          />
        )}
      </>
    );
  };
export default ModalAnt5;
