import React, { useEffect } from "react";
import {
  Col,
  DatePicker,
  Form,
  FormProps,
  Input,
  message,
  Row,
  Select,
  Switch,
} from "antd";
import { useGetUserDropdownMutation } from "../../store/api/userApiSlice";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "../../store/api/taskApiSlice";

dayjs.extend(utc);

type FieldType = {
  name: string;
  description: string;
  dateRange: any[];
  userId: string;
  isEnabled: boolean;
};

type FormFieldType = {
  name: string;
  description: string;
  dateRange: { startDate: string; endDate: string };
  userId: string;
  isEnabled: boolean;
};

interface UserFormProps {
  form: any;
  onSuccess: () => void;
  formData: FormFieldType;
  type: string;
}
const { RangePicker } = DatePicker;

const dateFormat = "YYYY/MM/DD";

const TaskForm: React.FC<UserFormProps> = ({
  form,
  onSuccess,
  formData,
  type,
}) => {
  const [createTask, { data: task, isLoading, isSuccess, isError }] =
    useCreateTaskMutation();

  const [
    updateTask,
    {
      data: taskUpdateData,
      isLoading: updateLoading,
      isSuccess: updateSuccess,
      isError: updateError,
    },
  ] = useUpdateTaskMutation();

  const [messageApi, contextHolder] = message.useMessage();

  const error = () => {
    messageApi.open({
      type: "error",
      content: "Something went wrong, Please try again",
    });
  };

  useEffect(() => {
    if (isError || updateError) {
      error();
    }
  }, [updateError, isError]);

  const [getUserDropdown, { data: dropdownData, isLoading: dropdownLoading }] =
    useGetUserDropdownMutation();

  useEffect(() => {
    getUserDropdown("");
  }, []);

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    const formattedValues = {
      ...values,
      dateRange: {
        startDate: dayjs(values.dateRange[0]).format("YYYY-MM-DD"),
        endDate: dayjs(values.dateRange[1]).format("YYYY-MM-DD"),
      },
    };
    console.log("values:", formattedValues);
    if (type === "NEW") {
      createTask(formattedValues);
    } else if (type === "EDIT") {
      const payload = {
        ...formData,
        ...formattedValues,
      };
      updateTask(payload);
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo,
  ) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    if (isSuccess || updateSuccess) {
      onSuccess();
    }
  }, [isSuccess, updateSuccess]);

  useEffect(() => {
    if (type === "NEW") {
      form.setFieldsValue({ isEnabled: false });
    } else if (formData && type === "EDIT") {
      form.setFieldsValue({
        name: formData.name,
        description: formData.description,
        dateRange: [
          dayjs(formData.dateRange.startDate),
          dayjs(formData.dateRange.endDate),
        ],
        userId: formData.userId,
        isEnabled: formData.isEnabled,
      });
    }
  }, [formData, type, form]);

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        hideRequiredMark
        initialValues={{ isEnabled: false }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        disabled={isLoading}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Task Name"
              rules={[{ required: true, message: "Task Name is required" }]}
            >
              <Input placeholder="Enter task name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="dateRange"
              label="Date Range"
              rules={[{ required: true, message: "Date Range is required" }]}
            >
              <RangePicker format={dateFormat} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="description" label="Description">
              <Input.TextArea rows={4} placeholder="Enter description" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Col span={12}>
              <Form.Item
                name="userId"
                label="Assign User"
                rules={[{ required: true, message: "Please select an user" }]}
              >
                <Select
                  placeholder="Please select an user"
                  options={dropdownData}
                  disabled={dropdownLoading}
                />
              </Form.Item>
            </Col>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="isEnabled" label="Enable">
              <Switch defaultChecked={false} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      {contextHolder}
    </>
  );
};

export default TaskForm;
