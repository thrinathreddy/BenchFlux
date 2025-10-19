import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TestForm from './TestForm';  // Assuming TestForm handles starting/stopping the test
import ResultsTable from './ResultsTable';
import ChartPanel from './ChartPanel';

export default function TestDashboard() {
  const [isRunning, setIsRunning] = useState(false);  // Tracks whether the test is running
  const [results, setResults] = useState([]);  // Holds the results from the test API
  const [testCompletedMsg, setTestCompletedMsg] = useState('');

  // Fetch results every 5 seconds if the test is running

  const fetchResults = async () => {
  try {
    const res = await axios.get('/api/results');
    const data = res.data;

    setResults(data.results || []);
    if(data.running === "NO"){
      handleTestComplete();
      setTestCompletedMsg('✅ Test Completed Successfully!');
    }else{
      setTestCompletedMsg('');  // Clear message if still running
    }
  } catch (err) {
    console.error('Failed to fetch results:', err);
  }
};


  // Start or stop fetching based on the test running state
  useEffect(() => {
    if (isRunning) {
      fetchResults();
      const interval = setInterval(fetchResults, 5000); // Re-fetch results every 5 seconds
      return () => clearInterval(interval);  // Clean up interval when stopped
    }
  }, [isRunning]);  // Depend on isRunning to start/stop fetching

  // Handle when the test form is completed
  const handleTestComplete = () => {
    setIsRunning(false);  // Automatically stop fetching when test completes
  };

  return (
    <div>
      <TestForm onTestComplete={handleTestComplete} setIsRunning={setIsRunning} isRunning={isRunning} />
      {testCompletedMsg && (
        <div style={{ marginTop: '10px', fontWeight: 'bold', color: 'green' }}>
          {testCompletedMsg}
        </div>
      )}
      <ChartPanel results={results} />
      {/* <ResultsTable isRunning={isRunning} results={results} /> */}
    </div>
  );
}
