import * as React from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Table                                                               */
/* ------------------------------------------------------------------ */

export type RuledTableProps = {
  headers: string[];
  children: React.ReactNode;
  caption?: string;
  className?: string;
};

/**
 * Pure editorial ruled table -- no zebra stripes, no hover fills.
 * Horizontal rules only, in the tradition of Kinfolk print layouts.
 */
export function RuledTable({
  headers,
  children,
  caption,
  className,
}: RuledTableProps) {
  return (
    <table
      className={cn("w-full border-collapse font-body text-text", className)}
    >
      {caption && (
        <caption className="mb-3 text-sm text-secondary text-left">
          {caption}
        </caption>
      )}

      <thead>
        <tr>
          {headers.map((header) => (
            <th
              key={header}
              scope="col"
              className="text-left text-sm font-medium text-secondary uppercase tracking-wide border-b border-rule px-3 py-3"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>{children}</tbody>
    </table>
  );
}

/* ------------------------------------------------------------------ */
/*  Row                                                                 */
/* ------------------------------------------------------------------ */

export type TableRowProps = {
  children: React.ReactNode;
  className?: string;
};

export function TableRow({ children, className }: TableRowProps) {
  return (
    <tr className={cn("border-b border-rule", className)}>{children}</tr>
  );
}

/* ------------------------------------------------------------------ */
/*  Cell                                                                */
/* ------------------------------------------------------------------ */

export type TableCellProps = {
  children: React.ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
};

const alignClass: Record<NonNullable<TableCellProps["align"]>, string> = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
};

export function TableCell({
  children,
  align = "left",
  className,
}: TableCellProps) {
  return (
    <td className={cn("px-3 py-3 text-sm", alignClass[align], className)}>
      {children}
    </td>
  );
}
