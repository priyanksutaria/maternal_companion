import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface PatientSearchProps {
  onSearch: (id: string) => void;
  loading: boolean;
  error: string | null;
}

export default function PatientSearch({ onSearch, loading, error }: PatientSearchProps) {
  const [pregnancyId, setPregnancyId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pregnancyId) {
      onSearch(pregnancyId);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Find Patient by Pregnancy ID</h2>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={pregnancyId}
            onChange={(e) => setPregnancyId(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter Pregnancy ID..."
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <button
          type="submit"
          className="w-full mt-4 px-4 py-3 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
}