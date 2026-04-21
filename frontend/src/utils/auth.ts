/**
 * Logs the user out by clearing all authentication-related data
 * and redirecting to the login page.
 */
export function logout() {
  // Clear all stored auth/session data
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("username");
  localStorage.removeItem("userId");

  // Optional safety cleanup (in case other keys exist)
  // localStorage.clear();

  // Redirect user to login page
  window.location.href = "/signin";
}