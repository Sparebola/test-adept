import "./App.css";
import { useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import { useAppDispatch, useAppSelector } from "./app/hooks";
import { RootState } from "./app/store";

function App() {
  const companies = useAppSelector((state: RootState) => state.companies);
  // const dispatch = useAppDispatch();
  const loaderRef = useRef(null);
  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: companies.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) console.log("load more");
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="company">
      <div className="company__header">
        <span>Компании:</span>
        <label>
          <input type="checkbox" />
          Выделить всё
        </label>
      </div>
      <div ref={parentRef} className="company__table">
        <div
          style={{
            height: rowVirtualizer.getTotalSize(),
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const company = companies[virtualRow.index];

            return (
              <div
                key={virtualRow.index}
                className="company__table-row"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <input type="checkbox" />
                <span>{company.name}</span>
                <span>{company.adress}</span>
              </div>
            );
          })}
        </div>
        <span ref={loaderRef}>Loading more...</span>
      </div>
    </div>
  );
}

export default App;
