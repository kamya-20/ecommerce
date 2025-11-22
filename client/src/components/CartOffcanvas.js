import React, { useState } from "react";

export default function CartOffcanvas({ cartItems, handleRemove, handleQuantityChange, user }) {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  // const handleCheckout = () => {
  //   if (!user) {
  //     setMessage("⚠️ Please login to place your order!");
  //   } else {
  //     setMessage("✅ Order placed successfully!");
  //     // 👇 yaha backend ko call karke order save bhi kar sakti ho
  //     // await fetch("/orders", {method:"POST", body: JSON.stringify(cartItems)})
  //   }
  //   setShowPopup(true);
  // };

  const handleCheckout = async () => {
    if (!user) {
      setMessage("⚠️ Please login to place your order!");
      setShowPopup(true);
      return;
    }
    if (total === 0) {
      setMessage("⚠️ Please select items to place your order!");
      setShowPopup(true);
      return;
    }

    try {
      const response = await fetch("https://cartify-56ii.onrender.com/api/order/place", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // your JWT
        },
        body: JSON.stringify({
          email: user.email, // 👈 add this line
          items: cartItems,
          total,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("✅ Order placed successfully! Check your email 📧");
      } else {
        setMessage("❌ Failed to place order. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Something went wrong. Try again later.");
    }

    setShowPopup(true);
  };

  return (
    <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasCart" aria-labelledby="offcanvasCartLabel" data-bs-backdrop="static" style={{ width: "35vw" }}>
      <div className="offcanvas-header">
        <h5 id="offcanvasCartLabel">Shopping Cart</h5>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div className="offcanvas-body">
        {cartItems.length === 0 ? (
          <p className="text-muted">Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="d-flex mb-3 align-items-center border-bottom pb-2">
              <img src={item.image} alt={item.title} style={{ width: "60px", height: "60px", objectFit: "contain" }} className="me-3" />
              <div className="flex-grow-1">
                <h6 className="mb-1">{item.title}</h6>
                <p className="mb-1">₹{item.price}</p>

                <div className="d-flex align-items-center">
                  <i className="bi bi-cart-dash-fill mx-2 text-secondary" style={{ fontSize: "1.5rem", cursor: "pointer" }} onClick={() => handleQuantityChange(item.id, item.quantity - 1)}></i>
                  <span className="mx-2">{item.quantity}</span>
                  <i className="bi bi-cart-plus-fill mx-2 text-secondary" style={{ fontSize: "1.5rem", cursor: "pointer" }} onClick={() => handleQuantityChange(item.id, item.quantity + 1)}></i>
                </div>
              </div>
              <i class="bi bi-x-square-fill" onClick={() => handleRemove(item.id)} style={{ cursor: "pointer", color: "red", fontSize: "1.4rem" }}></i>
            </div>
          ))
        )}

        <div className="mt-3  w-100 btn-lg">
          <h5>Total: ₹{total}</h5>
          <button className="btn btn-success w-100 mt-3" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
          {/* Popup Overlay */}
          {showPopup && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.5)", // black transparent bg
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
              }}>
              <div
                style={{
                  background: "white",
                  padding: "30px",
                  borderRadius: "12px",
                  textAlign: "center",
                  width: "300px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                }}>
                <h4>{message}</h4>
                <button className="btn btn-primary mt-3" onClick={() => setShowPopup(false)}>
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
