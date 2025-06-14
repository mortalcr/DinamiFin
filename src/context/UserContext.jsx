// src/context/UserContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext(null);

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    console.error("Error decodificando token:", e);
    return null;
  }
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = parseJwt(token);
      if (payload) {
        setUser({
          id: payload.user_id,
          email: payload.email,
          username: payload.username,
        });
      }
    }
    setLoading(false);
  }, []);

  const loginUser = (userInfo, token) => {
    const payload = parseJwt(token);
    if (payload) {
      const userData = {
        id: payload.user_id,
        email: payload.email,
        username: payload.username,
      };
      localStorage.setItem("token", token);
      setUser(userData);
    }
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, loginUser, logoutUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

