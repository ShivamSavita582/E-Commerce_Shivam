import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import AppContext from "../../context/AppContext";
import { productService } from "../../services/productService";
import { orderService } from "../../services/orderService";
import { authService } from "../../services/authService";
import { contactService } from "../../services/contactService";
import { formatPrice } from "../../utils/formatCurrency";
import { notify } from "../../utils/notification";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const AdminDashboard = () => {
  const { user, fetchProducts } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState("products");
  const [loading, setLoading] = useState(true);

  // Data States
  const [productsList, setProductsList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [queriesList, setQueriesList] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [queryFilter, setQueryFilter] = useState("all");
  const [querySearch, setQuerySearch] = useState("");

  // Product Create/Edit Form Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    title: "",
    category: "laptop",
    brand: "",
    price: "",
    originalPrice: "",
    qty: 10,
    imgSrc: "",
    description: "",
    isFeatured: false,
    isBestSeller: false,
  });

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [prodData, orderData, userData, contactData] = await Promise.all([
        productService.getProducts(),
        orderService.getAllOrders(),
        authService.getAllUsers(),
        contactService.getAllQueries().catch((err) => {
          console.warn("Contact queries fetch note:", err);
          return { queries: [] };
        }),
      ]);

      setProductsList(prodData.products || []);
      setOrdersList(Array.isArray(orderData) ? orderData : orderData.orders || []);
      setUsersList(Array.isArray(userData) ? userData : []);
      setQueriesList(contactData?.queries || []);
    } catch (err) {
      console.error("Admin load error:", err);
      notify.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Stats calculation
  const totalRevenue = ordersList.reduce(
    (sum, ord) => sum + Number(ord.amount || 0),
    0
  );
  const newQueriesCount = queriesList.filter((q) => q.status === "New").length;

  const handleQueryStatusChange = async (queryId, newStatus) => {
    try {
      await contactService.updateStatus(queryId, { status: newStatus });
      notify.success(`Inquiry status updated to ${newStatus}`);
      setQueriesList((prev) =>
        prev.map((q) => (q._id === queryId ? { ...q, status: newStatus } : q))
      );
      if (selectedQuery && selectedQuery._id === queryId) {
        setSelectedQuery((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      notify.error("Failed to update inquiry status");
    }
  };

  const handleDeleteQuery = async (queryId) => {
    if (window.confirm("Are you sure you want to permanently delete this customer inquiry?")) {
      try {
        await contactService.deleteQuery(queryId);
        notify.success("Inquiry deleted successfully");
        setQueriesList((prev) => prev.filter((q) => q._id !== queryId));
        if (selectedQuery && selectedQuery._id === queryId) {
          setSelectedQuery(null);
        }
      } catch (err) {
        notify.error("Failed to delete inquiry");
      }
    }
  };

  const filteredQueries = queriesList.filter((q) => {
    const matchesFilter =
      queryFilter === "all" || q.status?.toLowerCase() === queryFilter.toLowerCase();
    const matchesSearch =
      !querySearch.trim() ||
      q.ticketId?.toLowerCase().includes(querySearch.toLowerCase()) ||
      q.name?.toLowerCase().includes(querySearch.toLowerCase()) ||
      q.email?.toLowerCase().includes(querySearch.toLowerCase()) ||
      q.subject?.toLowerCase().includes(querySearch.toLowerCase()) ||
      q.message?.toLowerCase().includes(querySearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setProductForm({
      title: "",
      category: "laptop",
      brand: "",
      price: "",
      originalPrice: "",
      qty: 10,
      imgSrc: "",
      description: "",
      isFeatured: false,
      isBestSeller: false,
    });
    setShowProductModal(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      title: prod.title,
      category: prod.category,
      brand: prod.brand || "",
      price: prod.price,
      originalPrice: prod.originalPrice || prod.price,
      qty: prod.qty || 0,
      imgSrc: prod.imgSrc,
      description: prod.description,
      isFeatured: !!prod.isFeatured,
      isBestSeller: !!prod.isBestSeller,
    });
    setShowProductModal(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct._id, productForm);
        notify.success("Product updated successfully!");
      } else {
        await productService.addProduct(productForm);
        notify.success("Product created successfully!");
      }
      setShowProductModal(false);
      loadAdminData();
      fetchProducts();
    } catch (error) {
      notify.error(error?.response?.data?.message || "Failed to save product");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this product?")) {
      try {
        await productService.deleteProduct(id);
        notify.success("Product deleted successfully");
        setProductsList((prev) => prev.filter((p) => p._id !== id));
        fetchProducts();
      } catch (err) {
        notify.error("Failed to delete product");
      }
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      notify.success(`Order status set to ${newStatus}`);
      setOrdersList((prev) =>
        prev.map((ord) =>
          ord._id === orderId ? { ...ord, orderStatus: newStatus } : ord
        )
      );
    } catch (err) {
      notify.error("Failed to update status");
    }
  };

  const handleSeedCatalog = async () => {
    if (
      window.confirm(
        "Do you want to reset & seed the database catalog with 15+ premium products across all categories?"
      )
    ) {
      try {
        setLoading(true);
        const res = await productService.seedProducts();
        notify.success(res.message || "Catalog successfully seeded!");
        await loadAdminData();
        if (fetchProducts) fetchProducts();
      } catch (err) {
        notify.error("Failed to seed catalog: " + (err?.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleUserRole = async (targetUser) => {
    if (targetUser.email === "admin@gmail.com") {
      notify.error("The primary master admin account (admin@gmail.com) cannot be modified.");
      return;
    }
    const newRole = targetUser.role === "admin" ? "user" : "admin";
    if (
      window.confirm(
        `Change role of "${targetUser.name}" from ${targetUser.role} to ${newRole}?`
      )
    ) {
      try {
        await authService.updateUserRole(targetUser._id, newRole);
        notify.success(`User role changed to ${newRole}`);
        setUsersList((prev) =>
          prev.map((u) => (u._id === targetUser._id ? { ...u, role: newRole } : u))
        );
      } catch (err) {
        notify.error("Failed to update user role: " + (err?.response?.data?.message || err.message));
      }
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading Admin Management Console..." />;
  }

  return (
    <div className="container py-5" style={{ minHeight: "85vh" }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <span className="badge bg-danger-subtle text-danger px-3 py-2 rounded-pill mb-2">
            ADMINISTRATOR PRIVILEGES
          </span>
          <h1 className="fw-bold mb-1">Store Management Console</h1>
          <p className="text-secondary mb-0">Welcome back, {user?.name}.</p>
        </div>

        <div className="d-flex align-items-center gap-2 flex-wrap">
          <button
            onClick={handleSeedCatalog}
            className="btn btn-outline-dark rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-2"
            title="Populate/Reset database with flagship laptops, phones, cameras and accessories"
          >
            <span className="material-symbols-outlined">restart_alt</span>
            Seed Demo Catalog
          </button>
          <button
            onClick={handleOpenAddModal}
            className="btn btn-primary rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2"
          >
            <span className="material-symbols-outlined">add</span>
            Add New Product
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg">
          <div className="p-3 bg-white rounded-4 border shadow-sm h-100">
            <small className="text-secondary">TOTAL REVENUE</small>
            <h3 className="fw-bold text-dark mt-1 mb-0">{formatPrice(totalRevenue)}</h3>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg">
          <div className="p-3 bg-white rounded-4 border shadow-sm h-100">
            <small className="text-secondary">TOTAL ORDERS</small>
            <h3 className="fw-bold text-dark mt-1 mb-0">{ordersList.length}</h3>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg">
          <div className="p-3 bg-white rounded-4 border shadow-sm h-100">
            <small className="text-secondary">TOTAL PRODUCTS</small>
            <h3 className="fw-bold text-dark mt-1 mb-0">{productsList.length}</h3>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg">
          <div className="p-3 bg-white rounded-4 border shadow-sm h-100">
            <small className="text-secondary">REGISTERED USERS</small>
            <h3 className="fw-bold text-dark mt-1 mb-0">{usersList.length}</h3>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg">
          <div
            className="p-3 bg-white rounded-4 border shadow-sm h-100 position-relative"
            onClick={() => setActiveTab("inquiries")}
            style={{ cursor: "pointer" }}
            title="Click to view inquiries"
          >
            <div className="d-flex justify-content-between align-items-start">
              <small className="text-secondary">INQUIRIES</small>
              {newQueriesCount > 0 && (
                <span className="badge bg-danger rounded-pill" style={{ fontSize: "10px" }}>
                  {newQueriesCount} New
                </span>
              )}
            </div>
            <h3 className="fw-bold text-dark mt-1 mb-0">{queriesList.length}</h3>
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="d-flex gap-2 mb-4 border-bottom pb-2 flex-wrap">
        <button
          onClick={() => setActiveTab("products")}
          className={`btn btn-sm rounded-pill px-4 fw-semibold ${
            activeTab === "products" ? "btn-dark text-white" : "btn-light"
          }`}
        >
          Products ({productsList.length})
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`btn btn-sm rounded-pill px-4 fw-semibold ${
            activeTab === "orders" ? "btn-dark text-white" : "btn-light"
          }`}
        >
          Orders ({ordersList.length})
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`btn btn-sm rounded-pill px-4 fw-semibold ${
            activeTab === "users" ? "btn-dark text-white" : "btn-light"
          }`}
        >
          Users ({usersList.length})
        </button>
        <button
          onClick={() => setActiveTab("inquiries")}
          className={`btn btn-sm rounded-pill px-4 fw-semibold d-inline-flex align-items-center gap-2 ${
            activeTab === "inquiries" ? "btn-dark text-white" : "btn-light"
          }`}
        >
          <span>Customer Queries ({queriesList.length})</span>
          {newQueriesCount > 0 && (
            <span className="badge bg-danger rounded-pill" style={{ fontSize: "10px" }}>
              {newQueriesCount}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: PRODUCTS TABLE */}
      {activeTab === "products" && (
        <div className="bg-white rounded-4 border shadow-sm overflow-hidden p-3">
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {productsList.map((prod) => (
                  <tr key={prod._id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={prod.imgSrc}
                          alt={prod.title}
                          style={{ width: "45px", height: "45px", objectFit: "contain" }}
                          className="rounded border p-1"
                        />
                        <div>
                          <strong className="d-block text-truncate" style={{ maxWidth: "250px" }}>
                            {prod.title}
                          </strong>
                          <small className="text-secondary">{prod.brand || "Generic"}</small>
                        </div>
                      </div>
                    </td>
                    <td className="text-capitalize">{prod.category}</td>
                    <td className="fw-semibold">{formatPrice(prod.price)}</td>
                    <td>
                      <span
                        className={`badge ${
                          prod.qty > 0 ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"
                        }`}
                      >
                        {prod.qty > 0 ? `${prod.qty} units` : "Out of Stock"}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link
                          to={`/product/${prod.slug || prod._id}`}
                          className="btn btn-sm btn-outline-primary rounded-pill px-2 d-flex align-items-center"
                          title="View Live Product Page"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                            visibility
                          </span>
                        </Link>
                        <button
                          onClick={() => handleOpenEditModal(prod)}
                          className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod._id)}
                          className="btn btn-sm btn-outline-danger rounded-pill px-3"
                        >
                          Delete
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

      {/* TAB 2: ORDERS MANAGEMENT */}
      {activeTab === "orders" && (
        <div className="bg-white rounded-4 border shadow-sm overflow-hidden p-3">
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Change Status</th>
                </tr>
              </thead>
              <tbody>
                {ordersList.map((ord) => (
                  <tr key={ord._id}>
                    <td>#{ord.orderId || ord._id.slice(-6)}</td>
                    <td>{ord.userShipping?.fullName || "Customer"}</td>
                    <td className="fw-bold">{formatPrice(ord.amount)}</td>
                    <td>{new Date(ord.orderDate).toLocaleDateString()}</td>
                    <td>
                      <span className="badge bg-primary-subtle text-primary">
                        {ord.orderStatus || "Confirmed"}
                      </span>
                    </td>
                    <td>
                      <select
                        className="form-select form-select-sm"
                        style={{ width: "160px" }}
                        value={ord.orderStatus || "Confirmed"}
                        onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: USERS LIST */}
      {activeTab === "users" && (
        <div className="bg-white rounded-4 border shadow-sm overflow-hidden p-3">
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Role Action</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((u) => (
                  <tr key={u._id}>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td>
                      <span
                        className={`badge ${
                          u.role === "admin"
                            ? "bg-danger text-white"
                            : "bg-secondary text-white"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      {u.email === "admin@gmail.com" ? (
                        <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill fw-bold">
                          Primary Admin
                        </span>
                      ) : (
                        <button
                          onClick={() => handleToggleUserRole(u)}
                          className={`btn btn-sm rounded-pill px-3 ${
                            u.role === "admin" ? "btn-outline-secondary" : "btn-outline-danger"
                          }`}
                        >
                          {u.role === "admin" ? "Demote to User" : "Promote to Admin"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CUSTOMER INQUIRIES & SUPPORT TICKETS */}
      {activeTab === "inquiries" && (
        <div className="bg-white rounded-4 border shadow-sm p-4">
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <div>
              <h4 className="fw-bold mb-1">Customer Support Inquiries</h4>
              <p className="text-secondary small mb-0">
                Direct tickets recorded from the /contact form. Real-time updates & ticket tracking.
              </p>
            </div>

            {/* Filters & Search */}
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <div className="input-group input-group-sm" style={{ width: "240px" }}>
                <span className="input-group-text bg-white border-end-0">
                  <span className="material-symbols-outlined text-secondary" style={{ fontSize: "16px" }}>
                    search
                  </span>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by ticket, name, email..."
                  value={querySearch}
                  onChange={(e) => setQuerySearch(e.target.value)}
                />
              </div>

              <div className="btn-group btn-group-sm">
                {["all", "New", "In Progress", "Resolved", "Closed"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setQueryFilter(st)}
                    className={`btn ${
                      queryFilter.toLowerCase() === st.toLowerCase()
                        ? "btn-dark text-white fw-bold"
                        : "btn-outline-secondary"
                    }`}
                  >
                    {st === "all" ? "All" : st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filteredQueries.length === 0 ? (
            <div className="text-center py-5 text-secondary">
              <span className="material-symbols-outlined d-block mb-2" style={{ fontSize: "42px", color: "#9ca3af" }}>
                support_agent
              </span>
              <h5 className="fw-semibold text-dark">No inquiries found</h5>
              <p className="small mb-0">
                {queriesList.length === 0
                  ? "No customer inquiries have been submitted yet."
                  : "No queries match your current filter or search criteria."}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr className="text-secondary small text-uppercase">
                    <th>Ticket ID</th>
                    <th>Customer</th>
                    <th>Subject Category</th>
                    <th>Message Snippet</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Quick Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQueries.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <span
                          className="badge bg-dark-subtle text-dark font-monospace px-2 py-1"
                          style={{ fontSize: "12px", letterSpacing: "0.5px" }}
                        >
                          #{item.ticketId || item._id.slice(-6)}
                        </span>
                      </td>
                      <td>
                        <div>
                          <strong className="d-block text-dark">{item.name}</strong>
                          <a
                            href={`mailto:${item.email}`}
                            className="text-secondary small text-decoration-none d-block"
                          >
                            {item.email}
                          </a>
                          {item.phone && (
                            <small className="text-muted d-block">{item.phone}</small>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border px-2 py-1">
                          {item.subject}
                        </span>
                      </td>
                      <td style={{ maxWidth: "260px" }}>
                        <p
                          className="text-secondary small mb-0 text-truncate"
                          title={item.message}
                        >
                          {item.message}
                        </p>
                      </td>
                      <td className="small text-secondary">
                        {new Date(item.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            item.status === "New"
                              ? "bg-warning-subtle text-warning-emphasis"
                              : item.status === "In Progress"
                              ? "bg-info-subtle text-info-emphasis"
                              : item.status === "Resolved"
                              ? "bg-success-subtle text-success-emphasis"
                              : "bg-secondary-subtle text-secondary-emphasis"
                          } px-2 py-1 rounded-pill`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          style={{ width: "135px" }}
                          value={item.status}
                          onChange={(e) => handleQueryStatusChange(item._id, e.target.value)}
                        >
                          <option value="New">New</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-1">
                          <button
                            onClick={() => setSelectedQuery(item)}
                            className="btn btn-sm btn-outline-primary rounded-pill px-2 d-inline-flex align-items-center gap-1"
                            title="View Full Message & Contact Info"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                              visibility
                            </span>
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => handleDeleteQuery(item._id)}
                            className="btn btn-sm btn-outline-danger rounded-pill px-2 d-inline-flex align-items-center"
                            title="Delete Inquiry"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                              delete
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {showProductModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 1200 }}
        >
          <div
            className="bg-white rounded-4 p-4 shadow-lg"
            style={{ maxWidth: "600px", width: "95%", maxHeight: "90vh", overflowY: "auto" }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">
                {editingProduct ? "Edit Product" : "Create New Product"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowProductModal(false)}
              ></button>
            </div>

            <form onSubmit={handleProductSubmit}>
              <div className="mb-2">
                <label className="form-label small fw-semibold">Title</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="row g-2 mb-2">
                <div className="col-6">
                  <label className="form-label small fw-semibold">Category</label>
                  <select
                    className="form-select form-select-sm"
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  >
                    <option value="laptop">Laptop</option>
                    <option value="mobile">Mobile</option>
                    <option value="camera">Camera</option>
                    <option value="accessories">Accessories</option>
                    <option value="audio">Audio</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold">Brand</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                  />
                </div>
              </div>

              <div className="row g-2 mb-2">
                <div className="col-4">
                  <label className="form-label small fw-semibold">Price (₹)</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    required
                  />
                </div>
                <div className="col-4">
                  <label className="form-label small fw-semibold">Original Price (₹)</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={productForm.originalPrice}
                    onChange={(e) =>
                      setProductForm({ ...productForm, originalPrice: e.target.value })
                    }
                  />
                </div>
                <div className="col-4">
                  <label className="form-label small fw-semibold">Stock Qty</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={productForm.qty}
                    onChange={(e) => setProductForm({ ...productForm, qty: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="mb-2">
                <label className="form-label small fw-semibold">Image URL (imgSrc)</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={productForm.imgSrc}
                  onChange={(e) => setProductForm({ ...productForm, imgSrc: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Description</label>
                <textarea
                  className="form-control form-control-sm"
                  rows="3"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  required
                ></textarea>
              </div>

              <div className="d-flex gap-3 mb-4">
                <label className="small">
                  <input
                    type="checkbox"
                    checked={productForm.isFeatured}
                    onChange={(e) =>
                      setProductForm({ ...productForm, isFeatured: e.target.checked })
                    }
                    className="me-1"
                  />
                  Featured
                </label>
                <label className="small">
                  <input
                    type="checkbox"
                    checked={productForm.isBestSeller}
                    onChange={(e) =>
                      setProductForm({ ...productForm, isBestSeller: e.target.checked })
                    }
                    className="me-1"
                  />
                  Best Seller
                </label>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="btn btn-light btn-sm px-3"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm px-4">
                  {editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW QUERY DETAILS MODAL */}
      {selectedQuery && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(0,0,0,0.6)", zIndex: 1250, backdropFilter: "blur(3px)" }}
        >
          <div
            className="bg-white rounded-4 p-4 shadow-lg border"
            style={{ maxWidth: "620px", width: "95%", maxHeight: "90vh", overflowY: "auto" }}
          >
            <div className="d-flex justify-content-between align-items-start border-bottom pb-3 mb-3">
              <div>
                <span className="badge bg-dark font-monospace px-2 py-1 mb-1">
                  #{selectedQuery.ticketId || selectedQuery._id}
                </span>
                <h5 className="fw-bold mb-0 text-dark">Customer Inquiry Details</h5>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={() => setSelectedQuery(null)}
              ></button>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-sm-6">
                <small className="text-secondary d-block">CUSTOMER NAME</small>
                <strong className="text-dark fs-6">{selectedQuery.name}</strong>
              </div>
              <div className="col-sm-6">
                <small className="text-secondary d-block">EMAIL ADDRESS</small>
                <a
                  href={`mailto:${selectedQuery.email}?subject=RE: Ticket #${selectedQuery.ticketId} - ${selectedQuery.subject}`}
                  className="text-primary fw-semibold"
                >
                  {selectedQuery.email}
                </a>
              </div>
              <div className="col-sm-6">
                <small className="text-secondary d-block">PHONE NUMBER</small>
                {selectedQuery.phone ? (
                  <a href={`tel:${selectedQuery.phone}`} className="text-dark fw-semibold">
                    {selectedQuery.phone}
                  </a>
                ) : (
                  <span className="text-muted">Not provided</span>
                )}
              </div>
              <div className="col-sm-6">
                <small className="text-secondary d-block">DATE RECEIVED</small>
                <span className="text-dark fw-semibold">
                  {new Date(selectedQuery.createdAt).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>
            </div>

            <div className="mb-3">
              <small className="text-secondary d-block mb-1">INQUIRY CATEGORY</small>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 fs-6">
                {selectedQuery.subject}
              </span>
            </div>

            <div className="mb-4">
              <small className="text-secondary d-block mb-1">MESSAGE / REQUIREMENTS</small>
              <div
                className="p-3 rounded-3 bg-light border text-dark"
                style={{ whiteSpace: "pre-wrap", lineHeight: 1.7, fontSize: "14px" }}
              >
                {selectedQuery.message}
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center pt-2 border-top flex-wrap gap-2">
              <div className="d-flex align-items-center gap-2">
                <span className="small fw-semibold text-secondary">Change Status:</span>
                <select
                  className="form-select form-select-sm"
                  style={{ width: "150px" }}
                  value={selectedQuery.status}
                  onChange={(e) => handleQueryStatusChange(selectedQuery._id, e.target.value)}
                >
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="d-flex gap-2">
                <a
                  href={`mailto:${selectedQuery.email}?subject=RE: Ticket #${selectedQuery.ticketId} - ${selectedQuery.subject}`}
                  className="btn btn-sm btn-primary rounded-pill px-3 d-inline-flex align-items-center gap-1"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                    mail
                  </span>
                  Reply via Email
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedQuery(null)}
                  className="btn btn-sm btn-light border rounded-pill px-3"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
