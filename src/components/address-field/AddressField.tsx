import React, { useEffect, useState } from "react";
import { Button, Col, Input, Modal, Row } from "antd";
import MapModel from "./MapModel";
import { SearchOutlined } from "@ant-design/icons";

interface Coordinates {
  lat: number | null;
  lng: number | null;
}

interface AddressType {
  formatted: string;
  latitude: number;
  longitude: number;
}

interface AddressFieldProps {
  onSubmit: (address: string, coordinate: Coordinates) => void;
  value: AddressType;
}

const AddressField: React.FC<AddressFieldProps> = ({ onSubmit, value }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [address, setAddress] = useState<string>("");
  const [coordinates, setCoordinates] = useState<Coordinates>({
    lat: null,
    lng: null,
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    onSubmit(address, coordinates);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onAddressChange = (address: string, coordinate: Coordinates) => {
    setAddress(address);
    setCoordinates(coordinate);
  };

  useEffect(() => {
    if (value) {
      setAddress(value.formatted);
      setCoordinates({ lat: value.latitude, lng: value.longitude });
    }
  }, [value]);

  return (
    <>
      <Row gutter={16}>
        <Col span={21} style={{ marginBottom: "18px" }}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Enter an address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            disabled={true}
          />
        </Col>
        <Col span={3} style={{ marginBottom: "18px" }}>
          <Button type="primary" onClick={showModal}>
            Map
          </Button>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Input
            value={coordinates.lat?.toFixed(6)}
            disabled={true}
            placeholder="Latitude"
          />
        </Col>
        <Col span={12}>
          <Input
            value={coordinates.lng?.toFixed(6)}
            disabled={true}
            placeholder="Longutide"
          />
        </Col>
      </Row>
      <Modal
        title="Select your location"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={900}
      >
        <MapModel onChange={onAddressChange} value={value} />
      </Modal>
    </>
  );
};

export default AddressField;
