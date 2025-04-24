import { useRoutes } from "react-router-dom";
import Router from "./routes/Router";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import { AuthProvider } from "./views/authentication/AuthContext";
import "./components/Font/Font.css";

const originalAddEventListener = EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = function (type, listener, options) {
    if (type === "DOMNodeInserted") {
        console.warn(`Skipped deprecated event: ${type}`);
        return;
    }
    return originalAddEventListener.call(this, type, listener, options);
};

function App() {
  const routing = useRoutes(Router);

  return (
    <AuthProvider>
      {routing}
    </AuthProvider>
  );
}

export default App;
