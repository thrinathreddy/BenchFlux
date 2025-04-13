import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  TextareaAutosize
} from '@mui/material';

export default function TestForm({ onTestComplete, onStopTest, isRunning }) {
  const [form, setForm] = useState({
    primaryUrl: '',
    comparisonUrl: '',
    method: 'GET',
    testType: 'PERFORMANCE',
    iterations: 100,
    targetTPS: 5,
    rawHeaders: '',
    rawRequestBodies: '',
    authMode: 'MANUAL',
    authTokenUrl: '',
    authTokenMethod: 'GET',
    authTokenHeaders: '',
    authTokenBody: '',
    authTokenField: '',
    authTokenHeaderKey: 'Authorization',
    authTokenRefreshInterval: 300
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/runTest', form);
      onTestComplete();
    } catch (err) {
      alert('Test failed: ' + err.message);
    }
  };

  const handleStop = () => onStopTest();

  const updateTPS = async () => {
    try {
      await axios.post('/api/updateTps', { tps: form.targetTPS });
      alert('TPS updated');
    } catch (err) {
      alert('Update TPS failed: ' + err.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 4, background: '#fff', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h5" gutterBottom align="center">
        🧪 BenchFlux Test Configuration
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>

        <Grid container spacing={2}>

          {/* URL & Method */}
          <Grid item xs={12}>
            <TextField fullWidth label="Primary URL" name="primaryUrl" value={form.primaryUrl} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Comparison URL" name="comparisonUrl" value={form.comparisonUrl} onChange={handleChange} />
          </Grid>

          <Grid item xs={6}>
            <TextField fullWidth label="HTTP Method" name="method" value={form.method} onChange={handleChange} />
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Test Type</InputLabel>
              <Select name="testType" value={form.testType} onChange={handleChange}>
                <MenuItem value="PERFORMANCE">Performance</MenuItem>
                <MenuItem value="COMPARISON">Comparison</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <TextField fullWidth label="Iterations" name="iterations" type="number" value={form.iterations} onChange={handleChange} />
          </Grid>

          <Grid item xs={6}>
            <TextField fullWidth label="Target TPS" name="targetTPS" type="number" value={form.targetTPS} onChange={handleChange} />
          </Grid>

          {/* Auth Mode */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Auth Mode</InputLabel>
              <Select name="authMode" value={form.authMode} onChange={handleChange}>
                <MenuItem value="MANUAL">Manual (via Headers)</MenuItem>
                <MenuItem value="AUTO">Auto (via Token API)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {form.authMode === 'AUTO' && (
            <>
              <Grid item xs={12}>
                <TextField fullWidth label="Token URL" name="authTokenUrl" value={form.authTokenUrl} onChange={handleChange} />
              </Grid>

              <Grid item xs={6}>
                <TextField fullWidth label="Token Method" name="authTokenMethod" value={form.authTokenMethod} onChange={handleChange} />
              </Grid>

              <Grid item xs={6}>
                <TextField fullWidth label="Header Key (e.g. Authorization)" name="authTokenHeaderKey" value={form.authTokenHeaderKey} onChange={handleChange} />
              </Grid>

              <Grid item xs={6}>
                <TextField fullWidth label="Token Field (e.g. access_token)" name="authTokenField" value={form.authTokenField} onChange={handleChange} />
              </Grid>

              <Grid item xs={6}>
                <TextField fullWidth label="Refresh Interval (s)" name="authTokenRefreshInterval" type="number" value={form.authTokenRefreshInterval} onChange={handleChange} />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth multiline minRows={3}
                  label="Token Headers (JSON)"
                  name="authTokenHeaders"
                  value={form.authTokenHeaders}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth multiline minRows={3}
                  label="Token Body (JSON)"
                  name="authTokenBody"
                  value={form.authTokenBody}
                  onChange={handleChange}
                />
              </Grid>
            </>
          )}

          {/* Raw Headers & Request Bodies */}
          <Grid item xs={12}>
            <TextField
              fullWidth multiline minRows={3}
              label="Custom Headers (JSON)"
              name="rawHeaders"
              value={form.rawHeaders}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth multiline minRows={3}
              label="Request Bodies (JSON Array)"
              name="rawRequestBodies"
              value={form.rawRequestBodies}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        {/* Buttons */}
        <Box mt={4} display="flex" gap={2} justifyContent="flex-end">
          <Button variant="contained" color="success" type="submit" disabled={isRunning}>Run Test</Button>
          <Button variant="contained" color="error" onClick={handleStop} disabled={!isRunning}>Stop Test</Button>
          <Button variant="contained" color="primary" onClick={updateTPS} disabled={!isRunning}>Update TPS</Button>
        </Box>
      </Box>
    </Box>
  );
}
