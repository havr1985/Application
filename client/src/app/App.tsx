import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router.tsx';
import { useEffect, useRef } from 'react';
import { useAuthStore } from '../features/auth/store/auth.store.ts';
import { Toaster } from 'react-hot-toast';
import { useTagsStore } from '../features/tags/store/tags.store.ts';

function App() {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      useAuthStore.getState().checkAuth();
    }
    useTagsStore.getState().fetchTags();
  }, []);
  return (
    <>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
