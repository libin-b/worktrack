export function getUserRole({ saveNormalized = false } = {}) {
  const raw = localStorage.getItem("user_role");
  let role = "";
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      role = (parsed || "").toString();
    } catch {
      role = raw.toString();
    }
    role = role.trim().replace(/^"+|"+$/g, "").toLowerCase();
    if (saveNormalized && role && role !== raw) {
      try {
        localStorage.setItem("user_role", role);
      } catch {
        // ignore write errors
      }
    }
  }
  return {
    rawUserRole: raw,
    userRole: role,
    isEmployee: role === "employee",
    isHR: role === "hr",
    isManager: role === "manager"
  };
}