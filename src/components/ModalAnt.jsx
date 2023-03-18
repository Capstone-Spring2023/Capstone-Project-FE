import React, { useState } from "react";
import { Badge, Button, Descriptions, Modal, Tooltip } from "antd";
import "./GoogleButton.css";
import { InfoOutlined } from "@ant-design/icons";
import {
  getDownloadURL,
  getMetadata,
  getStorage,
  listAll,
  ref,
} from "firebase/storage";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { BASE_URL_API } from "../utils/constants";

const ModalAnt = ({ title, id }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [examTitle, setExamTitle] = useState("");
  const [lecturerName, setLecturerName] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [examScheduleID,setExamScheduleID]=useState("");
  const [examLink,setExamLink]=useState("");
  const [status, setStatus] = useState(false);
  const showModal = () => {
    getDetail();
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const [isZipping, setIsZipping] = useState(false);
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
        console.log("RES", resp);
        setExamTitle(resp.examContent);
        setLecturerName(resp.lecturerName);
        setSubjectName(resp.subjectName);
        setStatus(resp.status);
        setExamScheduleID(resp.examScheduleId);
        setExamLink(resp.examLink);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const downloadFolderAsZip = async () => {
    setIsZipping(true);
    const jszip = new JSZip();
    const storage = getStorage();
    const folderRef = ref(storage,sessionStorage.getItem("email") + "/" + examScheduleID + "/PE1");
    const folderRef2 = ref(storage, sessionStorage.getItem("email") + "/" + examScheduleID + "/PE1/Given");
    const folderRef3 = ref(storage,sessionStorage.getItem("email") + "/"+ examScheduleID + "/PE1/TestCases");
    // const folderRef = ref(storage,examLink + "/" + examScheduleID + "/PE1");
    // const folderRef2 = ref(storage, examLink + "/" + examScheduleID +"/PE1/Given");
    // const folderRef3 = ref(storage, examLink  + "/" + examScheduleID +"/PE1/TestCases");
    const folder = await listAll(folderRef);
    const folder2 = await listAll(folderRef2);
    const folder3 = await listAll(folderRef3);
    const promises = folder.items
      .map(async (item) => {
        const file = await getMetadata(item);
        const fileRef = ref(storage, item.fullPath);
        console.log("FILE", file);
        console.log("FILEREF", fileRef);
        const fileBlob = await getDownloadURL(fileRef).then((url) => {
          return fetch(`https://gentle-temple-68806.herokuapp.com/${url}`).then(
            (response) => response.blob()
          );
        });
        console.log("FILEBLOB", fileBlob);
        console.log("FOLDER", folder.prefixes[0]._location.path);
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
          return fetch(`https://gentle-temple-68806.herokuapp.com/${url}`).then(
            (response) => response.blob()
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
          return fetch(`https://gentle-temple-68806.herokuapp.com/${url}`).then(
            (response) => response.blob()
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
            <Descriptions.Item label="UserName">
              {lecturerName}
            </Descriptions.Item>
            <Descriptions.Item label="Title">{examTitle}</Descriptions.Item>
            <Descriptions.Item label="Status">
              {status === "Pending" ? (
                <Badge status="processing" text="Pending" />
              ) : status === "Approved" ? (
                <Badge status="success" text="Approved" />
              ) : (
                <Badge status="error" text="Rejected" />
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Type">By computer</Descriptions.Item>
            <Descriptions.Item label="File">
              <a className="container" onClick={downloadFolderAsZip}>
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
              </a>
            </Descriptions.Item>
          </Descriptions>
        </Modal>
      </Tooltip>
    </>
  );
};

export default ModalAnt;
