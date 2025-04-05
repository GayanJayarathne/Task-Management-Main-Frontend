import { Avatar, Divider, Dropdown, Flex, MenuProps, Space } from "antd";
import { useNavigate } from "react-router";
import React, { FC, ReactNode } from "react";
import { Layout, Menu, theme } from "antd";
import {
  AppstoreOutlined,
  PoweroffOutlined,
  UnlockOutlined,
} from "@ant-design/icons";

interface AdminLayoutProps {
  children?: ReactNode;
}

const { Header, Content, Footer, Sider } = Layout;

const UserLayout: FC<AdminLayoutProps> = (props) => {
  const { children } = props;
  const navigate = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: "dashboard",
      icon: <AppstoreOutlined />,
      label: "Dashboard",
    },
    {
      key: "changePassword",
      icon: <UnlockOutlined />,
      label: "Change Password",
      onClick: () => navigate("/user/change-password"),
    },
  ];

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "My Account",
      disabled: true,
    },
    {
      key: "2",
      label: "Logout",
      icon: <PoweroffOutlined />,
      onClick: () => navigate("/logout"),
    },
  ];

  return (
    <Layout style={{ height: "100%" }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="demo-logo-vertical">TMS</div>
        <Divider style={{ borderColor: "#fafafa" }} />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: "0px 20px",
            background: colorBgContainer,
            alignItems: "center",
          }}
        >
          <Flex align="center" justify="flex-end">
            <Dropdown menu={{ items }}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <Avatar>U</Avatar>
                </Space>
              </a>
            </Dropdown>
          </Flex>
        </Header>
        <Content style={{ margin: "24px 16px 0", height: "100%" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              height: "100%",
            }}
          >
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>MERN Stack Assignment</Footer>
      </Layout>
    </Layout>
  );
};

export default UserLayout;
