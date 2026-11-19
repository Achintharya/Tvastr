import { useCallback, useEffect, useState } from "react";

import { technologyTabs } from "../config/technologySections";

export function technologyTabFromHash() {
  if (typeof window === "undefined") return technologyTabs[0].id;
  const hash = window.location.hash.replace(/^#/, "");
  return technologyTabs.some((tab) => tab.id === hash) ? hash : technologyTabs[0].id;
}

/**
 * useTechnologyTabs — active Technology subsection tab synced to the URL hash.
 */
export function useTechnologyTabs() {
  const [activeTab, setActiveTab] = useState(technologyTabFromHash);

  useEffect(() => {
    const onHashChange = () => setActiveTab(technologyTabFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const select = useCallback((id) => {
    if (!technologyTabs.some((tab) => tab.id === id)) return;
    setActiveTab(id);
    if (typeof window !== "undefined" && window.location.hash !== `#${id}`) {
      window.history.pushState(null, "", `#${id}`);
    }
  }, []);

  return { activeTab, select };
}
