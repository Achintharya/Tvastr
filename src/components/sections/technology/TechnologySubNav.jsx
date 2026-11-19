import { useEffect, useRef } from "react";

import { technologyTabs } from "../../../config/technologySections";

/**
 * TechnologySubNav — pill tab bar that switches the visible Technology page
 * subsection group. Inactive groups stay mounted with display:none.
 */
export function TechnologySubNav({ activeTab, onSelect }) {
  const activeRef = useRef(null);

  // Keep the selected pill visible inside the horizontally scrollable row.
  useEffect(() => {
    activeRef.current?.scrollIntoView?.({ block: "nearest", inline: "nearest" });
  }, [activeTab]);

  return (
    <div
      role="tablist"
      aria-label="Technology subsections"
      className="fixed top-20 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none"
    >
      <div className="pointer-events-auto flex gap-2 no-scrollbar overflow-x-auto max-w-full py-2 px-2 rounded-full border bg-bg-primary/90 backdrop-blur-sm shadow-sm" style={{ borderColor: "var(--border-default)" }}>
        {technologyTabs.map((tab) => {
          const selected = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              ref={selected ? activeRef : undefined}
              role="tab"
              id={`technology-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`technology-tabpanel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => onSelect(tab.id)}
              onKeyDown={(event) => {
                const index = technologyTabs.findIndex((t) => t.id === activeTab);
                if (event.key === "ArrowRight") {
                  onSelect(technologyTabs[(index + 1) % technologyTabs.length].id);
                } else if (event.key === "ArrowLeft") {
                  onSelect(technologyTabs[(index + technologyTabs.length - 1) % technologyTabs.length].id);
                } else {
                  return;
                }
                event.preventDefault();
              }}
              className="whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-process-primary"
              style={
                selected
                  ? { background: "var(--process-primary)", color: "var(--bg-primary)" }
                  : { color: "var(--text-secondary)" }
              }
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
