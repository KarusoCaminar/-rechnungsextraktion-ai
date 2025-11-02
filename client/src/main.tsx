import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { i18n } from "./lib/i18n";

// Initialize i18n on app load
i18n.detectLanguage();

createRoot(document.getElementById("root")!).render(<App />);
