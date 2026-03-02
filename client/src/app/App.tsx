import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router.tsx';
import { useAuthActions } from '../features/auth/store/auth.selectors.ts';
import { useEffect } from 'react';
import { useAuthStore } from '../features/auth/store/auth.store.ts';

function App() {
  const { checkAuth } = useAuthActions();
  useEffect(() => {
    if (!useAuthStore.getState().accessToken) {
      checkAuth();
    }
  }, []);
  return <RouterProvider router={router} />;
}

export default App;
