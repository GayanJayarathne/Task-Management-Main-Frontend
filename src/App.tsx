import React, { useEffect, useState } from "react";
import { useRoutes } from "react-router";
import "./App.css";
import { routes } from "./routes";
import LoadingScreen from "./components/loading-screen/LoadingScreen";

const App = () => {
  const element = useRoutes(routes);
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsAppLoading(false), 1000);
    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  if (isAppLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <div className="App">{element}</div>
    </>
  );
};

export default App;
