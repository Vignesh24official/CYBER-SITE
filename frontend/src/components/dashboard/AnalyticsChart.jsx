import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const COLORS = ['#38BDF8', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6', '#EC4899'];

export const SeverityPieChart = ({ data }) => {
  const chartData = Object.entries(data || {}).map(([key, value]) => ({
    name: key,
    value: Number(value),
  }));

  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: '#1C2541', borderColor: '#2D3B66', borderRadius: '8px' }} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const CategoryBarChart = ({ data }) => {
  const chartData = Object.entries(data || {}).map(([key, value]) => ({
    category: key.length > 15 ? key.substring(0, 15) + '...' : key,
    count: Number(value),
  }));

  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2D3B66" />
          <XAxis dataKey="category" stroke="#94A3B8" fontSize={11} interval={0} angle={-15} textAnchor="end" />
          <YAxis stroke="#94A3B8" fontSize={11} />
          <Tooltip contentStyle={{ backgroundColor: '#1C2541', borderColor: '#2D3B66', borderRadius: '8px' }} />
          <Bar dataKey="count" fill="#38BDF8" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
