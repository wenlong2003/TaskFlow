import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Settings.css";

function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const { logout } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [deleteUsername, setDeleteUsername] = useState("");
  const [deletePassword, setDeletePassword] = useState("");

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      setUsername(parsedUser.username || "");
      setEmail(parsedUser.email || "");
    }
  }, []);

  const handleChangePassword = async () => {
    try {
      const res = await fetch("/api/user/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to update password");
        return;
      }

      alert("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      alert("Error updating password");
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteUsername !== username) {
      alert("Username does not match your account");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete your account? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      const verifyRes = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: deleteUsername,
          password: deletePassword,
        }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        alert(verifyData.error || "Incorrect password");
        return;
      }

      const deleteRes = await fetch("/api/user", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const deleteData = await deleteRes.json();

      if (!deleteRes.ok) {
        alert(deleteData.error || "Failed to delete account");
        return;
      }

      alert("Account deleted successfully");

      logout();
      navigate("/", { replace: true });
    } catch (err) {
      alert("Error deleting account");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div>
            <h2>Profile</h2>
            <p>Your account information.</p>

            <div className="profile-info">
              <label>Username</label>
              <div className="profile-value">{username}</div>
            </div>

            <div className="profile-info">
              <label>Email</label>
              <div className="profile-value">{email}</div>
            </div>
          </div>
        );

      case "security":
        return (
          <div>
            <h2>Security</h2>
            <p>Update your password and security settings.</p>

            <input
              placeholder="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <input
              placeholder="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button
              className="save-btn"
              onClick={handleChangePassword}
            >
              Update Password
            </button>
          </div>
        );

      case "danger":
        return (
          <div>
            <h2>Delete Account</h2>
            <p>
              Permanently delete your account and all associated data.
            </p>

            <input
              placeholder="Confirm Username"
              value={deleteUsername}
              onChange={(e) => setDeleteUsername(e.target.value)}
            />

            <input
              placeholder="Confirm Password"
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
            />

            <button
              className="delete-account-btn"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
  <div className="settings-page"> 
    <div className="settings-layout">
      <main className="settings-sidebar">
        <button 
          className={activeTab === "profile" ? "active" : ""} 
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
        <button 
          className={activeTab === "security" ? "active" : ""} 
          onClick={() => setActiveTab("security")}
        >
          Security
        </button>
        <button
          className={activeTab === "danger" ? "active danger-tab" : "danger-tab"}
          onClick={() => setActiveTab("danger")}
        >
          Delete Account
        </button>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </main>

      <aside className="settings-content">
        {renderContent()}
      </aside>
    </div>
  </div>
);
}

export default Settings;