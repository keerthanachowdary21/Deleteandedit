import React, { useState, useEffect } from "react";
import './App.css';

const UserManagementDashboard = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ id: "", firstName: "", lastName: "", email: "", department: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  // Fetch users from API
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((data) => {
        const formattedUsers = data.map((user) => ({
          id: user.id,
          firstName: user.name.split(" ")[0],
          lastName: user.name.split(" ")[1] || "",
          email: user.email,
          department: user.company?.name || "Unknown",
        }));
        setUsers(formattedUsers);
      })
      .catch((err) => setError("Failed to fetch users."));
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Add or Edit user
  const handleSubmit = (e) => {
    e.preventDefault();
    const url = isEditing
      ? `https://jsonplaceholder.typicode.com/users/${formData.id}`
      : "https://jsonplaceholder.typicode.com/users";
    const method = isEditing ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          if (isEditing) {
            setUsers(users.map((user) => (user.id === formData.id ? formData : user)));
          } else {
            setUsers([...users, { ...formData, id: users.length + 1 }]);
          }
          setFormData({ id: "", firstName: "", lastName: "", email: "", department: "" });
          setIsEditing(false);
        } else {
          throw new Error("Failed to save user.");
        }
      })
      .catch(() => setError("Failed to save user."));
  };

  // Delete user
  const handleDelete = (id) => {
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, { method: "DELETE" })
      .then((response) => {
        if (response.ok) {
          setUsers(users.filter((user) => user.id !== id));
        } else {
          throw new Error("Failed to delete user.");
        }
      })
      .catch(() => setError("Failed to delete user."));
  };

  // Edit user
  const handleEdit = (user) => {
    setIsEditing(true);
    setFormData(user);
  };

  return (
    <div className="dashboard-container">
      <h1>User Management Dashboard</h1>
      {error && <p className="error">{error}</p>}
      <div className="form-container">
        <h2>{isEditing ? "Edit User" : "Add User"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
            required
          />
          <button type="submit">{isEditing ? "Update" : "Add"} User</button>
        </form>
      </div>
      <div className="users-container">
        <h2>Users</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.department}</td>
                <td>
                  <button onClick={() => handleEdit(user)}>Edit</button>
                  <button onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementDashboard;
