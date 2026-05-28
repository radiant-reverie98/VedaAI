import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../utils/api";

const AuthContext =
  createContext();

export const AuthProvider = ({
  children,
}) => {

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // FETCH CURRENT USER
  // =========================
  const fetchCurrentUser =
    async () => {

    try {

      const response =
        await api.get(
          "/auth/me"
          
        );

      setUser(
        response.data.user
      );

    } catch (error) {

      setUser(null);

    } finally {

      setLoading(false);

    }

  };

  // =========================
  // LOGOUT
  // =========================
  const logout = async () => {

    try {

      await api.post(
        "/auth/logout",
       
      );

      setUser(null);

    } catch (error) {

      console.log(error);

    }

  };

  // =========================
  // INITIAL AUTH CHECK
  // =========================
  useEffect(() => {

    fetchCurrentUser();

  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        logout,
        fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );

};

export const useAuth = () =>
  useContext(AuthContext);