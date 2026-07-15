import { motion } from 'framer-motion';

function formatRupiah(n: number): string {
  if (!n || n <= 0) return '';
  if (n >= 1e15) return 'Rp ' + (n / 1e15).toFixed(1) + ' Kuadriliun';
  if (n >= 1e12) return 'Rp ' + (n / 1e12).toFixed(1) + ' T';
  if (n >= 1e9) return 'Rp ' + (n / 1e9).toFixed(1) + ' M';
  if (n >= 1e6) return 'Rp ' + (n / 1e6).toFixed(1) + ' Jt';
  return 'Rp ' + n.toLocaleString('id-ID');
}

export const KoruptorCard = ({
  nama, status, instansi, jabatan, pasal, tahun, kerugian, judul, sumber, link
}: {
  nama: string; status: string; instansi?: string; jabatan?: string;
  pasal?: string; tahun?: number; kerugian?: number;
  judul?: string; sumber?: string; link?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderLeft: '3px solid #dc2626' }}
    className="p-4 rounded-lg hover:bg-white/[0.04] transition-all duration-200"
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
      <h2 style={{ fontSize: '15px', fontWeight: 590, color: '#f7f8f8' }}>{nama}</h2>
      <span style={{
        fontSize: '10px', fontWeight: 500, padding: '2px 8px', borderRadius: '999px',
        background: status === 'terpidana' ? 'rgba(220,38,38,0.15)' : 'rgba(245,158,11,0.15)',
        color: status === 'terpidana' ? '#dc2626' : '#f59e0b',
        fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase',
      }}>{status}</span>
    </div>

    {(instansi || jabatan) && (
      <p style={{ color: '#8a8f98', fontSize: '11px', marginBottom: '4px' }}>
        {[jabatan, instansi].filter(Boolean).join(' · ')}
      </p>
    )}

    {pasal && (
      <p style={{ color: '#8a8f98', fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', marginBottom: '4px' }}>
        {pasal}
      </p>
    )}

    {judul && (
      <p style={{ color: '#a0a4ab', fontSize: '11px', marginBottom: '4px', lineHeight: 1.4 }}>
        {judul}
      </p>
    )}

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
      <div style={{ display: 'flex', gap: '12px' }}>
        {tahun && tahun > 0 && (
          <span style={{ color: '#62666d', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace' }}>{tahun}</span>
        )}
        {kerugian && kerugian > 0 && (
          <span style={{ color: '#dc2626', fontSize: '11px', fontWeight: 510, fontFamily: 'JetBrains Mono, monospace' }}>
            {formatRupiah(kerugian)}
          </span>
        )}
      </div>
      {link && (
        <a href={link} target="_blank" rel="noopener noreferrer"
          style={{ color: '#62666d', fontSize: '10px', textDecoration: 'none' }}
          className="hover:text-[#dc2626] transition-colors">
          {sumber || 'Sumber'} ↗
        </a>
      )}
    </div>
  </motion.div>
);
