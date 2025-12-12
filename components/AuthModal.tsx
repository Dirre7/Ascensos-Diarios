import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { X, Mail, Lock, Loader2, Cloud, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  translations: any;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, translations }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const t = translations; // Shortcut

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onClose();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage(t.success);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          
          {/* Bottom Sheet Modal */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-[2rem] shadow-[0_-8px_30px_rgba(0,0,0,0.12)] z-[70] overflow-hidden border-t border-slate-100 dark:border-slate-800"
          >
            {/* Drag Handle */}
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mt-4 mb-2" />

            <div className="p-6 pb-10">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl">
                        <Cloud className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-800 dark:text-white leading-none mb-1">
                        {isLogin ? t.welcomeBack : t.joinUs}
                        </h2>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            {isLogin ? t.syncDesc : t.joinDesc}
                        </p>
                    </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </button>
              </div>

              {/* Feedback Messages */}
              <AnimatePresence mode="wait">
                {error && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-2xl font-semibold border border-red-100 dark:border-red-900/50"
                    >
                    {error}
                    </motion.div>
                )}

                {message && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm rounded-2xl font-semibold border border-green-100 dark:border-green-900/50"
                    >
                    {message}
                    </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <form onSubmit={handleAuth} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider ml-1">{t.email}</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white font-medium transition-all"
                      placeholder={t.emailPlaceholder}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider ml-1">{t.password}</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white font-medium transition-all"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                        <span>{isLogin ? t.signIn : t.createAccount}</span>
                        <ArrowRight className="w-5 h-5 opacity-80" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-slate-400 text-sm font-medium mb-2">
                    {isLogin ? t.newHere : t.alreadyJoined}
                </p>
                <button
                  onClick={() => { setIsLogin(!isLogin); setError(null); setMessage(null); }}
                  className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline decoration-2 underline-offset-4 transition-all"
                >
                  {isLogin ? t.createAction : t.signInAction}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};