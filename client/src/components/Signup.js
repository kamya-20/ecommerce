/* global google */
import { useNavigate } from "react-router-dom";

import { useEffect } from "react";
import React, { useState } from "react";

export default function Signup({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  // const handleGoogleResponse = async (response) => {
  //   const idToken = response.credential; // this is google ID token nd not jwt token

  //   try {
  //     const res = await fetch("http://localhost:5000/auth/google-signup", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       credentials: "include", // So backend can set cookies
  //       body: JSON.stringify({ token: idToken }),
  //     });

  //     const data = await res.json();
  //     if (res.ok) {
  //       navigate("/");
  //     } else {
  //       console.error("Signup failed:", data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error during Google signup:", error);
  //   }
  // };

  const handleGoogleResponse = async (response) => {
    const idToken = response.credential; // this is google ID token not jwt

    try {
      const res = await fetch("http://localhost:5000/auth/google-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Backend will set cookie
        body: JSON.stringify({ token: idToken }),
      });

      if (res.ok) {
        // ✅ Fetch profile after signup
        const profileRes = await fetch("http://localhost:5000/profile", {
          credentials: "include",
        });

        const data = await profileRes.json();
        console.log("User from profile (signup):", data.user);

        setUser(data.user); // update App.js user
        navigate("/"); // redirect to home
      } else {
        const errorData = await res.json();
        console.error("Signup failed:", errorData.message);
      }
    } catch (error) {
      console.error("Error during Google signup:", error);
    }
  };

  useEffect(() => {
    const initializeGoogle = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });
      } else {
        setTimeout(initializeGoogle, 100); // Wait until google is ready
      }
    };

    initializeGoogle();
  }, []);

  // Handle click on Google Sign up button
  const handleGoogleSignup = () => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.prompt(); // Show Google popup
    } else {
      console.error("Google API not loaded. Please wait and try again.");
    }
  };

  return (
    <div style={{ backgroundColor: "#c5e1a5" }}>
      <div className="container d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="card p-4" style={{ width: "30rem" }}>
          <h1 className="text-center">Create Account</h1>
          <form>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Email address
              </label>
              <input type="email" className="form-control" placeholder="Enter your email" id="exampleInputEmail1" aria-describedby="emailHelp" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Create new Password
              </label>
              <input type="password" className="form-control" placeholder="New Password" id="exampleInputPassword1" value={password} onChange={(e) => setPassword(e.target.value)} required />

              <label htmlFor="exampleInputPassword1" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
                required
              />
            </div>
            <button type="submit" className="btn btn-success w-100">
              Submit
            </button>
          </form>

          {/* Divider */}
          <div className="d-flex align-items-center my-4">
            <hr className="flex-grow-1" />
            <span className="mx-2 text-muted">Or continue with</span>
            <hr className="flex-grow-1" />
          </div>

          {/* Google Button */}
          <button className="btn border d-flex align-items-center justify-content-center gap-2 w-100 py-2" style={{ borderRadius: "10px" }} onClick={handleGoogleSignup}>
            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google G logo" width="20" />

            <span className="fw-semibold">Sign up with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// onSubmit={handleSubmit}
// const handleGoogleSignup = () => {
//   if (window.google && window.google.accounts) {
//     window.google.accounts.id.prompt((notification) => {
//       if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
//         console.error("Google Sign-In prompt was skipped or not displayed.");
//       }
//     });
//   } else {
//     console.error("Google API not loaded yet. Please wait and try again.");
//   }
// };

// callback: async (response) => {
//           const idToken = response.credential;

//           try {
//             const res = await fetch("http://localhost:5000/auth/google-login", {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               credentials: "include",
//               body: JSON.stringify({ token: idToken }),
//             });

//             const data = await res.json();
//             console.log("User data from backend:", data);
//           }
//            catch (error) {
//             console.error("Error during login:", error);
//           }
//         },
