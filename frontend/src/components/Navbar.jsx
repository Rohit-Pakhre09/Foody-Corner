import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../features/authSlice";
import { resetReceipes } from "../features/receipeSlice";

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    const handleLogout = async () => {
        await dispatch(logout());
        dispatch(resetReceipes());
        navigate("/login");
    };

    return (
        <header className="bg-neutral-50 shadow-md">
            <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                <Link className="text-xl font-bold text-black" to={isAuthenticated ? "/dashboard" : "/login"}>
                    Foody Corner
                </Link>

                {isAuthenticated ? (
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-black">
                            {user?.name?.toUpperCase()}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="border rounded-md px-3 py-1.5 text-sm text-black"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <Link className="text-sm underline text-black" to="/login">Login</Link>
                        <Link className="text-sm underline text-black" to="/register">Register</Link>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Navbar;
