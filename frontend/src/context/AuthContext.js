import { createContext } from "react";

// Create the context
export const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
});
