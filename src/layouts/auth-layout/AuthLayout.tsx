import { FC, ReactNode } from "react";

interface AuthLayoutProps {
  children?: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = (props) => {
  const { children } = props;
  return <div className="auth-layout">{children}</div>;
};

export default AuthLayout;
