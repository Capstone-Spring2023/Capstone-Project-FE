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

  const downloadFolderAsZip = async () => {
    const jszip = new JSZip();
    const storage = getStorage();

    const folderRef = ref(storage, "baopgse140382@fpt.edu.vn/PE1");
    const folder = await listAll(folderRef);
    const promises = folder.items
      .map(async (item) => {
        const file = await getMetadata(item);
        const fileRef = ref(storage, item.fullPath);
        console.log("FILE", file);
        console.log("FILEREF", fileRef);
        const fileBlob = await getDownloadURL(fileRef).then((url) => {
          return fetch(`https://cors-anywhere.herokuapp.com/${url}`).then(
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

    const zipBlob = await jszip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "download.zip");
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
              {/* https://firebasestorage.googleapis.com/v0/b/capstone-cft.appspot.com/o/VNR-source-mini-2.docx?alt=media&token=c16c8d87-6029-4bf0-9679-452a98594673 */}
              <div className="row align-items-center">
                <div className="col-auto">
                  <img
                    src="https://banner2.cleanpng.com/20180611/wc/kisspng-computer-icons-file-explorer-internet-explorer-5b1e670f8e8603.7503591815287191195838.jpg"
                    className="img-thumbnail rounded img-size"
                    alt="Responsive image"
                  />
                </div>
              </div>
            </a>
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  );
};

export default ModalAnt;
