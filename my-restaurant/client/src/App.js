// frontend/src/App.js
// This is the main React application for the restaurant frontend.
// It handles routing, user authentication state, cart management,
// and displays different pages for menu, orders, reservations, and loyalty.

import React, { useState, useEffect, createContext, useContext, useCallback, useRef } from 'react'; // Added useRef
import { createRoot } from 'react-dom/client';
import { Home, Menu, ShoppingCart, CalendarDays, Gift, User, LogOut, LayoutDashboard, XCircle, MapPin } from 'lucide-react';
import io from 'socket.io-client';

// Tailwind CSS is assumed to be configured in your project.

// --- Context for User Authentication and Cart ---
const AuthContext = createContext(null);

// --- Notification Bar Component ---
const NotificationBar = ({ message, type, onClose }) => {
    if (!message) return null;

    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';

    return (
        <div className={`fixed bottom-4 right-4 ${bgColor} text-white p-4 rounded-lg shadow-lg flex items-center space-x-2 z-50`}>
            <span>{message}</span>
            <button onClick={onClose} className="ml-2">
                <XCircle size={20} />
            </button>
        </div>
    );
};

// --- API Service (Simplified) ---
const API_BASE_URL = 'https://my-restaurant-m8od.onrender.com/api';

const api = {
    async register(name, email, password) {
        const res = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        return res.json();
    },

    async login(email, password) {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return res.json();
    },

    async getMenu(token) {
        const res = await fetch(`${API_BASE_URL}/menu`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to fetch menu items');
        }
        return res.json();
    },

    async createOrder(orderData, token) {
        const res = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to create order');
        }
        return res.json();
    },

    async initiateMpesaPayment(orderId, token) {
        const res = await fetch(`${API_BASE_URL}/orders/${orderId}/initiate-mpesa-payment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to initiate M-Pesa payment');
        }
        return res.json();
    },

    async getMyOrders(token) {
        const res = await fetch(`${API_BASE_URL}/orders/myorders`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to fetch orders');
        }
        return res.json();
    },

    async cancelOrder(orderId, token) {
        const res = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to cancel order');
        }
        return res.json();
    },

    async createReservation(reservationData, token) {
        const res = await fetch(`${API_BASE_URL}/reservations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(reservationData)
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to create reservation');
        }
        return res.json();
    },

    async getMyReservations(token) {
        const res = await fetch(`${API_BASE_URL}/reservations/myreservations`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to fetch reservations');
        }
        return res.json();
    },

    async getMyLoyaltyPoints(token) {
        const res = await fetch(`${API_BASE_URL}/loyalty/my-points`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to fetch loyalty points');
        }
        return res.json();
    },

    async redeemLoyaltyPoints(pointsToRedeem, token) {
        const res = await fetch(`${API_BASE_URL}/loyalty/redeem`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ pointsToRedeem })
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to redeem points');
        }
        return res.json();
    },

    // Admin API calls
    async getAdminUsers(token) {
        const res = await fetch(`${API_BASE_URL}/admin/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to fetch admin users');
        }
        return res.json();
    },
    async getAdminOrders(token) {
        const res = await fetch(`${API_BASE_URL}/admin/orders`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to fetch admin orders');
        }
        return res.json();
    },
    async getAdminReservations(token) {
        const res = await fetch(`${API_BASE_URL}/admin/reservations`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to fetch admin reservations');
        }
        return res.json();
    },
    async updateOrderStatus(orderId, status, token) {
        const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to update order status');
        }
        return res.json();
    },
    async updateReservationStatus(reservationId, status, token) {
        const res = await fetch(`${API_BASE_URL}/reservations/${reservationId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to update reservation status');
        }
        return res.json();
    },
    async addMenuItem(itemData, token) {
        const res = await fetch(`${API_BASE_URL}/menu`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(itemData)
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to add menu item');
        }
        return res.json();
    },
    async updateMenuItem(itemId, itemData, token) {
        const res = await fetch(`${API_BASE_URL}/menu/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(itemData)
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to update menu item');
        }
        return res.json();
    },
    async deleteMenuItem(itemId, token) {
        const res = await fetch(`${API_BASE_URL}/menu/${itemId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to delete menu item');
        }
        return res.json();
    }
};

// --- AuthPage Component ---
const AuthPage = ({ onLoginSuccess, showNotification }) => {
    const [isRegister, setIsRegister] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let data;
            if (isRegister) {
                data = await api.register(name, email, password);
            } else {
                data = await api.login(email, password);
            }

            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                onLoginSuccess(data.user, data.token);
                showNotification(isRegister ? 'Registration successful!' : 'Login successful!', 'success');
            } else {
                showNotification(data.message || 'Authentication failed.', 'error');
            }
        } catch (error) {
            console.error('Auth error:', error);
            showNotification('An error occurred during authentication.', 'error');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    {isRegister ? 'Register' : 'Login'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {isRegister && (
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="name">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-orange-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-700 transition duration-300 shadow-md"
                    >
                        {isRegister ? 'Register' : 'Login'}
                    </button>
                </form>
                <p className="text-center text-gray-600 mt-4">
                    {isRegister ? 'Already have an account?' : 'Don\'t have an account?'}{' '}
                    <button
                        onClick={() => setIsRegister(!isRegister)}
                        className="text-orange-600 hover:underline font-semibold"
                    >
                        {isRegister ? 'Login here' : 'Register here'}
                    </button>
                </p>
            </div>
        </div>
    );
};

// --- HomePage Component ---
const HomePage = ({ user, setCurrentPage }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-100 to-red-100 p-4">
            <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-2xl w-full">
                <h1 className="text-5xl font-extrabold text-orange-800 mb-4 animate-fade-in-down">
                    Welcome, {user.name}!
                </h1>
                <p className="text-xl text-gray-700 mb-8 animate-fade-in-up">
                    Your culinary journey starts here.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FeatureCard
                        icon={<Menu size={48} className="text-orange-600" />}
                        title="Explore Our Menu"
                        description="Discover delicious dishes and drinks."
                        onClick={() => setCurrentPage('menu')}
                    />
                    <FeatureCard
                        icon={<ShoppingCart size={48} className="text-orange-600" />}
                        title="Place an Order"
                        description="Order your favorites online for pickup or delivery."
                        onClick={() => setCurrentPage('cart')}
                    />
                    <FeatureCard
                        icon={<CalendarDays size={48} className="text-orange-600" />}
                        title="Book a Table"
                        description="Reserve your spot for a delightful dining experience."
                        onClick={() => setCurrentPage('reservations')}
                    />
                    <FeatureCard
                        icon={<Gift size={48} className="text-orange-600" />}
                        title="My Loyalty Points"
                        description="Check your points and redeem exciting rewards."
                        onClick={() => setCurrentPage('loyalty')}
                    />
                    {user.role === 'admin' && (
                        <FeatureCard
                            icon={<LayoutDashboard size={48} className="text-orange-600" />}
                            title="Admin Dashboard"
                            description="Manage menu, orders, and reservations."
                            onClick={() => setCurrentPage('admin')}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, description, onClick }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out text-center group"
    >
        <div className="mb-4 group-hover:text-orange-700 transition-colors duration-300">
            {icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-orange-800 transition-colors duration-300">
            {title}
        </h3>
        <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
            {description}
        </p>
    </button>
);

// --- MenuPage Component ---
const MenuPage = ({ showNotification }) => {
    const { user, token, addToCart } = useContext(AuthContext);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                setLoading(true);
                const data = await api.getMenu(token);
                if (Array.isArray(data)) { // Ensure data is an array
                    setMenuItems(data);
                } else {
                    setError('Received unexpected data format for menu items.');
                    setMenuItems([]); // Set to empty array to prevent map error
                }
            } catch (err) {
                console.error('Error fetching menu:', err);
                setError(err.message || 'Could not load menu. Please try again later.');
                setMenuItems([]); // Set to empty array on error
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchMenu();
        }
    }, [token]);

    const categories = ['All', ...new Set(menuItems.map(item => item.category))];

    const filteredMenuItems = selectedCategory === 'All'
        ? menuItems
        : menuItems.filter(item => item.category === selectedCategory);

    const handleAddToCart = (item) => {
        addToCart(item);
        showNotification(`${item.name} added to cart!`, 'success');
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-700">Loading menu...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Our Delicious Menu</h1>

            <div className="flex justify-center mb-8 space-x-4 overflow-x-auto pb-2">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-6 py-2 rounded-full font-semibold transition-colors duration-300 whitespace-nowrap
                            ${selectedCategory === category ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMenuItems.length > 0 ? (
                    filteredMenuItems.map(item => (
                        <MenuItemCard key={item._id} item={item} onAddToCart={handleAddToCart} />
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-600">No items found in this category.</p>
                )}
            </div>
        </div>
    );
};

const MenuItemCard = ({ item, onAddToCart }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300 ease-in-out">
        <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300/E0E0E0/000000?text=Food+Item'; }} />
        <div className="p-5">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.name}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
            <div className="flex items-center justify-between">
                <span className="text-orange-600 font-bold text-lg">KES {item.price.toFixed(2)}</span>
                <button
                    onClick={() => onAddToCart(item)}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-700 transition duration-300 shadow-md"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    </div>
);

// --- CartPage Component ---
const CartPage = ({ showNotification, setCurrentPage }) => {
    const { cart, removeFromCart, updateCartQuantity, clearCart, user, token, updateLoyaltyPoints } = useContext(AuthContext);
    const [orderType, setOrderType] = useState('Delivery');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [contactNumber, setContactNumber] = useState(user.contactNumber || ''); // Pre-fill if available
    const [loyaltyPointsToRedeem, setLoyaltyPointsToRedeem] = useState(0);
    const [userLoyaltyPoints, setUserLoyaltyPoints] = useState(user.loyaltyPoints || 0);
    const [isProcessingOrder, setIsProcessingOrder] = useState(false);

    useEffect(() => {
        // Fetch latest loyalty points when cart page loads
        const fetchPoints = async () => {
            if (token) {
                try {
                    const data = await api.getMyLoyaltyPoints(token);
                    if (data && typeof data.loyaltyPoints === 'number') {
                        setUserLoyaltyPoints(data.loyaltyPoints);
                    }
                } catch (error) {
                    console.error('Error fetching loyalty points:', error);
                    showNotification('Failed to load loyalty points.', 'error');
                }
            }
        };
        fetchPoints();
    }, [token, showNotification, user.loyaltyPoints]); // Also re-fetch if user.loyaltyPoints changes (e.g., after order)

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    let finalAmount = subtotal;

    // Calculate discount from loyalty points
    let actualPointsRedeemed = 0;
    if (loyaltyPointsToRedeem > 0 && loyaltyPointsToRedeem <= userLoyaltyPoints) {
        const potentialDiscount = loyaltyPointsToRedeem;
        if (potentialDiscount <= finalAmount) {
            finalAmount -= potentialDiscount;
            actualPointsRedeemed = loyaltyPointsToRedeem;
        } else {
            // If discount is more than total, apply max possible discount
            actualPointsRedeemed = Math.floor(finalAmount);
            finalAmount = 0;
        }
    }

    const handlePlaceOrder = async () => {
        if (cart.length === 0) {
            showNotification('Your cart is empty!', 'error');
            return;
        }
        if (orderType === 'Delivery' && !deliveryAddress.trim()) {
            showNotification('Please enter a delivery address.', 'error');
            return;
        }
        if (!contactNumber.trim()) {
            showNotification('Please enter a contact number.', 'error');
            return;
        }

        setIsProcessingOrder(true);
        try {
            const orderData = {
                items: cart.map(item => ({
                    menuItem: item._id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })),
                orderType,
                deliveryAddress,
                contactNumber,
                loyaltyPointsToRedeem: actualPointsRedeemed
            };

            const response = await api.createOrder(orderData, token);

            if (response._id) {
                // NEW: Initiate M-Pesa STK Push instead of simulating
                showNotification('Order placed! Initiating M-Pesa payment...', 'info');
                const mpesaResponse = await api.initiateMpesaPayment(response._id, token);

                if (mpesaResponse.ResponseCode === '0') {
                    showNotification('M-Pesa STK Push sent! Please complete payment on your phone.', 'success');
                    clearCart();
                    // Do not update loyalty points here, wait for M-Pesa callback to confirm payment
                    setCurrentPage('myOrders'); // Navigate to orders page
                } else {
                    showNotification(mpesaResponse.message || 'M-Pesa payment initiation failed.', 'error');
                }
            } else {
                showNotification(response.message || 'Failed to place order.', 'error');
            }
        } catch (error) {
            console.error('Error placing order or initiating payment:', error);
            showNotification('An error occurred while placing your order or initiating payment.', 'error');
        } finally {
            setIsProcessingOrder(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Your Cart</h1>

            {cart.length === 0 ? (
                <div className="text-center text-gray-600 text-lg">
                    Your cart is empty. <button onClick={() => setCurrentPage('menu')} className="text-orange-600 hover:underline">Go to Menu</button>
                </div>
            ) : (
                <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg">
                    <div className="space-y-4 mb-6">
                        {cart.map(item => (
                            <div key={item._id} className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0">
                                <div className="flex items-center space-x-4">
                                    <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-lg object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/64x64/E0E0E0/000000?text=Food'; }} />
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                        <p className="text-gray-600 text-sm">KES {item.price.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => updateCartQuantity(item._id, item.quantity - 1)}
                                        className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-300"
                                        disabled={item.quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span className="font-semibold">{item.quantity}</span>
                                    <button
                                        onClick={() => updateCartQuantity(item._id, item.quantity + 1)}
                                        className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-300"
                                    >
                                        +
                                    </button>
                                    <button
                                        onClick={() => removeFromCart(item._id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <XCircle size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t pt-4 mt-4">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-semibold text-gray-700">Subtotal:</span>
                            <span className="text-lg font-bold text-gray-800">KES {subtotal.toFixed(2)}</span>
                        </div>

                        {/* Loyalty Points Redemption */}
                        <div className="mb-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                            <h3 className="font-semibold text-orange-700 mb-2">Loyalty Points</h3>
                            <p className="text-gray-700 mb-2">You have: <span className="font-bold">{userLoyaltyPoints} points</span></p>
                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="redeem-points">
                                Points to Redeem (1 point = KES 1)
                            </label>
                            <input
                                type="number"
                                id="redeem-points"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                value={loyaltyPointsToRedeem}
                                onChange={(e) => {
                                    const val = Math.max(0, Math.min(parseInt(e.target.value) || 0, userLoyaltyPoints, Math.ceil(subtotal)));
                                    setLoyaltyPointsToRedeem(val);
                                }}
                                min="0"
                                max={Math.min(userLoyaltyPoints, Math.ceil(subtotal))}
                            />
                            <p className="text-sm text-gray-600 mt-1">
                                Discount: KES {actualPointsRedeemed.toFixed(2)}
                            </p>
                        </div>

                        <div className="flex justify-between items-center font-bold text-xl text-gray-900 mb-6">
                            <span>Total (after discount):</span>
                            <span>KES {finalAmount.toFixed(2)}</span>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Details</h3>
                            <div className="flex items-center mb-3">
                                <input
                                    type="radio"
                                    id="delivery"
                                    name="orderType"
                                    value="Delivery"
                                    checked={orderType === 'Delivery'}
                                    onChange={(e) => setOrderType(e.target.value)}
                                    className="mr-2 text-orange-600 focus:ring-orange-500"
                                />
                                <label htmlFor="delivery" className="text-gray-700">Delivery</label>
                                <input
                                    type="radio"
                                    id="pickup"
                                    name="orderType"
                                    value="Pickup"
                                    checked={orderType === 'Pickup'}
                                    onChange={(e) => setOrderType(e.target.value)}
                                    className="ml-6 mr-2 text-orange-600 focus:ring-orange-500"
                                />
                                <label htmlFor="pickup" className="text-gray-700">Pickup</label>
                            </div>

                            {orderType === 'Delivery' && (
                                <div className="mb-3">
                                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="deliveryAddress">
                                        Delivery Address
                                    </label>
                                    <input
                                        type="text"
                                        id="deliveryAddress"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        value={deliveryAddress}
                                        onChange={(e) => setDeliveryAddress(e.target.value)}
                                        required={orderType === 'Delivery'}
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="contactNumber">
                                    Contact Number (for M-Pesa & notifications)
                                </label>
                                <input
                                    type="text"
                                    id="contactNumber"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    value={contactNumber}
                                    onChange={(e) => setContactNumber(e.target.value)}
                                    placeholder="e.g., 2547XXXXXXXX"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            className="w-full bg-orange-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-700 transition duration-300 shadow-md text-xl"
                            disabled={isProcessingOrder}
                        >
                            {isProcessingOrder ? 'Processing...' : 'Place Order & Pay with M-Pesa'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- MyOrdersPage Component ---
const MyOrdersPage = ({ showNotification, setCurrentPage }) => {
    const { token } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const data = await api.getMyOrders(token);
            if (Array.isArray(data)) {
                setOrders(data);
            } else {
                console.error('API returned non-array data for orders:', data);
                setError('Received unexpected data format for orders. Please try again or contact support.');
                setOrders([]);
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError(err.message || 'Could not load your orders. Please try again later.');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }, [token, showNotification]);

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token, fetchOrders]);

    const handleCancelOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
            try {
                const response = await api.cancelOrder(orderId, token);
                if (response.order) {
                    showNotification('Order cancelled successfully!', 'success');
                    fetchOrders();
                } else {
                    showNotification(response.message || 'Failed to cancel order.', 'error');
                }
            } catch (error) {
                console.error('Error cancelling order:', error);
                showNotification(error.message || 'An error occurred while cancelling the order.', 'error');
            }
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-700">Loading orders...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">My Orders</h1>

            {orders.length === 0 ? (
                <p className="text-center text-gray-600 text-lg">You haven't placed any orders yet.</p>
            ) : (
                <div className="max-w-4xl mx-auto space-y-6">
                    {orders.map(order => (
                        <div key={order._id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                            <div className="flex justify-between items-center mb-4 border-b pb-3">
                                <h2 className="text-xl font-bold text-gray-800">Order #{order._id.substring(0, 8)}</h2>
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold
                                    ${order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                      order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                      'bg-blue-100 text-blue-800'}`}
                                >
                                    {order.status}
                                </span>
                            </div>
                            <p className="text-gray-600 mb-2">
                                <span className="font-semibold">Order Date:</span> {new Date(order.createdAt).toLocaleString()}
                            </p>
                            <p className="text-gray-600 mb-2">
                                <span className="font-semibold">Order Type:</span> {order.orderType}
                            </p>
                            {order.orderType === 'Delivery' && (
                                <p className="text-gray-600 mb-2">
                                    <span className="font-semibold">Delivery Address:</span> {order.deliveryAddress}
                                </p>
                            )}
                            <p className="text-gray-600 mb-2">
                                <span className="font-semibold">Contact:</span> {order.contactNumber}
                            </p>
                            <p className="text-gray-600 mb-2">
                                <span className="font-semibold">Payment Status:</span> {order.paymentStatus}
                            </p>
                            <p className="text-gray-600 mb-2">
                                <span className="font-semibold">Loyalty Points Earned:</span> {order.loyaltyPointsEarned}
                            </p>
                            {order.loyaltyPointsRedeemed > 0 && (
                                <p className="text-gray-600 mb-2">
                                    <span className="font-semibold">Loyalty Points Redeemed:</span> {order.loyaltyPointsRedeemed}
                                </p>
                            )}

                            <h3 className="font-semibold text-gray-700 mt-4 mb-2">Items:</h3>
                            <ul className="list-disc list-inside pl-4">
                                {order.items.map((item, index) => (
                                    <li key={index} className="text-gray-600 text-sm">
                                        {item.name} x {item.quantity} (KES {item.price.toFixed(2)} each)
                                    </li>
                                ))}
                            </ul>
                            <div className="border-t pt-3 mt-4 flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-900">Total:</span>
                                <span className="text-lg font-bold text-orange-600">KES {order.totalAmount.toFixed(2)}</span>
                            </div>

                            <div className="mt-4 flex justify-end space-x-3">
                                {/* Cancel Order Button */}
                                {['Pending', 'Confirmed', 'Awaiting Confirmation'].includes(order.status) && (
                                    <button
                                        onClick={() => handleCancelOrder(order._id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 shadow-md text-sm"
                                    >
                                        Cancel Order
                                    </button>
                                )}
                                {/* Track Order Button (only for delivery orders that are confirmed/preparing) */}
                                {order.orderType === 'Delivery' && ['Confirmed', 'Preparing', 'Out for Delivery'].includes(order.status) && (
                                    <button
                                        onClick={() => setCurrentPage('trackOrder', { orderId: order._id })}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 shadow-md text-sm flex items-center space-x-1"
                                    >
                                        <MapPin size={16} />
                                        <span>Track Order</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- OrderTrackingPage Component ---
// This component will display a map and the real-time location of a delivery driver.
const OrderTrackingPage = ({ showNotification, orderId }) => {
    const { token } = useContext(AuthContext);
    const [order, setOrder] = useState(null);
    const [driverLocation, setDriverLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const socket = io('http://localhost:5000'); // Connect to your backend Socket.IO server

    // useRef to hold the map instance and marker instance
    const mapRef = useRef(null);
    const driverMarkerRef = useRef(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                // In a real app, you'd fetch specific order details including its assigned driver
                // For now, we'll simulate or assume the order exists.
                // You might need a specific API route to get a single order by ID for tracking.
                // For this example, we'll just use the orderId passed in.
                // You could add: const fetchedOrder = await api.getSingleOrder(orderId, token);
                // For now, mocking:
                setOrder({ _id: orderId, status: 'Out for Delivery', deliveryAddress: '123 Main St, Nairobi' });
                setLoading(false);
            } catch (err) {
                console.error('Error fetching order for tracking:', err);
                setError(err.message || 'Could not load order details for tracking.');
                setLoading(false);
            }
        };

        fetchOrderDetails();

        // Initialize Google Map when component mounts and Google Maps API is ready
        // window.google is available because we loaded the script in index.html
        const initializeMap = () => {
            if (window.google && mapRef.current) {
                const mapOptions = {
                    center: { lat: 1.2921, lng: 36.8219 }, // Default center (e.g., Nairobi)
                    zoom: 12,
                    mapId: 'YOUR_MAP_ID' // Optional: If you have a custom map style in Google Cloud
                };
                const map = new window.google.maps.Map(mapRef.current, mapOptions);
                driverMarkerRef.current = new window.google.maps.Marker({
                    map: map,
                    position: mapOptions.center,
                    title: 'Delivery Driver',
                    icon: { // Custom icon for the driver
                        path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                        scale: 5,
                        fillColor: '#FF5722', // Orange color
                        fillOpacity: 1,
                        strokeWeight: 0
                    }
                });
            } else {
                // If Google Maps API isn't ready yet, try again after a short delay
                setTimeout(initializeMap, 100);
            }
        };

        initializeMap(); // Call map initialization

        // Socket.IO listener for real-time location updates
        socket.on('orderLocationUpdate', (data) => {
            if (data.orderId === orderId) {
                const newLocation = { lat: data.latitude, lng: data.longitude };
                setDriverLocation({ ...newLocation, timestamp: data.timestamp });

                // Update marker position and center map
                if (driverMarkerRef.current) {
                    driverMarkerRef.current.setPosition(newLocation);
                    driverMarkerRef.current.getMap().setCenter(newLocation);
                }
                showNotification(`Driver for order ${orderId.substring(0, 8)} is at ${data.latitude.toFixed(4)}, ${data.longitude.toFixed(4)}`, 'info');
            }
        });

        // Clean up socket connection on component unmount
        return () => {
            socket.disconnect();
        };
    }, [orderId, token, showNotification]); // Dependencies for useEffect

    if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-700">Loading tracking details...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
    if (!order) return <div className="min-h-screen flex items-center justify-center text-gray-700">Order not found for tracking.</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Track Order #{order._id.substring(0, 8)}</h1>

            <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Delivery Status: <span className="text-orange-600">{order.status}</span></h2>
                {order.deliveryAddress && (
                    <p className="text-gray-700 mb-4">Delivering to: <span className="font-medium">{order.deliveryAddress}</span></p>
                )}

                {/* Map Container - Google Maps API will render here */}
                <div ref={mapRef} className="w-full h-96 bg-gray-200 rounded-lg overflow-hidden shadow-md">
                    {/* Map will be rendered inside this div by Google Maps API */}
                </div>

                {driverLocation && (
                    <p className="text-center text-gray-700 mt-2">
                        Driver last seen at: {driverLocation.lat.toFixed(4)}, {driverLocation.lng.toFixed(4)} (
                        {new Date(driverLocation.timestamp).toLocaleTimeString()})
                    </p>
                )}
                {!driverLocation && !loading && (
                    <p className="text-center text-gray-600 mt-2">Waiting for driver's location updates...</p>
                )}

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-700 mb-2">How Tracking Works (Conceptual):</h3>
                    <p className="text-gray-700 text-sm">
                        In a real scenario, our delivery drivers would use a separate app to send their live GPS location. This location is then updated in real-time on this map.
                        <br/>
                        For demonstration, you can simulate a driver location update by making a POST request to:
                        <code className="block bg-gray-100 p-2 rounded mt-2 text-xs">
                            POST {API_BASE_URL}/orders/delivery-location
                            <br/>Headers: Authorization: Bearer &#x3C;your_admin_token&#x3E;
                            <br/>Body: &#123; "orderId": "{orderId}", "latitude": 1.2921, "longitude": 36.8219 &#125;
                        </code>
                        (Replace latitude/longitude with desired coordinates, and use an admin token for testing this endpoint).
                    </p>
                </div>
            </div>
        </div>
    );
};


// --- LoyaltyPage Component ---
const LoyaltyPage = ({ showNotification }) => {
    const { user, token, updateLoyaltyPoints } = useContext(AuthContext);
    const [loyaltyPoints, setLoyaltyPoints] = useState(user.loyaltyPoints || 0);
    const [pointsToRedeem, setPointsToRedeem] = useState(0);
    const [isRedeeming, setIsRedeeming] = useState(false);

    useEffect(() => {
        const fetchPoints = async () => {
            if (token) {
                try {
                    const data = await api.getMyLoyaltyPoints(token);
                    if (data && typeof data.loyaltyPoints === 'number') {
                        setLoyaltyPoints(data.loyaltyPoints);
                    }
                } catch (error) {
                    console.error('Error fetching loyalty points:', error);
                    showNotification('Failed to load loyalty points.', 'error');
                }
            }
        };
        fetchPoints();
    }, [token, showNotification, user.loyaltyPoints]); // Re-fetch if user.loyaltyPoints in context changes

    const handleRedeemPoints = async () => {
        if (pointsToRedeem <= 0) {
            showNotification('Please enter a valid number of points to redeem.', 'error');
            return;
        }
        if (loyaltyPoints < pointsToRedeem) {
            showNotification('You do not have enough points to redeem.', 'error');
            return;
        }

        setIsRedeeming(true);
        try {
            const response = await api.redeemLoyaltyPoints(pointsToRedeem, token);
            if (response.newLoyaltyPoints !== undefined) {
                setLoyaltyPoints(response.newLoyaltyPoints);
                updateLoyaltyPoints(-pointsToRedeem); // Update context
                showNotification(response.message, 'success');
                setPointsToRedeem(0); // Reset input
            } else {
                showNotification(response.message || 'Failed to redeem points.', 'error');
            }
        } catch (error) {
            console.error('Error redeeming points:', error);
            showNotification('An error occurred while redeeming points.', 'error');
        } finally {
            setIsRedeeming(false);
        }
    };

    const pointsToDiscountRatio = 1; // 1 point = KES 1 discount

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-6">Your Loyalty Rewards</h1>
                <div className="mb-8 p-6 bg-orange-100 rounded-lg border border-orange-300">
                    <p className="text-2xl font-bold text-orange-700">Current Points:</p>
                    <p className="text-5xl font-extrabold text-orange-800 mt-2">{loyaltyPoints}</p>
                </div>

                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Redeem Your Points</h2>
                    <p className="text-gray-600 mb-4">
                        1 Loyalty Point = KES {pointsToDiscountRatio} discount on your next order.
                    </p>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="redeem-input">
                        Points to Redeem
                    </label>
                    <input
                        type="number"
                        id="redeem-input"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center text-lg"
                        value={pointsToRedeem}
                        onChange={(e) => setPointsToRedeem(Math.max(0, Math.min(parseInt(e.target.value) || 0, loyaltyPoints)))}
                        min="0"
                        max={loyaltyPoints}
                    />
                    <p className="text-sm text-gray-600 mt-2">
                        You will get a discount of KES {(pointsToRedeem * pointsToDiscountRatio).toFixed(2)}.
                    </p>
                    <button
                        onClick={handleRedeemPoints}
                        className="mt-6 w-full bg-orange-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-700 transition duration-300 shadow-md text-xl"
                        disabled={isRedeeming || pointsToRedeem === 0 || loyaltyPoints < pointsToRedeem}
                    >
                        {isRedeeming ? 'Redeeming...' : 'Redeem Points'}
                    </button>
                </div>

                <div className="text-gray-600 text-sm">
                    Points are automatically earned when you place and pay for orders.
                </div>
            </div>
        </div>
    );
};

// --- AdminDashboard Component ---
const AdminDashboard = ({ showNotification }) => {
    const { token, user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('overview');
    const [adminUsers, setAdminUsers] = useState([]);
    const [adminOrders, setAdminOrders] = useState([]);
    const [adminReservations, setAdminReservations] = useState([]);
    const [menuItems, setMenuItems] = useState([]); // For managing menu
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for Add/Edit Menu Item form
    const [isEditingMenuItem, setIsEditingMenuItem] = useState(false);
    const [currentMenuItem, setCurrentMenuItem] = useState(null);
    const [menuForm, setMenuForm] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        imageUrl: '',
        isAvailable: true
    });

    // Using useCallback for memoizing fetchData
    const fetchData = useCallback(async (tab) => {
        setLoading(true);
        setError(null);
        try {
            let data;
            if (tab === 'users') {
                data = await api.getAdminUsers(token);
                if (Array.isArray(data)) setAdminUsers(data); else throw new Error('Unexpected data format for users.');
            } else if (tab === 'orders') {
                data = await api.getAdminOrders(token);
                if (Array.isArray(data)) setAdminOrders(data); else throw new Error('Unexpected data format for orders.');
            } else if (tab === 'reservations') {
                data = await api.getAdminReservations(token);
                if (Array.isArray(data)) setAdminReservations(data); else throw new Error('Unexpected data format for reservations.');
            } else if (tab === 'menu') {
                data = await api.getMenu(token); // Re-use getMenu
                if (Array.isArray(data)) setMenuItems(data); else throw new Error('Unexpected data format for menu.');
            }
        } catch (err) {
            console.error(`Error fetching admin ${tab} data:`, err);
            setError(err.message || `Failed to load ${tab} data.`);
        } finally {
            setLoading(false);
        }
    }, [token, showNotification]); // Dependencies for useCallback

    useEffect(() => {
        if (token && user.role === 'admin') {
            fetchData(activeTab);
            // Also fetch initial data for overview if not already fetched by a specific tab
            if (activeTab === 'overview') {
                fetchData('users');
                fetchData('orders');
                fetchData('reservations');
            }
        } else if (user.role !== 'admin') {
            showNotification('You do not have administrative access.', 'error');
        }
    }, [token, user.role, activeTab, showNotification, fetchData]); // Added fetchData to dependency array

    const handleOrderStatusChange = async (orderId, newStatus) => {
        try {
            const response = await api.updateOrderStatus(orderId, newStatus, token);
            if (response.order) {
                showNotification('Order status updated successfully!', 'success');
                fetchData('orders'); // Refresh orders list
            } else {
                showNotification(response.message || 'Failed to update order status.', 'error');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            showNotification('An error occurred while updating order status.', 'error');
        }
    };

    const handleReservationStatusChange = async (reservationId, newStatus) => {
        try {
            const response = await api.updateReservationStatus(reservationId, newStatus, token);
            if (response.reservation) {
                showNotification('Reservation status updated successfully!', 'success');
                fetchData('reservations'); // Refresh reservations list
            } else {
                showNotification(response.message || 'Failed to update reservation status.', 'error');
            }
        } catch (error) {
            console.error('Error updating reservation status:', error);
            showNotification('An error occurred while updating reservation status.', 'error');
        }
    };

    const handleMenuFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setMenuForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAddOrUpdateMenuItem = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (isEditingMenuItem && currentMenuItem) {
                response = await api.updateMenuItem(currentMenuItem._id, menuForm, token);
            } else {
                response = await api.addMenuItem(menuForm, token);
            }

            if (response._id) {
                showNotification(`Menu item ${isEditingMenuItem ? 'updated' : 'added'} successfully!`, 'success');
                setIsEditingMenuItem(false);
                setCurrentMenuItem(null);
                setMenuForm({ name: '', description: '', price: '', category: '', imageUrl: '', isAvailable: true });
                fetchData('menu'); // Refresh menu list
            } else {
                showNotification(response.message || `Failed to ${isEditingMenuItem ? 'update' : 'add'} menu item.`, 'error');
            }
        } catch (error) {
            console.error(`Error ${isEditingMenuItem ? 'updating' : 'adding'} menu item:`, error);
            showNotification(`An error occurred while ${isEditingMenuItem ? 'updating' : 'adding'} menu item.`, 'error');
        }
    };

    const handleEditMenuItem = (item) => {
        setIsEditingMenuItem(true);
        setCurrentMenuItem(item);
        setMenuForm({
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            imageUrl: item.imageUrl,
            isAvailable: item.isAvailable
        });
        setActiveTab('menu'); // Switch to menu tab to show form
    };

    const handleDeleteMenuItem = async (itemId) => {
        if (window.confirm('Are you sure you want to delete this menu item?')) { // Using window.confirm for simplicity, replace with modal in real app
            try {
                const response = await api.deleteMenuItem(itemId, token);
                if (response.message) {
                    showNotification('Menu item deleted successfully!', 'success');
                    fetchData('menu'); // Refresh menu list
                } else {
                    showNotification(response.message || 'Failed to delete menu item.', 'error');
                }
            } catch (error) {
                console.error('Error deleting menu item:', error);
                showNotification('An error occurred while deleting menu item.', 'error');
            }
        }
    };

    if (user.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-600 text-2xl font-bold">
                Access Denied: You must be an administrator to view this page.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Admin Dashboard</h1>

            <div className="max-w-6xl mx-auto">
                {/* Tabs for navigation */}
                <div className="flex justify-center border-b border-gray-200 mb-8">
                    <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>Overview</TabButton>
                    <TabButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')}>Orders</TabButton>
                    <TabButton active={activeTab === 'reservations'} onClick={() => setActiveTab('reservations')}>Reservations</TabButton>
                    <TabButton active={activeTab === 'menu'} onClick={() => setActiveTab('menu')}>Menu Management</TabButton>
                    <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')}>Users</TabButton>
                </div>

                {loading ? (
                    <div className="text-center text-gray-700">Loading data...</div>
                ) : error ? (
                    <div className="text-center text-red-500">{error}</div>
                ) : (
                    <div className="bg-white p-8 rounded-xl shadow-lg">
                        {/* Tab Content */}
                        {activeTab === 'overview' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Overview</h2>
                                <p className="text-gray-700">Welcome to your admin dashboard. Use the tabs above to manage your restaurant's operations.</p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                    <InfoCard title="Total Users" value={adminUsers.length} />
                                    <InfoCard title="Total Orders" value={adminOrders.length} />
                                    <InfoCard title="Total Reservations" value={adminReservations.length} />
                                </div>
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">All Orders</h2>
                                {adminOrders.length === 0 ? (
                                    <p className="text-gray-600">No orders found.</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full bg-white rounded-lg shadow-md">
                                            <thead>
                                                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                                                    <th className="py-3 px-6 text-left">Order ID</th>
                                                    <th className="py-3 px-6 text-left">Customer</th>
                                                    <th className="py-3 px-6 text-left">Total</th>
                                                    <th className="py-3 px-6 text-left">Type</th>
                                                    <th className="py-3 px-6 text-left">Status</th>
                                                    <th className="py-3 px-6 text-left">Payment</th>
                                                    <th className="py-3 px-6 text-center">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-gray-700 text-sm font-light">
                                                {adminOrders.map(order => (
                                                    <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-50">
                                                        <td className="py-3 px-6 text-left whitespace-nowrap">{order._id.substring(0, 8)}</td>
                                                        <td className="py-3 px-6 text-left">{order.user ? order.user.name : 'N/A'}</td>
                                                        <td className="py-3 px-6 text-left">KES {order.totalAmount.toFixed(2)}</td>
                                                        <td className="py-3 px-6 text-left">{order.orderType}</td>
                                                        <td className="py-3 px-6 text-left">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold
                                                                ${order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                                order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                                'bg-blue-100 text-blue-800'}`}
                                                            >
                                                                {order.status}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-6 text-left">{order.paymentStatus}</td>
                                                        <td className="py-3 px-6 text-center">
                                                            <select
                                                                value={order.status}
                                                                onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                                                                className="px-3 py-1 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 text-sm"
                                                            >
                                                                {['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Completed', 'Cancelled'].map(s => (
                                                                    <option key={s} value={s}>{s}</option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'reservations' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">All Reservations</h2>
                                {adminReservations.length === 0 ? (
                                    <p className="text-gray-600">No reservations found.</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full bg-white rounded-lg shadow-md">
                                            <thead>
                                                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                                                    <th className="py-3 px-6 text-left">Reservation ID</th>
                                                    <th className="py-3 px-6 text-left">Customer</th>
                                                    <th className="py-3 px-6 text-left">Date</th>
                                                    <th className="py-3 px-6 text-left">Time</th>
                                                    <th className="py-3 px-6 text-left">Guests</th>
                                                    <th className="py-3 px-6 text-left">Status</th>
                                                    <th className="py-3 px-6 text-center">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-gray-700 text-sm font-light">
                                                {adminReservations.map(res => (
                                                    <tr key={res._id} className="border-b border-gray-200 hover:bg-gray-50">
                                                        <td className="py-3 px-6 text-left whitespace-nowrap">{res._id.substring(0, 8)}</td>
                                                        <td className="py-3 px-6 text-left">{res.user ? res.user.name : 'N/A'}</td>
                                                        <td className="py-3 px-6 text-left">{new Date(res.date).toLocaleDateString()}</td>
                                                        <td className="py-3 px-6 text-left">{res.time}</td>
                                                        <td className="py-3 px-6 text-left">{res.numberOfGuests}</td>
                                                        <td className="py-3 px-6 text-left">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold
                                                                ${res.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                                                res.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                                'bg-blue-100 text-blue-800'}`}
                                                            >
                                                                {res.status}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-6 text-center">
                                                            <select
                                                                value={res.status}
                                                                onChange={(e) => handleReservationStatusChange(res._id, e.target.value)}
                                                                className="px-3 py-1 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 text-sm"
                                                            >
                                                                {['Pending', 'Confirmed', 'Cancelled', 'Completed'].map(s => (
                                                                    <option key={s} value={s}>{s}</option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'menu' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Menu Management</h2>
                                <button
                                    onClick={() => {
                                        setIsEditingMenuItem(false);
                                        setCurrentMenuItem(null);
                                        setMenuForm({ name: '', description: '', price: '', category: '', imageUrl: '', isAvailable: true });
                                    }}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300 shadow-md mb-6"
                                >
                                    Add New Menu Item
                                </button>

                                {/* Add/Edit Menu Item Form */}
                                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                        {isEditingMenuItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                                    </h3>
                                    <form onSubmit={handleAddOrUpdateMenuItem} className="space-y-4">
                                        <div>
                                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="menuName">Name</label>
                                            <input type="text" id="menuName" name="name" value={menuForm.name} onChange={handleMenuFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="menuDescription">Description</label>
                                            <textarea id="menuDescription" name="description" value={menuForm.description} onChange={handleMenuFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" rows="3" required></textarea>
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="menuPrice">Price (KES)</label>
                                            <input type="number" id="menuPrice" name="price" value={menuForm.price} onChange={handleMenuFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" min="0" step="0.01" required />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="menuCategory">Category</label>
                                            <input type="text" id="menuCategory" name="category" value={menuForm.category} onChange={handleMenuFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="menuImageUrl">Image URL</label>
                                            <input type="text" id="menuImageUrl" name="imageUrl" value={menuForm.imageUrl} onChange={handleMenuFormChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                                        </div>
                                        <div className="flex items-center">
                                            <input type="checkbox" id="menuIsAvailable" name="isAvailable" checked={menuForm.isAvailable} onChange={handleMenuFormChange} className="mr-2 text-orange-600 focus:ring-orange-500 rounded" />
                                            <label htmlFor="menuIsAvailable" className="text-gray-700 text-sm font-semibold">Available</label>
                                        </div>
                                        <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-300 shadow-md">
                                            {isEditingMenuItem ? 'Update Item' : 'Add Item'}
                                        </button>
                                        {isEditingMenuItem && (
                                            <button type="button" onClick={() => {
                                                setIsEditingMenuItem(false);
                                                setCurrentMenuItem(null);
                                                setMenuForm({ name: '', description: '', price: '', category: '', imageUrl: '', isAvailable: true });
                                            }} className="ml-4 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition duration-300 shadow-md">
                                                Cancel
                                            </button>
                                        )}
                                    </form>
                                </div>

                                {/* Menu Items List */}
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Current Menu Items</h3>
                                {menuItems.length === 0 ? (
                                    <p className="text-gray-600">No menu items added yet.</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full bg-white rounded-lg shadow-md">
                                            <thead>
                                                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                                                    <th className="py-3 px-6 text-left">Name</th>
                                                    <th className="py-3 px-6 text-left">Category</th>
                                                    <th className="py-3 px-6 text-left">Price</th>
                                                    <th className="py-3 px-6 text-left">Available</th>
                                                    <th className="py-3 px-6 text-center">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-gray-700 text-sm font-light">
                                                {menuItems.map(item => (
                                                    <tr key={item._id} className="border-b border-gray-200 hover:bg-gray-50">
                                                        <td className="py-3 px-6 text-left">{item.name}</td>
                                                        <td className="py-3 px-6 text-left">{item.category}</td>
                                                        <td className="py-3 px-6 text-left">KES {item.price.toFixed(2)}</td>
                                                        <td className="py-3 px-6 text-left">{item.isAvailable ? 'Yes' : 'No'}</td>
                                                        <td className="py-3 px-6 text-center">
                                                            <button onClick={() => handleEditMenuItem(item)} className="text-blue-500 hover:text-blue-700 mr-3">Edit</button>
                                                            <button onClick={() => handleDeleteMenuItem(item._id)} className="text-red-500 hover:text-red-700">Delete</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'users' && (
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">All Users</h2>
                                {adminUsers.length === 0 ? (
                                    <p className="text-gray-600">No users found.</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full bg-white rounded-lg shadow-md">
                                            <thead>
                                                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                                                    <th className="py-3 px-6 text-left">User ID</th>
                                                    <th className="py-3 px-6 text-left">Name</th>
                                                    <th className="py-3 px-6 text-left">Email</th>
                                                    <th className="py-3 px-6 text-left">Loyalty Points</th>
                                                    <th className="py-3 px-6 text-left">Role</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-gray-700 text-sm font-light">
                                                {adminUsers.map(user => (
                                                    <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50">
                                                        <td className="py-3 px-6 text-left whitespace-nowrap">{user._id.substring(0, 8)}</td>
                                                        <td className="py-3 px-6 text-left">{user.name}</td>
                                                        <td className="py-3 px-6 text-left">{user.email}</td>
                                                        <td className="py-3 px-6 text-left">{user.loyaltyPoints}</td>
                                                        <td className="py-3 px-6 text-left">{user.role}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const TabButton = ({ active, onClick, children }) => (
    <button
        className={`px-6 py-3 text-lg font-semibold rounded-t-lg transition-colors duration-300
            ${active ? 'bg-orange-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        onClick={onClick}
    >
        {children}
    </button>
);

const InfoCard = ({ title, value }) => (
    <div className="bg-orange-50 p-6 rounded-xl shadow-md border border-orange-200 text-center">
        <h3 className="text-lg font-semibold text-orange-700 mb-2">{title}</h3>
        <p className="text-4xl font-bold text-orange-800">{value}</p>
    </div>
);

// --- Main App Component ---
function App() {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [currentPage, setCurrentPage] = useState('home'); // Default page
    const [pageProps, setPageProps] = useState({}); // New state for passing props to pages
    const [cart, setCart] = useState([]);
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [isLoadingUser, setIsLoadingUser] = useState(true);

    // Load user and token from localStorage on initial render
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedToken && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setToken(storedToken);
                setCurrentPage('home');
            } catch (e) {
                console.error("Failed to parse stored user data:", e);
                localStorage.clear();
                setCurrentPage('auth');
            }
        } else {
            setCurrentPage('auth');
        }
        setIsLoadingUser(false);
    }, []);

    // Modified setCurrentPage to accept props
    const handleSetCurrentPage = (page, props = {}) => {
        setCurrentPage(page);
        setPageProps(props);
    };

    const showNotification = (message, type = 'info') => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification({ message: '', type: '' });
        }, 3000);
    };

    const handleLoginSuccess = (userData, userToken) => {
        setUser(userData);
        setToken(userToken);
        handleSetCurrentPage('home');
    };

    const handleLogout = () => {
        setUser(null);
        setToken(null);
        localStorage.clear();
        setCart([]);
        handleSetCurrentPage('auth');
        showNotification('Logged out successfully!', 'info');
    };

    const updateLoyaltyPoints = (pointsChange) => {
        setUser(prevUser => {
            if (prevUser) {
                const newPoints = prevUser.loyaltyPoints + pointsChange;
                const updatedUser = { ...prevUser, loyaltyPoints: newPoints };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                return updatedUser;
            }
            return prevUser;
        });
    };

    const addToCart = (item) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(cartItem => cartItem._id === item._id);
            if (existingItem) {
                return prevCart.map(cartItem =>
                    cartItem._id === item._id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            } else {
                return [...prevCart, { ...item, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (itemId) => {
        setCart(prevCart => prevCart.filter(item => item._id !== itemId));
    };

    const updateCartQuantity = (itemId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(itemId);
        } else {
            setCart(prevCart =>
                prevCart.map(item =>
                    item._id === itemId ? { ...item, quantity: newQuantity } : item
                )
            );
        }
    };

    const clearCart = () => {
        setCart([]);
    };

    // Render content based on current page and authentication status
    const renderPage = () => {
        if (isLoadingUser) {
            return (
                <div className="min-h-screen flex items-center justify-center text-gray-700">
                    Loading application...
                </div>
            );
        }

        if (!user || !token) {
            return <AuthPage onLoginSuccess={handleLoginSuccess} showNotification={showNotification} />;
        }

        switch (currentPage) {
            case 'home':
                return <HomePage user={user} setCurrentPage={handleSetCurrentPage} />;
            case 'menu':
                return <MenuPage showNotification={showNotification} />;
            case 'cart':
                return <CartPage showNotification={showNotification} setCurrentPage={handleSetCurrentPage} />;
            case 'myOrders':
                return <MyOrdersPage showNotification={showNotification} setCurrentPage={handleSetCurrentPage} />; // Pass setCurrentPage
            case 'reservations':
                // eslint-disable-next-line react/jsx-no-undef
                return <ReservationsPage showNotification={showNotification} />;
            case 'loyalty':
                return <LoyaltyPage showNotification={showNotification} />;
            case 'admin':
                return user.role === 'admin' ? (
                    <AdminDashboard showNotification={showNotification} />
                ) : (
                    <div className="min-h-screen flex items-center justify-center text-red-600 text-2xl font-bold">
                        Access Denied: You do not have permission to view this page.
                    </div>
                );
            case 'trackOrder': // New case for order tracking
                return <OrderTrackingPage showNotification={showNotification} orderId={pageProps.orderId} />;
            default:
                return <HomePage user={user} setCurrentPage={handleSetCurrentPage} />;
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, addToCart, removeFromCart, updateCartQuantity, clearCart, cart, updateLoyaltyPoints }}>
            <div className="font-inter antialiased min-h-screen flex flex-col">
                {/* Navigation Bar */}
                <header className="bg-white shadow-md p-4 sticky top-0 z-40">
                    <nav className="max-w-7xl mx-auto flex justify-between items-center">
                        <div className="text-2xl font-bold text-orange-700">My Restaurant</div>
                        {!isLoadingUser && user && (
                            <div className="flex items-center space-x-4">
                                <NavLink icon={<Home size={20} />} text="Home" onClick={() => handleSetCurrentPage('home')} active={currentPage === 'home'} />
                                <NavLink icon={<Menu size={20} />} text="Menu" onClick={() => handleSetCurrentPage('menu')} active={currentPage === 'menu'} />
                                <NavLink icon={<ShoppingCart size={20} />} text={`Cart (${cart.length})`} onClick={() => handleSetCurrentPage('cart')} active={currentPage === 'cart'} />
                                <NavLink icon={<CalendarDays size={20} />} text="Reservations" onClick={() => handleSetCurrentPage('reservations')} active={currentPage === 'reservations'} />
                                <NavLink icon={<Gift size={20} />} text="Loyalty" onClick={() => handleSetCurrentPage('loyalty')} active={currentPage === 'loyalty'} />
                                <NavLink icon={<User size={20} />} text="My Orders" onClick={() => handleSetCurrentPage('myOrders')} active={currentPage === 'myOrders'} />
                                {user.role === 'admin' && (
                                    <NavLink icon={<LayoutDashboard size={20} />} text="Admin" onClick={() => handleSetCurrentPage('admin')} active={currentPage === 'admin'} />
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 text-gray-600 hover:text-red-600 font-semibold px-3 py-2 rounded-lg transition duration-300"
                                >
                                    <LogOut size={20} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </nav>
                </header>

                {/* Main Content */}
                <main className="flex-grow">
                    {renderPage()}
                </main>

                {/* Notification Bar */}
                <NotificationBar message={notification.message} type={notification.type} onClose={() => setNotification({ message: '', type: '' })} />

                {/* Footer */}
                <footer className="bg-gray-800 text-white p-6 text-center mt-auto">
                    <div className="max-w-7xl mx-auto">
                        <p>&copy; {new Date().getFullYear()} My Restaurant. All rights reserved.</p>
                        <p className="text-sm mt-2">Designed with ❤️ by Philemon </p>
                    </div>
                </footer>
            </div>
        </AuthContext.Provider>
    );
}

// Helper component for navigation links
const NavLink = ({ icon, text, onClick, active }) => (
    <button
        onClick={onClick}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition duration-300
            ${active ? 'bg-orange-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100 hover:text-orange-600'}`}
    >
        {icon}
        <span className="font-semibold">{text}</span>
    </button>
);

export default App;
