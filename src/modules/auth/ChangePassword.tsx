import { Button, Form, Input, message, Typography } from "antd";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/reducers/authSlice";
import { useChangePasswordMutation } from "../../store/api/authApiSlice";
import { useEffect } from "react";
import { Content } from "antd/es/layout/layout";

const ChangePassword = () => {
  const user = useSelector(selectUser);
  const [messageApi, contextHolder] = message.useMessage();

  const [
    changePassword,
    { data: authData, isLoading, isSuccess, isError, error },
  ] = useChangePasswordMutation();

  const onChangePassword = (values: any) => {
    changePassword({ ...values, email: user.email });
  };

  const success = () => {
    messageApi.open({
      type: "success",
      content: `Successfully changed the password`,
    });
  };

  const errorMessage = (data: any) => {
    messageApi.open({
      type: "error",
      content: data.data.message
        ? data.data.message
        : "Something went wrong, Please try again",
    });
  };

  useEffect(() => {
    if (isSuccess) {
      success();
      form.resetFields();
    } else if (isError) {
      errorMessage(error);
    }
  }, [isSuccess, isError]);

  const [form] = Form.useForm();

  return (
    <>
      <Content style={{ margin: "24px 16px 0", height: "100%", width: "30%" }}>
        <Form
          form={form}
          name="normal_login"
          layout="vertical"
          hideRequiredMark
          className="login-form"
          initialValues={{
            email: user.email,
            password: "",
            confirmPassword: "",
            newPassword: "",
          }}
          onFinish={onChangePassword}
        >
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please enter your current password" },
              {
                min: 6,
                message: "Password must be at least 6 characters long",
              },
            ]}
            label="Enter your current password"
            hasFeedback
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item
            name="newPassword"
            rules={[
              { required: true, message: "Please enter new password" },
              {
                min: 6,
                message: "Password must be at least 6 characters long",
              },
            ]}
            label="Enter new password"
            hasFeedback
          >
            <Input.Password placeholder="Enter new password" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["newPassword"]}
            label="Confirm your password"
            hasFeedback
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm password" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Confirm
            </Button>
          </Form.Item>
        </Form>
        {contextHolder}
      </Content>
    </>
  );
};

export default ChangePassword;
