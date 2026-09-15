import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell.jsx';
import { ErrorBoundary } from './components/feedback/ErrorBoundary.jsx';

// Routes
import { DashboardPage } from './routes/DashboardPage.jsx';
import { NewProjectPage } from './routes/NewProjectPage.jsx';
import { ProjectOverviewPage } from './routes/ProjectOverviewPage.jsx';
import { WorkspacePage } from './routes/WorkspacePage.jsx';
import { VisualizationPage } from './routes/VisualizationPage.jsx';
import { CostPage } from './routes/CostPage.jsx';
import { BoqPage } from './routes/BoqPage.jsx';
import { ExportPage } from './routes/ExportPage.jsx';

export const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/projects/new" element={<NewProjectPage />} />
            <Route path="/projects/:projectId" element={<ProjectOverviewPage />} />
            <Route path="/projects/:projectId/design" element={<WorkspacePage />} />
            <Route path="/projects/:projectId/3d" element={<VisualizationPage />} />
            <Route path="/projects/:projectId/cost" element={<CostPage />} />
            <Route path="/projects/:projectId/boq" element={<BoqPage />} />
            <Route path="/projects/:projectId/export" element={<ExportPage />} />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
