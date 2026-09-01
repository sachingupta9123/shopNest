import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    try {
      const savedUser = sessionStorage.getItem("user");

      return savedUser ? JSON.parse(savedUser) : null;

    } catch (error) {

      console.warn(
        "Stored login session could not be read and was cleared."
      );

      sessionStorage.removeItem("user");

      return null;
    }
  });


  // LOGIN
  const login = (userData) => {

    setUser(userData);

    sessionStorage.setItem(
      "user",
      JSON.stringify(userData)
    );
  };


  // LOGOUT
  const logout = () => {

    setUser(null);

    sessionStorage.removeItem("user");
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;