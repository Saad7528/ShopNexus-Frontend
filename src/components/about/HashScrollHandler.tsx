'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function HashScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (!hash) return;

      const targetId = hash.replace('#', '');
      const targetElement =
        document.getElementById(targetId) ||
        (targetId === 'faq' ? document.getElementById('faq-section') : null) ||
        (targetId === 'about' ? document.getElementById('about-hero') : null);

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (targetId === 'top' || targetId === 'about-hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    // Execute on initial render and after any brief hydration delay
    const t1 = setTimeout(scrollToHash, 100);
    const t2 = setTimeout(scrollToHash, 400);

    window.addEventListener('hashchange', scrollToHash);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('hashchange', scrollToHash);
    };
  }, [pathname]);

  return null;
}
