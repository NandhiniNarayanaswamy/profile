import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Profile() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        age: '',
        dob: '',
        contact: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [hasUpdated, setHasUpdated] = useState(false); // hide Edit after update
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/user/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFormData(res.data);
            } catch (err) {
                alert('Failed to load profile');
            }
        };

        fetchProfile();
    }, [navigate, token]);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.(com|in)$/;
        const contactRegex = /^\d{10}$/;
        const today = new Date();
        const dob = new Date(formData.dob);
        const ageDiff = today.getFullYear() - dob.getFullYear();

        if (!formData.name) return alert("Name is required");
        if (!emailRegex.test(formData.email)) return alert("Invalid email");
        if (!contactRegex.test(formData.contact)) return alert("Contact must be 10 digits");
        if (dob >= today) return alert("DOB must be in the past");
        if (parseInt(formData.age) < 13 || parseInt(formData.age) !== ageDiff) {
            return alert("Age must be 13+ and match DOB");
        }

        return true;
    };

    const handleUpdate = async e => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const res = await axios.put('http://localhost:5000/api/user/profile', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFormData(res.data);
            setEditMode(false);
            setHasUpdated(true); // hide edit button now
            toast.success('🎉 Profile updated successfully!');
        } catch (err) {
            toast.error('❌ Update failed. Try again.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const toggleEdit = () => {
        setEditMode(true);
    };

    return (
        <div className="container py-5">
            <ToastContainer position="top-center" />
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow-lg border-0 rounded-4">
                        <div className="card-header bg-primary text-white text-center">
                            <h4 className="m-0">Hey {formData.name}!</h4>
                        </div>

                        <div className="card-body p-4">
                            <form onSubmit={handleUpdate}>
                                {/* Name */}
                                <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        value={formData.name}
                                        onChange={handleChange}
                                        readOnly={!editMode}
                                    />
                                </div>

                                {/* Email */}
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        value={formData.email}
                                        readOnly
                                    />
                                </div>

                                {/* Age */}
                                <div className="mb-3">
                                    <label className="form-label">Age</label>
                                    <input
                                        type="number"
                                        name="age"
                                        className="form-control"
                                        value={formData.age}
                                        onChange={handleChange}
                                        readOnly={!editMode}
                                    />
                                </div>

                                {/* DOB */}
                                <div className="mb-3">
                                    <label className="form-label">Date of Birth</label>
                                    <input
                                        type="date"
                                        name="dob"
                                        className="form-control"
                                        value={formData.dob?.slice(0, 10)}
                                        onChange={handleChange}
                                        readOnly={!editMode}
                                    />
                                </div>

                                {/* Contact */}
                                <div className="mb-3">
                                    <label className="form-label">Contact Number</label>
                                    <input
                                        type="tel"
                                        name="contact"
                                        className="form-control"
                                        value={formData.contact}
                                        onChange={handleChange}
                                        readOnly={!editMode}
                                    />
                                </div>

                                <div className="d-grid gap-2">
                                    {!editMode && !hasUpdated && (
                                        <button type="button" className="btn btn-warning" onClick={toggleEdit}>
                                            ✏️ Edit Profile
                                        </button>
                                    )}
                                    {editMode && (
                                        <button type="submit" className="btn btn-success">
                                            ✅ Update Profile
                                        </button>
                                    )}
                                    <button type="button" onClick={handleLogout} className="btn btn-outline-danger">
                                        🚪 Logout
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <p className="text-center text-muted mt-3" style={{ fontSize: '0.9rem' }}>
                        You can only edit name, age, DOB, and contact once after login.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Profile;
