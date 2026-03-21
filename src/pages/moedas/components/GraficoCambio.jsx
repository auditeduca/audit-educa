import React, { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { formatDate } from '../../../utils/formatadores';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const GraficoCambio = ({ fromCurrency, toCurrency, fetchHistorical }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('30d'); // '7d', '30d', '90d'

  useEffect(() => {
    const loadHistoricalData = async () => {
      if (!fromCurrency || !toCurrency) return;

      setLoading(true);
      setError(null);

      try {
        // Determine date range based on selected period
        const endDate = new Date();
        let startDate = new Date();
        switch (period) {
          case '7d':
            startDate.setDate(endDate.getDate() - 7);
            break;
          case '30d':
            startDate.setDate(endDate.getDate() - 30);
            break;
          case '90d':
            startDate.setDate(endDate.getDate() - 90);
            break;
          default:
            startDate.setDate(endDate.getDate() - 30);
        }

        const data = await fetchHistorical(
          fromCurrency,
          toCurrency,
          startDate.toISOString().split('T')[0],
          endDate.toISOString().split('T')[0]
        );

        if (data && data.length > 0) {
          // Data format expected: [{ date: 'YYYY-MM-DD', rate: number }]
          const labels = data.map(item => formatDate(item.date));
          const rates = data.map(item => item.rate);

          setChartData({
            labels,
            datasets: [
              {
                label: `${fromCurrency} / ${toCurrency}`,
                data: rates,
                borderColor: '#C5A059',
                backgroundColor: 'rgba(197, 160, 89, 0.1)',
                borderWidth: 2,
                pointRadius: 2,
                pointBackgroundColor: '#C5A059',
                pointBorderColor: '#fff',
                pointHoverRadius: 5,
                fill: true,
                tension: 0.3,
              },
            ],
          });
        } else {
          setError('Nenhum dado histórico disponível para este período.');
        }
      } catch (err) {
        console.error('Error fetching historical data:', err);
        setError('Não foi possível carregar os dados históricos.');
      } finally {
        setLoading(false);
      }
    };

    loadHistoricalData();
  }, [fromCurrency, toCurrency, period, fetchHistorical]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 10 },
          boxWidth: 12,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            label += context.raw.toFixed(4);
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: `Taxa de Câmbio (${toCurrency})`,
          font: { size: 10 },
        },
        ticks: {
          callback: (value) => value.toFixed(4),
        },
      },
      x: {
        title: {
          display: true,
          text: 'Data',
          font: { size: 10 },
        },
      },
    },
  };

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  return (
    <div className="grafico-cambio">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[10px] font-bold text-audit-navy uppercase tracking-widest flex items-center gap-2">
          <i className="fas fa-chart-line text-audit-gold"></i> Gráfico de Câmbio
        </h3>
        <div className="flex gap-2">
          {[
            { value: '7d', label: '7 dias' },
            { value: '30d', label: '30 dias' },
            { value: '90d', label: '90 dias' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => handlePeriodChange(opt.value)}
              className={`px-3 py-1 text-[10px] font-bold rounded-full transition ${
                period === opt.value
                  ? 'bg-audit-gold text-audit-navy'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-80">
        {loading && (
          <div className="h-full flex items-center justify-center">
            <div className="animate-pulse text-slate-400">Carregando gráfico...</div>
          </div>
        )}
        {error && (
          <div className="h-full flex items-center justify-center text-red-500 text-sm">
            {error}
          </div>
        )}
        {!loading && !error && chartData && (
          <Line data={chartData} options={options} />
        )}
        {!loading && !error && !chartData && (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm">
            Selecione moedas para visualizar o histórico.
          </div>
        )}
      </div>
    </div>
  );
};

export default GraficoCambio;