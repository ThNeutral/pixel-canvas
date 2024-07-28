import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import { ColorProvider } from "./components/ColorProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ColorProvider />
  </React.StrictMode>
);
