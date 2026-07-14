import { motion } from 'framer-motion';

export const KoruptorCard = ({ nama, status }: { nama: string, status: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="border border-surface-700 p-6 font-mono text-white bg-surface-900 hover:border-accent transition-all duration-300"
  >
    <h2 className="text-xl font-bold uppercase tracking-tight">{nama}</h2>
    <p className="text-accent mt-2 text-sm uppercase tracking-widest">{status}</p>
  </motion.div>
);
