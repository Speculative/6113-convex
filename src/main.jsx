import { StrictMode } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Global, css } from '@emotion/react';

const address = import.meta.env.VITE_CONVEX_URL;

const convex = new ConvexReactClient(address);

ReactDOM.render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <Global styles={css`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html, body, #root {
          width: 100%;
          height: 100%;
          overflow: hidden;
          font-family: Roboto, sans-serif;
        }
      `} />
      <App />
    </ConvexProvider>
  </StrictMode>,
  document.getElementById("root")
);
