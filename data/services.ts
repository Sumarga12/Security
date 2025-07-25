
import { Service } from '../types.ts';

export const services: Service[] = [
    // General Cleaning
    {
        id: 'gc1',
        category: 'General Cleaning',
        name: 'General House Cleaning',
        price: 2000,
        description: 'Thorough cleaning of all rooms, dusting, vacuuming, mopping, and surface sanitization.',
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'gc2',
        category: 'General Cleaning',
        name: 'Spring Cleaning',
        price: 2500,
        description: 'Deep seasonal cleaning including baseboards, vents, and hard-to-reach areas.',
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'gc3',
        category: 'General Cleaning',
        name: 'After-Party Cleaning',
        price: 2200,
        description: 'Quick and efficient cleaning after events or gatherings, including trash removal.',
        imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    },
    // Kitchen
    {
        id: 'k1',
        category: 'Kitchen',
        name: 'Kitchen Deep Cleaning',
        price: 2500,
        description: 'Deep cleaning of countertops, appliances, cabinets, sinks, and floors for a sparkling kitchen.',
        imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'k2',
        category: 'Kitchen',
        name: 'Appliance Cleaning',
        price: 1200,
        description: 'Detailed cleaning of ovens, microwaves, refrigerators, and other kitchen appliances.',
        imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'k3',
        category: 'Kitchen',
        name: 'Grease Removal',
        price: 1400,
        description: 'Removal of tough grease and grime from kitchen surfaces and exhaust fans.',
        imageUrl: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80'
    },
    // Bathroom
    {
        id: 'b1',
        category: 'Bathroom',
        name: 'Bathroom Cleaning',
        price: 1800,
        description: 'Disinfection and scrubbing of toilets, showers, sinks, mirrors, and tiles.',
        imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'b2',
        category: 'Bathroom',
        name: 'Tile & Grout Cleaning',
        price: 1600,
        description: 'Deep cleaning and whitening of bathroom tiles and grout lines.',
        imageUrl: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'b3',
        category: 'Bathroom',
        name: 'Hard Water Stain Removal',
        price: 1500,
        description: 'Removal of hard water stains from glass, faucets, and bathroom fixtures.',
        imageUrl: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80'
    },
    // Carpet & Upholstery
    {
        id: 'cu1',
        category: 'Carpet & Upholstery',
        name: 'Carpet Cleaning',
        price: 3000,
        description: 'Professional cleaning and stain removal for carpets and rugs.',
        imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'cu2',
        category: 'Carpet & Upholstery',
        name: 'Upholstery Cleaning',
        price: 2200,
        description: 'Deep cleaning and sanitization of sofas, chairs, and upholstered furniture.',
        imageUrl: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'cu3',
        category: 'Carpet & Upholstery',
        name: 'Rug Cleaning',
        price: 1800,
        description: 'Gentle and effective cleaning for all types of area rugs.',
        imageUrl: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80'
    },
    // Windows
    {
        id: 'w1',
        category: 'Windows',
        name: 'Window & Glass Cleaning',
        price: 1200,
        description: 'Streak-free cleaning of windows, glass doors, and mirrors.',
        imageUrl: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3fd8?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'w2',
        category: 'Windows',
        name: 'Screen Cleaning',
        price: 900,
        description: 'Removal of dust and dirt from window screens and mesh.',
        imageUrl: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'w3',
        category: 'Windows',
        name: 'Window Track Cleaning',
        price: 1000,
        description: 'Detailed cleaning of window tracks and sills for smooth operation.',
        imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80'
    },
    // Move-In/Move-Out
    {
        id: 'mm1',
        category: 'Move-In/Move-Out',
        name: 'Move-In Cleaning',
        price: 3500,
        description: 'Comprehensive cleaning for homes before moving in, ensuring a fresh start.',
        imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'mm2',
        category: 'Move-In/Move-Out',
        name: 'Move-Out Cleaning',
        price: 3400,
        description: 'Thorough cleaning to help you get your deposit back when moving out.',
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'mm3',
        category: 'Move-In/Move-Out',
        name: 'Post-Renovation Cleaning',
        price: 4000,
        description: 'Removal of dust and debris after home renovations or repairs.',
        imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    },
    // Sofa & Mattress
    {
        id: 'sm1',
        category: 'Sofa & Mattress',
        name: 'Sofa Cleaning',
        price: 2200,
        description: 'Deep cleaning and sanitization of sofas to remove dust and allergens.',
        imageUrl: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'sm2',
        category: 'Sofa & Mattress',
        name: 'Mattress Cleaning',
        price: 2000,
        description: 'Professional cleaning and deodorizing of mattresses for a healthier sleep.',
        imageUrl: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'sm3',
        category: 'Sofa & Mattress',
        name: 'Cushion Cleaning',
        price: 1000,
        description: 'Gentle cleaning of cushions and pillows to remove dust and stains.',
        imageUrl: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3fd8?auto=format&fit=crop&w=800&q=80'
    }
];