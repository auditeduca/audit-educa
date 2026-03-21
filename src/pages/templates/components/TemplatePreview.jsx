// src/pages/templates/components/TemplatePreview.jsx
import React, { useState } from 'react';

export default function TemplatePreview({ html, onRefresh }) {
  const [zoom, setZoom] = useState(90); // zoom inicial 90% para caber melhor
  const [device, setDevice] = useState('desktop');
  const [showGrid, setShowGrid] = useState(false);

  const devices = {
    desktop: { width: '100%', height: 'auto' },
    tablet: { width: '768px', height: '1024px' },
    mobile: { width: '375px', height: '667px' }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-audit-navy flex items-center gap-2">
          <i className="fas fa-eye text-audit-gold"></i> Prévia
        </h3>
        <div className="flex gap-1">
          <button
            onClick={() => setZoom(Math.max(50, zoom - 10))}
            className="w-7 h-7 bg-slate-100 rounded flex items-center justify-center hover:bg-slate-200 transition"
          >
            <i className="fas fa-minus text-xs"></i>
          </button>
          <span className="w-12 text-center text-xs font-medium">{zoom}%</span>
          <button
            onClick={() => setZoom(Math.min(200, zoom + 10))}
            className="w-7 h-7 bg-slate-100 rounded flex items-center justify-center hover:bg-slate-200 transition"
          >
            <i className="fas fa-plus text-xs"></i>
          </button>
        </div>
      </div>

      <div className="flex gap-1 mb-4">
        {Object.keys(devices).map(d => (
          <button
            key={d}
            onClick={() => setDevice(d)}
            className={`flex-1 py-2 text-xs font-medium rounded transition ${
              device === d ? 'bg-audit-navy text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <i className={`fas fa-${
              d === 'desktop' ? 'desktop' : d === 'tablet' ? 'tablet-alt' : 'mobile-alt'
            } mr-1`}></i> {d}
          </button>
        ))}
      </div>

      <div
        className="border border-slate-200 rounded-xl overflow-auto bg-white transition-all"
        style={{
          maxHeight: '700px', // altura aumentada
          minHeight: '400px',
          ...devices[device]
        }}
      >
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top left',
            width: zoom === 100 ? '100%' : `${10000 / zoom}%`
          }}
        >
          <div
            dangerouslySetInnerHTML={{ __html: html }}
            className={showGrid ? 'preview-grid' : ''}
          />
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setShowGrid(!showGrid)}
          className={`flex-1 py-2 text-xs font-medium rounded transition ${
            showGrid ? 'bg-audit-gold text-audit-navy' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <i className="fas fa-border-all mr-1"></i> Grid
        </button>
        <button
          onClick={onRefresh}
          className="flex-1 py-2 bg-slate-100 text-slate-600 rounded text-xs font-medium hover:bg-slate-200 transition"
        >
          <i className="fas fa-sync-alt mr-1"></i> Atualizar
        </button>
      </div>
    </div>
  );
}