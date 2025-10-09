import React from 'react'
import { useState,useEffect } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ProductDetails({handleAddtoCart}) {
    const { id } = useParams(); // grabs :id from URL
    const [product, setProduct] = useState(null); 

    useEffect(() => {
    axios.get(`https://fakestoreapi.com/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error('Error fetching product:', err));
    }, [id]);

  if (!product) {
    return <div className="text-center mt-5 text-dark">Loading...</div>;
  }
  return (
    <div>
       <div className="container mt-5 text-dark text-center" >
            <img  src={product.image} alt={product.title} style={{ maxHeight: '300px', objectFit:'contain'  }} />
            <h2  className="mt-4">{product.title}</h2>
            <p  className="mt-2">{product.description}</p>
            <h4  className="mt-3">₹ {product.price}</h4>
          <button  onClick={()=>{handleAddtoCart(product) ; toast.success("Added to cart " ,{ position: "top-right", autoClose: 500, hideProgressBar: true} ) ;}} className="btn btn-success mt-3">Add to Cart</button>
        
      </div>
    </div>
   
  )
}

//  style={{backgroundColor:'#c5e1a5'}}