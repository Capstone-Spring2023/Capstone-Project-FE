import { InboxOutlined } from "@ant-design/icons";
import { Upload } from "antd";

const { Dragger } = Upload;

const UploadAnt = ({ uploadFile }) => (
  <Dragger customRequest={(e) => uploadFile(e)}>
    <p className="ant-upload-drag-icon">
      <InboxOutlined />
    </p>
    <p className="ant-upload-text">Click or drag file to this area to upload</p>
    {/* <p className="ant-upload-hint">Only support for docx and rar file</p> */}
  </Dragger>
);
export default UploadAnt;
