import React, { useState } from "react";
import { Badge, Button, Descriptions, Modal } from "antd";
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

const ModalAnt = ({ title }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const [isZipping, setIsZipping] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadFolderAsZip = async () => {
    setIsZipping(true);
    const jszip = new JSZip();
    const storage = getStorage();
    const folderRef = ref(storage, "baopgse140382@fpt.edu.vn/PE1");
    const folderRef2 = ref(storage, "baopgse140382@fpt.edu.vn/PE1/Given");
    const folderRef3 = ref(storage, "baopgse140382@fpt.edu.vn/PE1/Testcase");
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
        jszip.folder("Test_Case/");
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
        const testCFolder = jszip.folder("Testcase");
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
        footer={[
          <Button key="submit" type="default" onClick={handleOk}>
            OK
          </Button>,
        ]}
      >
        <Descriptions layout="vertical">
          <Descriptions.Item label="UserName">HoaDNT</Descriptions.Item>
          <Descriptions.Item label="Title">PRF exam</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Badge status="success" text="Active" />
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
              {isZipping && <div>Đang tải file...</div>}
            </a>
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  );
};

export default ModalAnt;
