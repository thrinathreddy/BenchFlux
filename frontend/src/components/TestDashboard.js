import React, { useState } from 'react';
import TestForm from './TestForm';
import ResultsTable from './ResultsTable';

export default function TestDashboard() {
  const [isRunning, setIsRunning] = useState(false);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  return (
    <div>
      <TestForm onTestComplete={handleStart} onStopTest={handleStop} isRunning={isRunning} />
      <ResultsTable isRunning={isRunning} />
    </div>
  );
}
