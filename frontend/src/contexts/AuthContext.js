import { createContext, useEffect, useReducer } from "react";
import apiService from "../app/apiService";
import { isValidToken } from "../utils/jwt";

//INITIAL VALUE
const initialState = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
};
//CONSTANTS
const INITIALIZE = "AUTH.INITALIZE";
const LOGIN_SUCCESS = "AUTH.LOGIN_SUCCESS";
const REGISTER_SUCCESS = "AUTH.REGISTER_SUCCESS";
const LOGOUT = "AUTH.LOGOUT";
const UPDATE_PROFILE = "AUTH.UPDATE_PROFILE";
//REDUCER
const reducer = (state, action) => {
  switch (action.type) {
    case INITIALIZE:
      const { isAuthenticated, user } = action.payload;
      return { ...state, isInitialized: true, isAuthenticated, user };
    case LOGIN_SUCCESS:
      return { ...state, isAuthenticated: true, user: action.payload.user };
    case REGISTER_SUCCESS:
      return { ...state, isAuthenticated: true, user: action.payload.user };
    case LOGOUT:
      return { ...state, isAuthenticated: false, user: null };

    default:
      return state;
  }
};

const AuthContext = createContext({ ...initialState });

const setSession = (accessToken) => {
  if (accessToken) {
    window.localStorage.setItem("accessToken", accessToken); // lưu vào localStorage
    apiService.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    window.localStorage.removeItem("accessToken");
    delete apiService.defaults.headers.common.Authorization;
  }
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem("accessToken");
        //nếu người dùng hết hạn hoặc không tồn tại thì throw error ở catch
        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);

          const response = await apiService.get("/users/me");
          const user = response.data;
          dispatch({
            type: INITIALIZE,
            payload: { isAuthenticated: true, user },
          });
        } else {
          setSession(null);
          dispatch({
            type: INITIALIZE,
            payload: { isAuthenticated: false, user: null },
          });
        }
      } catch (error) {
        setSession(null);
        dispatch({
          type: INITIALIZE,
          payload: { isAuthenticated: false, user: null },
        });
      }
    };
    initialize();
  }, []);

  const login = async ({ username, password }, callback) => {
    const response = await apiService.post("/auth/login", {
      username,
      password,
    });
    const { user, accessToken } = response.data.data;

    setSession(accessToken);
    dispatch({ type: LOGIN_SUCCESS, payload: { user } });

    callback(); // callback điều hướng trang
  };

  const register = async (
    { username, name, phone, email, password },
    callback
  ) => {
    const response = await apiService.post("/users", {
      username,
      name,
      phone,
      email,
      password,
    });

    const { user, accessToken } = response.data.data;

    setSession(accessToken);
    dispatch({ type: REGISTER_SUCCESS, payload: { user } });

    callback(); // callback điều hướng trang
  };

  const logout = (callback) => {
    setSession(null);
    dispatch({ type: LOGOUT });
    callback();
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext };
