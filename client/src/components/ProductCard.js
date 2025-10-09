import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function ProductCard({ title, price, image, id, onAddtoCart, product }) {
  return (
    <div className="card h-100" style={{ padding: "10px", cursor: "pointer", transition: "transform 0.3s ease" }} onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")} onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1")}>
      <Link to={`/product/${id}`}>
        <img src={image} className="card-img-top" alt={title} style={{ height: "200px", objectFit: "contain" }} />
      </Link>
      <div className="card-body">
        <h6 className="card-title">{title}</h6>
        <p className="card-text fw-bold">₹{price}</p>
        <button
          onClick={() => {
            onAddtoCart(product);
            toast.success("Added to cart ", { position: "top-right", autoClose: 500, hideProgressBar: true, style: { background: "#E9FFF1", color: "#004B3C", fontWeight: "500", fontSize: "0.95rem", borderRadius: "8px", boxShadow: "0px 2px 10px rgba(0,0,0,0.1)" } });
          }}
          className="btn text-white "
          style={{ background: "linear-gradient(to right, #00986F, #18B55B)" }}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
