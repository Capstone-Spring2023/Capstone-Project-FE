import React from "react";
import { Select, Space } from "antd";

const { Option } = Select;

const SelectAnt = ({ onChange }) => {
  return (
    <Select
      style={{
        width: "100%",
      }}
      placeholder="Select subjects"
      onChange={onChange}
      optionLabelProp="label"
    >
      <Option value="PRF" label="PRF">
        <Space>PRF (Programing)</Space>
      </Option>
      <Option value="ASC" label="ASC">
        <Space>ASC (Account)</Space>
      </Option>
      <Option value="JPD" label="JPD">
        <Space>JPD (Japan)</Space>
      </Option>
      <Option value="MAE" label="MAE">
        <Space>MAE (Math)</Space>
      </Option>
    </Select>
  );
};

export default SelectAnt;
