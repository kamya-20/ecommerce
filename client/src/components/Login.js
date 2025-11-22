import { useEffect } from "react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleGoogleResponse = async (response) => {
    console.log("Google response object:", response); // See everything Google sends
    const idToken = response.credential; // this is google ID token nd not jwt token
    console.log("ID Token received:", idToken); // Check if token exists

    try {
      const res = await fetch("https://cartify-56ii.onrender.com/auth/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Backend cookie set karega
        body: JSON.stringify({ token: idToken }),
      });

      if (res.ok) {
        // ✅ Profile API call bhi isi block ke andar karo
        const profileRes = await fetch("https://cartify-56ii.onrender.com/profile", {
          credentials: "include",
        });

        const data = await profileRes.json();
        console.log("User from profile:", data.user);

        setUser(data.user); // App.js ka user update hoga
        navigate("/"); // Home page pe redirect
      } else {
        const errorData = await res.json();
        console.error("Login failed:", errorData.message);
      }
    } catch (error) {
      console.error("Error during Google login:", error);
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

  const handleGoogleLogin = () => {
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
          <h1 className="text-center">Login</h1>
          <form>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Email address
              </label>
              <input type="email" className="form-control" id="exampleInputEmail1" placeholder="Enter your email" aria-describedby="emailHelp" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Password
              </label>
              <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-success w-100">
              Login
            </button>
          </form>

          {/* Divider */}
          <div className="d-flex align-items-center my-4">
            <hr className="flex-grow-1" />
            <span className="mx-2 text-muted">Or continue with</span>
            <hr className="flex-grow-1" />
          </div>

          {/* Google Button */}
          <button className="btn border d-flex align-items-center justify-content-center gap-2 w-100 py-2" style={{ borderRadius: "10px" }} onClick={handleGoogleLogin}>
            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google G logo" width="20" />

            <span className="fw-semibold">Sign in with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// onSubmit={handleLogin}
//   const handleLogin = async(e)=>{
//     e.preventDefault();
//     try{
//       const res =await axios.post('http://localhost:5000/api/users/login',{
//         email,password
//       });
//       alert(res.data.msg);

//     // Clear the input fields
//     setEmail('');
//     setPassword('');
//     }
//     catch(err){
//       console.error("Login failed:",err);
//       alert("Invalid credentials or server error");
//     }
//   };

//   try {
//     const res = await fetch("http://localhost:5000/auth/google-login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include", // So backend can set cookies
//       body: JSON.stringify({ token: idToken }),
//     });

//     // const data = await res.json();
//     if (res.ok) {
//       // ✅ cookie set ho gayi, ab profile fetch karo
//       const profileRes = await fetch("http://localhost:5000/profile", {
//         credentials: "include",
//       });
//     }
//     const data = await profileRes.json();
//       console.log("User from profile:", data.user);
//       setUser(data.user);
//       navigate("/");
//     else {
//       console.error("Login failed:", data.message);
//     }
//   } catch (error) {
//     console.error("Error during Google signup:", error);
//   }
// };
