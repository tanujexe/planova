import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell.jsx';
import { ErrorBoundary } from './components/feedback/ErrorBoundary.jsx';
import { PageLoading } from './components/feedback/PageLoading.jsx';

// Lazy-loaded route chunks for optimal initial page load performance
const DashboardPage = lazy(() => import('./routes/DashboardPage.jsx').then(m => ({ default: m.DashboardPage })));
const NewProjectPage = lazy(() => import('./routes/NewProjectPage.jsx').then(m => ({ default: m.NewProjectPage })));
const ProjectOverviewPage = lazy(() => import('./routes/ProjectOverviewPage.jsx').then(m => ({ default: m.ProjectOverviewPage })));
const WorkspacePage = lazy(() => import('./routes/WorkspacePage.jsx').then(m => ({ default: m.WorkspacePage })));
const VisualizationPage = lazy(() => import('./routes/VisualizationPage.jsx').then(m => ({ default: m.VisualizationPage })));
const CostPage = lazy(() => import('./routes/CostPage.jsx').then(m => ({ default: m.CostPage })));
const BoqPage = lazy(() => import('./routes/BoqPage.jsx').then(m => ({ default: m.BoqPage })));
const ExportPage = lazy(() => import('./routes/ExportPage.jsx').then(m => ({ default: m.ExportPage })));
const DesignDetailsPage = lazy(() => import('./routes/DesignDetailsPage.jsx').then(m => ({ default: m.DesignDetailsPage })));

export const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppShell>
          <Suspense fallback={<PageLoading />}>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/projects/new" element={<NewProjectPage />} />
              <Route path="/projects/:projectId" element={<ProjectOverviewPage />} />
              <Route path="/projects/:projectId/details" element={<DesignDetailsPage />} />
              <Route path="/projects/:projectId/drafts/:draftId" element={<DesignDetailsPage />} />
              <Route path="/projects/:projectId/design" element={<WorkspacePage />} />
              <Route path="/projects/:projectId/3d" element={<VisualizationPage />} />
              <Route path="/projects/:projectId/cost" element={<CostPage />} />
              <Route path="/projects/:projectId/boq" element={<BoqPage />} />
              <Route path="/projects/:projectId/export" element={<ExportPage />} />
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </AppShell>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
