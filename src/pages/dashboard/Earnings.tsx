import { DollarSign, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useGetDriverEarningsQuery } from '../../services/rideApi';
import { useState } from 'react';

const Earnings = () => {
  const [period, setPeriod] = useState('week');
  const { data: earningsData, isLoading } = useGetDriverEarningsQuery(period);
  
  const totalEarnings = earningsData?.data?.totalEarnings || 0;
  const earningsList = earningsData?.data?.earnings || [];

  // Transform earnings data for chart
  const chartData = earningsList.reduce((acc: any[], curr: any) => {
      const date = new Date(curr.date);
      let label = '';
      if (period === 'today') {
          label = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (period === 'month') {
          label = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      } else {
          label = date.toLocaleDateString('en-US', { weekday: 'short' });
      }
      
      const existing = acc.find(item => item.label === label);
      if (existing) {
          existing.amount += curr.amount;
      } else {
          acc.push({ label, amount: curr.amount });
      }
      return acc;
  }, []);

  if (isLoading) {
      return <div className="p-8 text-center text-gray-500">Loading earnings...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <DollarSign className="h-6 w-6" />
          Earnings
        </h1>
        <div className="flex bg-white rounded-lg shadow-sm p-1 border border-gray-200">
             {['today', 'week', 'month'].map((p) => (
                 <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-3 py-1 text-sm rounded-md capitalize transition-colors ${
                        period === p ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                 >
                     {p}
                 </button>
             ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
             <div>
                 <p className="text-gray-500 text-sm mb-1 capitalize">Total Earnings ({period})</p>
                 <p className="text-3xl font-bold text-gray-900">${totalEarnings.toFixed(2)}</p>
             </div>
             <div className="bg-green-100 p-3 rounded-full">
                 <TrendingUp className="h-6 w-6 text-green-600" />
             </div>
         </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4 capitalize">{period}ly Breakdown</h2>
        <div className="h-80 w-full">
           {chartData.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={chartData}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} />
                   <XAxis dataKey="label" axisLine={false} tickLine={false} />
                   <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                   <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                   <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
                 </BarChart>
               </ResponsiveContainer>
           ) : (
               <div className="h-full flex items-center justify-center text-gray-400">
                   No earnings data for this {period}.
               </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Earnings;
