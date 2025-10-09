// import React from "react";
// import { Link } from "react-router-dom";
// export default function Navbar({ cartItems, searchQuery, setsearchQuery }) {
//   const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
//   return (
//     <>
//       <nav className="navbar py-3 navbar-expand-lg sticky-top " style={{ backgroundColor: "#004B3C" }}>
//         <div className="container-fluid">
//           <Link
//             to="/"
//             className="navbar-brand text-white"
//             onClick={() => {
//               setsearchQuery("");
//             }}>
//             Cartify
//           </Link>

//           {/* Toggler for mobile screens */}
//           <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
//             <span className="navbar-toggler-icon"></span>
//           </button>

//           <div className="collapse navbar-collapse" id="navbarSupportedContent">
//             <ul className="navbar-nav me-auto mb-2 mb-lg-0">
//               <li className="nav-item">
//                 <form className="d-flex ms-5" onSubmit={(e) => e.preventDefault()}>
//                   <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" value={searchQuery} onChange={(e) => setsearchQuery(e.target.value)} style={{ width: "350px", height: "35px" }} />

//                   <button className="btn" type="button" style={{ color: "white", border: "none", fontSize: "20px" }}>
//                     <i className="bi bi-search"></i>
//                   </button>
//                 </form>
//               </li>
//             </ul>

//             <div className="d-flex align-items-center gap-3">
//               <div className="position-relative" data-bs-toggle="offcanvas" data-bs-target="#offcanvasCart" style={{ cursor: "pointer", width: "30px" }}>
//                 <i className="bi bi-cart" style={{ fontSize: "1.5rem", color: "white" }}></i>
//                 {totalQuantity > 0 && (
//                   <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: "0.7rem", padding: "4px 7px" }}>
//                     {totalQuantity}
//                   </span>
//                 )}
//               </div>

//               <Link to="/login" className="btn btn-outline-light">
//                 Login
//               </Link>
//               <Link to="/signup" className="btn btn-light text-dark">
//                 Signup
//               </Link>
//             </div>
//           </div>
//         </div>
//       </nav>
//     </>
//   );
// }

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Navbar({ cartItems, searchQuery, setsearchQuery, user, setUser, setCartItems }) {
  // const [user, setUser] = useState(null); // 👈 track logged in user

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Fetch user info when navbar loads

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/profile", {
          credentials: "include", // send cookie
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error("Not logged in");
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch("http://localhost:5000/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null); // remove from UI
    setCartItems([]); // cart empty
    toast.success("Logged out ", { position: "top-right", autoClose: 500, hideProgressBar: true, style: { background: "#E9FFF1", color: "#004B3C", fontWeight: "500", fontSize: "0.95rem", borderRadius: "8px", boxShadow: "0px 2px 10px rgba(0,0,0,0.1)" } });
  };

  return (
    <nav className="navbar py-3 navbar-expand-lg sticky-top " style={{ backgroundColor: "#004B3C" }}>
      <div className="container-fluid">
        <Link to="/" className="navbar-brand text-white" onClick={() => setsearchQuery("")}>
          Cartify
        </Link>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {/* Search Bar */}
          <form className="d-flex ms-5" onSubmit={(e) => e.preventDefault()}>
            <input className="form-control me-2" type="search" placeholder="Search" value={searchQuery} onChange={(e) => setsearchQuery(e.target.value)} style={{ width: "350px", height: "35px" }} />
          </form>

          <div className="d-flex align-items-center ms-auto gap-3">
            {/* Cart */}
            <div className="position-relative" data-bs-toggle="offcanvas" data-bs-target="#offcanvasCart" style={{ cursor: "pointer", width: "30px" }}>
              <i className="bi bi-cart" style={{ fontSize: "1.5rem", color: "white" }}></i>
              {totalQuantity > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: "0.7rem", padding: "4px 7px" }}>
                  {totalQuantity}
                </span>
              )}
            </div>

            {/* Show login/signup OR user profile */}
            {!user ? (
              <>
                <Link to="/login" className="btn btn-outline-light">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-light text-dark">
                  Signup
                </Link>
              </>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <div
                  style={{
                    width: "35px",
                    height: "35px",
                    borderRadius: "50%",
                    backgroundColor: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    color: "#004B3C",
                    cursor: "pointer",
                  }}>
                  {user.name?.[0] || user.email[0]}
                </div>
                <button onClick={handleLogout} className="btn" style={{ backgroundColor: "#d71010ff", color: "white", border: "none" }}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
