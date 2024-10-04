import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/SideBar";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import firebaseDB from "../../firebase"; // Firebase configuration

const BrowseShops = () => {
  const [shops, setShops] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    name: "",
    description: "",
    location: "",
    contactInfo: {
      phone: "",
      email: "",
    },
    image: null, // Track the image in the state
  });
  const [uploading, setUploading] = useState(false); // To show uploading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch(
          "http://localhost:8089/api/admin/shops/getshops"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch shops");
        }
        const data = await response.json();
        setShops(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  const handleUpdateClick = (shop) => {
    setSelectedShop(shop);
    setUpdatedData({
      name: shop.name,
      description: shop.description,
      location: shop.location,
      contactInfo: {
        phone: shop.contactInfo?.phone || "",
        email: shop.contactInfo?.email || "",
      },
      image: null, // Reset image state
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone" || name === "email") {
      setUpdatedData((prevState) => ({
        ...prevState,
        contactInfo: {
          ...prevState.contactInfo,
          [name]: value,
        },
      }));
    } else {
      setUpdatedData({ ...updatedData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    setUpdatedData({ ...updatedData, image: e.target.files[0] }); // Store file for upload
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let downloadURL = selectedShop.image; // Default to existing image URL

      // If a new image is selected, upload it to Firebase
      if (updatedData.image instanceof File) {
        const uniqueImageName = `${Date.now()}-${updatedData.image.name}`;

        // Upload image to Firebase
        const storage = getStorage(firebaseDB);
        const storageRef = ref(storage, `images/${uniqueImageName}`);
        await uploadBytes(storageRef, updatedData.image);

        // Get the download URL of the uploaded image
        downloadURL = await getDownloadURL(storageRef);
        console.log("Updated Image URL:", downloadURL);
      }

      // Prepare the shop data with updated image URL
      const shopData = {
        name: updatedData.name,
        description: updatedData.description,
        location: updatedData.location,
        contactInfo: {
          phone: updatedData.contactInfo.phone,
          email: updatedData.contactInfo.email,
        },
        image: downloadURL, // Use the new or existing image URL
      };

      // Send updated data to the server
      const response = await fetch(
        `http://localhost:8089/api/admin/shops/updateshop/${selectedShop._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(shopData),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update shop");
      }

      setShowModal(false);
      setError("");
      setUploading(false);
      // Update the shop list after the update
      setShops(
        shops.map((shop) =>
          shop._id === selectedShop._id ? { ...shop, ...shopData } : shop
        )
      );
    } catch (error) {
      setError(error.message);
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false); // Close the modal without making any updates
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-6 ml-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Browse Shops</h1>
          <input
            type="text"
            placeholder="Search for shops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-60 px-4 py-2 border rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading ? (
          <p>Loading shops...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex justify-between mb-4">
                <h2></h2>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                  onClick={() => navigate("/addshop")}
                >
                  Add Shop
                </button>
              </div>
              <table className="min-w-full bg-white  rounded-lg  overflow-hidden border-separate border-spacing-y-4">
                <thead class="text-xs text-black uppercase bg-gray-100">
                  <tr>
                    <th scope="col" class="px-6 py-3 rounded-s-lg">
                      Image
                    </th>
                    <th scope="col" class="px-6 py-3">
                      Name
                    </th>
                    <th scope="col" class="px-6 py-3">
                      Description
                    </th>
                    <th scope="col" class="px-6 py-3 rounded-e-lg">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {shops
                    .filter((shop) =>
                      shop.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((shop) => (
                      <tr
                        key={shop._id}
                        className="odd:bg-gray-100 hover:bg-gray-200 mb-6"
                      >
                        <td className="py-2 px-4 rounded-s-lg">
                          <img
                            src={shop.image}
                            alt={shop.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        </td>
                        <td className="py-2 px-4">
                          <a href={`/shop/${shop._id}`}>{shop.name}</a>
                        </td>
                        <td className="py-2 px-4">{shop.description}</td>
                        <td className="py-2 px-4 rounded-e-lg">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleUpdateClick(shop)}
                              className="inline-block px-4 py-2 bg-opacity-0 text-blue-500  rounded-lg hover:underline"
                            >
                              Update
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal for Update Form */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-2xl font-bold mb-4">Update Shop</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={updatedData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={updatedData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={updatedData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={updatedData.contactInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={updatedData.contactInfo.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    Upload Logo
                  </label>

                  <div className="flex items-center">
                    <label
                      htmlFor="file-upload"
                      className="block w-auto px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      Choose File
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    {/* Display selected file name or "No file chosen" */}
                    <span className="ml-3 text-gray-500 text-sm">
                      {updatedData.image
                        ? updatedData.image.name
                        : "No file chosen"}
                    </span>
                  </div>

                  <p
                    className="mt-1 text-sm text-gray-500"
                    id="file_input_help"
                  >
                    JPG (Ratio 1:1).
                  </p>
                </div>

                {uploading && (
                  <p className="text-blue-500">Uploading image...</p>
                )}
                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Update Shop
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseShops;
