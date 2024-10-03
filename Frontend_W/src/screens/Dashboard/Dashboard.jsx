import React, { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/SideBar'; // Import the Sidebar component
import { Bar } from 'react-chartjs-2'; // Import the Bar chart component
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import html2canvas from 'html2canvas'; // Import html2canvas
import jsPDF from 'jspdf'; // Import jsPDF

// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();
  
  const [shops, setShops] = useState([]); // State for shops
  const [products, setProducts] = useState([]); // State for products
  const [tapCounts, setTapCounts] = useState([]); // State for tap counts
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const chartRef = useRef(); // Ref to access the chart container

  // Get user information from token
  const getUserFromToken = () => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log('Decoded JWT:', decoded);
        return decoded;
      } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
      }
    }
    return null;
  };

  const user = getUserFromToken();

  // Handle logout
  const handleLogout = () => {
    Cookies.remove('token');
    navigate('/login');
  };

  // Fetch shops
  const fetchShops = async () => {
    try {
      const response = await fetch('http://localhost:8089/api/admin/shops/getshops');
      if (!response.ok) throw new Error('Failed to fetch shops');
      const data = await response.json();
      setShops(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8089/api/admin/products/getproducts');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tap counts
  const fetchTapCounts = async () => {
    try {
      const response = await fetch('http://localhost:8089/api/tapcount/gettapcounts');
      if (!response.ok) throw new Error('Failed to fetch tap counts');
      const data = await response.json();
      setTapCounts(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Use useEffect to fetch shops, products, and tap counts when the component mounts
  useEffect(() => {
    fetchShops();
    fetchProducts();
    fetchTapCounts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Prepare data for charts
  const prepareChartData = (data, type) => {
    const labels = [];
    const counts = [];

    data.forEach(tap => {
      if (tap.objectType === type) {
        labels.push(tap.objectId);
        counts.push(tap.count);
      }
    });

    return { labels, counts };
  };

  const { labels: productLabels, counts: productCounts } = prepareChartData(tapCounts, 'Product');
  const { labels: shopLabels, counts: shopCounts } = prepareChartData(tapCounts, 'Shop');

  // Chart data for products
  const productData = {
    labels: productLabels.map(id => products.find(product => product._id === id)?.name || id),
    datasets: [{
      label: 'Popularity',
      data: productCounts,
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }],
  };

  // Chart data for shops
  const shopData = {
    labels: shopLabels.map(id => shops.find(shop => shop._id === id)?.name || id),
    datasets: [{
      label: 'Popularity',
      data: shopCounts,
      backgroundColor: 'rgba(153, 102, 255, 0.6)',
    }],
  };

  const generateSummary = (productCounts, shopCounts, products, shops) => {
    const productTotal = productCounts.reduce((sum, count) => sum + count, 0);
    const shopTotal = shopCounts.reduce((sum, count) => sum + count, 0);
    
    const mostPopularProductIndex = productCounts.indexOf(Math.max(...productCounts));
    const mostPopularShopIndex = shopCounts.indexOf(Math.max(...shopCounts));
    
    const mostPopularProduct = products[mostPopularProductIndex]?.name || 'N/A';
    const mostPopularShop = shops[mostPopularShopIndex]?.name || 'N/A';
  
    // Calculate averages
    const averageProductPopularity = (productTotal / productCounts.length).toFixed(2);
    const averageShopPopularity = (shopTotal / shopCounts.length).toFixed(2);
  
    // Construct summary
    return `In this report, we analyzed the popularity of products and shops based on user interactions. 
      A total of ${productTotal} product views were recorded, with "${mostPopularProduct}" being the most popular product. 
      This product received ${productCounts[mostPopularProductIndex]} views, which is ${(productCounts[mostPopularProductIndex] / productTotal * 100).toFixed(2)}% of total views.
      
      Similarly, ${shopTotal} views were recorded for shops, with "${mostPopularShop}" receiving the highest interest, accounting for ${(shopCounts[mostPopularShopIndex] / shopTotal * 100).toFixed(2)}% of total shop views.
      
      The average popularity for products was ${averageProductPopularity} views, while shops averaged ${averageShopPopularity} views. 
      This data can help inform future marketing strategies and product offerings.`;
  };
  
  
  // Function to download report as PDF
  // Function to download report as PDF
// Function to download report as PDF
const downloadReport = async () => {
  // Create a new PDF document in portrait mode with A4 dimensions
  const pdf = new jsPDF('portrait', 'mm', 'a4');
  
  // Cover page
  pdf.setDrawColor(0); // Set border color
  pdf.setLineWidth(2); // Set border width
  pdf.rect(5, 5, pdf.internal.pageSize.getWidth() - 10, pdf.internal.pageSize.getHeight() - 10); // Draw border around page

  // Add title
  pdf.setFontSize(24);
  const title = 'Monthly Report';
  const titleWidth = pdf.getStringUnitWidth(title) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
  pdf.text(title, (pdf.internal.pageSize.getWidth() - titleWidth) / 2, 50); // Centered title

  // Add subtitle
  pdf.setFontSize(18);
  const subtitle = 'Views Analysis';
  const subtitleWidth = pdf.getStringUnitWidth(subtitle) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
  pdf.text(subtitle, (pdf.internal.pageSize.getWidth() - subtitleWidth) / 2, 70); // Centered subtitle

  // Add a footer with the date
  const date = new Date().toLocaleDateString();
  pdf.setFontSize(10);
  const dateWidth = pdf.getStringUnitWidth(`Date: ${date}`) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
  pdf.text(`Date: ${date}`, (pdf.internal.pageSize.getWidth() - dateWidth) / 2, pdf.internal.pageSize.getHeight() - 20); // Centered date

  // Add a new page for the summary and charts
  pdf.addPage();

  // Draw border for the second page
  pdf.rect(5, 5, pdf.internal.pageSize.getWidth() - 10, pdf.internal.pageSize.getHeight() - 10); // Draw border around second page

  // Generate summary based on the chart data
  const summary = generateSummary(productCounts, shopCounts, products, shops);

  // Use html2canvas to capture charts
  if (chartRef.current) {
    try {
      const canvas = await html2canvas(chartRef.current, {
        scale: 2 // Adjust scale for better resolution
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pdf.internal.pageSize.getWidth() - 20; // Leave some margin
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio
      const maxHeight = pdf.internal.pageSize.getHeight() - 100; // Leave space for text
      const finalHeight = Math.min(imgHeight, maxHeight);

      // Adjust the image size if it exceeds the height of the page
      const finalWidth = (imgHeight > maxHeight) ? imgWidth * (maxHeight / imgHeight) : imgWidth;

      // Add the chart image to PDF
      pdf.addImage(imgData, 'PNG', 10, 50, finalWidth, finalHeight); // Adjust position and size as needed

      // Add summary below the charts
      pdf.setFontSize(14);
      pdf.text('Summary', 10, 50 + finalHeight + 20); // Positioning based on chart height
      pdf.setFontSize(12);
      const splitSummary = pdf.splitTextToSize(summary, pdf.internal.pageSize.getWidth() - 20);
      pdf.text(splitSummary, 10, 50 + finalHeight + 40);

      // Save the PDF
      pdf.save('dashboard_report.pdf');
    } catch (error) {
      console.error("Error capturing charts:", error);
    }
  } else {
    console.error("Chart ref is not valid");
  }
};



  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-6">
        <header className="bg-white shadow-md mb-6 p-4 rounded">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Welcome, {user?.name || 'User'}!</h1>
            <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded">Logout</button>
          </div>
        </header>

        <button 
          onClick={downloadReport} 
          className="bg-blue-500 text-white p-2 rounded mb-4 hover:bg-blue-600 transition duration-200">
          Download Report
        </button>

        {/* Display Product and Shop Popularity Charts Side by Side */}
        <div className="flex justify-around mt-6" ref={chartRef}>
          {/* Product Popularity Chart */}
          <div className="w-1/2 p-4 shadow-lg rounded-lg hover:shadow-2xl transition-shadow duration-300 mr-4">
            <h2 className="text-xl font-bold text-center">Product Popularity</h2>
            <Bar data={productData} options={{ responsive: true }} />
          </div>

          {/* Shop Popularity Chart */}
          <div className="w-1/2 p-4 shadow-lg rounded-lg hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-xl font-bold text-center">Shop Popularity</h2>
            <Bar data={shopData} options={{ responsive: true }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
