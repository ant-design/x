import { Flex, InputNumber, Slider } from 'antd';
import React from 'react';

export interface RadiusPickerProps {
  id?: string;
  value?: number;
  onChange?: (value: number | null) => void;
}

const RadiusPicker: React.FC<RadiusPickerProps> = ({ id, value, onChange }) => (
  <Flex gap="large">
    <InputNumber
      value={value}
      onChange={onChange}
      style={{ width: 120 }}
      min={0}
      formatter={(val) => `${val}px`}
      parser={(str) => str?.replace('px', '') as unknown as number}
      id={id}
    />
    <Slider
      tooltip={{ open: false }}
      style={{ width: 128 }}
      min={0}
      value={value}
      max={20}
      onChange={onChange}
    />
  </Flex>
);

export default RadiusPicker;
