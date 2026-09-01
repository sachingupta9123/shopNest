import React, { useEffect, useState } from "react";
import "./AdminUsers.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      // Get logged-in admin from sessionStorage
      const savedUser = sessionStorage.getItem("user");

      if (!savedUser) {
        setError("Please login first.");
        setUsers([]);
        return;
      }

      let userInfo;

      try {
        userInfo = JSON.parse(savedUser);
      } catch (error) {
        sessionStorage.removeItem("user");
        setError("Invalid login session. Please login again.");
        setUsers([]);
        return;
      }

      if (!userInfo?.token) {
        setError("Authentication token not found. Please login again.");
        setUsers([]);
        return;
      }

      const response = await fetch("/api/auth/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch users");
      }

      // Make sure data is always an array
      if (Array.isArray(data)) {
        setUsers(data);
      } else if (Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        setUsers([]);
        throw new Error("Invalid user data received from server");
      }

    } catch (err) {
      console.error("Users fetch error:", err);

      setUsers([]);
      setError(err.message || "Something went wrong");

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchUsers();
  }, []);


  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };


  return (
    <div className="admin-users-page">

      {/* Header */}
      <div className="users-header">

        <div>
          <h1>Users</h1>
          <p>Manage all registered users</p>
        </div>

        <button
          className="refresh-btn"
          onClick={fetchUsers}
          disabled={loading}
        >
          {loading ? "Loading..." : "↻ Refresh"}
        </button>

      </div>


      {/* Loading */}
      {loading && (
        <div className="users-loading">
          <div className="loader"></div>
          <p>Loading users...</p>
        </div>
      )}


      {/* Error */}
      {!loading && error && (
        <div className="users-error">
          ⚠️ {error}
        </div>
      )}


      {/* Users */}
      {!loading && !error && (
        <div className="users-card">

          <div className="users-card-header">
            <div>
              <h2>All Users</h2>

              <p>
                Total registered users:{" "}
                <strong>{users.length}</strong>
              </p>
            </div>
          </div>


          {users.length === 0 ? (

            <div className="no-users">
              <div className="no-users-icon">👥</div>

              <h3>No Users Found</h3>

              <p>
                No registered users are available.
              </p>
            </div>

          ) : (

            <div className="table-wrapper">

              <table className="users-table">

                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email Address</th>
                    <th>Role</th>
                    <th>Verification</th>
                    <th>Joined</th>
                  </tr>
                </thead>


                <tbody>

                  {users.map((user) => (

                    <tr key={user._id}>

                      {/* User */}
                      <td>
                        <div className="user-profile">

                          <div className="user-avatar">
                            {user.name
                              ? user.name.charAt(0).toUpperCase()
                              : "U"}
                          </div>

                          <div>

                            <span className="user-name">
                              {user.name || "Unknown User"}
                            </span>

                            <span className="user-id">
                              ID:{" "}
                              {user._id
                                ? user._id.slice(-6)
                                : "N/A"}
                            </span>

                          </div>

                        </div>
                      </td>


                      {/* Email */}
                      <td>
                        <span className="user-email">
                          {user.email || "N/A"}
                        </span>
                      </td>


                      {/* Role */}
                      <td>

                        <span
                          className={`role-badge ${
                            user.role === "admin"
                              ? "admin-role"
                              : "user-role"
                          }`}
                        >
                          {user.role === "admin"
                            ? "Admin"
                            : "User"}
                        </span>

                      </td>


                      {/* Verification */}
                      <td>

                        {user.isVerified ? (

                          <span className="status-badge verified">
                            ✓ Verified
                          </span>

                        ) : (

                          <span className="status-badge unverified">
                            ● Not Verified
                          </span>

                        )}

                      </td>


                      {/* Joined */}
                      <td>

                        <span className="joined-date">
                          {formatDate(user.createdAt)}
                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>
      )}

    </div>
  );
};

export default AdminUsers;