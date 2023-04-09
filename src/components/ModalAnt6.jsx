import React, { useEffect, useState } from "react";
import { Button, DatePicker, Descriptions, message, Modal, Select } from "antd";
import "./GoogleButton.css";
import { toast } from "react-hot-toast";
import moment from "moment";
import { BASE_URL_API } from "../utils/constants";
import dayjs from "dayjs";

const { Option } = Select;
const ModalAnt6 = ({
  title,
  scheduleId,
  slot,
  scheduleDate,
  classCode,
  classId,
  isModalOpen,
  setIsModalOpen,
  parentIsModalOpen,
  fetchSchedule,
}) => {
  const [type, setType] = useState("");
  const [slotI, setSlot] = useState("");
  const [success, setSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState(scheduleDate);
  const dateFormat = "YYYY-MM-DD";
  // const [selectedDate, setSelectedDate] = useState(moment(scheduleDate));
  // const [selectedDate, setSelectedDate] = useState(moment(scheduleDate, 'YYYY-MM-DD'));
  useEffect(() => {
    setSelectedDate(scheduleDate ? scheduleDate : moment().startOf("day"));
  }, [scheduleDate]);
  const handleOk = () => {
    // setIsModalOpen(false);
    let slotValue = slotI - 1;
    if (slotValue < 0) {
      slotValue = 0;
    }
    const Data = {
      type,
      scheduleId,
      slot: slotValue,
      scheduleDate: selectedDate,
      classId,
    };

    fetch(`${BASE_URL_API}/schedule/lecturer/schedule`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(Data),
    })
      .then((res) => {
        message.success("Change successfully");
        setIsModalOpen(false);
        console.log(res);
        fetchSchedule();
      })
      .catch((err) => {
        console.log(err.message);
        message.error("Change fail");
      });
  };
  const handleOk2 = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Modal
        centered={true}
        title={`${title}`}
        open={!parentIsModalOpen}
        onCancel={handleOk}
        footer={[
          <Button
            key="submit"
            type="primary"
            onClick={handleOk}
            style={{
              backgroundColor: "#FFFFFF",
              color: "#FFA500",
              borderColor: "#FFA500",
            }}
          >
            Change
          </Button>,
          <Button key="reschedule" type="default" onClick={handleOk2}>
            Close
          </Button>,
        ]}
      >
        <Descriptions layout="vertical">
          <Descriptions.Item label="Type">
            <Select
              style={{ width: 120 }}
              onChange={(value) => setType(value)}
              required
            >
              <Option value="one">One</Option>
              <Option value="all">All</Option>
            </Select>
          </Descriptions.Item>
          <Descriptions.Item label="Slot">
            {/* <Input value={slot} onChange={(e) => setSlot(e.target.value)} /> */}
            <Select
              defaultValue={slot - 1}
              style={{ width: 120 }}
              onChange={(value) => setSlot(parseInt(value))}
            >
              <Option value="1">1</Option>
              <Option value="2">2</Option>
              <Option value="3">3</Option>
              <Option value="4">4</Option>
              <Option value="5">5</Option>
              <Option value="6">6</Option>
              <Option value="7">7</Option>
              <Option value="8">8</Option>
            </Select>
          </Descriptions.Item>
          <Descriptions.Item label="Subject">
            {classCode && classCode.split("_")[0]}
          </Descriptions.Item>
          <Descriptions.Item label="Schedule Date">
            <DatePicker
              onChange={(date) => setSelectedDate(date.format("YYYY-MM-DD"))}
              defaultValue={dayjs(selectedDate, dateFormat)}
              showTime={false}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Class">
            {classCode && classCode.split("_")[1]}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  );
};

export default ModalAnt6;
