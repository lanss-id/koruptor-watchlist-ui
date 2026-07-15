import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ApexCharts from 'apexcharts';
import { KoruptorCard } from '../components/KoruptorCard';

export async function getServerSideProps() {
  try {
    const [resTersangka, resStats] = await Promise.all([
      fetch('https://api-watchlist.lanss.my.id/api/toptersangka'),
      fetch('https://api-watchlist.lanss.my.id/api/stats'),
    ]);
    const data = await resTersangka.json();
    const stats = await resStats.json();
    return { props: { data, stats } };
  } catch (e) {
    return { props: { data: [], stats: null } };
  }
}

function formatRupiah(n: number): string {
  if (!n || n <= 0) return '-';
  if (n >= 1e15) return 'Rp ' + (n / 1e15).toFixed(1) + ' Kuadriliun';
  if (n >= 1e12) return 'Rp ' + (n / 1e12).toFixed(1) + ' T';
  if (n >= 1e9) return 'Rp ' + (n / 1e9).toFixed(1) + ' M';
  if (n >= 1e6) return 'Rp ' + (n / 1e6).toFixed(1) + ' Jt';
  return 'Rp ' + n.toLocaleString('id-ID');
}

export default function Home({ data, stats }: { data: any[], stats: any }) {
  const chartBar = useRef<HTMLDivElement>(null);
  const chartPie = useRef<HTMLDivElement>(null);
  const chartLine = useRef<HTMLDivElement>(null);
  const inst = useRef<any>(null);
  const pie = useRef<any>(null);
  const line = useRef<any>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'nama' | 'tahun' | 'kerugian'>('nama');

  const filtered = data
    .filter((x: any) => {
      if (statusFilter !== 'all' && x.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return x.nama.toLowerCase().includes(q) || (x.instansi || '').toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a: any, b: any) => {
      if (sortBy === 'nama') return a.nama.localeCompare(b.nama);
      if (sortBy === 'kerugian') return (b.total_kerugian || 0) - (a.total_kerugian || 0);
      return (b.tahun || 0) - (a.tahun || 0);
    });

  useEffect(() => {
    if (!stats) return;
    if (inst.current) inst.current.destroy();
    if (stats.instansi_top.length > 0) {
      inst.current = new ApexCharts(chartBar.current, {
        chart: { type: 'bar', height: 250, background: 'transparent', foreColor: '#8a8f98', toolbar: { show: false } },
        series: [{ name: 'Tersangka', data: stats.instansi_top.map((d: any) => d.jumlah) }],
        xaxis: { categories: stats.instansi_top.map((d: any) => d.instansi), labels: { style: { colors: '#8a8f98', fontSize: '11px' } } },
        yaxis: { labels: { style: { colors: '#8a8f98', fontSize: '11px' } } },
        grid: { borderColor: 'rgba(255,255,255,0.05)' },
        colors: ['#dc2626'],
        plotOptions: { bar: { borderRadius: 3, columnWidth: '70%' } },
        tooltip: { theme: 'dark' },
        dataLabels: { enabled: false },
      });
      inst.current.render();
    }
    if (pie.current) pie.current.destroy();
    const statusObj = stats.status_distribusi || {};
    if (Object.keys(statusObj).length > 0) {
      pie.current = new ApexCharts(chartPie.current, {
        chart: { type: 'donut', height: 250, background: 'transparent', foreColor: '#8a8f98', toolbar: { show: false } },
        series: Object.values(statusObj), labels: Object.keys(statusObj),
        colors: ['#dc2626', '#f59e0b', '#6366f1', '#10b981'],
        legend: { position: 'bottom', labels: { colors: '#8a8f98' } },
        dataLabels: { enabled: false }, tooltip: { theme: 'dark' },
        plotOptions: { pie: { donut: { size: '65%' } } },
      });
      pie.current.render();
    }
    if (line.current) line.current.destroy();
    if (stats.tren_tahunan.length > 0) {
      line.current = new ApexCharts(chartLine.current, {
        chart: { type: 'line', height: 250, background: 'transparent', foreColor: '#8a8f98', toolbar: { show: false } },
        series: [{ name: 'Kasus', data: stats.tren_tahunan.map((d: any) => d.jumlah) }],
        xaxis: { categories: stats.tren_tahunan.map((d: any) => d.tahun), labels: { style: { colors: '#8a8f98', fontSize: '11px' } } },
        yaxis: { labels: { style: { colors: '#8a8f98', fontSize: '11px' } } },
        grid: { borderColor: 'rgba(255,255,255,0.05)' },
        colors: ['#dc2626'], stroke: { curve: 'smooth', width: 2 },
        markers: { size: 3, colors: ['#dc2626'] },
        tooltip: { theme: 'dark' }, dataLabels: { enabled: false },
      });
      line.current.render();
    }
    return () => { inst.current?.destroy(); pie.current?.destroy(); line.current?.destroy(); };
  }, [stats]);

  const topRugi = stats?.top_kerugian?.filter((t: any) => t.total_kerugian > 0) || [];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
      {/* HEADER */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 600, letterSpacing: '-0.5px', color: '#f7f8f8', lineHeight: 1.2 }}>
          🕵️ Koruptor Watchlist
        </h1>
        <p style={{ color: '#a0a4ab', fontSize: '14px', marginTop: '4px', lineHeight: 1.5 }}>
          Dashboard data kasus korupsi Indonesia dari vonis inkrah — sumber: KPK, BBC, Tempo, CNN, Kompas, Antara
        </p>
      </header>

      {/* BIG NUMBERS */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', marginBottom: '28px' }}>
          {[
            { label: 'Tersangka', value: stats.total_tersangka, desc: 'orang yang terlibat' },
            { label: 'Total Kasus', value: stats.total_kasus, desc: 'perkara korupsi' },
            { label: 'Kerugian Negara', value: formatRupiah(stats.total_kerugian), desc: 'total uang negara' },
            { label: 'Periode', value: '2013–2025', desc: 'tahun vonis' },
          ].map(stat => (
            <div key={stat.label} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '16px' }}>
              <p style={{ color: '#8a8f98', fontSize: '11px', fontWeight: 500, marginBottom: '2px' }}>{stat.label}</p>
              <p style={{ color: '#f7f8f8', fontSize: '26px', fontWeight: 600, lineHeight: 1.1 }}>{stat.value}</p>
              <p style={{ color: '#62666d', fontSize: '11px', marginTop: '2px' }}>{stat.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* CHARTS */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginBottom: '32px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '16px' }}>
            <p style={{ color: '#f7f8f8', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Instansi Terbanyak</p>
            <p style={{ color: '#62666d', fontSize: '11px', marginBottom: '12px' }}>8 instansi dengan jumlah tersangka terbanyak</p>
            <div ref={chartBar} style={{ minHeight: '250px' }} />
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '16px' }}>
            <p style={{ color: '#f7f8f8', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Status Hukum</p>
            <p style={{ color: '#62666d', fontSize: '11px', marginBottom: '12px' }}>Proporsi status dari semua tersangka</p>
            <div ref={chartPie} style={{ minHeight: '250px' }} />
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '16px' }}>
            <p style={{ color: '#f7f8f8', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Tren Tahunan</p>
            <p style={{ color: '#62666d', fontSize: '11px', marginBottom: '12px' }}>Jumlah kasus korupsi per tahun (2013-2025)</p>
            <div ref={chartLine} style={{ minHeight: '250px' }} />
          </div>
        </div>
      )}

      {/* TOP KERUGIAN */}
      {topRugi.length > 0 && (
        <div style={{ background: 'rgba(220,38,38,0.04)', border: '1px solid rgba(220,38,38,0.15)', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
          <p style={{ color: '#dc2626', fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>⚠️ 5 Kerugian Negara Terbesar</p>
          <div style={{ display: 'grid', gap: '6px' }}>
            {topRugi.map((t: any, i: number) => (
              <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#62666d', fontSize: '12px', fontWeight: 600, fontFamily: 'JetBrains Mono, monospace', minWidth: '24px' }}>#{i + 1}</span>
                  <span style={{ color: '#f7f8f8', fontSize: '14px', fontWeight: 500 }}>{t.nama}</span>
                </div>
                <span style={{ color: '#dc2626', fontSize: '14px', fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}>{formatRupiah(t.total_kerugian)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEARCH + FILTERS */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ flex: '1 1 240px', position: 'relative' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#62666d', fontSize: '14px' }}>🔍</span>
          <input
            type="text"
            placeholder="Cari nama tersangka..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '10px 12px 10px 36px', borderRadius: '6px',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#f7f8f8', fontSize: '14px', outline: 'none',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: 'Semua' },
            { key: 'terpidana', label: '🔴 Terpidana' },
            { key: 'tersangka', label: '🟡 Tersangka' },
          ].map(f => (
            <button key={f.key} onClick={() => setStatusFilter(f.key)}
              style={{
                padding: '8px 14px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                fontSize: '13px', fontWeight: 500,
                background: statusFilter === f.key ? '#dc2626' : 'rgba(255,255,255,0.04)',
                color: statusFilter === f.key ? '#fff' : '#a0a4ab',
              }}>
              {f.label}
            </button>
          ))}
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
          style={{
            padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.04)', color: '#a0a4ab', fontSize: '13px', cursor: 'pointer',
          }}>
          <option value="nama">Urut: Nama A-Z</option>
          <option value="kerugian">Urut: Kerugian Terbesar</option>
          <option value="tahun">Urut: Tahun Terbaru</option>
        </select>
        <span style={{ color: '#62666d', fontSize: '13px', marginLeft: 'auto' }}>
          {filtered.length} tersangka
        </span>
      </div>

      {/* LEGEND */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', fontSize: '12px', color: '#8a8f98' }}>
        <span><span style={{ color: '#dc2626' }}>●</span> Terpidana — sudah divonis pengadilan</span>
        <span><span style={{ color: '#f59e0b' }}>●</span> Tersangka — masih proses hukum</span>
      </div>

      {/* GRID */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#62666d' }}>
          <p style={{ fontSize: '32px', marginBottom: '8px' }}>🔍</p>
          <p style={{ fontSize: '16px' }}>Tidak ada tersangka yang cocok dengan pencarian "{search}"</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '10px' }}>
          {filtered.map((item: any) => (
            <KoruptorCard key={item.id}
              nama={item.nama} status={item.status}
              instansi={item.instansi} jabatan={item.jabatan}
              pasal={item.pasal} tahun={item.tahun}
              kerugian={item.total_kerugian}
              judul={item.judul} sumber={item.sumber} link={item.source_url}
            />
          ))}
        </div>
      )}
    </div>
  );
}
