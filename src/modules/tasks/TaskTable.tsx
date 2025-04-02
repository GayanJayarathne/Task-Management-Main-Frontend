import React, { useEffect, useState } from "react";
import { Button, Drawer, Flex, Form, Space, Table, Typography } from "antd";
import type { TableProps } from "antd";
import { PlusOutlined, EditOutlined, RestOutlined } from "@ant-design/icons";
import TaskForm from "./TaskForm";
import {
  useDeleteTaskMutation,
  useGetTaskByIdMutation,
  useGetTaskListMutation,
} from "../../store/api/taskApiSlice";

const { Title } = Typography;

interface DataType {
  name: string;
  description: string;
  dateRange: { startDate: string; endDate: string };
  userId: { _id: string; firstName: string; lastName: string };
  isEnabled: boolean;
}

const TaskTable = () => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("NEW");
  const [getTaskList, { data: taskData, isLoading, isSuccess, isError }] =
    useGetTaskListMutation();
  const [
    getUserById,
    {
      data: taskByIdData,
      isLoading: userLoading,
      isSuccess: userSuccess,
      isError: userError,
    },
  ] = useGetTaskByIdMutation();
  const [
    deleteUser,
    {
      data: taskDelete,
      isLoading: deleteLoading,
      isSuccess: deleteSuccess,
      isError: deleteError,
    },
  ] = useDeleteTaskMutation();

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Task Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (_, record) => <>{record.dateRange.startDate}</>,
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (_, record) => <>{record.dateRange.endDate}</>,
    },
    {
      title: "User",
      dataIndex: "userId",
      key: "userId",
      render: (_, record) => (
        <>{`${record.userId.firstName} ${record.userId.lastName}`}</>
      ),
    },
    {
      title: "Active",
      dataIndex: "isEnabled",
      key: "isEnabled",
      render: (_, record) => <>{record.isEnabled ? "Active" : "Inactive"}</>,
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
    if (userSuccess && taskByIdData?.data) {
      showDrawer();
    }
  }, [userSuccess, taskByIdData]);

  useEffect(() => {
    if (deleteSuccess) {
      getTaskList("");
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
    getTaskList("");
    onClose();
  };

  useEffect(() => {
    getTaskList("");
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
          Task
        </Title>
        <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
          New Task
        </Button>
      </Flex>
      <Table<DataType>
        columns={columns}
        dataSource={
          taskData?.data && taskData?.data.length > 0 ? taskData?.data : []
        }
      />
      <Drawer
        title={type === "EDIT" ? "Edit Task" : "Create new task"}
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
        <TaskForm
          form={form}
          onSuccess={onSuccess}
          formData={taskByIdData?.data}
          type={type}
        />
      </Drawer>
    </Flex>
  );
};

export default TaskTable;
