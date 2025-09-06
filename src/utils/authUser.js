import { jwtDecode } from "jwt-decode";

export const getAuthUser = () => {
  const token = localStorage.getItem("auth_token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return {
      id: decoded.id,
      name: decoded.sub,
      role: decoded.role,
    };
  } catch (err) {
    console.error("Failed to decode token:", err);
    return null;
  }
};
