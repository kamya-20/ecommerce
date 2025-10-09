import React from 'react'

export default function Cart({cartItems, onRemove = () => {}, onQuantityChange = () => {} }) {
  return (
    <div>
      <h2>Cart ({cartItems.length} items)</h2>
      {/* Display items */}
    </div>
  )
}

