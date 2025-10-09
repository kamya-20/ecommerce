import React, { use } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import { useState, useEffect } from "react";
import axios from "axios";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Cart from "./components/Cart";
import ProductDetails from "./components/ProductDetails";
import CartOffcanvas from "./components/CartOffcanvas";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from "./components/Profile";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    axios
      .get("https://fakestoreapi.com/products")
      .then((res) => {
        setProducts(res.data.slice(0, 18));
      })
      .catch((err) => {
        console.error("Error fetching products", err);
      });
  }, []);

  const [cartItems, setCartItems] = useState([]);

  const handleRemove = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id, quantity) => {
    if (quantity <= 0) return;
    setCartItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

  // add to cart Logic
  const handleAddtoCart = (product) => {
    setCartItems((prevItems) => {
      // check if the product already exists in the cart
      const existing = prevItems.find((item) => item.id === product.id);
      // just inc quantity
      if (existing) {
        return prevItems.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      //  a new item is added
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  // search logic
  const [searchQuery, setsearchQuery] = useState("");
  const [user, setUser] = useState(null); // 🔹 global user state

  return (
    <div>
      <Router>
        <ToastContainer position="top-right" autoClose={1500} hideProgressBar={true} newestOnTop={false} closeOnClick pauseOnHover draggable />
        <Navbar cartItems={cartItems} searchQuery={searchQuery} setsearchQuery={setsearchQuery} user={user} setUser={setUser} setCartItems={setCartItems} />
        <Routes>
          <Route
            exact
            path="/"
            element={
              <>
                <main className="container  text-center" style={{ minHeight: "75vh" }}>
                  <h2 className=" mb-4" style={{ fontSize: "2.2rem", color: "#004B3C", borderBottom: "3px solid #004B3C", display: "inline-block", paddingBottom: "10px" }}>
                    Featured Products
                  </h2>
                  <div className="row g-4">
                    {(() => {
                      const filteredProducts = products.filter((product) => {
                        const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                        const pattern = new RegExp(`\\b${escapedQuery}`, "i");
                        // here i means ignore case , Match text without worrying about UPPERCASE or lowercase letters.
                        return pattern.test(product.title.toLowerCase()) || pattern.test(product.description.toLowerCase());
                      });

                      if (filteredProducts.length === 0) {
                        return (
                          <div className="text-center mt-5 w-100 text-muted" style={{ fontSize: "1.2rem" }}>
                            No products found for your search
                          </div>
                        );
                      }
                      return filteredProducts.map((product) => (
                        <div className="col-md-4" key={product.id}>
                          <ProductCard title={product.title} image={product.image} price={product.price} id={product.id} onAddtoCart={handleAddtoCart} product={product} />
                        </div>
                      ));
                    })()}
                  </div>
                </main>
                <Footer />
              </>
            }></Route>
          <Route exact path="/login" element={<Login setUser={setUser} />}></Route>
          <Route exact path="/signup" element={<Signup setUser={setUser} />}></Route>
          <Route exact path="/profile" element={<Profile />}></Route>

          <Route exact path="/product/:id" element={<ProductDetails handleAddtoCart={handleAddtoCart} />}></Route>
        </Routes>
        <CartOffcanvas cartItems={cartItems} handleRemove={handleRemove} handleQuantityChange={handleQuantityChange} user={user} />
      </Router>
    </div>
  );
}

{
  /* <Route exact path="/cart" element={<Cart cartItems={cartItems}/>}></Route> */
}
