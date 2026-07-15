import { KoruptorCard } from '../components/KoruptorCard';

export async function getServerSideProps() {
  try {
    const res = await fetch('https://api-watchlist.lanss.my.id/api/toptersangka');
    const data = await res.json();
    return { props: { data } };
  } catch (e) {
    console.error('Fetch failed:', e);
    return { props: { data: [] } };
  }
}

export default function Home({ data }: { data: any[] }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-10 font-sans selection:bg-accent selection:text-white">
      <header className="border-b border-surface-800 pb-6 mb-10">
        <h1 className="text-4xl font-black uppercase tracking-tighter">Koruptor Watchlist</h1>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.map((item: any) => (
          <KoruptorCard key={item.id} nama={item.nama} status={item.status} />
        ))}
      </main>
    </div>
  );
}
