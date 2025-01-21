import { memo, useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import "./App.css";

import { useAppDispatch, useAppSelector } from "./app/hooks";
import { loadCompanies, loadMoreCompanies } from "./app/actions";
import {
  addCompany,
  Company,
  deleteSelectCompany,
  selectAllCompany,
  setCompanyChecked,
  setEditCompanyAdress,
  setEditCompanyName,
  setEditId,
} from "./app/slice";

interface ListRowProps {
  company: Company;
  isChecked: boolean;
  isEdit: boolean;
}

const ListRow = memo(({ company, isChecked, isEdit }: ListRowProps) => {
  const dispatch = useAppDispatch();

  return (
    <>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={(event) => {
          dispatch(
            setCompanyChecked({
              isChecked: event.target.checked,
              id: company.id,
            })
          );
        }}
      />
      {isEdit ? (
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
            className="company__name"
            onClick={() => {
              dispatch(setEditId(company.id));
            }}
          >
            {company.name}
          </span>
          <span
            className="company__name"
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
  const companies = useAppSelector((state) => state.companies.companies);
  const isSubload = useAppSelector((state) => state.companies.isSubload);
  const selectedIds = useAppSelector((state) => state.companies.selectedIds);
  const editId = useAppSelector((state) => state.companies.editId);

  const loadMoreErrorText = useAppSelector(
    (state) => state.companies.loadMoreErrorText
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
                  transform: `translateY(${virtualRow.start}px)`,
                  background: selectedIds[company.id] ? "gray" : undefined,
                }}
              >
                <ListRow
                  company={company}
                  isChecked={Boolean(selectedIds[company.id])}
                  isEdit={Boolean(editId === company.id)}
                />
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
  const isLoading = useAppSelector((state) => state.companies.isLoading);
  const loadErrorText = useAppSelector(
    (state) => state.companies.loadErrorText
  );
  const dispatch = useAppDispatch();
  const [isSelectAll, selectAll] = useState(false);

  useEffect(() => {
    const promise = dispatch(loadCompanies());
    return () => {
      promise.abort();
    };
  }, []);

  return (
    <div className="company">
      <div className="company__tools">
        <button
          onClick={() => {
            selectAll(false);
            dispatch(deleteSelectCompany());
          }}
        >
          Delete slect
        </button>
        <button
          onClick={() => {
            dispatch(addCompany());
          }}
        >
          Add
        </button>
      </div>

      <div className="company__header">
        <span>Компании:</span>

        <label>
          <input
            type="checkbox"
            checked={isSelectAll}
            onChange={(event) => {
              selectAll(event.target.checked);
              dispatch(selectAllCompany(event.target.checked));
            }}
          />
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
