import "./Toast.css";

function Toast({ show, message, type = "success" }) {
  if (!show) return null;

  const icons = {
    success: "✓",
    wishlist: "♥",
    error: "✕",
    warning: "⚠"
  };

  const titles = {
    success: "Success",
    wishlist: "Wishlist",
    error: "Error",
    warning: "Warning"
  };

  return (
    <div className={`toast ${type}`}>
      <div className="toast-icon">
        {icons[type]}
      </div>

      <div className="toast-content">
        <strong>{titles[type]}</strong>
        <p>{message}</p>
      </div>

      <div className="toast-progress"></div>
    </div>
  );
}

export default Toast;