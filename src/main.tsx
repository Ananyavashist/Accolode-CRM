import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { BrokerProvider } from "./store/BrokerContext";
import { CrmProvider } from "./store/CrmContext";
import { DashboardPeriodProvider } from "./store/DashboardPeriodContext";
import { UiProvider } from "./store/UiContext";
import { startRevealScrollbar } from "./lib/revealScrollbar";
import "./index.css";
import { bootstrapDemoOnPageLoad } from "./lib/demoBootstrap";

bootstrapDemoOnPageLoad();
startRevealScrollbar();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <BrokerProvider>
        <CrmProvider>
          <DashboardPeriodProvider>
            <UiProvider>
              <App />
            </UiProvider>
          </DashboardPeriodProvider>
        </CrmProvider>
      </BrokerProvider>
    </BrowserRouter>
  </StrictMode>,
);
