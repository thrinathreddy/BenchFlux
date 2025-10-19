// ChartPanel.js
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { Box, Typography, Grid, Paper } from '@mui/material';

const COLORS = ['#4caf50', '#f44336'];

export default function ChartPanel({ results }) {
  if (!results.length) return null;

  // Format data for response time line chart
  const responseTimeData = results.map(r => ({
    time: new Date(r.executionTimestamp).toLocaleTimeString(),
    responseTime: r.responseTime
  }));

  // TPS aggregation
  const tpsMap = {};
  results.forEach(r => {
    const second = new Date(r.executionTimestamp).toLocaleTimeString();
    tpsMap[second] = (tpsMap[second] || 0) + 1;
  });
  const tpsData = Object.entries(tpsMap).map(([time, tps]) => ({ time, tps }));

  // Success vs Fail count
  const successCount = results.filter(r => r.status).length;
  const failCount = results.length - successCount;
  const statusData = [
    { name: 'Success', value: successCount },
    { name: 'Fail', value: failCount }
  ];

  return (
    <Box sx={{ mt: 4, width: '100%', px: 2 }}> {/* Added horizontal padding */}
      <Typography variant="h6" gutterBottom>
        📉 Real-Time Test Metrics
      </Typography>
      <Grid container spacing={2} sx={{ mt: 4, width: '100%', px: 2 }}>
        {/* Response Time Chart */}
        <Grid item size={4} sx={{ p: 2, height: '100%' }}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="subtitle1" gutterBottom>Response Time</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="responseTime" stroke="#1976d2" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* TPS Chart */}
        <Grid item size={4} sx={{ p: 2, height: '100%' }}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="subtitle1" gutterBottom>TPS (Transactions Per Second)</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={tpsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="tps" stroke="#4caf50" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Success vs Fail Chart */}
        <Grid item size={4} sx={{ p: 2, height: '100%' }}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="subtitle1" gutterBottom>Status</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

}
