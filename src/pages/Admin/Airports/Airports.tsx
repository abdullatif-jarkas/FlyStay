import { useEffect, useState, useMemo } from "react";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import axiosInstance from "../../../api/axios";
import { TableContainer } from "../../../components/ui/table";

interface Airport {
  id: number;
  name: string;
  code: string;
  city: {
    id: number;
    name: string;
  };
  city_id: number;
  country: {
    id: number;
    name: string;
    iso2: string;
  };
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
        header: "ID",
        accessorKey: "id",
        enableSorting: true,
      },
      {
        header: "Name",
        accessorKey: "name",
        enableSorting: true,
      },
      {
        header: "IATA Code",
        accessorKey: "IATA_code",
        enableSorting: true,
      },
      {
        header: "Location",
        accessorFn: (row) => {
          const city = row.city?.name ?? "";
          const country = row.country?.name ?? "";
          console.log(country)
          return city && country ? `${city}, ${country}` : city || country;
        },
        enableSorting: true,
      },
      {
        header: "City ID",
        accessorFn: (row) => row.city_id,
        enableSorting: true,
      },
      {
        header: "Country ISO2",
        accessorFn: (row) => row.country?.iso2 ?? "",
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
