import { useEffect, useMemo, useState } from "react";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import axios from "axios";
import { Pagination } from "../Cities/Cities";
import { TableContainer } from "../../../components/ui/table";

interface Hotel {
  id: number;
  name: string;
  address?: string;
  city: string;
  created_at: string;
}

const Hotels = () => {
  const [data, setData] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pagination, setPagination] = useState<Pagination | null>();
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);

  // form state
  const [formData, setFormData] = useState({
    name: "",
    city_id: "",
    rating: "",
    description: "",
  });

  const token = localStorage.getItem("token");

  const fetchHotels = async () => {
    try {
      const params: any = {
        page,
      };
      const res = await axios.get("http://127.0.0.1:8000/api/hotel", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        params,
      });
      if (res.data.data.length === 0) {
        setError("No hotels found!");
        return;
      }

      if (res.data.status === "success") {
        setData(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      setError("Faild to load data!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [page]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const form = new FormData();
    form.append("name", formData.name);
    form.append("city_id", formData.city_id);
    form.append("rating", formData.rating);
    form.append("description", formData.description);

    try {
      await axios.post("http://127.0.0.1:8000/api/hotel", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setSuccess("تم إنشاء الفندق بنجاح");
      setFormData({
        name: "",
        city_id: "",
        rating: "",
        description: "",
      });
      fetchHotels(); // إعادة تحميل الجدول
    } catch (err) {
      setError("حدث خطأ أثناء إنشاء الفندق");
    }
  };

  const columns = useMemo<ColumnDef<Hotel>[]>(
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
        header: "City",
        accessorKey: "city.name",
        enableSorting: true,
      },
    ],
    []
  );

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Create New Hotel</h2>

      <form
        onSubmit={handleCreate}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
      >
        <input
          type="text"
          placeholder="Hotel Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="City ID"
          value={formData.city_id}
          onChange={(e) =>
            setFormData({ ...formData, city_id: e.target.value })
          }
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Rating"
          value={formData.rating}
          onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="border p-2 rounded col-span-1 md:col-span-2"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded col-span-1 md:col-span-2"
        >
          Create Hotel
        </button>
      </form>

      {success && <p className="text-green-600 mb-4">{success}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <TableContainer
        title="Hotels List"
        data={data}
        columns={columns}
        loading={loading}
        sorting={sorting}
        onSortingChange={setSorting}
        pagination={pagination || undefined}
        onPageChange={pagination ? setPage : undefined}
        emptyMessage="No hotels found"
      />
    </div>
  );
};

export default Hotels;
