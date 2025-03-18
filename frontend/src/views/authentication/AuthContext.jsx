import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    isAuthenticated: false,
    role: null,  // Menyimpan role pengguna
  });

  useEffect(() => {
    // Cek token dan role di localStorage
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      setState({ isAuthenticated: true, role });
    }
  }, []);

  const login = (token, role) => {
    // Setelah login berhasil, set token dan role
    localStorage.setItem("token", token); // Simpan token
    localStorage.setItem("role", role); // Simpan role
    console.log(localStorage.getItem("role"));

    setState({ isAuthenticated: true, role });
  };

  const logout = () => {
    // Logout dan hapus token dan role
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setState({ isAuthenticated: false, role: null });
  };

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
