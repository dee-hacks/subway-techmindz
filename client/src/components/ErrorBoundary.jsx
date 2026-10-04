import React from 'react';

// App-level error boundary: prevents the "white screen" if a page hits an
// unexpected error, and gives the user a friendly way to recover.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error:', error, info);
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
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f9fafb',
            padding: '24px'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '8px' }}>🚆</div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: '8px 0' }}>
              Something went wrong
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>
              This page hit an unexpected error. Please go back or reload.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={this.handleReload}
                style={{
                  background: '#0d9488',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Reload
              </button>
              <button
                onClick={this.handleGoHome}
                style={{
                  background: '#e5e7eb',
                  color: '#111827',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;