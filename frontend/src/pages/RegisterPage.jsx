import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearAuthError, register } from "../features/authSlice";

const RegisterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        return () => {
            dispatch(clearAuthError());
        };
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(register(formData));
    };

    return (
        <section className="max-w-md mx-auto mt-12 border rounded-xl p-6 shadow">
            <h1 className="text-2xl font-bold mb-5">Register</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2"
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2"
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2"
                    required
                />
                {error ? <p className="text-red-600 text-sm">{error}</p> : null}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white rounded-md px-3 py-2 disabled:opacity-50"
                >
                    {loading ? "Creating..." : "Register"}
                </button>
            </form>
            <p className="mt-4 text-sm">
                Already have an account? <Link className="underline" to="/login">Login</Link>
            </p>
        </section>
    );
};

export default RegisterPage;
