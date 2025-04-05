import * as React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { Flex, Layout, Spin } from "antd";
import { logout, setToken, setUser } from "../../store/reducers/authSlice";
import LoadingScreen from "../../components/loading-screen/LoadingScreen";

const Logout = (props: { isMsal?: boolean }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    onLogout().then((r) => navigate("/"));
  }, []);

  const onLogout = async () => {
    dispatch(logout());
    localStorage.clear();
    setTimeout(() => {
      navigate("/");
    }, 300);
  };
  return (
    <>
      <LoadingScreen />
    </>
  );
};

export default Logout;
