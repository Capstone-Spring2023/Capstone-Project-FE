import React, { useState } from "react";
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
    message
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { Upload } from "antd";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
import {getDownloadURL } from 'firebase/storage';
const { Dragger } = Upload;

const ModalAnt3 = ({ title, id }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [file, setFile] = useState("");
    const { examid } = useParams(id);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
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
                    Math.floor(snapshot.bytesTransferred / snapshot.totalBytes).toFixed(
                      2
                    ) * 100,
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
              getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                console.log(url);
                localStorage.setItem('url', url);
                setFile(url);
                message.success(`${file.name} file uploaded successfully.`);
              }).catch((error) => {
                console.log(error);
                message.error(`${file.name} file uploaded failed.`);
              });
            }
          );
      };

    return (
        <>
            <InfoOutlined
                onClick={showModal}
                style={{ fontSize: 18, color: "blue" }}
                height={55}
            />
            <Modal
                centered={true}
                open={isModalOpen}
                title={`${title}`}
                onOk={handleOk}
                footer={[
                    <Button key="submit" type="default" onClick={handleOk}>
                        OK
                    </Button>,
                ]}
            >
                {/* <Col span={12}>
                    <Form.Item
                        label="ID"
                        initialValue={examid}
                    >
                    </Form.Item>
                </Col> */}
                <Row justify="center" align="center">
                    <Col span={20} offset={0}>
                        <Form.Item name="file" accept=".docx">
                            <Dragger customRequest={(e) => upLoadFile(e)}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                <p className="ant-upload-hint">Only support for docx and rar file</p>
                            </Dragger>
                        </Form.Item>
                    </Col>
                </Row>
            </Modal>
        </>
    );
};

export default ModalAnt3;
