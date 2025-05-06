import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

// Import the logo from assets
import logoSvg from '../assets/advantage-ceo-final.svg';

const Home = () => {
  return (
    <div className="flex-1 bg-gradient-to-br from-white to-neutral-100">
      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <img src={logoSvg} alt="AdvantageCEO Logo" className="h-32 w-auto" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-extrabold text-neutral-900 sm:text-5xl md:text-6xl"
          >
            <span className="block">Welcome to</span>
            <span className="block text-blue-600">AdvantageCEO</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-3 max-w-md mx-auto text-base text-neutral-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"
          >
            Transform your company's performance with the 5xCEO framework. Analyze, interpret, and act on your assessment data.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10"
          >
            <Link href="/login">
              <Button className="rounded-md px-8 py-3 text-base font-medium">
                Login
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-24 grid grid-cols-1 gap-8 md:grid-cols-3"
        >
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Strategic Clarity</h3>
            <p className="text-neutral-600">Develop and communicate a clear, compelling vision and strategy.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Scalable Talent</h3>
            <p className="text-neutral-600">Systems for attracting, developing, and retaining exceptional people.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Relentless Focus</h3>
            <p className="text-neutral-600">Concentrate resources on highest-value activities and avoid distractions.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Disciplined Execution</h3>
            <p className="text-neutral-600">Consistently meet or exceed commitments and drive results.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Energized Culture</h3>
            <p className="text-neutral-600">Foster an environment of engagement, innovation, and high performance.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Your Success</h3>
            <p className="text-neutral-600">Implement the 5xCEO framework to transform your organization.</p>
          </div>
        </motion.div>
      </div>
      
      <footer className="bg-white border-t border-neutral-200 mt-20">
        <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center text-neutral-500">
            &copy; {new Date().getFullYear()} AdvantageCEO. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;