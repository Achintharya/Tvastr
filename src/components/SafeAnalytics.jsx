/**
 * SafeAnalytics — Error-tolerant wrapper for Vercel Analytics.
 *
 * Vercel Analytics is frequently blocked by ad blockers (uBlock Origin,
 * Privacy Badger, etc.), which causes ERR_BLOCKED_BY_CLIENT errors in the
 * console. This wrapper catches those errors silently so they don't pollute
 * the dev console or alarm users.
 *
 * Property: Analytics graceful degradation
 */
import { Component, Suspense, lazy } from 'react';

// Lazy-load Analytics to isolate any import-time failures
const VercelAnalytics = lazy(() =>
  import('@vercel/analytics/react')
    .then((mod) => ({ default: mod.Analytics }))
    .catch(() => ({ default: () => null })) // Return empty component on failure
);

/**
 * Error boundary that catches runtime errors from Analytics
 */
class AnalyticsErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Silently swallow analytics errors — they're non-critical
    if (process.env.NODE_ENV === 'development') {
      console.debug('[SafeAnalytics] Analytics blocked or failed:', error.message);
    }
  }

  render() {
    if (this.state.hasError) {
      return null; // Render nothing if analytics fails
    }
    return this.props.children;
  }
}

/**
 * SafeAnalytics — drop-in replacement for <Analytics />
 * Gracefully handles ad blocker interference.
 */
export function SafeAnalytics() {
  return (
    <AnalyticsErrorBoundary>
      <Suspense fallback={null}>
        <VercelAnalytics />
      </Suspense>
    </AnalyticsErrorBoundary>
  );
}

export default SafeAnalytics;
