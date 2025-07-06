import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            navigate('/profile');
        } catch (err) {
            alert(err.response.data.message);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 shadow p-4 rounded bg-light">
                    <h2 className="text-center mb-4">Login</h2>
                    <form onSubmit={handleSubmit}>
                        {['email', 'password'].map(field => (
                            <div className="mb-3" key={field}>
                                <label className="form-label text-capitalize">{field}</label>
                                <input
                                    type={field === 'password' ? 'password' : 'email'}
                                    name={field}
                                    className="form-control"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        ))}
                        <button className="btn btn-success w-100">Login</button>
                        <p className="mt-3 text-center">
                            Don’t have an account? <a href="/signup">Register here</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
