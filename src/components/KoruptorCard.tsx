import { motion } from 'framer-motion';

export const KoruptorCard = ({ nama, status, sumber, link }: { nama: string, status: string, sumber?: string, link?: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderLeft: '3px solid #dc2626' }}
    className="p-5 rounded-lg hover:bg-white/[0.04] transition-all duration-200"
  >
    <h2 className="text-[15px] font-[590] tracking-tight text-[#f7f8f8]">{nama}</h2>
    <p className="mt-1 text-xs uppercase tracking-widest" style={{ color: '#dc2626' }}>{status}</p>
    {link && (
      <a href={link} target="_blank" rel="noopener noreferrer" style={{ color: '#62666d' }} className="hover:text-[#dc2626] text-[11px] mt-3 block transition-colors">
        {sumber || 'Sumber →'}
      </a>
    )}
  </motion.div>
);
