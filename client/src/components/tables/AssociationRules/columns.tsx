"use client";
import { ColumnDef } from "@tanstack/react-table";
import { MovieFullDataT } from "@/types/movie.types";

import {
  baseHeader,
  confidenceCell,
  movieCell,
  movieHeader,
  supportCell,
} from "@/components/tables/BaseTable/base-columns";

export type TableAssociationRuleT = {
  support: number;
  confidence: number;
  movie: MovieFullDataT;
};

export const columns: ColumnDef<TableAssociationRuleT & { filterField: string }>[] =
  [
    {
      accessorKey: "movie.title",
      header: movieHeader,
      cell: ({ row }: any) => {
        const data = row.original;
        const movie = data.movie as MovieFullDataT;
        return movieCell(movie);
      },
    },
    {
      accessorKey: "confidence",
      header: baseHeader("Уверенность"),
      cell: confidenceCell,
    },
    {
      accessorKey: "support",
      header: baseHeader("Поддержка"),
      cell: supportCell,
    },
    {
      accessorKey: "filterField",
      header: () => null,
      cell: () => null,
    },
  ];
