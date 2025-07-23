
import React from 'react';
import AnimatedPage from '../components/AnimatedPage.tsx';
import { motion } from 'framer-motion';
import founderPhoto from '../src/assets/myphoto.jpg';

const team = [
  {
    name: 'Sumarga Puri',
    role: 'Founder & Tech Innovator',
    img: founderPhoto,
    bio: 'A forward-thinking developer whose passion for user-centered design sparked HomeCleaning. Without prior experience in the cleaning industry, he leveraged empathy, research, and creativity to build a seamless experience that empowers both customers and service experts.'
  }
];

const milestones = [
  {
    year: '2021',
    title: 'The Question',
    desc: 'One student asked: "Why can\'t premium home-cleaning come to us?" This simple question sparked the vision for HomeCleaning.'
  },
  {
    year: '2022',
    title: 'Platform Launch',
    desc: 'HomeCleaning launched, connecting busy homeowners with vetted cleaning professionals, delivering convenience and quality.'
  },
  {
    year: '2023',
    title: 'Trusted Name',
    desc: 'HomeCleaning becomes a trusted name in professional at-home cleaning, known for comprehensive coverage and reliability.'
  }
];

const services = [
  {
    icon: '🧽',
    title: 'Comprehensive Coverage',
    desc: 'From soap-scoured bathrooms and sparkling windows to fresh carpets, mattresses, and sofas, we do it all.'
  },
  {
    icon: '📦',
    title: 'Tailored Packages',
    desc: 'General cleaning, deep cleans, move-in/move-out, specialty treatments—you pick what you need.'
  },
  {
    icon: '✅',
    title: 'Trusted Professionals',
    desc: 'Every cleaner is background-checked, trained, and equipped to deliver impeccable results.'
  },
  {
    icon: '📱',
    title: 'Effortless Booking',
    desc: 'Schedule in seconds via our app or website, and relax while we handle the rest.'
  }
];

const About: React.FC = () => {
  return (
    <AnimatedPage>
      {/* Hero Section */}
      <div className="relative h-72 md:h-96 flex items-center justify-center bg-gradient-to-r from-[#22C55E] to-[#166534] overflow-hidden mb-12">
        <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80" alt="Home Cleaning" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg">About HomeCleaning</h1>
          <p className="mt-4 text-lg md:text-2xl font-light drop-shadow">Making a Pristine Home Effortless and Accessible</p>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="max-w-4xl mx-auto px-4 mb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center">
          <p className="text-lg text-black/80 leading-relaxed">
            Since our launch, HomeCleaning has become a trusted name in professional at‐home cleaning. Founded by tech innovator Sumarga Puri, our mission is simple: bring expert kitchen deep-cleaning, carpet & upholstery care, window washing, bathroom sanitization, move-in/move-out cleans—and everything in between—straight to your doorstep, making a pristine home effortless and accessible.
          </p>
        </motion.div>
      </div>

      {/* Story & Timeline Section */}
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 mb-20">
        {/* Story */}
        <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-[#166534] mb-4">Our Story</h2>
          <p className="text-black/80 text-lg mb-4">What began as one student's question—"Why can't premium home-cleaning come to us?"—evolved into a full-service platform. Today, HomeCleaning connects busy homeowners with vetted cleaning professionals, delivering convenience, quality, and peace of mind in every visit.</p>
          <p className="text-black/70">HomeCleaning is more than a service—it's a community built on care, compassion, and a shared belief that a clean home fosters well-being. We're here to simplify your life, one spotless room at a time.</p>
        </motion.div>
        {/* Timeline */}
        <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-1 bg-[#22C55E]/30 rounded-full hidden md:block" />
          <ul className="space-y-10 ml-0 md:ml-12">
            {milestones.map((m, i) => (
              <li key={i} className="relative flex items-start">
                <div className="flex flex-col items-center mr-4 md:mr-8">
                  <div className="w-8 h-8 rounded-full bg-[#22C55E] flex items-center justify-center text-white font-bold text-lg shadow-lg">{i+1}</div>
                  {i < milestones.length - 1 && <div className="w-1 h-16 bg-[#22C55E]/30" />}
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-[#166534]">{m.year} — {m.title}</h4>
                  <p className="text-black/70 mt-1">{m.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Meet the Team Section */}
      <div className="bg-[#F7FFF7] py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#166534] mb-10">Meet the Founder</h2>
          <div className="grid md:grid-cols-2 gap-10">
            {team.map((member, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: idx * 0.2 }} className="bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row items-center gap-8">
                <img src={member.img} alt={member.name} className="w-32 h-32 rounded-full object-cover border-4 border-[#22C55E] shadow-md" />
                <div>
                  <h3 className="text-2xl font-bold text-[#166534]">{member.name}</h3>
                  <p className="text-[#22C55E] font-semibold mb-2">{member.role}</p>
                  <p className="text-black/80">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-[#166534] mb-12">Why Choose Us?</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: idx * 0.1 }} className="bg-white rounded-xl shadow-lg p-8 flex items-start gap-4">
              <span className="text-3xl flex-shrink-0">{service.icon}</span>
              <div>
                <h4 className="text-xl font-bold text-[#166534] mb-2">{service.title}</h4>
                <p className="text-black/70">{service.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Our Commitment Section */}
      <div className="bg-[#F7FFF7] py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#166534] mb-6">Our Commitment</h2>
          <p className="text-lg text-black/80 leading-relaxed">
            HomeCleaning is more than a service—it's a community built on care, compassion, and a shared belief that a clean home fosters well-being. We're here to simplify your life, one spotless room at a time.
          </p>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default About;
