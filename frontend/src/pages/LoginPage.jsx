import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearAuthError, login } from "../features/authSlice";

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
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
        await dispatch(login(formData));
    };

    return (
        <section className="max-w-md mx-auto mt-12 border rounded-xl p-6 shadow">
            <h1 className="text-2xl font-bold mb-5">Login</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
            <p className="mt-4 text-sm">
                Don&apos;t have an account? <Link className="underline" to="/register">Register</Link>
            </p>
        </section>
    );
};

export default LoginPage;
