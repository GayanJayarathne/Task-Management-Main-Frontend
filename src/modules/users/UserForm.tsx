import React, { useEffect } from "react";
import { Col, Form, FormProps, Input, message, Row, Switch } from "antd";
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";
import AddressField from "../../components/address-field/AddressField";
import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from "../../store/api/userApiSlice";

type FieldType = {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  address: {
    formatted: string;
    latitude: number;
    longitude: number;
  };
  isEnabled: boolean;
};

interface UserFormProps {
  form: any;
  onSuccess: () => void;
  formData: FieldType;
  type: "NEW" | "EDIT";
}

const UserForm: React.FC<UserFormProps> = ({
  form,
  onSuccess,
  formData,
  type,
}) => {
  const [createUser, { data: user, isLoading, isSuccess, isError }] =
    useCreateUserMutation();

  const [
    updateUser,
    {
      data: userUpdateData,
      isLoading: updateLoading,
      isSuccess: updateSuccess,
      isError: updateError,
    },
  ] = useUpdateUserMutation();

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

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("values:", values);
    if (type === "NEW") {
      createUser(values);
    } else if (type === "EDIT") {
      const payload = {
        ...formData,
        ...values,
      };
      updateUser(payload);
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
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        mobile: formData.mobile,
        address: formData.address,
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
              name="firstName"
              label="First Name"
              rules={[{ required: true, message: "First Name is required" }]}
            >
              <Input placeholder="Enter first name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[{ required: true, message: "Last Name is required" }]}
            >
              <Input placeholder="Enter last name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Invalid email format" },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Enter Email" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="mobile"
              label="Mobile Number"
              rules={[
                { required: true, message: "Mobile number is required" },
                {
                  pattern: /^\+?[1-9]\d{1,14}$/,
                  message: "Invalid phone number format",
                },
              ]}
            >
              <Input
                prefix={<PhoneOutlined />}
                style={{ width: "100%" }}
                placeholder="Enter Mobile Number"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="address"
              label="Address"
              rules={[
                {
                  required: true,
                  message: "Address is required",
                },
              ]}
            >
              <AddressField
                value={form.getFieldValue("address")}
                onSubmit={(address, coordinates) => {
                  form.setFieldsValue({
                    address: {
                      formatted: address,
                      latitude: coordinates.lat,
                      longitude: coordinates.lng,
                    },
                  });
                }}
              />
            </Form.Item>
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

export default UserForm;
