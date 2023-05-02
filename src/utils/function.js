import { Button, Input, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import React from "react";

function sendNotification(message, user) {
  document.onvisibilitychange = () => {
    if (document.hidden) {
      const notification = new Notification(
        "There is new notification open web to view",
        {
          icon: "https://cdn-icons-png.flaticon.com/512/733/733585.png",
          body: `${user}: ${message}`,
        }
      );
      notification.onclick = () =>
        function () {
          window.open("http://localhost:3000");
        };
    }
  };
}

export default function checkPageStatus(message, user) {
  if (user === sessionStorage.getItem("fullName")) {
    if (!("Notification" in window)) {
      alert("This browser does not support system notifications!");
    } else if (Notification.permission === "granted") {
      sendNotification(message, user);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission((permission) => {
        if (permission === "granted") {
          sendNotification(message, user);
        }
      });
    }
  }
}

export const dataChange = (socket) => {
  socket.emit("dataChange", {
    message: "Change",
  });
};
const handleSearch = (
  selectedKeys,
  confirm,
  dataIndex,
  setSearchText,
  setSearchedColumn
) => {
  confirm();
  setSearchText(selectedKeys[0]);
  setSearchedColumn(dataIndex);
};
const handleReset = (clearFilters, setSearchText) => {
  clearFilters();
  setSearchText("");
};

export const getColumnSearchProps = (
  dataIndex,
  setSearchText,
  setSearchedColumn,
  searchInput,
  searchedColumn,
  searchText
) => ({
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
        onPressEnter={() =>
          handleSearch(
            selectedKeys,
            confirm,
            dataIndex,
            setSearchText,
            setSearchedColumn
          )
        }
        style={{
          marginBottom: 8,
          display: "block",
        }}
      />
      <Space>
        <Button
          type="default"
          onClick={() =>
            handleSearch(
              selectedKeys,
              confirm,
              dataIndex,
              setSearchText,
              setSearchedColumn
            )
          }
          icon={<SearchOutlined />}
          size="small"
          style={{
            width: 90,
          }}
        >
          Search
        </Button>
        <Button
          onClick={() =>
            clearFilters && handleReset(clearFilters, setSearchText)
          }
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
