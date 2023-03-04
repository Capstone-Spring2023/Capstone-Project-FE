import React from "react";
import { Select, Space } from "antd";

const { Option } = Select;

const SelectAnt = ({
  onChange,
  items,
  placeholder,
  disabled,
  defaultValue,
}) => {
  return (
    <Select
      style={{
        width: "100%",
      }}
      placeholder={`${placeholder}`}
      onChange={onChange}
      optionLabelProp="label"
      disabled={disabled}
    >
      {items?.map((item, index) => (
        <Option key={index} value={`${item}`} label={`${item}`}>
          <Space>{item}</Space>
        </Option>
      ))}
    </Select>
  );
};

export default SelectAnt;
