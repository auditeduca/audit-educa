import React, { useEffect, useRef, useState } from 'react';
import Header from '../Header';
import Footer from '../Footer';

const MainLayout = ({ children }) => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef(null);

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };
    updateHeaderHeight();

    window.addEventListener('resize', updateHeaderHeight);
    const observer = new ResizeObserver(updateHeaderHeight);
    if (headerRef.current) observer.observe(headerRef.current);

    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div ref={headerRef}>
        <Header />
      </div>
      <main className="flex-grow" style={{ paddingTop: headerHeight ? `${headerHeight}px` : '0' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;