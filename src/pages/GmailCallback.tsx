
import { useEffect } from 'react';

export const GmailCallback = () => {
  useEffect(() => {
    // Extrair parâmetros da URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      // Enviar erro para a janela pai
      if (window.opener) {
        window.opener.postMessage({
          type: 'GMAIL_AUTH_ERROR',
          error: error
        }, window.location.origin);
      }
      window.close();
      return;
    }

    if (code) {
      // Enviar código para a janela pai
      if (window.opener) {
        window.opener.postMessage({
          type: 'GMAIL_AUTH_SUCCESS',
          code: code
        }, window.location.origin);
      }
      window.close();
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Processando autenticação...</p>
      </div>
    </div>
  );
};
