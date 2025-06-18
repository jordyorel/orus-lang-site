
import { useEffect } from 'react';
import { loader } from '@monaco-editor/react';
import { setMonacoInstance } from '@/utils/monacoCache';

export const useMonacoPreloader = () => {
  useEffect(() => {
    // Preload Monaco editor on app start
    const preloadMonaco = async () => {
      try {
        console.log('Preloading Monaco editor...');
        const monaco = await loader.init();
        setMonacoInstance(monaco);
        console.log('Monaco editor preloaded successfully');
      } catch (error) {
        console.warn('Failed to preload Monaco editor:', error);
      }
    };

    // Small delay to not block initial render
    const timeoutId = setTimeout(preloadMonaco, 100);
    return () => clearTimeout(timeoutId);
  }, []);
};
