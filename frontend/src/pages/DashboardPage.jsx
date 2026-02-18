import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    createReceipe,
    deleteReceipe,
    fetchAdminReceipes,
    fetchUserReceipes,
    updateReceipe
} from "../features/receipeSlice";

const DashboardPage = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { userReceipes, allReceipes, loading, error } = useSelector((state) => state.receipe);
    const [formData, setFormData] = useState({ title: "", content: "" });
    const [editingId, setEditingId] = useState(null);

    const loadReceipes = () => {
        dispatch(fetchUserReceipes());
        if (user?.role === "admin") {
            dispatch(fetchAdminReceipes());
        }
    };

    useEffect(() => {
        loadReceipes();
    }, [dispatch, user?.role]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editingId) {
            await dispatch(updateReceipe({ id: editingId, payload: formData }));
        } else {
            await dispatch(createReceipe(formData));
        }

        setFormData({ title: "", content: "" });
        setEditingId(null);
        loadReceipes();
    };

    const handleEdit = (item) => {
        setEditingId(item._id);
        setFormData({
            title: item.title || "",
            content: item.content || ""
        });
    };

    const handleDelete = async (id) => {
        await dispatch(deleteReceipe(id));
        if (editingId === id) {
            setEditingId(null);
            setFormData({ title: "", content: "" });
        }
        loadReceipes();
    };

    return (
        <section className="max-w-6xl mx-auto p-4 space-y-8">
            <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-sm text-black">Welcome, {user?.name}</p>
            </div>

            {error ? <p className="text-red-600 text-sm">{error}</p> : null}

            <div className="border rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-3">{editingId ? "Edit Receipe" : "Add Receipe"}</h2>
                <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-3">
                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={formData.title}
                        onChange={handleChange}
                        className="border rounded-md px-3 py-2"
                        required
                    />
                    <input
                        type="text"
                        name="content"
                        placeholder="Content"
                        value={formData.content}
                        onChange={handleChange}
                        className="border rounded-md px-3 py-2"
                        required
                    />
                    <div className="md:col-span-2 flex gap-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="border rounded-md px-4 py-2 disabled:opacity-50"
                        >
                            {editingId ? "Update" : "Add"}
                        </button>
                        {editingId ? (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingId(null);
                                    setFormData({ title: "", content: "" });
                                }}
                                className="border rounded-md px-4 py-2"
                            >
                                Cancel
                            </button>
                        ) : null}
                    </div>
                </form>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-3">Your Receipes</h2>
                {loading && userReceipes.length === 0 ? <p>Loading...</p> : null}
                <div className="grid md:grid-cols-2 gap-4">
                    {userReceipes.map((item) => (
                        <section key={item._id} className="border rounded-lg p-4">
                            <h3 className="font-semibold capitalize">{item.title}</h3>
                            <p className="text-sm text-gray-700 capitalize mt-2">{item.content}</p>
                            <div className="flex gap-2 mt-3">
                                <button
                                    type="button"
                                    onClick={() => handleEdit(item)}
                                    className="border rounded-md px-3 py-1 text-sm"
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(item._id)}
                                    className="border rounded-md px-3 py-1 text-sm text-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </section>
                    ))}
                </div>
                {userReceipes.length === 0 && !loading ? <p className="text-sm text-black">No receipes found.</p> : null}
            </div>

            {user?.role === "admin" ? (
                <div>
                    <h2 className="text-xl font-semibold mb-3">All Receipes</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {allReceipes.map((item) => (
                            <article key={item._id} className="border rounded-lg p-4">
                                <h3 className="font-semibold capitalize">{item.title}</h3>
                                <p className="text-sm text-gray-700 capitalize mt-2">{item.content}</p>
                                <p className="text-xs text-gray-500 mt-3">
                                    By: {item.user?.name || "Unknown"} ({item.user?.email || "N/A"})
                                </p>
                                <div className="flex gap-2 mt-3">
                                    <button
                                        type="button"
                                        onClick={() => handleEdit(item)}
                                        className="border rounded-md px-3 py-1 text-sm"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(item._id)}
                                        className="border rounded-md px-3 py-1 text-sm text-red-600"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                    {allReceipes.length === 0 && !loading ? <p className="text-sm text-black">No receipes found.</p> : null}
                </div>
            ) : null}
        </section>
    );
};

export default DashboardPage;
