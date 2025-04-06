import { Button, Card, Form, Input, message, Spin, Typography } from "antd";
import {
  useAuthVerifyOtpMutation,
  useGetAuthenticateMutation,
  useGetAuthOtpMutation,
} from "../../store/api/authApiSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  setRefreshToken,
  setToken,
  setUser,
} from "../../store/reducers/authSlice";
import { useNavigate } from "react-router";
import { setArrayToLocalStorage, setToLocalStorage } from "../../utils/helpers";
import LoadingScreen from "../../components/loading-screen/LoadingScreen";

type AuthType = "EMAIL" | "OTP" | "CREATE_PASSWORD" | "PASSWORD";

interface FormValues {
  email?: string;
  otp?: string;
  password?: string;
  confirmPassword?: string;
}

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [authType, setAuthType] = useState<AuthType>("EMAIL");
  const [email, setEmail] = useState<string>("");

  const [
    requestOtp,
    {
      data: otpData,
      isLoading: isRequestingOtp,
      isError: isOtpError,
      error: otpError,
    },
  ] = useGetAuthOtpMutation();

  const [
    verifyOtp,
    {
      data: verifyData,
      isLoading: isVerifyingOtp,
      isError: isVerifyError,
      error: verifyError,
    },
  ] = useAuthVerifyOtpMutation();

  const [
    authenticate,
    {
      data: authData,
      isLoading: isAuthenticating,
      isError: isAuthError,
      error: authError,
    },
  ] = useGetAuthenticateMutation();

  const showErrorMessage = (error: any) => {
    const message =
      error?.data?.message || "Something went wrong. Please try again.";
    messageApi.error(message);
  };

  const handleAuthSuccess = (data: any) => {
    if (!data?.data) return;

    const { token, user, refreshToken } = data.data;

    dispatch(setToken(token));
    dispatch(setUser(user));
    dispatch(setRefreshToken(refreshToken));

    setToLocalStorage("token", token);
    setArrayToLocalStorage("user", user);
    setToLocalStorage("refreshToken", refreshToken);

    navigate("/");
  };

  const handleEmailSubmit = (values: FormValues) => {
    if (values.email) {
      setEmail(values.email);
      requestOtp({ email: values.email });
    }
  };

  const handleOtpSubmit = (values: FormValues) => {
    if (values.otp) {
      verifyOtp({ otp: values.otp, email });
    }
  };

  const handlePasswordSubmit = (values: FormValues) => {
    if (values.password) {
      authenticate({ password: values.password, email });
    }
  };

  useEffect(() => {
    if (isOtpError && otpError) showErrorMessage(otpError);
  }, [isOtpError, otpError]);

  useEffect(() => {
    if (isVerifyError && verifyError) showErrorMessage(verifyError);
  }, [isVerifyError, verifyError]);

  useEffect(() => {
    if (isAuthError && authError) showErrorMessage(authError);
  }, [isAuthError, authError]);

  useEffect(() => {
    if (otpData) setAuthType("OTP");
  }, [otpData]);

  useEffect(() => {
    if (verifyData) {
      setAuthType(
        verifyData?.data?.isFirstLogin ? "CREATE_PASSWORD" : "PASSWORD",
      );
    }
  }, [verifyData]);

  useEffect(() => {
    if (authData) handleAuthSuccess(authData);
  }, [authData]);

  const isLoading = isRequestingOtp || isVerifyingOtp || isAuthenticating;

  const EmailForm = () => (
    <Form
      name="email_form"
      initialValues={{ email: "" }}
      onFinish={handleEmailSubmit}
      layout="vertical"
    >
      <Typography.Text>Enter your email to login</Typography.Text>
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            type: "email",
            message: "Please input a valid email",
          },
        ]}
      >
        <Input placeholder="Email" size="large" />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="login-form-button"
          size="large"
          block
        >
          Continue
        </Button>
      </Form.Item>
    </Form>
  );

  const OtpForm = () => (
    <Form name="otp_form" layout="vertical" onFinish={handleOtpSubmit}>
      <Typography.Text>{`OTP sent to ${email}`}</Typography.Text>
      <Form.Item
        name="otp"
        rules={[{ required: true, message: "Please enter the OTP" }]}
      >
        <Input placeholder="Enter OTP" size="large" />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="login-form-button"
          size="large"
          block
        >
          Verify OTP
        </Button>
      </Form.Item>
    </Form>
  );

  const CreatePasswordForm = () => (
    <Form
      name="create_password_form"
      layout="vertical"
      onFinish={handlePasswordSubmit}
    >
      <Typography.Text>Create a new password</Typography.Text>
      <Form.Item
        name="password"
        rules={[
          { required: true, message: "Please enter your password" },
          { min: 8, message: "Password must be at least 8 characters long" },
          {
            pattern:
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            message:
              "Password must contain uppercase, lowercase, number and special character",
          },
        ]}
        label="New password"
        hasFeedback
      >
        <Input.Password placeholder="Enter password" size="large" />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        dependencies={["password"]}
        label="Confirm password"
        hasFeedback
        rules={[
          { required: true, message: "Please confirm your password" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Passwords do not match"));
            },
          }),
        ]}
      >
        <Input.Password placeholder="Confirm password" size="large" />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="login-form-button"
          size="large"
          block
        >
          Create Account
        </Button>
      </Form.Item>
    </Form>
  );

  const PasswordForm = () => (
    <Form
      name="password_form"
      layout="vertical"
      onFinish={handlePasswordSubmit}
    >
      <Typography.Text>Enter your password</Typography.Text>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please enter your password" }]}
        label="Password"
      >
        <Input.Password placeholder="Enter your password" size="large" />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="login-form-button"
          size="large"
          block
        >
          Log in
        </Button>
      </Form.Item>
    </Form>
  );

  const renderAuthForm = () => {
    const forms = {
      EMAIL: <EmailForm />,
      OTP: <OtpForm />,
      CREATE_PASSWORD: <CreatePasswordForm />,
      PASSWORD: <PasswordForm />,
    };

    return forms[authType];
  };

  if (isAuthenticating && authType === "PASSWORD") {
    return <LoadingScreen />;
  }

  return (
    <>
      <Card
        style={{
          width: 400,
          maxWidth: "90vw",
          margin: "auto",
        }}
        title="Account Login"
        bordered
      >
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <Spin size="large" tip="Processing..." />
          </div>
        ) : (
          renderAuthForm()
        )}
      </Card>
      {contextHolder}
    </>
  );
};

export default Login;
