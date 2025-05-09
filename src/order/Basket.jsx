import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const BasketPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { item, restaurantId } = location.state || {};

  const [quantity, setQuantity] = useState(1);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You need to login first');
        navigate('/login');
        return;
      }

      const response = await fetch('https://customer-service-lqm4.onrender.com/api/customers/profile', {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setUserProfile(data);
    } catch (err) {
      setError('Error fetching profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  if (!item) {
    return <div>No item found</div>;
  }

  const handleQuantityChange = (type) => {
    setQuantity((prev) => (type === 'inc' ? prev + 1 : Math.max(1, prev - 1)));
  };

  const handleAddToCart = async () => {
    if (!userProfile) {
      setError('User not logged in');
      return;
    }

    const cartItem = {
      userId: userProfile._id,
      mealId: item._id,
      itemName: item.name,
      quantity: quantity,
      price: item.price,
      totalPrice: item.price * quantity,
      restaurantId: restaurantId,
      image: item.image,
    };

    try {
      const response = await fetch('https://ordermanagementservice.onrender.com/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
        body: JSON.stringify(cartItem),
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      const result = await response.json();
      console.log('Item added to cart:', result);
      navigate('/cart', { state: { userId: userProfile._id } })
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('Failed to add item to cart.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-50 to-amber-100">
      {/* Decorative food patterns */}
      <div className="fixed inset-0 z-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-repeat" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23f97316' fill-opacity='0.2'%3E%3Cpath d='M0 0h80v80H0z'/%3E%3Cpath d='M20 20c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10-10-4.477-10-10zm30 0c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10-10-4.477-10-10zM20 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10-10-4.477-10-10zm30 0c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10-10-4.477-10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
             }}
        ></div>
      </div>

      <header className="w-full bg-black text-white py-4 px-6 rounded-xl mb-8 shadow-lg z-10 relative mx-4 mt-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-orange-500">🍴 BiteSpeed</h1>
          <nav className="space-x-4 hidden sm:block">
            <Link to="/customer-home" className="text-orange-400 font-semibold underline">
              Home
            </Link>
            <Link to="/orders" className="hover:text-orange-400">My Orders</Link>
            <Link to="/profile" className="hover:text-orange-400">Profile</Link>
          </nav>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 z-10 relative">
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow mb-6">
          <h2 className="text-2xl font-bold text-orange-700 flex items-center">
            <span className="mr-2">🛒</span> Meal Description
          </h2>
        </div>

        

        <div className="flex flex-col md:flex-row gap-8 bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-md border border-orange-100">
          {item.image && (
            <div className="w-full md:w-72 h-60 rounded-xl shadow-sm overflow-hidden">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
              />
            </div>
          )}

          <div className="flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-orange-800">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
              <div className="flex flex-wrap gap-3 my-2">
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium">
                  {item.isAvailable ? '✓ Available' : '✗ Not Available'}
                </span>
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium">
                  {item.category}
                </span>
              </div>
              <p className="text-lg font-bold text-orange-700">Rs. {item.price}</p>
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-orange-600">Restaurant ID:</span> {restaurantId}
              </p>

              <div className="flex items-center gap-4 mt-4">
                <button 
                  onClick={() => handleQuantityChange('dec')} 
                  className="px-3 py-1 bg-orange-200 text-orange-800 rounded-full hover:bg-orange-300 transition"
                >
                  -
                </button>
                <span className="text-xl font-medium">{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange('inc')} 
                  className="px-3 py-1 bg-orange-200 text-orange-800 rounded-full hover:bg-orange-300 transition"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full py-3 mt-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-amber-200/30 to-transparent z-0"></div>
      <div className="fixed top-0 right-0 w-64 h-64 bg-orange-300/10 rounded-full blur-3xl -mr-32 -mt-16 z-0"></div>
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl -ml-48 -mb-16 z-0"></div>

      <footer className="mt-auto bg-black text-white rounded-xl shadow-lg px-6 py-8 z-10 relative mx-4 mb-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-semibold text-orange-400">🍴 FoodieExpress</h2>
            <p className="text-sm mt-2 text-gray-300">Delivering deliciousness to your door since 2025.</p>
          </div>
          <div className="flex space-x-6 text-lg">
            <Link to="/customer-home" className="hover:text-orange-400">Home</Link>
            <Link to="/orders" className="hover:text-orange-400">My Orders</Link>
            <Link to="/profile" className="hover:text-orange-400">Profile</Link>
            <Link to="/about" className="hover:text-orange-400">About Us</Link>
            <Link to="/contact" className="hover:text-orange-400">Contact</Link>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-lg text-gray-400">
          <p className="text-lg">© 2025 FoodieExpress. All rights reserved.</p>
          <p className="mt-2 text-sm">Made with 🍲 by the FoodieExpress Dev Team</p>
        </div>
      </footer>
    </div>
  );
};

export default BasketPage;