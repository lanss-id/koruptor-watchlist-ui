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

  const total = data.length;

  useEffect(() => {
    if (!stats) return;

    if (inst.current) inst.current.destroy();
    if (stats.instansi_top.length > 0) {
      inst.current = new ApexCharts(chartBar.current, {
        chart: { type: 'bar', height: 250, background: 'transparent', foreColor: '#8a8f98', toolbar: { show: false } },
        series: [{ name: 'Tersangka', data: stats.instansi_top.map((d: any) => d.jumlah) }],
        xaxis: { categories: stats.instansi_top.map((d: any) => d.instansi), labels: { style: { colors: '#8a8f98', fontSize: '10px' } } },
        yaxis: { labels: { style: { colors: '#8a8f98', fontSize: '10px' } } },
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
        series: Object.values(statusObj),
        labels: Object.keys(statusObj),
        colors: ['#dc2626', '#f59e0b', '#6366f1', '#10b981'],
        legend: { position: 'bottom', labels: { colors: '#8a8f98' } },
        dataLabels: { enabled: false },
        tooltip: { theme: 'dark' },
        plotOptions: { pie: { donut: { size: '65%' } } },
      });
      pie.current.render();
    }

    if (line.current) line.current.destroy();
    if (stats.tren_tahunan.length > 0) {
      line.current = new ApexCharts(chartLine.current, {
        chart: { type: 'line', height: 250, background: 'transparent', foreColor: '#8a8f98', toolbar: { show: false } },
        series: [{ name: 'Kasus', data: stats.tren_tahunan.map((d: any) => d.jumlah) }],
        xaxis: { categories: stats.tren_tahunan.map((d: any) => d.tahun), labels: { style: { colors: '#8a8f98', fontSize: '10px' } } },
        yaxis: { labels: { style: { colors: '#8a8f98', fontSize: '10px' } } },
        grid: { borderColor: 'rgba(255,255,255,0.05)' },
        colors: ['#dc2626'],
        stroke: { curve: 'smooth', width: 2 },
        markers: { size: 3, colors: ['#dc2626'] },
        tooltip: { theme: 'dark' },
        dataLabels: { enabled: false },
      });
      line.current.render();
    }

    return () => {
      if (inst.current) inst.current.destroy();
      if (pie.current) pie.current.destroy();
      if (line.current) line.current.destroy();
    };
  }, [stats]);

  const topRugi = stats?.top_kerugian?.filter((t: any) => t.total_kerugian > 0) || [];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 32px' }}>
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '24px', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 510, letterSpacing: '-0.704px', color: '#f7f8f8', lineHeight: 1.13 }}>
          Koruptor Watchlist
        </h1>
        <p style={{ color: '#8a8f98', fontSize: '13px', marginTop: '4px', fontFamily: 'JetBrains Mono, monospace' }}>
          {total} tersangka · data dari KPK, BBC, Tempo, Antara, CNN, Kompas
        </p>
      </header>

      {stats && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '40px' }}>
            {[
              { label: 'Total Tersangka', value: stats.total_tersangka },
              { label: 'Total Kasus', value: stats.total_kasus },
              { label: 'Kerugian Negara', value: formatRupiah(stats.total_kerugian) },
              { label: 'Periode Data', value: '2013–2025' },
            ].map(stat => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '20px' }}>
                <p style={{ color: '#8a8f98', fontSize: '11px', fontWeight: 510 }}>{stat.label}</p>
                <p style={{ color: '#f7f8f8', fontSize: '28px', fontWeight: 510, marginTop: '4px' }}>{stat.value}</p>
              </motion.div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '40px' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '20px' }}>
              <p style={{ color: '#f7f8f8', fontSize: '13px', fontWeight: 590, marginBottom: '12px' }}>Sektor Terbanyak</p>
              <div ref={chartBar} style={{ minHeight: '250px' }} />
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '20px' }}>
              <p style={{ color: '#f7f8f8', fontSize: '13px', fontWeight: 590, marginBottom: '12px' }}>Status Hukum</p>
              <div ref={chartPie} style={{ minHeight: '250px' }} />
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '20px' }}>
              <p style={{ color: '#f7f8f8', fontSize: '13px', fontWeight: 590, marginBottom: '12px' }}>Tren Tahunan</p>
              <div ref={chartLine} style={{ minHeight: '250px' }} />
            </motion.div>
          </div>

          {topRugi.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '20px', marginBottom: '40px' }}>
              <p style={{ color: '#f7f8f8', fontSize: '13px', fontWeight: 590, marginBottom: '12px' }}>Kerugian Negara Terbesar</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {topRugi.map((t: any, i: number) => (
                  <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div>
                      <span style={{ color: '#8a8f98', fontSize: '11px', marginRight: '8px', fontFamily: 'JetBrains Mono, monospace' }}>#{i + 1}</span>
                      <span style={{ color: '#f7f8f8', fontSize: '13px' }}>{t.nama}</span>
                    </div>
                    <span style={{ color: '#dc2626', fontSize: '13px', fontWeight: 510, fontFamily: 'JetBrains Mono, monospace' }}>{formatRupiah(t.total_kerugian)}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '12px' }}>
        {data.map((item: any) => (
          <KoruptorCard
            key={item.id}
            nama={item.nama}
            status={item.status}
            instansi={item.instansi}
            jabatan={item.jabatan}
            pasal={item.pasal}
            tahun={item.tahun}
            kerugian={item.total_kerugian}
            judul={item.judul}
            sumber={item.sumber}
            link={item.source_url}
          />
        ))}
      </div>
    </div>
  );
}
