import { ReactNode, useEffect, useRef, useState } from "react";

interface DeferredSectionProps {
  children: ReactNode;
  className?: string;
  minHeight?: number;
  rootMargin?: string;
}

const DeferredSection = ({
  children,
  className,
  minHeight = 320,
  rootMargin = "300px 0px",
}: DeferredSectionProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = containerRef.current;

    if (!element || isVisible) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={!isVisible ? { minHeight } : undefined}
    >
      {isVisible ? children : null}
    </div>
  );
};

export default DeferredSection;
