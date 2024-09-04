import React, { useState } from "react";

const PromotionCode = () => {
  // Static data for available promotion codes
  const availablePromoCodes = {
    SAVE10: 10,
    SAVE20: 20,
    SAVE30: 30,
  };

  // State to manage the input promo code and the applied discount
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [message, setMessage] = useState("");

  // Function to apply the promotion code
  const applyPromoCode = () => {
    const promoValue = availablePromoCodes[promoCode.toUpperCase()];
    if (promoValue) {
      setDiscount(promoValue);
      setMessage(`Promo code applied! You saved ${promoValue}%`);
    } else {
      setDiscount(0);
      setMessage("Invalid promo code. Please try again.");
    }
  };

  return (
    <div>
      <h2>Apply Promotion Code</h2>
      <input
        type="text"
        value={promoCode}
        onChange={(e) => setPromoCode(e.target.value)}
        placeholder="Enter promo code"
      />
      <button onClick={applyPromoCode}>Apply Code</button>
      {message && <p>{message}</p>}
      {discount > 0 && <p>Your discount: {discount}%</p>}
    </div>
  );
};

export default PromotionCode;
