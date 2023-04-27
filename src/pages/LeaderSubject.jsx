import React, { useState } from "react";
import { Header } from "../components";
import { BASE_URL_API, NO_CORS_URL } from "../utils/constants";
import { Checkbox, Popconfirm, Select, Space, Table } from "antd";
import { toast, Toaster } from "react-hot-toast";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { DownloadOutlined } from "@ant-design/icons";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import {
  getDownloadURL,
  getMetadata,
  getStorage,
  listAll,
  ref,
} from "firebase/storage";

const { Option } = Select;
const { Column } = Table;
const LeaderSubject = ({ socket }) => {
  const [examAvailableSubjectData, setAvailableSubjectData] = useState([{}]);
  const [subject, setSubject] = useState([{}]);
  const semester = [
    { id: 3, name: "SP23" },
    { id: 1, name: "SU23" },
    { id: 2, name: "FA23" },
  ];
  const [noti, setNoti] = useState("Leader assign");
  const [availableSubjectId, setAvailableSubjectId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [subjectName, setSubjectName] = useState("");
  const [isZipping, setIsZipping] = useState(false);
  const userIdofHeader = sessionStorage.getItem("userId");

  const handleSubjectSelect = (value) => {
    const id = value.split(",")[0];
    const selectSubjectName = value.split(",")[1];
    setSubjectName(selectSubjectName);
    fetchTable(id);
  };

  const handleSemesterSelect = (value) => {
    fetchSubject(value);
  };

  const fetchSubject = (semesterId) => {
    fetch(`https://fpt-cft.azurewebsites.net/Semester/${semesterId}`)
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setSubject(resp);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const onChange = (checkedValues: CheckboxValueType[]) => {
    setAvailableSubjectId(checkedValues.target.value.split(",")[0]);
    setUserId(checkedValues.target.value.split(",")[1]);
  };
  const handleLeader = (availableSubjectId, userId) => {
    const leaderData = {
      availableSubjectId,
      userId,
      userIdofHeader,
    };
    toast.promise(
      fetch(`${BASE_URL_API}/header/SetLeader`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(leaderData),
      })
        .then((res) => {
          if (noti.trim() && sessionStorage.getItem("fullName")) {
            socket.emit("message", {
              type: "subjectLeader",
              message: noti,
              userName: sessionStorage.getItem("fullName"),
            });
            // checkPageStatus(noti, sessionStorage.getItem("fullName"));
          }
          setNoti("");
          fetchTable(availableSubjectId);
        })
        .catch((err) => {
          console.log(err.message);
        }),
      {
        loading: "Updating...",
        success: <b>Updated successfully</b>,
        error: <b>Could not update.</b>,
      }
    );
  };

  const downloadFolderAsZip = async (examLink) => {
    setIsZipping(true);
    const jszip = new JSZip();
    const storage = getStorage();
    const folderRef = ref(storage, examLink + "/" + subjectName + "/PE1");
    const folderRef2 = ref(
      storage,
      examLink + "/" + subjectName + "/PE1/Given"
    );
    const folderRef3 = ref(
      storage,
      examLink + "/" + subjectName + "/PE1/TestCases"
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
    const zipBlob = await jszip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "PE1.zip");
  };

  const fetchTable = (availableSubjectId) => {
    fetch(
      `${BASE_URL_API}/header/GetLecturersHaveRegisterSubjectByAvailableSubjectId/${availableSubjectId}`
    )
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setAvailableSubjectData(resp.data);
        console.log("RES", resp);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const columns = [
    {
      title: "FullName",
      dataIndex: "fullName",
      filters: [
        {
          text: "Han",
          value: "Han",
        },
      ],
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.fullName.indexOf(value) === 0,
      width: "20%",
    },
    {
      title: "Semester",
      dataIndex: "semester",
    },
    {
      title: "Reviewer",
      dataIndex: "approvalUserName",
    },
    {
      title: "Exam file",
      dataIndex: "examLink",
      render: (_, record) =>
        record.status ? (
          <DownloadOutlined
            style={{ fontSize: 23, color: "lightblue" }}
            onClick={() => downloadFolderAsZip(record.examLink)}
          />
        ) : (
          <></>
        ),
    },
    {
      title: "Exam status",
      dataIndex: "status",
      render: (_, record) =>
        record.status ? <div>Submitted</div> : <div>Not Submit</div>,
    },
    {
      title: "isLeader",
      dataIndex: "isLeader",
      render: (_, record) =>
        record.isCol ? (
          <div>Is Collaborator</div>
        ) : (
          <Popconfirm
            title="Assign subject Leader"
            description="Are you sure to assign leader?"
            onConfirm={() => handleLeader(availableSubjectId, userId)}
            okText="Yes"
            okType="default"
            cancelText="No"
          >
            <Checkbox
              onChange={onChange}
              value={`${record.availableSubjectId},${record.userId}`}
              checked={record?.isLeader}
            >
              isLeader
            </Checkbox>
          </Popconfirm>
        ),
    },
  ];

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Toaster />
      <div className="flex justify-between items-center">
        <Header category="App" title="Available Subject" />
      </div>
      <div className="flex justify-start items-center mb-5">
        <Select
          style={{ width: "200px", marginRight: "10px" }}
          placeholder="Select semester"
          onSelect={handleSemesterSelect}
          optionLabelProp="label"
          optionFilterProp="label"
        >
          {semester?.map((item, index) => (
            <Option key={index} value={`${item.id}`} label={`${item.name}`}>
              <Space>{item.name}</Space>
            </Option>
          ))}
        </Select>
        <Select
          style={{ width: "200px" }}
          showSearch
          placeholder="Select subjects"
          onSelect={handleSubjectSelect}
          optionLabelProp="label"
        >
          {subject?.map((item, index) => (
            <Option
              key={index}
              value={`${item?.availableSubjectId},${item?.subjectName}`}
              label={`${item?.subjectName}`}
            >
              <Space>{item?.subjectName}</Space>
            </Option>
          ))}
        </Select>
      </div>
      <Table
        columns={columns}
        dataSource={
          examAvailableSubjectData?.length > 1 ? examAvailableSubjectData : null
        }
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};
export default LeaderSubject;
