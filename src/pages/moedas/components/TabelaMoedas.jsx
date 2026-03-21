import React from 'react';
import { formatNumber } from '../../../utils/formatadores';

const TabelaMoedas = ({ rates, baseCurrency, currencies }) => {
  if (!rates) return <div>Carregando taxas...</div>;

  // Show only a limited set of currencies for brevity, or show all
  const currenciesToShow = Object.keys(rates).slice(0, 10); // first 10

  return (
    <div className="tabela-moedas">
      <h3>Tabela de Câmbio (base: {baseCurrency})</h3>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Moeda</th>
            <th>Taxa</th>
          </tr>
        </thead>
        <tbody>
          {currenciesToShow.map((code) => (
            <tr key={code}>
              <td>{code} - {currencies?.[code] || ''}</td>
              <td>{formatNumber(rates[code])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TabelaMoedas;