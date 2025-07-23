
import React from 'react';
import AnimatedPage from '../components/AnimatedPage.tsx';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
    return (
        <AnimatedPage>
            <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-[#F7FFF7]">
                <h1 className="text-8xl font-bold font-serif text-black">404</h1>
                <h2 className="text-3xl font-serif text-black mt-4">Page Not Found</h2>
                <p className="text-black/80 mt-2">The page you are looking for does not exist or has been moved.</p>
                <Link to="/">
                    <button className="mt-8 px-8 py-3 bg-accent-color text-white font-bold rounded-full shadow-lg hover:bg-[#15803D] transition-colors duration-300">
                        Go to Homepage
                    </button>
                </Link>
            </div>
        </AnimatedPage>
    );
};

export default NotFound;