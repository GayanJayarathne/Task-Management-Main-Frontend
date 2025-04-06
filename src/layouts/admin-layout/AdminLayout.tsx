import { Avatar, Divider, Dropdown, Flex, MenuProps, Space } from "antd";
import { useNavigate } from "react-router";
import React, { FC, ReactNode } from "react";
import { Layout, Menu, theme } from "antd";
import {
  AppstoreOutlined,
  PoweroffOutlined,
  ScheduleOutlined,
  TeamOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/reducers/authSlice";

interface AdminLayoutProps {
  children?: ReactNode;
}

const { Header, Content, Footer, Sider } = Layout;

const AdminLayout: FC<AdminLayoutProps> = (props) => {
  const { children } = props;
  const navigate = useNavigate();
  const user = useSelector(selectUser);

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
      key: "user",
      icon: <TeamOutlined />,
      label: "User",
      onClick: () => navigate("/admin/user"),
    },
    {
      key: "task",
      icon: <ScheduleOutlined />,
      label: "Task",
      onClick: () => navigate("/admin/task"),
    },
    {
      key: "changePassword",
      icon: <UnlockOutlined />,
      label: "Change Password",
      onClick: () => navigate("/admin/change-password"),
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
        <div onClick={() => navigate("/")} className="demo-logo-vertical">
          TMS
        </div>
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
                  <Avatar>{user?.firstName?.charAt(0).toUpperCase()}</Avatar>
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

export default AdminLayout;
