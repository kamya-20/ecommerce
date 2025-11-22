import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("https://cartify-56ii.onrender.com/profile", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
      });
  }, []);

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg border-0 rounded-3">
            <div className="card-header text-white text-center py-4" style={{ backgroundColor: "#004B3C" }}>
              <h3 className="mb-0">👤 User Dashboard</h3>
            </div>

            <div className="card-body p-4">
              {user ? (
                <div>
                  <h4 className="fw-bold text-center mb-3">Welcome, {user.name} 🎉</h4>
                  <p className="text-muted text-center">Here are your account details:</p>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <i className="bi bi-envelope-fill text-success me-2"></i>
                      <strong>Email:</strong> {user.email}
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="text-center py-5">
                  <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3">Fetching your profile...</p>
                </div>
              )}
            </div>

            <div className="card-footer text-center">
              <button className="btn btn-outline-danger">
                <i className="bi bi-box-arrow-right me-2"></i> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
