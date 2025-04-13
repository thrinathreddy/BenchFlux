import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip
} from '@mui/material';

export default function ResultsTable({ isRunning }) {
  const [results, setResults] = useState([]);
  const intervalRef = useRef(null);

  const fetchResults = async () => {
    try {
      const res = await axios.get('/api/results');
      setResults(res.data);
    } catch (err) {
      console.error('Failed to fetch results:', err);
    }
  };

  useEffect(() => {
    if (isRunning) {
      fetchResults(); // Fetch immediately
      intervalRef.current = setInterval(fetchResults, 5000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h6" gutterBottom>📊 Test Results</Typography>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Time (ms)</TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell>Request Body</TableCell>
              <TableCell>Status Code</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((r, i) => (
              <TableRow key={i}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>
                  <Chip
                    label={r.status ? 'Success' : 'Fail'}
                    color={r.status ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{r.responseTime}</TableCell>
                <TableCell>{new Date(r.executionTimestamp).toLocaleTimeString()}</TableCell>
                <TableCell>
                  <Box sx={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {r.requestBody}
                  </Box>
                </TableCell>
                <TableCell>{r.primaryResponse?.statusCode || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
