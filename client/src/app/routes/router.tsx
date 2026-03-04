import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Layout } from '../../shared/components/Layout.tsx';
import { ProtectedRoute } from './ProtectedRoute.tsx';

const EventsListPage = lazy(() => import('../../pages/EventsListPage.tsx'));
const RegisterPage = lazy(() => import('../../pages/RegisterPage.tsx'));
const LoginPage = lazy(() => import('../../pages/LoginPage.tsx'));
const CreateEventPage = lazy(() => import('../../pages/CreateEventPage.tsx'));
const EditEventPage = lazy(() => import('../../pages/EditEventPage.tsx'));
const EventDetailPage = lazy(() => import('../../pages/EventDetailPage.tsx'));
const MyEventsPage = lazy(() => import('../../pages/MyEventsPage.tsx'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<p>Loading...</p>}>
            <EventsListPage />
          </Suspense>
        ),
      },
      {
        path: '/register',
        element: (
          <Suspense fallback={<p>Loading...</p>}>
            <RegisterPage />
          </Suspense>
        ),
      },
      {
        path: '/login',
        element: (
          <Suspense fallback={<p>Loading...</p>}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: 'events/create',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<p>Loading...</p>}>
              <CreateEventPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'events/:id/edit',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<p>Loading...</p>}>
              <EditEventPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'events/:id',
        element: (
          <Suspense fallback={<p>Loading...</p>}>
            <EventDetailPage />
          </Suspense>
        ),
      },
      {
        path: '/my-events',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<p>Loading...</p>}>
              <MyEventsPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
