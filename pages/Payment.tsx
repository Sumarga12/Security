
import React, { useState, useEffect } from 'react';
import AnimatedPage from '../components/AnimatedPage.tsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

// Import payment logos
import esewaLogo from '../src/assets/esewa.jpeg';
import khaltiLogo from '../src/assets/Khalti.jpg';
import { paymentsAPI } from '../src/api/payments';
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe((import.meta as any).env.VITE_STRIPE_PUBLISHABLE_KEY);

const paymentOptions = [
    { name: 'Visa / MasterCard', logo: '💳', type: 'emoji' },
    { name: 'PayPal', logo: '🅿️', type: 'emoji' },
    { name: 'eSewa', logo: esewaLogo, type: 'image' },
    { name: 'Khalti', logo: khaltiLogo, type: 'image' }
];

const inputClass = "w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 ring-accent-color focus:border-transparent transition";

// Nepali phone number validation function
const validateNepaliPhoneNumber = (phoneNumber: string): boolean => {
    // Remove all non-digit characters
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    // Check if it's a valid Nepali mobile number (10 digits starting with 98, 97, 96, etc.)
    const mobilePattern = /^(98|97|96|95|94|93|92|91|90)\d{8}$/;
    // Check if it's a valid Nepali landline number (7 digits after area code)
    const landlinePattern = /^01\d{7}$/;
    return mobilePattern.test(cleanNumber) || landlinePattern.test(cleanNumber);
};

// Function to format phone number as user types
const formatPhoneNumber = (value: string): string => {
    // Remove all non-digit characters
    const cleanNumber = value.replace(/\D/g, '');
    // Limit to 10 digits
    const limitedNumber = cleanNumber.slice(0, 10);
    // Format based on length
    if (limitedNumber.length <= 2) {
        return limitedNumber;
    } else if (limitedNumber.length <= 6) {
        return `${limitedNumber.slice(0, 2)}-${limitedNumber.slice(2)}`;
    } else {
        return `${limitedNumber.slice(0, 2)}-${limitedNumber.slice(2, 6)}-${limitedNumber.slice(6)}`;
    }
};

const VisaForm = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 mt-6">
        <input type="text" placeholder="Cardholder Name" className={inputClass} />
        <input type="text" inputMode="numeric" placeholder="Card Number (e.g., 1234 5678 9101 1121)" className={inputClass} />
        <div className="flex space-x-4">
            <input type="text" placeholder="Expiry Date (MM/YY)" className={inputClass} />
            <input type="text" inputMode="numeric" placeholder="CVV" className={inputClass} />
        </div>
    </motion.div>
);

const PayPalForm = () => (
     <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 mt-6">
        <p className="text-sm text-gray-600 text-center">You will be redirected to PayPal to complete your payment securely.</p>
        <input type="email" placeholder="PayPal Email" className={inputClass} />
    </motion.div>
);

const WalletForm: React.FC<{ walletName: 'eSewa' | 'Khalti'}> = ({ walletName }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [mpin, setMpin] = useState('');

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const formattedValue = formatPhoneNumber(value);
        setPhoneNumber(formattedValue);
        // Clear error when user starts typing
        if (phoneError) {
            setPhoneError('');
        }
        // Validate when user finishes typing (10 digits)
        if (formattedValue.replace(/\D/g, '').length === 10) {
            if (!validateNepaliPhoneNumber(formattedValue)) {
                setPhoneError('Please enter a valid Nepali phone number (e.g., 98-1234-5678)');
            } else {
                setPhoneError('');
            }
        }
    };

    const handlePhoneBlur = () => {
        if (phoneNumber && !validateNepaliPhoneNumber(phoneNumber)) {
            setPhoneError('Please enter a valid Nepali phone number (e.g., 98-1234-5678)');
        }
    };

    const handleMpinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Only allow digits and limit to 6 characters
        const numericValue = value.replace(/\D/g, '').slice(0, 6);
        setMpin(numericValue);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 mt-6">
            <div>
                <input 
                    type="text" 
                    inputMode="tel" 
                    placeholder={`${walletName} ID (Phone Number)`} 
                    className={`${inputClass} ${phoneError ? 'border-red-500 focus:ring-red-500' : ''}`}
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    onBlur={handlePhoneBlur}
                    maxLength={12} // 10 digits + 2 hyphens
                />
                {phoneError && (
                    <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                    Format: 98-1234-5678 (Mobile) or 01-1234567 (Landline)
                </p>
            </div>
            <div>
                <input 
                    type="password" 
                    inputMode="numeric"
                    placeholder={`${walletName} Password / MPIN`} 
                    className={inputClass}
                    value={mpin}
                    onChange={handleMpinChange}
                    maxLength={6}
                />
                <p className="text-gray-500 text-xs mt-1">
                    Enter 4-6 digit MPIN (numbers only)
                </p>
            </div>
        </motion.div>
    );
};

