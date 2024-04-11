import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import clsx from "clsx";

type Props = {
  currentPage: number;
  totalItems: number;
  path: string;
  limit: number;
};

const MyPagination = ({ currentPage, totalItems, path, limit }: Props) => {
  const totalPages = Math.ceil(totalItems / (limit || 1));
  const generatePageLink = (pageNumber: number) => `${path}?page=${pageNumber}`;

  return (
    <Pagination className="my-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={generatePageLink(currentPage - 1)}
            className={clsx(
              currentPage <= 1 && "pointer-events-none opacity-50"
            )}
          />
        </PaginationItem>

        {[
          currentPage === totalPages ? currentPage - 2 : 0,
          currentPage - 1,
          currentPage,
          currentPage + 1,
          currentPage === 1 ? currentPage + 2 : 0,
        ]
          .filter((page) => page > 0 && page <= totalPages)
          .map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                href={generatePageLink(page)}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

        <PaginationItem>
          <PaginationNext
            href={generatePageLink(currentPage + 1)}
            className={clsx(
              currentPage * limit >= totalItems &&
                "pointer-events-none opacity-50"
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default MyPagination;
