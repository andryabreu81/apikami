import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:3005/users';

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', lastname: '', email: '', role_id: 1, password: '' });
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'role_id' ? parseInt(value) : value });
  };

  const openModalForAdd = () => {
    setFormData({ name: '', lastname: '', email: '', role_id: 1, password: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openModalForEdit = (user) => {
    // Para la edición, si no queremos cambiar contraseña, la dejamos vacía (el backend de NestJS debería manejarla como opcional o ignorarla si está vacía)
    setFormData({ name: user.name, lastname: user.lastname, email: user.email, role_id: user.role_id || (user.role && user.role.id) || 1, password: '' });
    setEditingId(user.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (editingId && !payload.password) {
        delete payload.password; // no enviar password vacía si es edición
      }

      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, payload);
      } else {
        await axios.post(API_URL, payload);
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
      alert('Error saving user');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>User Management</h1>
        <button className="btn-primary" onClick={openModalForAdd}>
          + Add New User
        </button>
      </header>

      <main className="content">
        <div className="table-wrapper">
          <table className="user-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>#{user.id}</td>
                  <td>{user.name} {user.lastname}</td>
                  <td>{user.email}</td>
                  <td>{user.role?.name || `Role ${user.role_id}`}</td>
                  <td className="actions">
                    <button className="btn-edit" onClick={() => openModalForEdit(user)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(user.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="empty-state">No users found. Start by adding one.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingId ? 'Edit User' : 'Add New User'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>First Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" name="lastname" value={formData.lastname} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Role ID</label>
                <input type="number" name="role_id" value={formData.role_id} onChange={handleInputChange} required />
              </div>
              {!editingId && (
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleInputChange} required />
                </div>
              )}
              {editingId && (
                 <div className="form-group">
                 <label>New Password (opcional)</label>
                 <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Leave empty to keep current" />
               </div>
              )}
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
