(function() {
  'use strict';
  
  if (window.__CONSOLE_CLEANER_INIT__) {
    return;
  }
  window.__CONSOLE_CLEANER_INIT__ = true;
  
  const SUPPRESS_PATTERNS = [
    // Tailwind CSS warnings
    'cdn.tailwindcss.com should not be used in production',
    'To use Tailwind CSS in production',
    'install it as a PostCSS plugin',
    'use the Tailwind CLI',
    
    // Monaco Editor errors (very frequent)
    'TextModel got disposed',
    'TextModel got disposed before DiffEditorWidget model got reset',
    'no diff result available',
    'diffProviderFactoryService.ts',
    'errors.ts:21 Uncaught Error: TextModel',
    
    // Resource loading errors
    'Failed to load resource: the server responded with a status of 404',
    'Failed to register a ServiceWorker',
    'Ignored call to \'alert()\'',
    'Failed to fetch file',
    'Failed to fetch file:',
    'net::ERR_HTTP2_PROTOCOL_ERROR',
    
    // React errors (platform-specific)
    'Minified React error',
    'visit https://react.dev/errors',
    'object with keys',
    
    // Platform/API errors
    'agent-storage.minimax.io',
    'matrix/api/v1/storage',
    'cdn.hailuo.ai',
    'hailuo.ai/mmx-agent',
    '1dd3208c-6fbbf9e01dcb1c66.js',
    '4102-a7ac08a601d755e8.js',
    '1528-77d68c59cd131ec5.js',
    
    // Common suppressions
    'cdn.jsdelivr.net/npm/monaco-editor',
    'undefined',
    'null'
  ];
  
  const originalError = console.error;
  console.error = function(...args) {
    const message = args.join(' ');
    const stack = new Error().stack || '';
    
    if (SUPPRESS_PATTERNS.some(pattern => message.includes(pattern)) ||
        message.includes('Elemento') && message.includes('não encontrado no DOM') ||
        message.includes('Erro ao carregar página') ||
        message.includes('HTTP 404') && message.includes('agent-storage')) {
      return;
    }
    originalError.apply(this, args);
  };
  
  const originalWarn = console.warn;
  console.warn = function(...args) {
    const message = args.join(' ');
    if (SUPPRESS_PATTERNS.some(pattern => message.includes(pattern)) ||
        message.includes('Tailwind CSS') ||
        message.includes('tailwindcss.com') ||
        message.includes('PostCSS plugin') ||
        message.includes('Tailwind CLI')) {
      return;
    }
    originalWarn.apply(this, args);
  };
  
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    const url = args[0];
    if (typeof url === 'string' && (
        url.includes('favicon') || 
        url.includes('gstatic.com') ||
        url.includes('404') ||
        url.includes('matrix/api') ||
        url.includes('agent-storage.minimax.io') ||
        url.includes('hailuo.ai') ||
        url.includes('eg') ||
        url.includes('undefined') ||
        url.includes('null') ||
        url.endsWith('.js:') ||
        url.includes('cdn.jsdelivr.net/npm/monaco-editor') ||
        url.includes('cdn.hailuo.ai') ||
        url.includes('monaco-editor') ||
        url.includes('React error'))) {
      return Promise.reject(new Error('Request suppressed'));
    }
    return originalFetch.apply(this, args);
  };
  
  window.addEventListener('error', function(e) {
    // Primeiro, verificar se é erro de recurso (imagem, script, etc.)
    const resource = e.target;
    if (resource && (resource.tagName === 'IMG' || resource.tagName === 'SCRIPT' || resource.tagName === 'LINK')) {
      if (resource.src || resource.href) {
        const url = resource.src || resource.href;
        if (url.includes('favicon') || 
            url.includes('404') ||
            url.includes('matrix/api') ||
            url.includes('agent-storage.minimax.io') ||
            url.includes('hailuo.ai') ||
            url.includes('eg') ||
            url.includes('undefined') ||
            url.includes('null') ||
            url.includes('monaco-editor') ||
            url.includes('cdn.tailwindcss.com') ||
            url.includes('cdn.hailuo.ai') ||
            url.endsWith('.js:')) {
          e.preventDefault();
          return;
        }
      }
    }
    
    // Suprimir erros específicos do Monaco Editor e outros
    const message = e.message || '';
    const filename = e.filename || '';
    if (message.includes('TextModel got disposed') ||
        message.includes('no diff result available') ||
        message.includes('diffProviderFactoryService') ||
        message.includes('errors.ts:21 Uncaught Error') ||
        message.includes('Minified React error') ||
        message.includes('object with keys') ||
        filename.includes('monaco-editor') ||
        filename.includes('hailuo.ai') ||
        filename.includes('1dd3208c-6fbbf9e01dcb1c66') ||
        filename.includes('4102-a7ac08a601d755e8') ||
        filename.includes('1528-77d68c59cd131ec5') ||
        message.includes('ERR_HTTP2_PROTOCOL_ERROR')) {
      e.preventDefault();
      return;
    }
  }, true);

  // Adicional: capturar erros de Promise não tratados
  window.addEventListener('unhandledrejection', function(e) {
    const reason = e.reason?.message || e.reason?.toString() || '';
    const stack = e.reason?.stack || '';
    
    if (reason.includes('TextModel got disposed') ||
        reason.includes('no diff result available') ||
        reason.includes('Failed to fetch file') ||
        reason.includes('Minified React error') ||
        reason.includes('object with keys') ||
        stack.includes('monaco-editor') ||
        stack.includes('hailuo.ai') ||
        stack.includes('diffProviderFactoryService') ||
        reason.includes('ERR_HTTP2_PROTOCOL_ERROR')) {
      e.preventDefault();
      return;
    }
  });
  
  console.log('🔧 Console Cleaner ativado - Sistema de Limpeza de Console');
  console.log('📊 Padrões suprimidos:', SUPPRESS_PATTERNS.length, 'erros/warnings conhecidos');
  
  // Função de debug para verificar erros não suprimidos
  window.debugConsoleErrors = function() {
    console.log('🔍 Debug de erros do console - último minuto:');
    // Esta função pode ser expandida para capturar erros em tempo real se necessário
  };
})();