import { CssBaseline, ThemeProvider } from '@mui/material';
import { useRoutes } from 'react-router-dom';
import Router from './routes/Router';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

const originalAddEventListener = EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = function (type, listener, options) {
    if (type === 'DOMNodeInserted') {
        console.warn(`Skipped deprecated event: ${type}`);
        return;
    }
    return originalAddEventListener.call(this, type, listener, options);
};

import { baselightTheme } from "./theme/DefaultColors";
import { AuthProvider } from './views/authentication/AuthContext';

function App() {
  
  const routing = useRoutes(Router);
  const theme = baselightTheme;

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {routing}
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App