const Payment: React.FC = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);
    const [stripeError, setStripeError] = useState<string | null>(null);
    const [lastPaymentIntentFor, setLastPaymentIntentFor] = useState<string | null>(null);

    const { items, appointmentDetails, totalPrice } = state || {};

    useEffect(() => {
      if (
        selectedPayment === 'Visa / MasterCard' &&
        appointmentDetails &&
        appointmentDetails._id &&
        lastPaymentIntentFor !== appointmentDetails._id
      ) {
        paymentsAPI.processPayment({
          appointmentId: appointmentDetails._id,
          paymentMethod: 'Visa / MasterCard',
        }).then(res => {
          setStripeClientSecret(res.clientSecret || null);
          setLastPaymentIntentFor(appointmentDetails._id); // Mark as created
        }).catch(err => {
          setStripeError("Failed to initialize payment. Please try again.");
        });
      }
    }, [selectedPayment, appointmentDetails, lastPaymentIntentFor]);

    const handlePayment = () => {
        if (!selectedPayment) return;
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            setPaymentSuccess(true);
            navigate('/profile');
        }, 2000);
    };

    if (!items || items.length === 0) {
         return (
            <AnimatedPage>
                <div className="text-center py-20">
                    <h2 className="text-2xl font-serif">Invalid Payment Request.</h2>
                    <p className="mt-2">No appointment details found.</p>
                    <button onClick={() => navigate('/')} className="mt-4 px-6 py-2 bg-accent-color text-white font-bold rounded-lg">Go Home</button>
                </div>
            </AnimatedPage>
        );
    }
    
    return (
        <AnimatedPage>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-serif text-center text-[#4E443C] mb-8">Complete Your Payment</h1>
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="border-b border-gray-200 pb-4 mb-4">
                            <h2 className="text-xl font-serif text-[#4E443C]">Order Summary</h2>
                            {items.map((item: any) => (
                                <div key={item.id} className="flex justify-between mt-2 text-[#4E443C]/90">
                                    <span>{item.name}</span>
                                    <span className="font-semibold">Rs{item.price}</span>
                                </div>
                            ))}
                            <div className="flex justify-between mt-4 pt-4 border-t font-bold text-[#4E443C]">
                                <span>Total</span><span>Rs{totalPrice}</span></div>
                        </div>
                        <h3 className="text-lg font-serif text-[#4E443C] mb-4">Select Payment Method</h3>
                        <div className="space-y-4">
                            {paymentOptions.map(option => (
                                <div
                                    key={option.name}
                                    onClick={() => setSelectedPayment(option.name)}
                                    className={`p-4 border rounded-lg flex flex-col cursor-pointer transition-all ${selectedPayment === option.name ? 'border-[#22C55E] ring-2 ring-[#22C55E]' : 'border-gray-300 hover:border-gray-400'}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            {option.type === 'emoji' ? (
                                                <span className="text-2xl mr-4">{option.logo}</span>
                                            ) : (
                                                <img src={option.logo} alt={option.name} className="w-8 h-8 mr-4" />
                                            )}
                                            <span className="font-semibold text-[#4E443C]">{option.name}</span>
                                        </div>
                                        {selectedPayment === option.name && <CheckCircleIcon className="w-6 h-6 text-[#22C55E]" />}
                                    </div>
                                    {selectedPayment === option.name && (
                                        <div className="mt-4">
                                            {option.name === 'Visa / MasterCard' && stripeClientSecret && (
                                                <Elements stripe={stripePromise} options={{ clientSecret: stripeClientSecret, appearance: {
                                                    theme: 'stripe',
                                                    variables: {
                                                        colorPrimary: '#22C55E',
                                                        colorBackground: '#ffffff',
                                                        colorText: '#32325d',
                                                        colorDanger: '#e5424d',
                                                        colorTextSecondary: '#525f7f',
                                                        fontFamily: 'Arial, sans-serif',
                                                        spacingUnit: '4px',
                                                        borderRadius: '8px',
                                                    },
                                                } }}>
                                                    <StripeCardForm
                                                        onSuccess={() => {
                                                            setPaymentSuccess(true);
                                                            setStripeError(null);
                                                            setTimeout(() => navigate('/profile'), 2000);
                                                        }}
                                                        onError={(msg) => setStripeError(msg)}
                                                    />
                                                </Elements>
                                            )}
                                            {option.name === 'PayPal' && <PayPalForm />}
                                            {option.name === 'eSewa' && <WalletForm walletName="eSewa" />}
                                            {option.name === 'Khalti' && <WalletForm walletName="Khalti" />}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        {/* Only show Pay button for non-Stripe methods */}
                        {selectedPayment !== 'Visa / MasterCard' && (
                            <motion.button
                                onClick={handlePayment}
                                disabled={!selectedPayment || processing}
                                className="w-full mt-8 py-3 px-6 bg-[#22C55E] text-white font-bold rounded-lg shadow-lg hover:bg-[#15803D] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                whileHover={{ scale: (!selectedPayment || processing) ? 1 : 1.02 }}
                                whileTap={{ scale: (!selectedPayment || processing) ? 1 : 0.98 }}
                            >
                                {processing ? 'Processing...' : `Pay Rs${totalPrice}`}
                            </motion.button>
                        )}
                        {stripeError && (
                            <div className="text-red-500 text-center mt-2">{stripeError}</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            <AnimatePresence>
            {paymentSuccess && (
                 <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <motion.div
                        className="bg-white rounded-lg shadow-2xl max-w-sm w-full p-8 text-center"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ type: 'spring' }}
                    >
                        <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto" />
                        <h2 className="text-2xl font-serif mt-4 text-[#4E443C]">Payment Successful!</h2>
                        <p className="text-[#4E443C]/80 mt-2">Your appointment is confirmed. Redirecting to your profile...</p>
                    </motion.div>
                 </div>
            )}
            </AnimatePresence>
        </AnimatedPage>
    );
};

// StripeCardForm is now a real form that handles payment confirmation
const StripeCardForm: React.FC<{ onSuccess: () => void; onError: (msg: string) => void }> = ({ onSuccess, onError }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setProcessing(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {},
            redirect: "if_required",
        });

        setProcessing(false);

        if (error) {
            onError(error.message || "Payment failed");
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            onSuccess();
        } else {
            onError("Payment was not successful. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement />
            <button
                type="submit"
                disabled={!stripe || processing}
                className="w-full mt-4 py-3 px-6 bg-[#22C55E] text-white font-bold rounded-lg shadow-lg hover:bg-[#15803D] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {processing ? "Processing..." : "Pay with Card"}
            </button>
        </form>
    );
};

export default Payment;
