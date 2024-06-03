import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authLogin } from "../api/auth";
import { jwtDecode } from "jwt-decode";
import Swal from 'sweetalert2'

const AuthContext = createContext({
  isAuth: localStorage.getItem("token") ? true : false,
  token: localStorage.getItem("token") || null,
  login: () => { },
  logout: () => { },
});

export const AuthProvider = ({ children }) => {
  const [token, setToken_] = useState(localStorage.getItem("token") || null);
  const [isAuth, setIsAuth] = useState(localStorage.getItem("token") ? true : false);
  const [loading, setLoading] = useState(false);
  const [authUser, setAuthUser] = useState({
    userId: 0,
    email: '',
    roleId: 0,
    user_picture: {
      destination: null,
      filename: null,
    }
  })

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    if (token) {
      setUserDecode(token)
    }
  }, [])

  const setUserDecode = (token) => {
    const { userId, email, roleId, userPicture } = jwtDecode(token);
    setAuthUser({ userId, email, roleId, userPicture });
    setToken_(token);
    setIsAuth(true);
  }

  const login = useMemo(() => (dataForm) => {
    setLoading(true);
    authLogin(dataForm)
      .then(({ auth, token }) => {
        setIsAuth(auth);
        if (auth && token) {
          setUserDecode(token)
        }
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.response?.data?.message,
        });
        setIsAuth(false);
        window.localStorage.removeItem("token");
      })
      .finally(() => setLoading(false))
  }, []);

  const logout = useMemo(() => () => {
    window.localStorage.removeItem('token');
    setIsAuth(false);
    setToken_(null)
  }, []);

  const contextValue = useMemo(() =>
    ({ token, loading, isAuth, authUser }),
    [token, loading, isAuth, authUser]
  );

  return (
    <AuthContext.Provider
      value={{ ...contextValue, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


