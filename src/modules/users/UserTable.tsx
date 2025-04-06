import React, { useEffect, useState } from "react";
import {
  Button,
  Drawer,
  Flex,
  Form,
  message,
  Popconfirm,
  Space,
  Table,
  Typography,
} from "antd";
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
  const [type, setType] = useState<"NEW" | "EDIT">("NEW");
  const [messageApi, contextHolder] = message.useMessage();
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
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            onConfirm={() => onDeleteUser(record)}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<RestOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const cancel = () => {
    console.log("Cancelled");
  };

  const success = (message: string) => {
    messageApi.open({
      type: "success",
      content: `Successfully ${message}`,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      success("fetched");
    }
  }, [isSuccess]);

  const error = () => {
    messageApi.open({
      type: "error",
      content: "Something went wrong, Please try again",
    });
  };

  useEffect(() => {
    if (deleteError || isError || userError) {
      error();
    }
  }, [deleteError, isError, userError]);

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
      success("deleted");
      getUsersList("");
    }
  }, [deleteSuccess]);

  const [form] = Form.useForm();

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setType("NEW");
    form.resetFields();
    setOpen(false);
  };

  const onSuccess = () => {
    success(type === "NEW" ? "created" : "updated");
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
      {contextHolder}
    </Flex>
  );
};

export default UserTable;
