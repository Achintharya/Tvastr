import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Keep the original document metadata on the two protected pages.
const originalStructuredData = document.querySelector('script[type="application/ld+json"]')?.textContent;
const marketingStructuredData = JSON.stringify({
  "@context": "https://schema.org", "@type": "Organization",
  name: "Tvastr Industrial Intelligence", url: "https://tvastr.co",
  description: "Manufacturing software for business records, quality analysis and management reporting."
});
export function MarketingStructuredData() {
  const { pathname } = useLocation();
  useEffect(() => {
    const script = document.querySelector('script[type="application/ld+json"]');
    if (!script) return;
    script.textContent = ["/technology", "/research"].includes(pathname)
      ? originalStructuredData : marketingStructuredData;
    return () => { script.textContent = originalStructuredData; };
  }, [pathname]);
  return null;
}
