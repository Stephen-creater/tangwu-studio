import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            background: "#18120e",
            color: "#f8f0df",
            padding: "24px"
          }}
        >
          <div
            style={{
              width: "min(720px, 100%)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "24px",
              padding: "24px",
              background: "rgba(33,25,20,0.92)"
            }}
          >
            <h1 style={{ marginTop: 0, fontSize: "32px" }}>页面运行出错</h1>
            <p style={{ lineHeight: 1.7 }}>当前页面在渲染时抛出了错误，已停止渲染。</p>
            <pre
              style={{
                whiteSpace: "pre-wrap",
                lineHeight: 1.6,
                margin: 0,
                color: "#f3d4c4"
              }}
            >
              {String(this.state.error?.stack || this.state.error)}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </React.StrictMode>
);
