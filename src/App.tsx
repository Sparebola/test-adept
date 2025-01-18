import { useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import "./App.css";

import { useAppDispatch, useAppSelector } from "./app/hooks";
import { RootState } from "./app/store";
import { loadCompanies, subloadCompanies } from "./app/actions";

const List = () => {
  const { companies, isSubload, subloadErrorText } = useAppSelector(
    (state: RootState) => state.companies
  );
  const dispatch = useAppDispatch();

  const loaderRef = useRef(null);
  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: companies.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        dispatch(subloadCompanies());
      }
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
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
        <div ref={loaderRef} style={{ height: 1 }}></div>
      </div>
      {isSubload ? (
        <span>Loading more...</span>
      ) : (
        subloadErrorText && <span>{subloadErrorText}</span>
      )}
    </>
  );
};

const App = () => {
  const { isLoading, loadErrorText } = useAppSelector(
    (state: RootState) => state.companies
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    const promise = dispatch(loadCompanies());
    return () => {
      promise.abort();
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
      {loadErrorText ? (
        <span>{loadErrorText}</span>
      ) : isLoading ? (
        <span>Loading...</span>
      ) : (
        <List />
      )}
    </div>
  );
};

export default App;
