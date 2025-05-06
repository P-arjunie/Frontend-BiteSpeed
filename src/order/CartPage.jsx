import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaTrashAlt, FaShoppingCart, FaMinus, FaPlus, FaArrowLeft } from 'react-icons/fa'; // Import icons

const CartPage = () => {
  const location = useLocation();
  const { userId } = location.state || {};  // Get userId from location state

  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setError("User ID not provided");
      return;
    }

    const fetchCartItems = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/cart/user/${userId}`, {
          headers: {
            'Authorization': localStorage.getItem('token'),
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch cart items');
        }

        const data = await response.json();
        setCartItems(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCartItems();
  }, [userId]);

  const handleRemoveItem = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/cart/${itemId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error("Failed to delete cart item");
      }

      const updatedCart = cartItems.filter(item => item._id !== itemId);
      setCartItems(updatedCart);
    } catch (error) {
      console.error("Error deleting cart item:", error);
    }
  };

  const handleQuantityChange = async (itemId, type) => {
    const updatedCart = cartItems.map(item => {
      if (item._id === itemId) {
        const newQuantity = type === 'inc' ? item.quantity + 1 : Math.max(1, item.quantity - 1);
        return { ...item, quantity: newQuantity, totalPrice: newQuantity * item.price };
      }
      return item;
    });

    const updatedItem = updatedCart.find(item => item._id === itemId);

    try {
      await fetch(`http://localhost:3000/api/cart/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: updatedItem.quantity, price: updatedItem.price }),
      });

      setCartItems(updatedCart);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FaShoppingCart className="text-white text-2xl" />
              <h1 className="text-2xl font-bold text-white">Your Cart</h1>
            </div>
            <Link 
              to="/customer-home" 
              className="flex items-center text-white hover:text-orange-100 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {cartItems.length === 0 && !error && (
          <div className="text-center py-16 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
            <FaShoppingCart className="mx-auto text-5xl text-orange-300 mb-4" />
            <p className="text-gray-600 text-xl mb-6">Your cart is empty</p>
            <Link to="/customer-home">
              <button className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-8 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300">
                Start Shopping
              </button>
            </Link>
          </div>
        )}

        {cartItems.length > 0 && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <div className="px-6 py-4 bg-orange-50 border-b border-gray-100">
                  <h2 className="font-semibold text-lg text-orange-800">Shopping Cart</h2>
                  <p className="text-sm text-gray-500">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</p>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <div key={item._id} className="p-6 hover:bg-orange-50 transition-colors duration-150">
                      <div className="flex flex-col sm:flex-row gap-5">
                        <div className="relative flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.itemName}
                            className="w-24 h-24 object-cover rounded-lg shadow-sm border border-gray-200"
                          />
                        </div>

                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800">{item.itemName}</h3>
                          <p className="text-orange-600 font-medium mt-1">Rs. {item.price}</p>
                        </div>

                        <div className="flex flex-col sm:items-end gap-3">
                          <div className="flex items-center border border-gray-200 rounded-full">
                            <button
                              onClick={() => handleQuantityChange(item._id, 'dec')}
                              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                            >
                              <FaMinus className="text-xs text-orange-500" />
                            </button>
                            <span className="px-4 font-medium text-gray-700">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item._id, 'inc')}
                              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                            >
                              <FaPlus className="text-xs text-orange-500" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between gap-4 mt-2">
                            <button
                              onClick={() => handleRemoveItem(item._id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                              title="Remove item"
                            >
                              <FaTrashAlt />
                            </button>
                            
                            <span className="font-bold text-gray-800">
                              Rs. {(item.price * item.quantity).toFixed(2)}
                            </span>

                            <Link
                              to="/ordersummary"
                              state={{ cartItem: item, restaurantId: item.restaurantId }}
                            >
                              <button className="py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-all duration-300 shadow-sm hover:shadow-md">
                                Checkout
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md border border-gray-100 sticky top-6">
                <div className="px-6 py-4 bg-orange-50 border-b border-gray-100">
                  <h2 className="font-semibold text-lg text-orange-800">Order Summary</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>Rs. {total.toFixed(2)}</span>
                    </div>
                   
                    <div className="border-t border-gray-100 pt-3 mt-3">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span className="text-orange-600">Rs. {(total).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;