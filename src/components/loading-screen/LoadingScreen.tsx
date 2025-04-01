import { Flex, Layout, Spin } from "antd";
import React from "react";

const LoadingScreen = () => {
  return (
    <Flex align="center" gap="middle">
      <Spin size="large" style={{ maxHeight: "100%" }}>
        <Layout style={{ height: "100vh", width: "100vw" }}></Layout>
      </Spin>
    </Flex>
  );
};

export default LoadingScreen;
