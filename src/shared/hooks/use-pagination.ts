import { useCallback, useMemo, useState } from "react";

export interface UsePaginationOptions {
  itemsPerPage: number;
  totalItems: number;
}

export function usePagination({ itemsPerPage, totalItems }: UsePaginationOptions) {
  const [activeIndex, setActiveIndex] = useState(-1);

  const pageCount = useMemo(
    () => Math.max(1, Math.ceil(totalItems / Math.max(1, itemsPerPage))),
    [totalItems, itemsPerPage],
  );

  const currentPage = useMemo(() => {
    if (activeIndex < 0) return 0;
    return Math.floor(activeIndex / Math.max(1, itemsPerPage));
  }, [activeIndex, itemsPerPage]);

  const firstIndexOfPage = useCallback(
    (page: number) => Math.min(totalItems - 1, page * Math.max(1, itemsPerPage)),
    [itemsPerPage, totalItems],
  );

  const canScrollLeft = currentPage > 0;
  const canScrollRight = currentPage < pageCount - 1;

  const goToPage = useCallback(
    (page: number) => {
      const safePage = Math.min(Math.max(0, page), pageCount - 1);
      const firstIndex = firstIndexOfPage(safePage);
      setActiveIndex(firstIndex);
      return firstIndex;
    },
    [firstIndexOfPage, pageCount],
  );

  const nextPage = useCallback(() => {
    return goToPage(currentPage + 1);
  }, [goToPage, currentPage]);

  const previousPage = useCallback(() => {
    return goToPage(currentPage - 1);
  }, [goToPage, currentPage]);

  const navigateByOffset = useCallback(
    (offset: number) => {
      const next = Math.min(Math.max(activeIndex + offset, 0), totalItems - 1);
      setActiveIndex(next);
      return next;
    },
    [activeIndex, totalItems],
  );

  return {
    activeIndex,
    canScrollLeft,
    canScrollRight,
    currentPage,
    firstIndexOfPage,
    goToPage,
    navigateByOffset,
    nextPage,
    pageCount,
    previousPage,
    setActiveIndex,
  };
}
