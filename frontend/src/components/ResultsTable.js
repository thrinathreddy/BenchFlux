// ResultsTable.js
import React from 'react';

export default function ResultsTable({ isRunning, results }) {
  if (!results || results.length === 0) {
    return <div>No results to display</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Status</th>
          <th>Time (ms)</th>
          <th>Timestamp</th>
          <th>Request Body</th>
          <th>Code</th>
        </tr>
      </thead>
      <tbody>
        {results.map((r, i) => (
          <tr key={i}>
            <td>{i + 1}</td>
            <td>{r.status ? '✅' : '❌'}</td>
            <td>{r.responseTime}</td>
            <td>{new Date(r.executionTimestamp).toLocaleTimeString()}</td>
            <td>{r.requestBody}</td>
            <td>{r.primaryResponse?.statusCode || '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
