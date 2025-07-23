
import React, { useState } from 'react';
import AnimatedPage from '../components/AnimatedPage.tsx';
import { motion } from 'framer-motion';
import { PhoneIcon, EnvelopeIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';
import { FaTwitter, FaInstagram, FaFacebook, FaLinkedin } from 'react-icons/fa';

const Contact: React.FC = () => {
    const [status, setStatus] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        setTimeout(() => {
            setStatus('sent');
        }, 1500);
    };

    const contactMethods = [
        {
            icon: PhoneIcon,
            title: 'Call Us',
            info: '+977-9864921463',
            description: 'Speak directly with our team'
        },
        {
            icon: EnvelopeIcon,
            title: 'Email Us',
            info: 'hglam0052@gmail.com',
            description: 'Send us a detailed message'
        },
        {
            icon: MapPinIcon,
            title: 'Visit Us',
            info: 'Kathmandu, Nepal',
            description: 'Our headquarters location'
        }
    ];

    const businessHours = [
        { day: 'Monday - Friday', hours: '8:00 AM - 8:00 PM' },
        { day: 'Saturday', hours: '9:00 AM - 6:00 PM' },
        { day: 'Sunday', hours: '10:00 AM - 4:00 PM' }
    ];

    return (
        <AnimatedPage>
            {/* Hero Section */}
            <div className="relative h-64 md:h-80 flex items-center justify-center bg-gradient-to-r from-[#22C55E] to-[#166534] overflow-hidden mb-12">
                <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80" alt="Customer Service" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                <div className="relative z-10 text-center text-white">
                    <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg">Get In Touch</h1>
                    <p className="mt-4 text-lg md:text-2xl font-light drop-shadow">We're here to help with all your cleaning needs</p>
                </div>
            </div>

            {/* Contact Methods */}
            <div className="max-w-6xl mx-auto px-4 mb-16">
                <div className="grid md:grid-cols-3 gap-8">
                    {contactMethods.map((method, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: idx * 0.1 }}
                            className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow"
                        >
                            <method.icon className="h-12 w-12 text-[#22C55E] mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-[#166534] mb-2">{method.title}</h3>
                            <p className="text-lg font-semibold text-black mb-2">{method.info}</p>
                            <p className="text-black/70">{method.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-16 mb-16">
                {/* Contact Form */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="bg-white rounded-xl shadow-lg p-8"
                >
                    <h2 className="text-3xl font-bold text-[#166534] mb-6">Send Us a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <input 
                                type="text" 
                                placeholder="Your Name" 
                                required 
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 ring-[#22C55E] focus:border-transparent transition" 
                            />
                            <input 
                                type="email" 
                                placeholder="Email Address" 
                                required 
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 ring-[#22C55E] focus:border-transparent transition" 
                            />
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <input 
                                type="tel" 
                                placeholder="Phone Number" 
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 ring-[#22C55E] focus:border-transparent transition" 
                            />
                            <select className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 ring-[#22C55E] focus:border-transparent transition">
                                <option value="">Select Service</option>
                                <option value="general">General Cleaning</option>
                                <option value="deep">Deep Cleaning</option>
                                <option value="kitchen">Kitchen Cleaning</option>
                                <option value="bathroom">Bathroom Cleaning</option>
                                <option value="carpet">Carpet Cleaning</option>
                                <option value="move">Move-in/Move-out</option>
                            </select>
                        </div>
                        <textarea 
                            placeholder="Tell us about your cleaning needs..." 
                            rows={5} 
                            required 
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 ring-[#22C55E] focus:border-transparent transition"
                        />
                        <motion.button
                            type="submit"
                            className="w-full py-4 px-6 bg-[#22C55E] text-white font-bold rounded-lg shadow-lg hover:bg-[#15803D] transition-colors duration-300 disabled:bg-gray-400"
                            disabled={status === 'sending'}
                            whileHover={{ scale: status !== 'sending' ? 1.02 : 1 }}
                            whileTap={{ scale: status !== 'sending' ? 0.98 : 1 }}
                        >
                            {status === 'sending' ? 'Sending Message...' : status === 'sent' ? 'Message Sent!' : 'Send Message'}
                        </motion.button>
                        {status === 'sent' && (
                            <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-green-600 text-center font-semibold"
                            >
                                Thank you! We'll get back to you within 24 hours.
                            </motion.p>
                        )}
                    </form>
                </motion.div>

                {/* Business Info */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="space-y-8"
                >
                    {/* Business Hours */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="flex items-center mb-6">
                            <ClockIcon className="h-8 w-8 text-[#22C55E] mr-3" />
                            <h3 className="text-2xl font-bold text-[#166534]">Business Hours</h3>
                        </div>
                        <div className="space-y-4">
                            {businessHours.map((schedule, idx) => (
                                <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                                    <span className="font-semibold text-black">{schedule.day}</span>
                                    <span className="text-[#22C55E] font-medium">{schedule.hours}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Service Areas */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <h3 className="text-2xl font-bold text-[#166534] mb-4">Service Areas</h3>
                        <p className="text-black/80 mb-4">We proudly serve the greater Kathmandu area and surrounding regions.</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <span className="text-black/70">• Kathmandu</span>
                            <span className="text-black/70">• Lalitpur</span>
                            <span className="text-black/70">• Bhaktapur</span>
                            <span className="text-black/70">• Kirtipur</span>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <h3 className="text-2xl font-bold text-[#166534] mb-4">Follow Us</h3>
                        <p className="text-black/80 mb-6">Stay updated with our latest services and cleaning tips.</p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-12 h-12 bg-[#22C55E] text-white rounded-full flex items-center justify-center hover:bg-[#15803D] transition-colors">
                                <FaFacebook size={20} />
                            </a>
                            <a href="#" className="w-12 h-12 bg-[#22C55E] text-white rounded-full flex items-center justify-center hover:bg-[#15803D] transition-colors">
                                <FaInstagram size={20} />
                            </a>
                            <a href="#" className="w-12 h-12 bg-[#22C55E] text-white rounded-full flex items-center justify-center hover:bg-[#15803D] transition-colors">
                                <FaTwitter size={20} />
                            </a>
                            <a href="#" className="w-12 h-12 bg-[#22C55E] text-white rounded-full flex items-center justify-center hover:bg-[#15803D] transition-colors">
                                <FaLinkedin size={20} />
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Map Section */}
            <div className="max-w-6xl mx-auto px-4 mb-16">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="bg-white rounded-xl shadow-lg p-8"
                >
                    <h3 className="text-2xl font-bold text-[#166534] mb-6 text-center">Our Location</h3>
                    <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                        <div className="text-center">
                            <MapPinIcon className="h-16 w-16 text-[#22C55E] mx-auto mb-4" />
                            <p className="text-lg font-semibold text-black">Kathmandu, Nepal</p>
                            <p className="text-black/70">Map integration coming soon</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatedPage>
    );
};

export default Contact;