import React, { useState } from "react";
import { Badge, Button, Descriptions, Modal, Tooltip } from "antd";
import "./GoogleButton.css";
import { DownloadOutlined, InfoOutlined, LoadingOutlined } from "@ant-design/icons";
import {
  getDownloadURL,
  getMetadata,
  getStorage,
  listAll,
  ref,
} from "firebase/storage";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { BASE_URL_API, NO_CORS_URL } from "../utils/constants";

const ModalAnt = ({ title, id }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [examContent, setExamContent] = useState("");
  const [examTitle, setExamTitle] = useState("");
  const [lecturerName, setLecturerName] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [examScheduleID, setExamScheduleID] = useState("");
  const [examLink, setExamLink] = useState("");
  const [status, setStatus] = useState(false);
  const [examInstruction, setExamInstruction] = useState("");
  const [type,setType]=useState("");
  const showModal = () => {
    getDetail();
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const [isZipping, setIsZipping] = useState(false);
  const [isZipping1, setIsZipping1] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const getDetail = () => {
    fetch(`${BASE_URL_API}/exam-submission/` + id, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setExamContent(resp.examContent);
        setLecturerName(resp.lecturerName);
        setSubjectName(resp.subjectName);
        setStatus(resp.status);
        setExamInstruction(resp.examInstruction);
        setExamScheduleID(resp.examScheduleId);
        setExamLink(resp.examLink);
        setType(resp.type);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const downloadFolderAsZip = async () => {
    setIsZipping(true);
    const jszip = new JSZip();
    const storage = getStorage();
    const folderRef = ref(storage, "/SP23/" + examLink + "/" + subjectName + "/PE1");
    const folderRef2 = ref(
      storage,
      "/SP23/" + examLink + "/" + subjectName + "/PE1/Given"
    );
    const folderRef3 = ref(
      storage,
      "/SP23/" + examLink + "/" + subjectName + "/PE1/TestCases"
    );
    const folder = await listAll(folderRef);
    const folder2 = await listAll(folderRef2);
    const folder3 = await listAll(folderRef3);
    const promises = folder.items
      .map(async (item) => {
        const file = await getMetadata(item);
        const fileRef = ref(storage, item.fullPath);
        const fileBlob = await getDownloadURL(fileRef).then((url) => {
          return fetch(`${NO_CORS_URL}/${url}`).then((response) =>
            response.blob()
          );
        });
        jszip.folder("Given/");
        jszip.folder("TestCases/");
        jszip.file(file.name, fileBlob);
      })
      .reduce((acc, curr) => acc.then(() => curr), Promise.resolve());
    await promises;
    const promises2 = folder2.items
      .map(async (item) => {
        const givenFolder = jszip.folder("Given");
        const file = await getMetadata(item);
        const fileRef = ref(storage, item.fullPath);
        const fileBlob = await getDownloadURL(fileRef).then((url) => {
          return fetch(`${NO_CORS_URL}/${url}`).then((response) =>
            response.blob()
          );
        });
        givenFolder.file(file.name, fileBlob);
      })
      .reduce((acc, curr) => acc.then(() => curr), Promise.resolve());
    await promises2;
    const promises3 = folder3.items
      .map(async (item) => {
        const testCFolder = jszip.folder("TestCases");
        const file = await getMetadata(item);
        const fileRef = ref(storage, item.fullPath);
        const fileBlob = await getDownloadURL(fileRef).then((url) => {
          return fetch(`${NO_CORS_URL}/${url}`).then((response) =>
            response.blob()
          );
        });
        testCFolder.file(file.name, fileBlob);
      })
      .reduce((acc, curr) => acc.then(() => curr), Promise.resolve());
    await promises3;
    setIsZipping(false);
    setIsDownloading(true);
    const zipBlob = await jszip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "PE1.zip");
    setIsDownloading(false);
  };

  return (
    <>
      <Tooltip title="Info">
        <InfoOutlined
          onClick={showModal}
          style={{ fontSize: 17, color: "blue" }}
          height={55}
        />
        <Modal
          centered={true}
          open={isModalOpen}
          title={`${title}`}
          onOk={handleOk}
          onCancel={handleOk}
          footer={[
            <Button key="submit" type="default" onClick={handleOk}>
              OK
            </Button>,
          ]}
        >
          <Descriptions layout="vertical">
            <Descriptions.Item label="Lecturer">
              {lecturerName}
            </Descriptions.Item>
            <Descriptions.Item label="Content">{examContent}</Descriptions.Item>
            <Descriptions.Item label="Subject">{subjectName}</Descriptions.Item>
            <Descriptions.Item label="Status">
              {status === "Pending" ? (
                <Badge status="processing" text="Pending" />
              ) : status === "Approved" ? (
                <Badge status="success" text="Approved" />
              ) : (
                <Badge status="error" text="Rejected" />
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Type">{type}</Descriptions.Item>
            <Descriptions.Item label="File">
              {/* <a className="container" onClick={downloadFolderAsZip}>
                <div className="row align-items-center">
                  <div className="col-auto">
                    <img
                      src="https://banner2.cleanpng.com/20180611/wc/kisspng-computer-icons-file-explorer-internet-explorer-5b1e670f8e8603.7503591815287191195838.jpg"
                      className="img-thumbnail rounded img-size"
                      alt="Responsive image"
                    />
                  </div>
                </div>
                {isZipping && <div>Loading file...</div>}
              </a> */}
              <Button
                onClick={() => downloadFolderAsZip(examLink)}
                icon={isZipping ? <LoadingOutlined /> : <DownloadOutlined />}
                loading={isZipping}
              >
                {isZipping ? "Loading..." : ""}
              </Button>
            </Descriptions.Item>
            {status === "Approved" ? (
              <Descriptions.Item label="File Instruction">
                {/* <a className="container" onClick={() => window.open(examInstruction)}>
                  <div className="row align-items-center">
                    <div className="col-auto">
                      <img
                        src="https://e7.pngegg.com/pngimages/887/195/png-clipart-yellow-blue-and-red-files-blue-angle-area-material-system-explorer-blue-angle.png"
                        className="img-thumbnail rounded img-size"
                        alt="Responsive image"
                      />
                    </div>
                  </div>
                </a> */}
                <Button
                onClick={() => window.open(examInstruction)}
                icon={isZipping1 ? <LoadingOutlined /> : <DownloadOutlined />}
                loading={isZipping1}
              >
                {isZipping1 ? "Download..." : ""}
              </Button>
              </Descriptions.Item>
            ) : null}
          </Descriptions>
        </Modal>
      </Tooltip>
    </>
  );
};

export default ModalAnt;
