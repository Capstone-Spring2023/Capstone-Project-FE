import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";

const { Dragger } = Upload;
const props = {
  name: "file",
  multiple: false,
  action: "",
  onChange(info) {
    const { status } = info.file;
    console.log("FILE", info);
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "error") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "done") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};
const UploadAnt = () => (
  <Dragger {...props}>
    <p className="ant-upload-drag-icon">
      <InboxOutlined />
    </p>
    <p className="ant-upload-text">Click or drag file to this area to upload</p>
    <p className="ant-upload-hint">Only support for docx and rar file</p>
  </Dragger>
);
export default UploadAnt;
