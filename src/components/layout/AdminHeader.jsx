import { BookOpen } from 'lucide-react';

export default function AdminHeader() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <BookOpen size={24} />
          </div>
          <h1 className="text-xl font-bold text-slate-800">Painel Administrativo</h1>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">v2.0 - React</span>
        </div>
      </div>
    </header>
  );
}