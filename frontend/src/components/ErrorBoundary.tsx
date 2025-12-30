import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleFixInVie = () => {
    const { error, errorInfo } = this.state;

    const messageData = {
      type: 'VIE_FIX_ERROR',
      payload: {
        message: error?.message || 'Unknown error',
        stack: error?.stack || errorInfo?.componentStack || 'No stack trace available',
        name: error?.name || 'Error',
        timestamp: new Date().toISOString(),
      }
    };

    // Post to parent window if we're in an iframe
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(messageData, '*');
    } else if (window.top && window.top !== window) {
      window.top.postMessage(messageData, '*');
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 99999,
          fontFamily: '"JetBrains Mono", monospace, system-ui, sans-serif',
          backgroundColor: '#f0f0ef',
          color: '#1e201e',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            height: '100%',
          }}>
            <div style={{
              maxWidth: '600px',
              width: '100%',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              background: '#fcfdfc',
              border: '1px solid #e0e1e0',
              borderRadius: '8px',
              padding: '24px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            }}>
              <h1 style={{
                fontSize: '18px',
                fontWeight: 600,
                margin: 0,
              }}>
                Oops! An error occurred
              </h1>

              <div style={{
                fontSize: '13px',
                color: '#e54d2e',
                lineHeight: 1.5,
                margin: 0,
                whiteSpace: 'pre-wrap',
                textAlign: 'left',
                background: '#f8f9f8',
                border: '1px solid #e0e1e0',
                borderRadius: '4px',
                padding: '12px',
                overflowX: 'auto',
                overflowY: 'auto',
                wordWrap: 'break-word',
                maxHeight: '150px',
              }}>
                {this.state.error?.message || 'Unknown error'}
              </div>

              <details style={{
                textAlign: 'left',
                border: '1px solid #e0e1e0',
                borderRadius: '4px',
                background: '#fcfdfc',
              }}>
                <summary style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  fontWeight: 500,
                  color: '#b2b5b0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  userSelect: 'none',
                  fontSize: '13px',
                }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M6 12L10 8L6 4"></path>
                  </svg>
                  Stack Trace
                </summary>
                <div style={{
                  padding: '12px',
                  fontFamily: 'inherit',
                  fontSize: '11px',
                  lineHeight: 1.4,
                  color: '#b2b5b0',
                  whiteSpace: 'pre-wrap',
                  overflowX: 'auto',
                  background: '#f8f9f8',
                  margin: '0 12px 12px 12px',
                  borderRadius: '2px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                }}>
                  {this.state.error?.stack || this.state.errorInfo?.componentStack || 'No stack trace available'}
                </div>
              </details>

              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                marginTop: '8px',
              }}>
                <button
                  onClick={this.handleFixInVie}
                  style={{
                    background: '#ff7214',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Fix with Vie
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
