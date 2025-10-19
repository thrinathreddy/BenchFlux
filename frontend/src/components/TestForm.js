import React, { useState } from 'react';
import axios from 'axios';
import KeyValueList from './KeyValueList';
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
  Paper
} from '@mui/material';

export default function TestForm({ onTestComplete, setIsRunning, isRunning, testCompletedMsg }) {
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
    authTokenRefreshInterval: 300,
    authTokenPrefix: '',
  });

  const [headers, setHeaders] = useState([{ key: '', value: '' }]);
  const [tokenHeaders, setTokenHeaders] = useState([{ key: '', value: '' }]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const headersObject = headers.reduce((acc, h) => {
        if (h.key) acc[h.key] = h.value;
        return acc;
      }, {});

      const tokenHeadersObject = tokenHeaders.reduce((acc, h) => {
        if (h.key) acc[h.key] = h.value;
        return acc;
      }, {});

      const payload = {
        ...form,
        rawHeaders: JSON.stringify(headersObject),
        authTokenHeaders: JSON.stringify(tokenHeadersObject),
      };
      await axios.post('/api/runTest', payload);
      setIsRunning(true);
    } catch (err) {
      alert('Test failed: ' + err.message);
    }
  };

  const handleStop = async () => {
    try {
      await axios.post('/api/stopTest');
      setIsRunning(false);
      onTestComplete();
    } catch (err) {
      alert('Error stopping the test: ' + err.message);
    }
  };

  const updateTPS = async () => {
    try {
      await axios.post('/api/updateTps', { tps: form.targetTPS });
      alert('TPS updated');
    } catch (err) {
      alert('Update TPS failed: ' + err.message);
    }
  };

  return (
    <Box sx={{ width: '80%', mx: 'auto', p: 4, bgcolor: '#fff', borderRadius: 2, boxShadow: 3, borderTop: '8px solid #1976d2' }}>
      <Typography variant="h5" gutterBottom align="center">
        🧪 BenchFlux Test Configuration
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* URLs */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Primary URL"
              name="primaryUrl"
              value={form.primaryUrl}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Comparison URL"
              name="comparisonUrl"
              value={form.comparisonUrl}
              onChange={handleChange}
            />
          </Grid>

          {/* Method & Type */}
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="HTTP Method" name="method" value={form.method} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Test Type</InputLabel>
              <Select name="testType" value={form.testType} onChange={handleChange} label="Test Type">
                <MenuItem value="PERFORMANCE">Performance</MenuItem>
                <MenuItem value="COMPARISON">Comparison</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Iterations & TPS */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Iterations"
              name="iterations"
              type="number"
              value={form.iterations}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Target TPS"
              name="targetTPS"
              type="number"
              value={form.targetTPS}
              onChange={handleChange}
            />
          </Grid>

          {/* Auth Mode */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Auth Mode</InputLabel>
              <Select name="authMode" value={form.authMode} onChange={handleChange} label="Auth Mode">
                <MenuItem value="MANUAL">Manual (via Headers)</MenuItem>
                <MenuItem value="AUTO">Auto (via Token API)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* === AUTO MODE Section === */}
          {form.authMode === 'AUTO' && (
            <Grid item size={12}>
              <Paper elevation={2} sx={{ p: 3, mt: 2, borderRadius: 2, bgcolor: '#fafafa' }}>
                <Grid container spacing={2} size={12}>
                  {/* Section Header */}
                  <Grid item size={12}>
                    <Typography variant="h6" gutterBottom>
                      🔐 OAuth / Token-based Authentication
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Configure token endpoint details for automatic token retrieval and refresh.
                    </Typography>
                  </Grid>

                  {/* === Step 1: Token Endpoint Configuration === */}
                  <Grid item size={12}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        1️⃣ Token Endpoint Configuration
                      </Typography>

                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Token Endpoint URL"
                            name="authTokenUrl"
                            value={form.authTokenUrl}
                            onChange={handleChange}
                          />
                        </Grid>

                        <Grid item xs={6} md={3}>
                          <TextField
                            fullWidth
                            label="HTTP Method"
                            name="authTokenMethod"
                            value={form.authTokenMethod}
                            onChange={handleChange}
                          />
                        </Grid>

                        <Grid item xs={6} md={3}>
                          <TextField
                            fullWidth
                            label="Refresh Interval (seconds)"
                            name="authTokenRefreshInterval"
                            type="number"
                            value={form.authTokenRefreshInterval}
                            onChange={handleChange}
                          />
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>

                  {/* === Step 2: Token Request === */}
                  <Grid item size={12}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        2️⃣ Token Request
                      </Typography>

                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2" gutterBottom>Token Request Headers</Typography>
                          <KeyValueList
                            items={tokenHeaders}
                            setItems={setTokenHeaders}
                            title="Token Headers"
                            keyLabel="Header Key"
                            valueLabel="Header Value"
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Typography variant="body2" gutterBottom>Token Request Body (JSON)</Typography>
                          <TextField
                            fullWidth
                            multiline
                            minRows={6}
                            name="authTokenBody"
                            value={form.authTokenBody}
                            onChange={handleChange}
                            placeholder='{"client_id": "abc", "client_secret": "xyz"}'
                          />
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>

                  {/* === Step 3: Token Response Handling === */}
                  <Grid item size={12}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        3️⃣ Token Response Handling
                      </Typography>

                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            label="Token Field in Response"
                            name="authTokenField"
                            value={form.authTokenField}
                            onChange={handleChange}
                            placeholder="access_token"
                          />
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            label="Authorization Header Key"
                            name="authTokenHeaderKey"
                            value={form.authTokenHeaderKey}
                            onChange={handleChange}
                            placeholder="Authorization"
                          />
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <TextField
                            fullWidth
                            label="Token Prefix"
                            name="authTokenPrefix"
                            value={form.authTokenPrefix}
                            onChange={handleChange}
                            placeholder="Bearer"
                          />
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          )}


          {/* Custom Headers & Request Body */}
          <Grid size={12} spacing={2}>
            <Grid item size={6} spacing={2}>
              <KeyValueList
                items={headers}
                setItems={setHeaders}
                title="Custom Headers"
                keyLabel="Header Key"
                valueLabel="Header Value"
              />
            </Grid></Grid>
          <Grid size={12} spacing={2}>
            <Grid item size={6} spacing={2}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Request Bodies (JSON Array)"
                name="rawRequestBodies"
                value={form.rawRequestBodies}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

        </Grid>

        {/* Buttons */}
        <Box mt={4} display="flex" gap={2} justifyContent="flex-end">
          <Button variant="contained" color="success" type="submit" disabled={isRunning}>
            Run Test
          </Button>
          <Button variant="contained" color="error" onClick={handleStop} disabled={!isRunning}>
            Stop Test
          </Button>
          <Button variant="contained" color="primary" onClick={updateTPS} disabled={!isRunning}>
            Update TPS
          </Button>

        </Box>
      </Box>
      <Grid container spacing={2}>
        {/* URLs */}
        <Grid item xs={12}>
          {testCompletedMsg && (
            <div style={{ marginTop: '10px', fontWeight: 'bold', color: 'green' }}>
              {testCompletedMsg}
            </div>
          )}
        </Grid></Grid>
    </Box>
  );
}
