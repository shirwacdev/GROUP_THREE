import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ background: '#16161f', borderTop: '1px solid #2a2a3a' }} className="mt-16">
      <div className="max-w-6xl mx-auto px-6 py-10">

        <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">

          <div>
            <div className="flex items-center gap-2 mb-3">
              <div style={{ background: '#6366f1', borderRadius: '6px' }} className="w-7 h-7 flex items-center justify-center">
                <LayoutGrid className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold">QuizMaster</span>
            </div>
            <p className="text-slate-500 text-sm max-w-xs">
              A quiz platform for students. Test your knowledge across multiple topics.
            </p>
          </div>

          <div className="flex gap-12">
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Platform</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link to="/" className="hover:text-white">Home</Link></li>
                <li><Link to="/categories" className="hover:text-white">Categories</Link></li>
                <li><Link to="/leaderboard" className="hover:text-white">Leaderboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Account</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link to="/login" className="hover:text-white">Login</Link></li>
                <li><Link to="/register" className="hover:text-white">Register</Link></li>
              </ul>
            </div>
          </div>

        </div>

        <div style={{ borderTop: '1px solid #2a2a3a' }} className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-slate-500 text-sm">© 2026 QuizMaster. All rights reserved.</p>
          <p className="text-slate-600 text-sm">Graduation project — built with React & Node.js</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
