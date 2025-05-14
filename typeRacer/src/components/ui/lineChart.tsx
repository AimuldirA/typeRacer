// components/LineChartExample.tsx
'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type Props = {
  data: { date: string; value: number }[];
};


export default function LineChartEx({data}:Props) {
  return (
    <div className="p-4 rounded-2xl shadow-md bg-primary border border-secondary border-2 dark:bg-zinc-900">
      <h2 className="text-xl font-bold mb-4">Race Results</h2>
      <ResponsiveContainer  height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
