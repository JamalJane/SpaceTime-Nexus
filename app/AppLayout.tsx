import Header from '../components/Header';
import RightSidebar from '../components/RightSidebar';
import CardNav from '../components/CardNav';
import Scene3D from '../components/Scene3D';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: '#050505' }}>
      <Scene3D />
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col p-6">
        <Header />
        <div className="pointer-events-none flex flex-1" />
        <div className="pointer-events-auto flex justify-center">
          <CardNav />
        </div>
      </div>
      <RightSidebar />
      <main className="relative z-10 min-h-screen p-6 pt-14">
        {children}
      </main>
    </div>
  );
}
