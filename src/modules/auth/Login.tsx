import { Button, Card, Checkbox, Form, Input } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useGetAuthenticateMutation } from "../../store/api/authApiSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../../store/reducers/authSlice";
import { useNavigate } from "react-router";
import { setArrayToLocalStorage, setToLocalStorage } from "../../utils/helpers";
import LoadingScreen from "../../components/loading-screen/LoadingScreen";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [getAuthenticate, { data: authData, isLoading, isSuccess, isError }] =
    useGetAuthenticateMutation();

  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
    getAuthenticate(values);
  };

  useEffect(() => {
    if (isSuccess && authData) {
      console.log({ authData });
      dispatch(setToken(authData?.data.token));
      dispatch(setUser(authData?.data.user));
      setToLocalStorage("token", authData?.data.token);
      setArrayToLocalStorage("user", authData?.data.user);
      navigate("/");
    }
  }, [isSuccess]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Card style={{ width: 300 }}>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
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
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <a className="login-form-forgot" href="">
            Forgot password
          </a>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
          Or <a href="">register now!</a>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Login;
