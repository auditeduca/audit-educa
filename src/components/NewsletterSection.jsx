import React, { useState } from 'react';

export default function NewsletterSection({ onSubscribe }) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      onSubscribe();
      setEmail('');
    }
  };

  return (
    <div className="bg-audit-navy p-10 rounded-3xl shadow-2xl text-white relative overflow-hidden group mb-12">
      <div className="absolute -right-8 -top-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
        <i className="fas fa-shield-alt text-8xl"></i>
      </div>
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h4 className="text-xs font-bold uppercase tracking-widest text-audit-gold mb-4 flex items-center gap-2">
            <i className="fas fa-envelope"></i> Newsletter Audit
          </h4>
          <h3 className="text-2xl font-serif font-bold mb-4">Mantenha-se Atualizado</h3>
          <p className="text-sm font-light leading-relaxed text-slate-300">
            Receba gratuitamente as últimas atualizações normativas e dicas práticas para o seu dia a dia profissional.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="w-full md:w-auto min-w-[300px] space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-sm outline-none focus:border-audit-gold transition placeholder-slate-400 text-white"
            aria-label="Endereço de e-mail"
            required
          />
          <button type="submit" className="w-full p-4 bg-audit-gold text-audit-navy font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-white hover:text-audit-navy transition shadow-lg">
            Assinar Gratuitamente
          </button>
        </form>
      </div>
    </div>
  );
}