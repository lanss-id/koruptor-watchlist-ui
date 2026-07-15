import { motion } from 'framer-motion';

export const KoruptorCard = ({ nama, status, sumber, link }: { nama: string, status: string, sumber?: string, link?: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="border border-surface-700 border-l-4 border-l-accent p-5 font-mono text-white bg-surface-900 hover:bg-surface-800 transition-all duration-300"
  >
    <h2 className="text-lg font-bold uppercase tracking-tight">{nama}</h2>
    <p className="text-accent mt-1.5 text-xs uppercase tracking-widest">{status}</p>
    {link && (
      <a href={link} target="_blank" rel="noopener noreferrer" className="text-surface-500 hover:text-accent text-xs mt-3 block transition-colors">
        {sumber || 'Sumber →'}
      </a>
    )}
  </motion.div>
);
