import React, { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Planova ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-linen flex items-center justify-center p-6 bg-blueprint-grid">
          <div className="max-w-md w-full bg-white rounded-xl shadow-elevated border border-sand-300 p-8 text-center">
            <div className="w-16 h-16 bg-sand-200 text-terracotta rounded-full flex items-center justify-center mx-auto mb-5 border border-terracotta/20">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-display font-bold text-ink mb-2">
              Something went off-grid
            </h1>
            <p className="text-sm text-ink-muted mb-6 leading-relaxed">
              We encountered an unexpected rendering issue. Your project data in local storage remains safely preserved.
            </p>
            {this.state.error && (
              <div className="bg-sand-100 p-3 rounded-lg text-xs font-mono text-ink-muted mb-6 text-left overflow-auto max-h-24 border border-sand-200">
                {this.state.error.message}
              </div>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-sage-500 hover:bg-sage-600 text-white rounded-lg text-sm font-medium transition-all shadow-subtle"
              >
                <RefreshCw className="w-4 h-4" />
                Reload View
              </button>
              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-sand-200 hover:bg-sand-300 text-ink rounded-lg text-sm font-medium transition-all"
              >
                <Home className="w-4 h-4" />
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
