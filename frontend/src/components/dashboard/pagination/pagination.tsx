"use client";

const Pagination = ({
  count,
  currentPage,
  onPageChange,
}: {
  count: number;
  currentPage: number;
  onPageChange: (pageNumber: number) => void;
}) => {
  const ITEM_PER_PAGE = 5; // Assuming 5 items per page

  const totalPages = Math.ceil(count / ITEM_PER_PAGE);

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const handleChangePage = (type: string) => {
    let newPage = currentPage;
    if (type === "prev" && hasPrev) {
      newPage--;
    } else if (type === "next" && hasNext) {
      newPage++;
    }
    onPageChange(newPage);
  };

  return (
    <div className="bgSoft p-4 flex justify-between">
      <button
        className={`px-4 py-2  ${hasPrev ? "text-white" : "text-gray-500"} ${
          hasPrev ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-300"
        } ${hasPrev ? "cursor-pointer" : "cursor-not-allowed"}`}
        onClick={() => handleChangePage("prev")}
      >
        Previous
      </button>
      <button
        className={`px-4 py-2  ${hasNext ? "text-white" : "text-gray-500"} ${
          hasNext ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-300"
        } ${hasNext ? "cursor-pointer" : "cursor-not-allowed"}`}
        onClick={() => handleChangePage("next")}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
