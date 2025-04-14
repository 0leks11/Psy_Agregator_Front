import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import api from "../services/api"; // Your configured axios instance

interface User {
  id: string;
  email: string;
  role: "user" | "therapist";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: any, role: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("authToken")
  );
  const [loading, setLoading] = useState(true); // Check auth on initial load

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        api.defaults.headers.common["Authorization"] = `Token ${token}`; // Or Bearer for JWT
        try {
          // Replace with your actual endpoint to verify token/get user data
          const response = await api.get("/api/auth/user/"); // Example endpoint
          setUser(response.data);
        } catch (error) {
          console.error("Auth Error:", error);
          localStorage.removeItem("authToken");
          setToken(null);
          setUser(null);
          delete api.defaults.headers.common["Authorization"];
        }
      }
      setLoading(false);
    };
    verifyToken();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/api/auth/login/", {
        email: email, // Используем email вместо username
        password,
      });
      const token = response.data.token;
      localStorage.setItem("authToken", token);
      setToken(token);

      // Get user data after successful login
      const userResponse = await api.get("/api/auth/user/");
      setUser(userResponse.data);

      api.defaults.headers.common["Authorization"] = `Token ${token}`;
      return true;
    } catch (error) {
      console.error("Login Error:", error);
      return false;
    }
  };

  const register = async (userData: any, role: string) => {
    try {
      const endpoint =
        role === "therapist"
          ? "/api/auth/register/therapist/"
          : "/api/auth/register/client/";

      console.log(`Отправка на ${endpoint}:`, userData);
      const response = await api.post(endpoint, userData);

      const token = response.data.token;
      localStorage.setItem("authToken", token);
      setToken(token);
      setUser(response.data.user);
      api.defaults.headers.common["Authorization"] = `Token ${token}`;
      return true;
    } catch (error) {
      console.error("Register Error:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common["Authorization"];
    // Optional: Call backend logout endpoint if needed
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}{" "}
      {/* Render children only after initial auth check */}
    </AuthContext.Provider>
  );
};

// Custom Hook to use Auth context easily
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
