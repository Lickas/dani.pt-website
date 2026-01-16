import React from 'react';
import { Info } from 'lucide-react';

/**
 * Banner que aparece quando o site está em modo demonstração (mock data)
 * Só aparece se REACT_APP_USE_MOCK=true
 */
export const DemoModeBanner = () => {
  const isDemo = process.env.REACT_APP_USE_MOCK === 'true';
  
  if (!isDemo) return null;
  
  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
      <div className="container-site py-2 px-4">
        <div className="flex items-center justify-center gap-2 text-sm">
          <Info size={16} className="text-yellow-600 dark:text-yellow-400" />
          <p className="text-yellow-800 dark:text-yellow-200">
            <strong>Modo Demonstração:</strong> Os dados apresentados são exemplos ilustrativos.
          </p>
        </div>
      </div>
    </div>
  );
};
