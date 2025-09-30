import { Routes, Route, Navigate } from 'react-router-dom';
import { H1, AppLayout } from '@/components';
import { EventsListPage } from '@/pages';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Default redirect to events page */}
        <Route path="/" element={<Navigate to="/events" replace />} />

        {/* Events routes */}
        <Route path="/events" element={<EventsListPage />} />
        <Route
          path="/events/:id"
          element={<H1>Event Details (Coming Soon)</H1>}
        />
        <Route
          path="/events/new"
          element={<H1>Create Event (Coming Soon)</H1>}
        />
        <Route
          path="/events/:id/edit"
          element={<H1>Edit Event (Coming Soon)</H1>}
        />

        {/* Legacy dashboard page */}
        <Route
          path="/organizerdashboard"
          element={<H1 className="text-3xl font-bold">Organizerdashboard</H1>}
        />

        {/* Catch-all redirect to events */}
        <Route path="*" element={<Navigate to="/events" replace />} />
      </Route>
    </Routes>
  );
};
