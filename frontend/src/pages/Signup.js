import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        age: '',
        dob: '',
        contact: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState('');

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Handle password strength
        if (name === 'password') {
            evaluatePasswordStrength(value);
        }
    };

    const evaluatePasswordStrength = (password) => {
        let strength = '';
        const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        const medium = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

        if (strong.test(password)) strength = 'strong';
        else if (medium.test(password)) strength = 'medium';
        else strength = 'weak';

        setPasswordStrength(strength);
    };

    const validate = () => {
        const { email, age, dob, contact, password } = formData;

        const emailRegex = /^[^\s@]+@[^\s@]+\.(com|in)$/;
        if (!emailRegex.test(email)) {
            alert('Invalid email format (must end with .com or .in)');
            return false;
        }

        const contactRegex = /^\d{10}$/;
        if (!contactRegex.test(contact)) {
            alert('Contact number must be exactly 10 digits');
            return false;
        }

        const today = new Date();
        const enteredDOB = new Date(dob);
        if (enteredDOB >= today) {
            alert('Date of birth must be in the past');
            return false;
        }

        const ageDiff = today.getFullYear() - enteredDOB.getFullYear();
        if (parseInt(age) < 13 || parseInt(age) !== ageDiff) {
            alert('Age must be 13 or older and match your date of birth');
            return false;
        }

        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
        if (!strongPasswordRegex.test(password)) {
            alert('Password must be at least 6 characters and include:\n- 1 uppercase letter\n- 1 lowercase letter\n- 1 number\n- 1 special character');
            return false;
        }

        return true;
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const res = await axios.post('https://profile-6g3x.onrender.com/api/auth/signup', formData);
            localStorage.setItem('token', res.data.token);
            navigate('/profile');
        } catch (err) {
            alert(err.response?.data?.message || 'Signup failed');
        }
    };

    // Determine color for password strength
    const getStrengthColor = () => {
        if (passwordStrength === 'strong') return 'text-success';
        if (passwordStrength === 'medium') return 'text-warning';
        return 'text-danger';
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 shadow p-4 rounded bg-light">
                    <h2 className="text-center mb-4">Signup</h2>
                    <form onSubmit={handleSubmit}>
                        {/* Dynamic Form Inputs */}
                        {['name', 'email', 'password', 'age', 'dob', 'contact'].map(field => (
                            <div className="mb-3" key={field}>
                                <label className="form-label text-capitalize">{field}</label>
                                <input
                                    type={
                                        field === 'password'
                                            ? showPassword ? 'text' : 'password'
                                            : field === 'dob' ? 'date'
                                                : field === 'age' || field === 'contact' ? 'number'
                                                    : 'text'
                                    }
                                    name={field}
                                    className="form-control"
                                    onChange={handleChange}
                                    required
                                />
                                {/* Show password strength bar */}
                                {field === 'password' && (
                                    <div className={`mt-1 small ${getStrengthColor()}`}>
                                        Strength: {passwordStrength.toUpperCase()}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Show/Hide password toggle */}
                        <div className="form-check mb-3">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="showPassword"
                                onChange={() => setShowPassword(!showPassword)}
                            />
                            <label className="form-check-label" htmlFor="showPassword">
                                Show Password
                            </label>
                        </div>

                        <button className="btn btn-primary w-100">Register</button>

                        <p className="mt-3 text-center">
                            Already have an account? <Link to="/">Login here</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signup;
