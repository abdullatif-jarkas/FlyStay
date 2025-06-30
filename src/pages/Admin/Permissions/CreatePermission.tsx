import React, { useState } from 'react';

const CreatePermission = ({ onCreated }: { onCreated: () => void }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('name', name);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/permission', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        setMessage('Permission created successfully');
        setName('');
        onCreated(); // لإعادة تحميل البيانات في الجدول
      } else {
        setMessage(result.message || 'Failed to create permission');
      }
    } catch (error) {
      setMessage('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-4">
      <h2 className="text-xl font-semibold">Create New Permission</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Permission name"
        className="border p-2 rounded w-full"
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create'}
      </button>
      {message && <p className="text-sm text-gray-700">{message}</p>}
    </form>
  );
};

export default CreatePermission;
