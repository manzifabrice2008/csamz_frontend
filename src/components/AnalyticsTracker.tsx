import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analyticsApi } from '@/services/api';

export default function AnalyticsTracker() {
    const location = useLocation();

    useEffect(() => {
        // Debounce tracking to avoid double pings on some react lifecycle quirks
        const timer = setTimeout(() => {
            analyticsApi.track(location.pathname).catch(err => {
                // Silently fail, don't break the UI for tracking errors
                console.debug('Analytics tracking failed:', err);
            });
        }, 500);

        return () => clearTimeout(timer);
    }, [location.pathname]);

    return null;
}
