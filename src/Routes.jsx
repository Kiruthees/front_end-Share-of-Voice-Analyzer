import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import SearchHistory from './pages/search-history';
import Dashboard from './pages/dashboard';
import AnalysisResults from './pages/analysis-results';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<AnalysisResults />} />
        <Route path="/search-history" element={<SearchHistory />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analysis-results" element={<AnalysisResults />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
