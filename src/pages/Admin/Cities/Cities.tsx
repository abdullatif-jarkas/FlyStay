import { useEffect, useMemo, useState } from "react";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import axios from "axios";
import { TableContainer } from "../../../components/ui/table";

interface Country {
  id: number;
  name: string;
  iso2: string;
}

interface City {
  id: number;
  name: string;
  country: Country;
}

export interface Pagination {
  current_page: number;
  total_pages: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}

const Cities = () => {
  const [data, setData] = useState<City[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);

  // 🔍 State للبحث
  const [searchCity, setSearchCity] = useState("");
  const [searchCountry, setSearchCountry] = useState("");

  const token = localStorage.getItem("token");

  const fetchCities = async () => {
    try {
      setLoading(true);

      const params: any = {
        page,
      };

      if (searchCity) params.name = searchCity;
      if (searchCountry) params.country = searchCountry;

      const res = await axios.get("http://127.0.0.1:8000/api/get-all-cities", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        params,
      });

      if (res.data.status === "success") {
        setData(res.data.data);
        setPagination(res.data.pagination);
      } else {
        setError("فشل في تحميل البيانات");
      }
    } catch (err) {
      setError("فشل في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, [page]);

  const handleSearch = () => {
    setPage(1); // نعيد إلى الصفحة الأولى عند البحث
    fetchCities();
  };

  const columns = useMemo<ColumnDef<City>[]>(
    () => [
      {
        header: "ID",
        accessorKey: "id",
        enableSorting: true,
      },
      {
        header: "City Name",
        accessorKey: "name",
        enableSorting: true,
      },
      {
        header: "Country",
        accessorFn: (row) => row.country?.name ?? "N/A",
        id: "country",
        cell: (info) => info.getValue(),
        enableSorting: true,
      },
    ],
    []
  );

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Cities</h2>

      {/* 🔍 حقول البحث */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by city name"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          className="border p-2 rounded w-full sm:w-auto"
        />
        <input
          type="text"
          placeholder="Search by country name"
          value={searchCountry}
          onChange={(e) => setSearchCountry(e.target.value)}
          className="border p-2 rounded w-full sm:w-auto"
        />
        <button
          onClick={handleSearch}
          className="bg-primary-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <TableContainer
        data={data}
        columns={columns}
        loading={loading}
        sorting={sorting}
        onSortingChange={setSorting}
        pagination={pagination || undefined}
        onPageChange={pagination ? setPage : undefined}
        emptyMessage="No cities found"
      />
    </div>
  );
};

export default Cities;
