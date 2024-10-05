import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Sidebar from "../../components/SideBar";

const WishlistReport = () => {
  const { register, handleSubmit } = useForm();
  const [productsReport, setProductsReport] = useState([]);
  const [usersReport, setUsersReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMostWishedProducts = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(
        "http://localhost:8089/api/wishlist/most-wished-products",
        {
          startDate: data.startDate,
          endDate: data.endDate,
        }
      );
      setProductsReport(response.data);
    } catch (err) {
      setError("Error fetching most wished products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersWithMostWishlistItems = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(
        "http://localhost:8089/api/wishlist/users-with-most-wishlist-items",
        {
          startDate: data.startDate,
          endDate: data.endDate,
        }
      );
      setUsersReport(response.data);
    } catch (err) {
      setError("Error fetching users with most wishlist items");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data, reportType) => {
    if (reportType === "products") {
      fetchMostWishedProducts(data);
    } else if (reportType === "users") {
      fetchUsersWithMostWishlistItems(data);
    }
  };

  const generatePDF = async () => {
    const pdf = new jsPDF("p", "pt", "a4");

    // Add cover page border, title, etc.
    pdf.setDrawColor(0);
    pdf.setLineWidth(2);
    pdf.rect(
      5,
      5,
      pdf.internal.pageSize.getWidth() - 10,
      pdf.internal.pageSize.getHeight() - 10
    );

    pdf.setFontSize(36);
    const title = "Monthly Wishlist Report";
    const titleY = 150;
    pdf.text(title, pdf.internal.pageSize.getWidth() / 2, titleY, {
      align: "center",
    });

    pdf.setFontSize(24);
    const subtitle = "Views Analysis";
    const subtitleY = 220;
    pdf.text(subtitle, pdf.internal.pageSize.getWidth() / 2, subtitleY, {
      align: "center",
    });

    // Make sure all images are loaded before taking the screenshot with html2canvas
    const loadImages = async () => {
      const images = Array.from(document.images); // Get all images in the document
      return Promise.all(
        images.map((img) => {
          if (!img.complete) {
            return new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
            });
          }
          return Promise.resolve();
        })
      );
    };

    // Wait for images to load
    await loadImages();

    // Add page break to continue to the main report
    pdf.addPage();

    const input = document.getElementById("report");

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }

      // Save the PDF
      pdf.save("wishlist_report.pdf");
    });
  };

  // Find the top wished product and user
  const topWishedProduct = productsReport.reduce(
    (max, product) => {
      return product.count > max.count ? product : max;
    },
    { count: 0 }
  );

  const topWishedUser = usersReport.reduce(
    (max, user) => {
      return user.totalItems > max.totalItems ? user : max;
    },
    { totalItems: 0 }
  );

  const totalProductsWishlisted = productsReport.reduce(
    (total, product) => total + product.count, // Calculate the total count of wishlisted products
    0
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div
        style={{
          maxWidth: "800px",
          margin: "30px auto",
          padding: "20px",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
            color: "#333",
          }}
        >
          Wishlist Reports
        </h2>

        <form
          style={{
            display: "grid",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <label
              htmlFor="startDate"
              style={{ flex: "1", color: "#555", fontWeight: "bold" }}
            >
              Start Date:
            </label>
            <input
              type="date"
              id="startDate"
              style={{
                flex: "2",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
              {...register("startDate", { required: true })}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <label
              htmlFor="endDate"
              style={{ flex: "1", color: "#555", fontWeight: "bold" }}
            >
              End Date:
            </label>
            <input
              type="date"
              id="endDate"
              style={{
                flex: "2",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
              {...register("endDate", { required: true })}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <button
              type="button"
              onClick={handleSubmit((data) => onSubmit(data, "products"))}
              style={{
                padding: "10px 20px",
                backgroundColor: "#4CAF50", // Green
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                flex: "1",
                marginRight: "10px",
                transition: "background-color 0.3s",
              }}
            >
              Wishlisted Products Overview
            </button>

            <button
              type="button"
              onClick={handleSubmit((data) => onSubmit(data, "users"))}
              style={{
                padding: "10px 20px",
                backgroundColor: "#2196F3", // Blue
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                flex: "1",
                marginLeft: "10px",
                transition: "background-color 0.3s",
              }}
            >
              Top Users by Wishlist Activity
            </button>
          </div>
        </form>

        {loading && (
          <p
            style={{
              textAlign: "center",
              color: "orange",
            }}
          >
            Loading...
          </p>
        )}
        {error && (
          <p
            style={{
              textAlign: "center",
              color: "red",
            }}
          >
            {error}
          </p>
        )}

        <div id="report" style={{ marginTop: "20px" }}>
          {productsReport.length > 0 && (
            <div
              style={{
                border: "1px solid #ddd",
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "20px",
                backgroundColor: "#f9f9f9",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h3
                style={{
                  marginBottom: "20px",
                  color: "#333",
                  textAlign: "center",
                  fontSize: "24px", // Increased font size
                  fontWeight: "bold", // Make it bold
                  padding: "10px 0", // Added padding
                  borderBottom: "2px solid #4CAF50", // Bottom border for distinction
                  backgroundColor: "#f0f0f0", // Optional: Light background color
                }}
              >
                Wishlisted Products Report
              </h3>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  tableLayout: "fixed",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        border: "1px solid #ddd",
                        padding: "10px",
                        backgroundColor: "#f0f0f0",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      Product Name
                    </th>
                    <th
                      style={{
                        border: "1px solid #ddd",
                        padding: "10px",
                        backgroundColor: "#f0f0f0",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      Number Of Times Wishlisted
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {productsReport.map((product) => (
                    <tr key={product._id}>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "15px", // Equal spacing
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center", // Vertically center the content
                            justifyContent: "center",
                          }}
                        >
                          {/* Product Name */}
                          <span style={{ marginRight: "10px" }}>
                            {product._id.name}
                          </span>

                          {/* Product Image (Smaller size) */}
                          <img
                            src={product._id.imageUrl}
                            alt={product._id.name}
                            style={{
                              width: "30px",
                              height: "30px",
                              objectFit: "cover",
                            }} // Set the size to be smaller
                          />
                        </div>
                      </td>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "15px", // Equal spacing
                          textAlign: "center",
                        }}
                      >
                        {product.count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {usersReport.length > 0 && (
            <div
              style={{
                border: "1px solid #ddd",
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "20px",
                backgroundColor: "#f9f9f9",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h3
                style={{
                  marginBottom: "20px",
                  color: "#333",
                  textAlign: "center",
                  fontSize: "24px", // Increased font size
                  fontWeight: "bold", // Make it bold
                  padding: "10px 0", // Added padding
                  borderBottom: "2px solid #2196F3", // Bottom border for distinction
                  backgroundColor: "#f0f0f0", // Optional: Light background color
                }}
              >
                Users with Most Wishlisted Items Report
              </h3>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  tableLayout: "fixed",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        border: "1px solid #ddd",
                        padding: "10px",
                        backgroundColor: "#f0f0f0",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      User Name
                    </th>
                    <th
                      style={{
                        border: "1px solid #ddd",
                        padding: "10px",
                        backgroundColor: "#f0f0f0",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      Number of Wishlisted Items
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {usersReport.map((user) => (
                    <tr key={user._id}>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "15px", // Equal spacing
                          textAlign: "center",
                        }}
                      >
                        {user._id.fullName}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "15px", // Equal spacing
                          textAlign: "center",
                        }}
                      >
                        {user.totalItems}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Summary Section */}
          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <h3 style={{ color: "#4CAF50" }}>Summary</h3>
            {topWishedProduct.count > 0 && (
              <p>
                <strong>Top Wishlisted Product:</strong>{" "}
                {topWishedProduct._id.name}
              </p>
            )}
            {topWishedUser.totalItems > 0 && (
              <p>
                <strong>Top Wishlisted User:</strong>{" "}
                {topWishedUser._id.fullName}
              </p>
            )}
            {/* New Section for Total Count */}
            {productsReport.length > 0 && ( // Only show the total if there are products
              <p>
                <strong>Total Number Of Products Wishlisted:</strong>{" "}
                {totalProductsWishlisted}
              </p>
            )}
            <p>.</p>
          </div>
        </div>

        <button
          onClick={generatePDF}
          style={{
            padding: "10px 20px",
            backgroundColor: "#FF5733", // Red color for PDF button
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "20px",
            transition: "background-color 0.3s",
          }}
        >
          Download PDF Report
        </button>
      </div>
    </div>
  );
};

export default WishlistReport;
