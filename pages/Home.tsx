
import React from 'react';
import AnimatedPage from '../components/AnimatedPage.tsx';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { testimonials } from '../data/testimonials.ts';

const Home: React.FC = () => {
    return (
        <AnimatedPage>
            {/* Hero Section */}
            <section className="bg-[#F7FFF7]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <motion.div 
                            className="text-left"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-black">Your Home, Our Care: Spotless Every Time.</h1>
                            <p className="mt-4 text-lg md:text-xl max-w-xl text-black/80">Every corner, every material—meticulously cleaned for your peace of mind.</p>
                        </motion.div>
                         <motion.div 
                            className="relative h-96 rounded-lg overflow-hidden shadow-xl"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                         >
                            <img src="https://bangsalon.com/wp-content/uploads/2023/11/banghome-page.jpg" alt="Stylist working on hair" className="w-full h-full object-cover"/>
                        </motion.div>
                    </div>
                </div>
            </section>
            
            {/* Service Intro Section */}
             <section className="py-16 sm:py-24 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div 
                            className="grid grid-cols-2 gap-4"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8, staggerChildren: 0.2 }}
                        >
                            <img src="https://img.freepik.com/premium-photo/hairdressers-makeup-artist-working-beauty-salon_10069-11140.jpg" alt="Hair Wash" className="rounded-lg shadow-lg object-cover h-full w-full"/>
                            <div className="space-y-4">
                               <img src="https://www.looksunisexsalon.com/wp-content/uploads/2024/08/looks-salon-image-1.jpg" alt="Waxing" className="rounded-lg shadow-lg object-cover h-full w-full"/>
                               {/* <img src="https://picsum.photos/seed/skincare-grid/400/242" alt="Skincare" className="rounded-lg shadow-lg object-cover h-full w-full"/> */}
                            </div>
                        </motion.div>
                         <motion.div 
                            className="text-left"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-3xl md:text-4xl font-serif text-black">Counters to carpets, tiles to windows—tailored cleaning that makes your space shine.</h2>
                            <Link to="/services">
                                <motion.button 
                                    className="mt-6 inline-flex items-center px-8 py-3 bg-accent-color text-white font-bold rounded-full shadow-lg hover:bg-[#15803D] transition-colors duration-300"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Explore Services
                                    <ArrowRightIcon className="ml-2 h-5 w-5"/>
                                </motion.button>
                            </Link>
                         </motion.div>
                    </div>
                </div>
            </section>

             {/* Feedback Section */}
            <section className="py-16 sm:py-24 bg-[#F7FFF7]">
                 <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.h2 
                        className="text-3xl md:text-4xl font-serif text-center text-black mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.6 }}
                    >
                        Feedback
                    </motion.h2>
                    <motion.div 
                        className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.8 }}
                    >
                        <img src={testimonials[0].imageUrl} alt={testimonials[0].name} className="w-full h-auto max-h-[400px] object-cover rounded-lg shadow-lg"/>
                        <div className="text-left">
                            <h3 className="text-xl font-semibold font-serif text-black">{testimonials[0].name}</h3>
                            <p className="mt-2 text-lg text-black/90 leading-relaxed">"{testimonials[0].quote}"</p>
                        </div>
                    </motion.div>
                 </div>
            </section>
        </AnimatedPage>
    );
};

export default Home;