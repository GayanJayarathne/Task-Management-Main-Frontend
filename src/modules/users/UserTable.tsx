import React, { useEffect, useState } from "react";
import { Button, Drawer, Flex, Form, Space, Table, Typography } from "antd";
import type { TableProps } from "antd";
import { PlusOutlined, EditOutlined, RestOutlined } from "@ant-design/icons";
import UserForm from "./UserForm";
import {
  useDeleteUserMutation,
  useGetUserByIdMutation,
  useGetUserListMutation,
} from "../../store/api/userApiSlice";

interface DataType {
  key: string;
  firstName: string;
  age: number;
  email: string;
  tags?: string[];
}

const { Title } = Typography;

const UserTable = () => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("NEW");
  const [getUsersList, { data: userData, isLoading, isSuccess, isError }] =
    useGetUserListMutation();
  const [
    getUserById,
    {
      data: userByIdData,
      isLoading: userLoading,
      isSuccess: userSuccess,
      isError: userError,
    },
  ] = useGetUserByIdMutation();
  const [
    deleteUser,
    {
      data: userDelete,
      isLoading: deleteLoading,
      isSuccess: deleteSuccess,
      isError: deleteError,
    },
  ] = useDeleteUserMutation();
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => onEditUser(record)} />
          <Button
            icon={<RestOutlined />}
            onClick={() => onDeleteUser(record)}
          />
        </Space>
      ),
    },
  ];

  const onEditUser = (row: any) => {
    setType("EDIT");
    getUserById(row._id);
  };

  const onDeleteUser = (row: any) => {
    deleteUser(row._id);
  };

  useEffect(() => {
    if (userSuccess && userByIdData) {
      showDrawer();
    }
  }, [userSuccess, userByIdData]);

  useEffect(() => {
    if (deleteSuccess) {
      getUsersList("");
    }
  }, [deleteSuccess]);

  const [form] = Form.useForm();

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setType("NEW");
    setOpen(false);
  };

  const onSuccess = () => {
    getUsersList("");
    onClose();
  };

  useEffect(() => {
    getUsersList("");
  }, []);

  const handleSubmit = () => {
    form.submit();
  };

  return (
    <Flex vertical>
      <Flex
        justify="space-between"
        align="center"
        style={{ paddingBottom: "20px" }}
      >
        <Title style={{ margin: 0 }} level={3}>
          User
        </Title>
        <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
          New User
        </Button>
      </Flex>
      <Table<DataType>
        columns={columns}
        dataSource={userData && userData.length > 0 ? userData : []}
      />
      <Drawer
        title={type === "EDIT" ? "Edit user" : "Create new user"}
        width={720}
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit} type="primary">
              Submit
            </Button>
          </Space>
        }
      >
        <UserForm
          form={form}
          onSuccess={onSuccess}
          formData={userByIdData}
          type={type}
        />
      </Drawer>
    </Flex>
  );
};

export default UserTable;
