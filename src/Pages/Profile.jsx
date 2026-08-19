import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile({ user, setUser }) {
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-box">
          <h1>Please Login</h1>

          <button
            className="edit-profile"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("shoppingWorldUser");
    setUser(null);
    navigate("/");
  };

  return (
    <div className="profile-container">
      <div className="profile-box">

        <div className="profile-icon">
          👤
        </div>

        <h1>My Profile</h1>

        <div className="profile-info">

          <div>
            <span>Name</span>
            <strong>{user.name}</strong>
          </div>

          <div>
            <span>Email</span>
            <strong>{user.email}</strong>
          </div>

          <div>
            <span>Phone</span>
            <strong>{user.phone}</strong>
          </div>

        </div>

        <div className="profile-buttons">

          <button className="edit-profile">
            ✏️ Edit Profile
          </button>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>

        </div>

      </div>
    </div>
  );
}

export default Profile;