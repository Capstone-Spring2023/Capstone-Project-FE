import React, { useState, useEffect } from "react";
import { Badge, Button, Descriptions, Modal, Input, DatePicker, Select,message  } from "antd";
import "./GoogleButton.css";
import { InfoOutlined } from "@ant-design/icons";
import { BASE_URL_API } from "../utils/constants";
import { toast } from "react-hot-toast";
import moment from "moment";
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
    fetchSchedule
}) => {
    const [type, setType] = useState("");
    const [slotI, setSlot] = useState("");
    const [success, setSuccess] = useState(false);
    const [selectedDate, setSelectedDate] = useState(moment(scheduleDate));
    // const [selectedDate, setSelectedDate] = useState(moment(scheduleDate));
    // const [selectedDate, setSelectedDate] = useState(moment(scheduleDate, 'YYYY-MM-DD'));
    useEffect(() => {
        setSelectedDate(scheduleDate ? moment(scheduleDate) : moment().startOf("day"));
    }, [scheduleDate]);
    const handleOk = () => {
        // setIsModalOpen(false);
        const Data = { type, scheduleId, slot: slotI - 1, scheduleDate: selectedDate.format("YYYY-MM-DD"), classId };
        toast.promise(
            fetch(`https://cft-api.onrender.com/api/schedule/lecturer/schedule`, {
                method: "PUT",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(Data),
            })
                .then((res) => {
                    setSuccess(true);
                    message.success("Change successful");
                    setIsModalOpen(false);
                    console.log(res);
                    fetchSchedule();
                })
                .catch((err) => {
                    console.log(err.message);
                    message.success("Change fail");
                }),
            {
                loading: "Creating...",
                success: <b>Change successfully</b>,
                error: <b>Could not change.</b>,
            }
        );
    };
    const handleOk2 = () => {
        setIsModalOpen(false);
    }
    return (
        <>
            <Modal
                centered={true}
                title={`${title}`}
                open={!parentIsModalOpen}
                onCancel={handleOk}
                footer={[
                    <Button key="submit" type="primary" onClick={handleOk} style={{ backgroundColor: '#FFFFFF', color: '#FFA500', borderColor: '#FFA500' }}>
                        Change
                    </Button>,
                    <Button key="reschedule" type="default" onClick={handleOk2}>
                        Close
                    </Button>
                ]}
            >
                <Descriptions layout="vertical">
                    <Descriptions.Item label="Type">
                        <Select style={{ width: 120 }} onChange={value => setType(value)} required>
                            <Option value="one">One</Option>
                            <Option value="all">All</Option>
                        </Select>
                    </Descriptions.Item>
                    <Descriptions.Item label="Slot">
                        {/* <Input value={slot} onChange={(e) => setSlot(e.target.value)} /> */}
                        <Select defaultValue={slot - 1} style={{ width: 120 }} onChange={value => setSlot(parseInt(value))}>
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
                            value={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            defaultValue={moment().startOf("day")}
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
