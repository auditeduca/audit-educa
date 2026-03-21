import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Erro capturado:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[300px] flex items-center justify-center text-center p-10">
          <div>
            <h2 className="text-xl font-bold text-red-600 mb-2">
              Algo deu errado
            </h2>
            <p className="text-slate-500">
              Tente recarregar a página.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}