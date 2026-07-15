import { KoruptorCard } from '../components/KoruptorCard';
import { motion } from 'framer-motion';
import Script from 'next/script';

export async function getServerSideProps() {
  try {
    const res = await fetch('https://api-watchlist.lanss.my.id/api/toptersangka');
    const data = await res.json();
    return { props: { data } };
  } catch (e) {
    return { props: { data: [] } };
  }
}

export default function Home({ data }: { data: any[] }) {
  const total = data.length;
  const instansiCount: Record<string, number> = {};
  data.forEach((item: any) => {
    const instansi = item.instansi || 'Tidak diketahui';
    instansiCount[instansi] = (instansiCount[instansi] || 0) + 1;
  });
  const instansiChart = Object.entries(instansiCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8);

  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/apexcharts" strategy="afterInteractive" />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 32px' }}>
        {/* HEADER */}
        <header style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '24px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 510, letterSpacing: '-0.704px', color: '#f7f8f8', lineHeight: 1.13 }}>
                Koruptor Watchlist
              </h1>
              <p style={{ color: '#8a8f98', fontSize: '13px', marginTop: '4px' }}>
                {total} tersangka terdata
              </p>
            </div>
          </div>
        </header>

        {/* STATS ROW */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '40px' }}>
          {[
            { label: 'Total Tersangka', value: total, accent: '#dc2626' },
            { label: 'Instansi Terdata', value: Object.keys(instansiCount).length, accent: '#5e6ad2' },
            { label: 'Sumber Berita', value: 'Google News', accent: '#10b981' },
          ].map(stat => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '20px' }}
            >
              <p style={{ color: '#8a8f98', fontSize: '11px', fontWeight: 510, letterSpacing: '0.3px' }}>{stat.label}</p>
              <p style={{ color: '#f7f8f8', fontSize: '28px', fontWeight: 510, marginTop: '4px' }}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* CHART SECTION */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '24px', marginBottom: '40px' }}
        >
          <h2 style={{ color: '#f7f8f8', fontSize: '15px', fontWeight: 590, marginBottom: '16px' }}>Tersangka per Instansi</h2>
          <div id="chart" style={{ minHeight: '300px' }} />
        </motion.div>

        {/* GRID CARD LIST */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '12px' }}>
          {data.map((item: any) => (
            <KoruptorCard key={item.id} nama={item.nama} status={item.status} sumber={item.sumber} link={item.source_url} />
          ))}
        </div>
      </div>

      {/* CHART INIT */}
      <Script id="chart-init" strategy="afterInteractive">{`
        const chartData = ${JSON.stringify(instansiChart)};
        setTimeout(() => {
          const options = {
            chart: { type: 'bar', height: 300, background: 'transparent', foreColor: '#8a8f98', toolbar: { show: false } },
            series: [{ name: 'Tersangka', data: chartData.map(d => d[1]) }],
            xaxis: { categories: chartData.map(d => d[0]), labels: { style: { colors: '#8a8f98', fontSize: '11px' } } },
            yaxis: { labels: { style: { colors: '#8a8f98', fontSize: '11px' } } },
            grid: { borderColor: 'rgba(255,255,255,0.05)' },
            plotOptions: { bar: { borderRadius: 4, columnWidth: '70%', colors: { ranges: [{ from: 0, to: 1000, color: '#dc2626' }] } } },
            tooltip: { theme: 'dark' },
            dataLabels: { enabled: false },
          };
          new ApexCharts(document.querySelector('#chart'), options).render();
        }, 100);
      `}</Script>
    </>
  );
}
