import { Button, Card, Checkbox, Form, Input, Spin, Typography } from "antd";
import { UserOutlined, LockOutlined, KeyOutlined } from "@ant-design/icons";
import {
  useAuthVerifyOtpMutation,
  useGetAuthenticateMutation,
  useGetAuthOtpMutation,
} from "../../store/api/authApiSlice";
import { use, useEffect, useState } from "react";
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

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [
    getAuthOtp,
    {
      data: otpData,
      isLoading: isOtpLoading,
      isSuccess: isOtpSuccess,
      isError: isOtpError,
    },
  ] = useGetAuthOtpMutation();
  const [getAuthenticate, { data: authData, isLoading, isSuccess, isError }] =
    useGetAuthenticateMutation();
  const [
    verifyOtp,
    {
      data: verifyData,
      isLoading: isVerifyLoading,
      isSuccess: isVerifySuccess,
      isError: iVerifyError,
    },
  ] = useAuthVerifyOtpMutation();

  const [authType, setAuthType] = useState<AuthType>("EMAIL");
  const [email, setEmail] = useState<string>("");

  const onSubmitEmail = (values: any) => {
    setEmail(values.email);
    getAuthOtp(values);
  };

  const onSubmitOtp = (values: any) => {
    verifyOtp({ ...values, email: email });
  };

  const onSubmitPassword = (values: any) => {
    getAuthenticate({ ...values, email: email });
  };

  useEffect(() => {
    if (isOtpSuccess) {
      setAuthType("OTP");
    }
  }, [isOtpSuccess]);

  useEffect(() => {
    if (isVerifySuccess && verifyData) {
      if (verifyData?.data?.isFirstLogin) {
        setAuthType("CREATE_PASSWORD");
      } else {
        setAuthType("PASSWORD");
      }
    }
  }, [isVerifySuccess]);

  useEffect(() => {
    if (isSuccess && authData) {
      console.log({ authData });
      dispatch(setToken(authData?.data.token));
      dispatch(setUser(authData?.data.user));
      dispatch(setRefreshToken(authData?.data.refreshToken));
      setToLocalStorage("token", authData?.data.token);
      setArrayToLocalStorage("user", authData?.data.user);
      navigate("/");
    }
  }, [isSuccess]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const EmailForm = () => {
    return (
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          email: "",
        }}
        onFinish={onSubmitEmail}
      >
        <Typography>Enter your email to login</Typography>
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Please input your email!",
            },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Email" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
        </Form.Item>
      </Form>
    );
  };

  const OtpForm = () => {
    return (
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          otp: "",
          email: email,
        }}
        onFinish={onSubmitOtp}
      >
        <Typography>OTP sent to {email}!</Typography>
        <Form.Item
          name="otp"
          rules={[
            {
              required: true,
              message: "Please enter otp!",
            },
          ]}
        >
          <Input prefix={<KeyOutlined />} placeholder="OTP" />
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
    );
  };

  const CreatePasswordForm = () => {
    return (
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          email: email,
          password: "",
        }}
        onFinish={onSubmitPassword}
      >
        <Typography>Enter new password to login</Typography>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Please enter your password" },
            { min: 6, message: "Password must be at least 6 characters long" },
          ]}
          hasFeedback
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>

        <Typography>Confirm your password</Typography>
        <Form.Item
          name="confirmPassword"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Please confirm your password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
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
            Log in
          </Button>
        </Form.Item>
      </Form>
    );
  };

  const PasswordForm = () => {
    return (
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          email: email,
          password: "",
        }}
        onFinish={onSubmitPassword}
      >
        <Typography>Enter your password to login</Typography>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Please enter your password" },
            { min: 6, message: "Password must be at least 6 characters long" },
          ]}
          hasFeedback
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
        </Form.Item>
      </Form>
    );
  };

  const onRenderForm = () => {
    switch (authType) {
      case "EMAIL":
        return <EmailForm />;
      case "OTP":
        return <OtpForm />;
      case "CREATE_PASSWORD":
        return <CreatePasswordForm />;
      case "PASSWORD":
        return <PasswordForm />;
      default:
        return <EmailForm />;
    }
  };

  return (
    <>
      {isLoading || isOtpLoading || isVerifyLoading ? (
        <Spin tip="Loading" size="large">
          <Card
            style={{
              width: 300,
              height: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {onRenderForm()}
          </Card>
        </Spin>
      ) : (
        <Card
          style={{
            width: 300,
            height: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {onRenderForm()}
        </Card>
      )}
    </>
  );
};

export default Login;
