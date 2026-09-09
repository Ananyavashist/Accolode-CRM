import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CrmProvider } from "./store/CrmContext";
import { UiProvider } from "./store/UiContext";
import { startRevealScrollbar } from "./lib/revealScrollbar";
import "./index.css";

startRevealScrollbar();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <CrmProvider>
        <UiProvider>
          <App />
        </UiProvider>
      </CrmProvider>
    </BrowserRouter>
  </StrictMode>,
);
