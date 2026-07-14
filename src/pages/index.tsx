import { useEffect, useState } from 'react';
import { KoruptorCard } from '../components/KoruptorCard';

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Proxying to Flask port 5000 in dev
    fetch('http://127.0.0.1:5000/api/toptersangka')
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

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
