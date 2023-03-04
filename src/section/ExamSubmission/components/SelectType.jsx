import React from "react";
import { Select, Space } from "antd";

const { Option } = Select;

const SelectType = ({ onChange, disabled, defaultValue }) => {
  return (
    <Select
      style={{
        width: "100%",
      }}
      placeholder="Select type"
      onChange={onChange}
      optionLabelProp="label"
      disabled={disabled}
      defaultValue={`${defaultValue}`}
      value={`${defaultValue}`}
    >
      <Option value="By computer" label="By computer">
        <Space>By computer</Space>
      </Option>
      <Option value="By hand" label="By hand">
        <Space>By hand</Space>
      </Option>
    </Select>
  );
};

export default SelectType;
