export default function Tabs({ tabs, active, onChange, actionButton }) {
  return (
    <div className="border-b border-slate-200 bg-white px-6">
      <div className="flex items-center justify-between">
        <div className="flex space-x-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-2 py-4 px-1 font-medium text-sm transition-all border-b-2 relative ${
                active === tab.id
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab.icon && <tab.icon size={18} />}
              {tab.label}
              {tab.count !== undefined && (
                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                  active === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
        {actionButton && <div className="flex-shrink-0">{actionButton}</div>}
      </div>
    </div>
  );
}