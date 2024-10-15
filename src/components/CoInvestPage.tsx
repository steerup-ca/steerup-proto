import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StartupsSelection } from '../types';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const CoInvestPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [investmentAmount, setInvestmentAmount] = useState<string>('');
  const [selection, setSelection] = useState<StartupsSelection | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSelection = async () => {
      if (id) {
        const selectionRef = doc(db, 'startupsSelections', id);
        const selectionSnap = await getDoc(selectionRef);
        if (selectionSnap.exists()) {
          setSelection({ id: selectionSnap.id, ...selectionSnap.data() } as StartupsSelection);
        }
      }
      setLoading(false);
    };

    fetchSelection();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!selection) {
    return <div>Selection not found</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the investment data to your backend
    console.log(`Investment of $${investmentAmount} submitted for selection ${id}`);
    // Navigate back to the main page or a confirmation page
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Co-invest in {selection.title}</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="investmentAmount" className="block text-sm font-medium text-gray-700">
            Investment Amount ($)
          </label>
          <input
            type="number"
            id="investmentAmount"
            value={investmentAmount}
            onChange={(e) => setInvestmentAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
            min="1"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
        >
          Confirm Co-investment
        </button>
      </form>
    </div>
  );
};

export default CoInvestPage;
