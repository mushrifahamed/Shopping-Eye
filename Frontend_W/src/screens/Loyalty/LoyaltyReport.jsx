import React, { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const LoyaltyReportPage = () => {
  const [reportData, setReportData] = useState([]); 
  const [overallTotals, setOverallTotals] = useState({
    totalPoints: 0,
    totalRedeemedPoints: 0,
    totalPercentageRedeemed: '0',
    totalPercentageBalance: '0',
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8089/api/loyalty/report');
      console.log(response.data); // Debugging log
      setReportData(response.data.reportData); // Ensure this is an array
      setOverallTotals(response.data.overallTotals); 
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Title for the PDF
    doc.text('Loyalty Points Report', 14, 16);

    // Define the columns for the table
    const tableColumn = [
      'User ID',
      'Phone Number',
      'Total Points',
      'Total Redeemed Points',
      '% Redeemed',
      '% Balance',
    ];
    const tableRows = [];

    // Loop through the report data and push rows into the table
    reportData.forEach(report => {
      const reportRow = [
        report.userID,
        report.phoneNumber,
        report.totalPoints,
        report.totalRedeemedPoints,
        report.percentageRedeemed + '%',
        report.percentageBalance + '%',
      ];
      tableRows.push(reportRow);
    });

    // Add the table to the PDF
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    // Add overall totals to the PDF
    const startY = doc.lastAutoTable.finalY + 10; // Position after the table
    doc.text('Overall Totals:', 14, startY);
    doc.text(`Total Points: ${overallTotals.totalPoints}`, 14, startY + 10);
    doc.text(`Total Redeemed Points: ${overallTotals.totalRedeemedPoints}`, 14, startY + 20);
    doc.text(`Percentage of Points Redeemed: ${overallTotals.totalPercentageRedeemed}%`, 14, startY + 30);
    doc.text(`Percentage of Points Balance: ${overallTotals.totalPercentageBalance}%`, 14, startY + 40);
    doc.text(`Total Users: ${overallTotals.totalUsers}`, 14, startY + 50);

    // Download the PDF
    doc.save('loyalty-report.pdf');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen w-full">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Loyalty Report</h2>

      <button
        onClick={fetchReport}
        className="mb-6 px-4 py-2 bg-indigo-600 text-white rounded"
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Generate Report'}
      </button>

      {reportData.length > 0 && (
        <>
          <div className="overflow-x-auto">
            {/* Heading for the table */}
            <h3 className="text-xl font-semibold mb-2">Top 5 Loyalty Accounts</h3>

            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead className="bg-gray-200 text-gray-600 uppercase text-sm">
                <tr>
                  <th className="px-6 py-3 text-left border-b">User ID</th>
                  <th className="px-6 py-3 text-left border-b">Phone Number</th>
                  <th className="px-6 py-3 text-left border-b">Total Points</th>
                  <th className="px-6 py-3 text-left border-b">Total Redeemed Points</th>
                  <th className="px-6 py-3 text-left border-b">% of Points Redeemed</th>
                  <th className="px-6 py-3 text-left border-b">% of Points Balance</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm">
                {reportData.map((reportItem, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 border-b">{reportItem.userID}</td>
                    <td className="px-6 py-4 border-b">{reportItem.phoneNumber}</td>
                    <td className="px-6 py-4 border-b">{reportItem.totalPoints}</td>
                    <td className="px-6 py-4 border-b">{reportItem.totalRedeemedPoints}</td>
                    <td className="px-6 py-4 border-b">{reportItem.percentageRedeemed}%</td>
                    <td className="px-6 py-4 border-b">{reportItem.percentageBalance}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold">Overall Totals:</h3>
            <p>Total Points: {overallTotals.totalPoints}</p>
            <p>Total Redeemed Points: {overallTotals.totalRedeemedPoints}</p>
            <p>Percentage of Points Redeemed: {overallTotals.totalPercentageRedeemed}%</p>
            <p>Percentage of Points Balance: {overallTotals.totalPercentageBalance}%</p>
            <p>Total Users: {overallTotals.totalUsers}</p>
          </div>

          <button
            onClick={generatePDF}
            className="mt-6 px-4 py-2 bg-green-600 text-white rounded"
          >
            Download Report as PDF
          </button>
        </>
      )}
    </div>
  );
};

export default LoyaltyReportPage;
