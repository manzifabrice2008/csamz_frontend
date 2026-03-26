import { ComponentType, useEffect, useState } from "react";

type MonitoringComponent = ComponentType<Record<string, never>>;

const DeferredMonitoring = () => {
  const [AnalyticsComponent, setAnalyticsComponent] = useState<MonitoringComponent | null>(null);
  const [SpeedInsightsComponent, setSpeedInsightsComponent] = useState<MonitoringComponent | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadMonitoring = () => {
      Promise.all([
        import("@vercel/analytics/react"),
        import("@vercel/speed-insights/react"),
      ])
        .then(([analyticsModule, speedInsightsModule]) => {
          if (cancelled) {
            return;
          }

          setAnalyticsComponent(() => analyticsModule.Analytics);
          setSpeedInsightsComponent(() => speedInsightsModule.SpeedInsights);
        })
        .catch(() => {
          // Skip monitoring silently if it fails to load.
        });
    };

    if ("requestIdleCallback" in window) {
      const idleHandle = window.requestIdleCallback(loadMonitoring, { timeout: 2000 });

      return () => {
        cancelled = true;
        window.cancelIdleCallback(idleHandle);
      };
    }

    const timeoutId = window.setTimeout(loadMonitoring, 1500);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <>
      {AnalyticsComponent ? <AnalyticsComponent /> : null}
      {SpeedInsightsComponent ? <SpeedInsightsComponent /> : null}
    </>
  );
};

export default DeferredMonitoring;
