import React, { useEffect } from "react";

const TableFooter = ({ total, range, setPage, page, slice }) => {
  const isActive =
    "px-3 py-2 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white";
  const notActive =
    "px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white";
  useEffect(() => {
    if (slice.length < 1 && page !== 1) {
      setPage(page - 1);
    }
  }, [slice, page, setPage]);
  return (
    <nav
      className="flex items-center justify-between pt-4"
      aria-label="Table navigation"
    >
      <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
        Showing{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          1-{slice.length}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {total.length}
        </span>
      </span>
      <ul className="inline-flex items-center -space-x-px">
        {range.map((el, index) => (
          <li key={index}>
            <button
              className={`${page === el ? isActive : notActive}`}
              onClick={() => setPage(el)}
            >
              {el}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableFooter;
