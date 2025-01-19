import { memo, useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import "./App.css";

import { useAppDispatch, useAppSelector } from "./app/hooks";
import { loadCompanies, loadMoreCompanies } from "./app/actions";
import {
  Company,
  setEditCompanyAdress,
  setEditCompanyName,
  setEditId,
} from "./app/slice";

interface ListRowProps {
  company: Company;
}

const ListRow = memo(({ company }: ListRowProps) => {
  const editId = useAppSelector((state) => state.companies.editId);
  const dispatch = useAppDispatch();

  return (
    <>
      <input type="checkbox" />
      {editId === company.id ? (
        <>
          <input
            defaultValue={company.name}
            onChange={(event) => {
              dispatch(setEditCompanyName(event.target.value));
            }}
          ></input>

          <div>
            <input
              defaultValue={company.adress}
              onChange={(event) => {
                dispatch(setEditCompanyAdress(event.target.value));
              }}
            ></input>
            <button onClick={() => dispatch(setEditId(-1))}>Ok</button>
          </div>
        </>
      ) : (
        <>
          <span
            onClick={() => {
              dispatch(setEditId(company.id));
            }}
          >
            {company.name}
          </span>
          <span
            onClick={() => {
              dispatch(setEditId(company.id));
            }}
          >
            {company.adress}
          </span>
        </>
      )}
    </>
  );
});

const List = () => {
  const { companies, isSubload, loadMoreErrorText } = useAppSelector(
    (state) => state.companies
  );

  const dispatch = useAppDispatch();

  const loaderRef = useRef(null);
  const parentRef = useRef(null);

  // const [editId, setEditId] = useState(-1);
  // const editCompanyRef = useRef<Omit<Company, "id">>();

  const rowVirtualizer = useVirtualizer({
    count: companies.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        dispatch(loadMoreCompanies());
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
                <ListRow company={company} />
              </div>
            );
          })}
        </div>
        <div ref={loaderRef} style={{ height: 1 }}></div>
      </div>
      {isSubload ? (
        <span>Loading more...</span>
      ) : (
        loadMoreErrorText && <span>{loadMoreErrorText}</span>
      )}
    </>
  );
};

const App = () => {
  const { isLoading, loadErrorText } = useAppSelector(
    (state) => state.companies
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
