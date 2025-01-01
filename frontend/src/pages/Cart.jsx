import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";

const Cart = () => {
  const { products, essentials, currency, cartItems, updateQuantity, navigate } =
    useContext(ShopContext);

  const [cartData, setCartData] = useState([]);
  const [showPasscode, setShowPasscode] = useState(false);
  const [enteredPasscode, setEnteredPasscode] = useState("");

  useEffect(() => {
    if (products.length > 0 || essentials.length > 0) {
      const tempData = [];
      let hasBestseller = false;

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });

            // Check for bestseller in both catalogs
            const productData = products.find(
              (product) => product._id === items
            );
            const essentialsData = essentials.find(
              (essential) => essential._id === items
            );
            if (
              (productData && productData.bestseller) ||
              (essentialsData && essentialsData.bestseller)
            ) {
              hasBestseller = true;
            }
          }
        }
      }

      setShowPasscode(hasBestseller);
      setCartData(tempData);
    }
  }, [cartItems, products, essentials]);

  const handlePasscodeChange = (e) => {
    setEnteredPasscode(e.target.value);
  };

  const handleCheckout = () => {
    if (showPasscode) {
      if (enteredPasscode === "KONIBAJE") {
        navigate("/place-order");
      } else {
        alert("Incorrect passcode.");
      }
    } else {
      navigate("/place-order");
    }
  };

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      <div>
        {cartData.map((item, index) => {
          const productData = products.find(
            (product) => product._id === item._id
          );
          const essentialsData = essentials.find(
            (essential) => essential._id === item._id
          );

          const data = productData || essentialsData;

          if (!data) return null; // Skip if no matching data is found

          return (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
            >
              <div className="flex items-start gap-6">
                <img
                  className="w-16 sm:w-20"
                  src={data.image[0]}
                  alt=""
                />
                <div>
                  <p className="text-xs sm:text-lg font-medium">
                    {data.name}
                  </p>
                  <div className="flex items-center gap-5 mt-2">
                    <p>
                      {currency}
                      {data.price}
                    </p>
                    <p className="px-2 sm:py-1 border bg-slate-50">
                      {item.size}
                    </p>
                  </div>
                </div>
              </div>
              <input
                onChange={(e) =>
                  e.target.value === "" || e.target.value === "0"
                    ? null
                    : updateQuantity(
                        item._id,
                        item.size,
                        Number(e.target.value)
                      )
                }
                className="border max-w-10 sm:max-w-20 px-1 py-1"
                type="number"
                min={1}
                defaultValue={item.quantity}
              />
              <img
                onClick={() => updateQuantity(item._id, item.size, 0)}
                className="w-4 mr-4 sm:w-5 cursor-pointer"
                src={assets.bin_icon}
                alt=""
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            {showPasscode && (
              <input
                type="text"
                className="bg-gray-700 text-white text-sm my-8 px-5 py-3"
                placeholder="PASSCODE"
                value={enteredPasscode}
                onChange={handlePasscodeChange}
              />
            )}
            <button
              onClick={handleCheckout}
              className="bg-black text-white text-sm my-8 px-8 py-3"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
