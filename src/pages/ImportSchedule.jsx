import React, { useEffect, useRef, useState } from "react";
import { Header } from "../components";
import { InboxOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  message,
  message as messageAnt,
  Popconfirm,
  Result,
  Select,
  Space,
  Steps,
  Table,
  Upload,
} from "antd";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { read, utils } from "xlsx";
import { BASE_URL_API } from "../utils/constants";
import moment from "moment/moment";
import { toast, Toaster } from "react-hot-toast";
import Highlighter from "react-highlight-words";

const { Dragger } = Upload;
const { Option } = Select;
const ImportSchedule = () => {
  const [deadLine, setDeadLine] = useState("");
  const [formData, setFormData] = useState(new FormData());
  const [current, setCurrent] = useState(0);
  const [subject, setSubject] = useState([{}]);
  const [subjectId, setSubjectId] = useState(null);
  const [availableSubjectId, setAvailableSubjectId] = useState(null);
  const [teachableData, setTeachableData] = useState([{}]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  useEffect(() => {
    fetchSubject();
  }, []);

  const upLoadFile = ({ onSuccess, onProgress, onError, file }) => {
    if (!file) return;
    const fileExtension = file.name.split(".").pop();
    const fileNameParts = file.name.split("-");
    if (fileExtension !== "csv") {
      messageAnt.error("Only support for .csv or .xlsx file");
      return;
    }
    if (fileNameParts[0] !== "CF" || fileNameParts[1] !== "Lịch") {
      messageAnt.error("Only support for CF schedule file");
      return;
    }
    const storage = getStorage();
    let fileRef = ref(
      storage,
      `/SP23/${sessionStorage.getItem("email")}/EmptySchedule/${file.name}`
    );
    const uploadTask = uploadBytesResumable(fileRef, file);
    uploadTask.on(
      "state_changed",
      function progress(snapshot) {
        onProgress(
          {
            percent:
              Math.floor(
                snapshot.bytesTransferred / snapshot.totalBytes
              ).toFixed(2) * 100,
          },
          file
        );
      },
      function error(err) {
        onError(err, file);
        messageAnt.error(`${file.name} file imported failed.`);
      },
      function complete() {
        onSuccess(file);
        getDownloadURL(uploadTask.snapshot.ref)
          .then((url) => {
            console.log(url);
            handleFile(file);
            setCurrent(current + 1);
            messageAnt.success(`${file.name} file imported successfully.`);
          })
          .catch((error) => {
            console.log(error);
            messageAnt.error(`${file.name} file imported failed.`);
          });
      }
    );
  };

  const sendNotification = (values) => {
    importSchedule();
    setRegisterDeadLine();
  };

  const setRegisterDeadLine = () => {
    const deadLineData = {
      semesterId: 1,
      deadline: deadLine,
    };
    toast.promise(
      fetch(`${BASE_URL_API}/schedule/deadline`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(deadLineData),
      })
        .then((res) => {
          setCurrent(current + 1);
          console.log(res);
        })
        .catch((err) => {
          console.log(err.message);
        }),
      {
        loading: "Sending Notification...",
        success: <b>Sent successfully</b>,
        error: <b>Sent fail</b>,
      }
    );
  };
  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    setDeadLine(dateString);
  };
  const importSchedule = () => {
    fetch(`${BASE_URL_API}/auto-schedule/import-file/semester/1`, {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleFile = (file) => {
    const reader = new FileReader();
    setFormData((formData) => {
      formData.append("file", file);
      return formData;
    });
    reader.onload = (event) => {
      const workbook = read(event.target.result, { type: "binary" });
      const sheet1Name = workbook.SheetNames[0];
      const sheet1 = workbook.Sheets[sheet1Name];
      const data1 = utils.sheet_to_csv(sheet1);

      // const csvBlob = new Blob([data1], { type: "text/csv;charset=utf-8" });
      // saveAs(csvBlob, file.name.replace(".xlsx", "") + ".csv");
    };
    reader.readAsBinaryString(file);
  };

  const contentStyle: React.CSSProperties = {
    marginTop: 16,
  };
  const fetchSubject = (semesterId) => {
    fetch(`https://fpt-cft.azurewebsites.net/Semester/1`)
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

  const fetchTeachableData = (availableId) => {
    fetch(
      `${BASE_URL_API}/user/GetUserCanTeachByAvailableSubjectId/${availableId}`
    )
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setTeachableData(resp.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleTeachable = (subjectId, userId, availableSubjectId) => {
    const teachableData = {
      subjectId,
      userId,
    };
    toast.promise(
      fetch(`${BASE_URL_API}/able-subject/api/user/able-subject`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(teachableData),
      })
        .then((res) => {
          fetchTeachableData(availableSubjectId);
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

  const isDisabledDate = (current) => {
    // Lấy ra ngày hiện tại
    const today = moment().startOf("day");
    // Tính toán ngày hết hạn tối thiểu
    const minDeadline = moment(today).add(1, "day"); // Tối thiểu ngày mai
    // Tính toán ngày hết hạn tối đa
    const maxDeadline = moment(today).add(4, "month"); // Tối đa 4 tháng sau
    // Kiểm tra current có nằm trong khoảng thời gian tối thiểu và tối đa không
    return (
      current &&
      (current < minDeadline || current > maxDeadline || current.isSame(today))
    );
  };

  const handleSubjectSelect = (value) => {
    const availableSubjectId = value.split(",")[0];
    const subjectId = value.split(",")[1];
    fetchTeachableData(availableSubjectId);
    setSubjectId(subjectId);
    setAvailableSubjectId(availableSubjectId);
  };
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="default"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "FullName",
      dataIndex: "fullName",
      key: "fullName",
      ...getColumnSearchProps("fullName"),
    },
    {
      title: "Semester",
      dataIndex: "semester",
    },
    {
      title: "Teachable",
      dataIndex: "status",
      render: (_, record) => (
        <Popconfirm
          title="Set teachable subject"
          description="Are you sure to set this subject?"
          onConfirm={() =>
            handleTeachable(subjectId, record.userId, availableSubjectId)
          }
          okText="Yes"
          okType="default"
          cancelText="No"
        >
          <Checkbox
            onChange={onChange}
            value={`${record.userId}`}
            checked={record?.status}
          >
            isTeachable
          </Checkbox>
        </Popconfirm>
      ),
    },
  ];

  const steps = [
    {
      title: "Import Empty Schedule",
      content: (
        <Form name="basic" onFinish={sendNotification} autoComplete="off">
          <Form.Item
            name="deadline"
            rules={[
              {
                required: true,
                message: "Please input register deadline!",
              },
            ]}
          >
            <DatePicker
              onChange={onChange}
              placeholder="Select register deadline"
              style={{ width: "200px" }}
              disabledDate={isDisabledDate}
            />
          </Form.Item>
          <Form.Item
            name="file"
            rules={[
              {
                required: true,
                message: "Please import your empty schedule here!",
              },
            ]}
          >
            <Dragger customRequest={(e) => upLoadFile(e)}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to import
              </p>
              <p className="ant-upload-hint">
                Only support for .xlsx or .csv file
              </p>
            </Dragger>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: "Set teachable subject",
      content: (
        <Form name="basic" onFinish={sendNotification} autoComplete="off">
          <div className="flex flex-col gap-3">
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
                  value={`${item?.availableSubjectId},${item?.subjectId}`}
                  label={`${item?.subjectName}`}
                >
                  <Space>{item?.subjectName}</Space>
                </Option>
              ))}
            </Select>
            <Table
              columns={columns}
              dataSource={teachableData?.length > 1 ? teachableData : null}
              pagination={{ pageSize: 5 }}
            />
            <Button htmlType="submit" className="w-fit">
              Send Notification
            </Button>
          </div>
        </Form>
      ),
    },
    {
      title: "Success",
      content: (
        <Result
          status="success"
          title="All operation has been success!"
          subTitle="You can continue your work now."
        />
      ),
    },
  ];

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Toaster />
      <div className="flex flex-col gap-3">
        <Header category="Managements" title="Import Schedule" />
        <Steps current={current} items={items} />
        <div style={contentStyle}>{steps[current].content}</div>
      </div>
    </div>
  );
};

export default ImportSchedule;
