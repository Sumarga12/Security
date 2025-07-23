
import React, { useState, useMemo } from 'react';
import AnimatedPage from '../components/AnimatedPage.tsx';
import { motion, AnimatePresence } from 'framer-motion';
import { services } from '../data/services.ts';
import { Service } from '../types.ts';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext.tsx';
import { ShoppingCartIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

const categories = ['General Cleaning', 'Kitchen', 'Bathroom', 'Carpet & Upholstery', 'Windows', 'Move-In/Move-Out', 'Sofa & Mattress'];
const defaultCategory = 'General Cleaning';

const ServiceCard: React.FC<{ service: Service, onBook: (service: Service) => void, onAddToCart: (service: Service) => void }> = ({ service, onBook, onAddToCart }) => {
    return (
        <motion.div
            className="relative bg-white rounded-2xl border border-gray-200 shadow-lg group flex flex-col overflow-hidden transition-transform duration-200 hover:scale-[1.025] hover:shadow-2xl"
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="relative overflow-hidden">
                <img src={service.imageUrl} alt={service.name} className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110" />
                <span className="absolute top-3 right-3 bg-black text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">Rs{service.price}</span>
                <span className="absolute top-3 left-3 bg-gray-100 text-black text-xs font-semibold px-3 py-1 rounded-full border border-gray-200">{service.category}</span>
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-serif font-semibold text-black mb-1">{service.name}</h3>
                <div className="flex-grow mt-1">
                     <p className="text-sm text-black/80 line-clamp-2">{service.description}</p>
                </div>
                <div className="mt-5 flex gap-3">
                    <button onClick={() => onBook(service)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold bg-accent-color text-white rounded-lg hover:bg-[#15803D] transition">
                        <CalendarDaysIcon className="w-5 h-5" /> Book Now
                    </button>
                    <button onClick={() => onAddToCart(service)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold bg-gray-200 text-black rounded-lg hover:bg-green-100 transition">
                        <ShoppingCartIcon className="w-5 h-5" /> Add to Cart
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const Services: React.FC = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q')?.toLowerCase() || '';
    const activeTab = searchParams.get('category') || defaultCategory;
    
    const setActiveTab = (tab: string) => {
        setSearchParams({ category: tab });
    };
    
    const handleBookNow = (service: Service) => {
        navigate('/appointment', { state: { service } });
    };

    const handleAddToCart = (service: Service) => {
        addToCart(service);
    }

    const displayedServices = useMemo(() => {
        if (query) {
             return services.filter(s => 
                s.name.toLowerCase().includes(query) ||
                s.category.toLowerCase().includes(query) ||
                s.description.toLowerCase().includes(query)
            );
        }
        return services.filter(s => s.category.includes(activeTab));
    }, [query, activeTab]);

    return (
        <AnimatedPage>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                 <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-serif text-center text-black mb-4">Services</h1>
                 </div>

                {/* Categories Tabs */}
                <div className="flex flex-wrap justify-center gap-2 border-b border-[#166534]/10 my-8 pb-2">
                    {categories.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2 text-sm font-medium rounded-full transition-colors relative
                                ${activeTab === tab ? 'bg-black text-white shadow-md' : 'bg-gray-100 text-black hover:bg-black/10'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {query && (
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-serif">Search Results for "{searchParams.get('q')}"</h2>
                        <button onClick={() => setSearchParams({})} className="text-sm text-black hover:underline mt-1">Clear search</button>
                    </div>
                )}
                
                <AnimatePresence mode="wait">
                    <motion.div
                        key={query || activeTab}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-10"
                    >
                        {displayedServices.length > 0 ? (
                           displayedServices.map((service) => (
                                <ServiceCard key={service.id} service={service} onBook={handleBookNow} onAddToCart={handleAddToCart} />
                            ))
                        ) : (
                             <div className="col-span-full text-center py-10">
                                <h2 className="text-2xl font-serif text-black">No cleaning services found</h2>
                                <p className="text-black/80 mt-2">Please try another category or search term.</p>
                             </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </AnimatedPage>
    );
};

export default Services;
