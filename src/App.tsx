import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router";
import "./App.css";

const TaskModuleWrapper = () => {
  const TaskManagementModule = lazy(() =>
    import("task/TaskModule").catch((err) => {
      console.error("Error loading TaskModule:", err);
      return { default: () => <div>Error loading Task Module</div> };
    }),
  );

  return (
    <Suspense fallback={<div>Loading Task Management Module...</div>}>
      <TaskManagementModule />
    </Suspense>
  );
};

const Home = () => (
  <div style={{ padding: "20px" }}>
    <h2>Main App Home Page</h2>
    <p>This is the host application</p>
  </div>
);

const AboutPage = () => (
  <div style={{ padding: "20px" }}>
    <h2>About This App</h2>
    <p>
      This is a demonstration of Micro Frontend architecture using Module
      Federation.
    </p>
  </div>
);

function App() {
  return (
    <Router>
      <div className="App">
        <header
          style={{
            background: "#f0f0f0",
            padding: "15px",
            marginBottom: "20px",
          }}
        >
          <h1>Task Management Main App</h1>
          <nav>
            <Link to="/" style={{ marginRight: "15px" }}>
              Home
            </Link>
            <Link to="/about" style={{ marginRight: "15px" }}>
              About
            </Link>
            <Link to="/tasks">Tasks Management (Micro Frontend)</Link>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/tasks/*" element={<TaskModuleWrapper />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
