import { useEffect, useState, useMemo } from "react";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import axiosInstance from "../../../api/axios";
import { TableContainer } from "../../../components/ui/table";

interface Airport {
  id: number;
  name: string;
  code: string;
  city: string;
  country: string;
}

const Airports = () => {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);

  const fetchAirports = async () => {
    try {
      const res = await axiosInstance.get("/get-all-airports");
      setAirports(res.data.data);
    } catch (error) {
      console.error("Error fetching airports:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo<ColumnDef<Airport>[]>(
    () => [
      {
        header: "#",
        accessorFn: (_, index) => index + 1,
        id: "index",
        enableSorting: false,
      },
      {
        header: "Name",
        accessorKey: "name",
        enableSorting: true,
      },
      {
        header: "Code",
        accessorKey: "code",
        enableSorting: true,
      },
      {
        header: "City",
        accessorKey: "city",
        enableSorting: true,
      },
      {
        header: "Country",
        accessorKey: "country",
        enableSorting: true,
      },
    ],
    []
  );

  useEffect(() => {
    fetchAirports();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <TableContainer
        title="Airports Table"
        data={airports}
        columns={columns}
        loading={loading}
        sorting={sorting}
        onSortingChange={setSorting}
        emptyMessage="No airports found"
      />
    </div>
  );
};

export default Airports;
