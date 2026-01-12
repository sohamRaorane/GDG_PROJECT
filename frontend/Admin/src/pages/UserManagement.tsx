import { useState, useEffect } from "react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { Search, Filter, MoreVertical, CheckCircle, XCircle, Shield } from "lucide-react";
import { getAllUsers, createUser, deleteUser, updateUserRole } from "../services/db";
import Modal from "../components/ui/Modal";

type RoleLabel = "Admin" | "Provider" | "User";

interface User {
    id: number;
    realId?: string;
    name: string;
    email: string;
    role: "Admin" | "Provider" | "User";
    status: "Active" | "Inactive";
    lastActive: string;
}

const UserManagement = () => {
    const [users, setUsers] = useState<User[]>([]);

    // Map backend role to UI label
    const mapRole = (role: string): RoleLabel => {
        if (role === "admin") return "Admin";
        if (role === "organiser") return "Provider";
        return "User";
    };

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                const profiles = await getAllUsers();
                if (!mounted) return;
                const mapped: User[] = profiles.map((p, idx) => ({
                    id: idx + 1,
                    // Use 'id' injected by converter if 'uid' is missing. 
                    // 'id' is not in UserProfile type so we cast to any.
                    realId: p.uid || (p as any).id,
                    name: p.displayName || p.email || "Unknown",
                    email: p.email || "",
                    role: mapRole(p.role || ""),
                    status: "Active",
                    lastActive: "just now",
                }));
                setUsers(mapped);
            } catch (err) {
                console.error("Failed to load users", err);
            }
        };
        load();
        return () => { mounted = false };
    }, []);

    const toggleStatus = (id: number) => {
        setUsers(users.map(u => u.id === id ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u));
    };

    const handleDeleteUser = async (uid: string | number) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await deleteUser(String(uid));
                setUsers(users.filter(u => u.realId !== uid));
            } catch (e) {
                console.error("Failed to delete user", e);
            }
        }
    };

    // Edit User State
    const [isEditUserOpen, setIsEditUserOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [selectedRole, setSelectedRole] = useState<RoleLabel>("User");

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setSelectedRole(user.role);
        setIsEditUserOpen(true);
    };

    const handleUpdateRole = async () => {
        if (!editingUser) return;
        try {
            const roleMap: Record<string, "customer" | "admin" | "organiser"> = {
                "User": "customer",
                "Admin": "admin",
                "Provider": "organiser"
            };
            const backendRole = roleMap[selectedRole];

            // Update in DB (using realId if available, fallback to id but realId is preferred for DB ops)
            await updateUserRole(String(editingUser.realId || editingUser.id), backendRole);

            // Update local state
            setUsers(users.map(u => u.id === editingUser.id ? { ...u, role: selectedRole } : u));
            setIsEditUserOpen(false);
        } catch (error) {
            console.error("Failed to update role", error);
        }
    };

    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        role: "User" as RoleLabel
    });

    const handleAddUser = async () => {
        if (!newUser.name || !newUser.email) return;

        try {
            const roleMap: Record<string, "customer" | "admin" | "organiser"> = {
                "User": "customer",
                "Admin": "admin",
                "Provider": "organiser"
            };

            const backendRole = roleMap[newUser.role];

            await createUser({
                displayName: newUser.name,
                email: newUser.email,
                role: backendRole
            });

            // Refresh list
            const profiles = await getAllUsers();
            const mapped: User[] = profiles.map((p, idx) => ({
                id: idx + 1,
                name: p.displayName || p.email || "Unknown",
                email: p.email || "",
                role: mapRole(p.role || ""),
                status: "Active",
                lastActive: "just now",
            }));
            setUsers(mapped);
            setIsAddUserOpen(false);
            setNewUser({ name: "", email: "", role: "User" });
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Premium Header with Gradient Background */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 shadow-xl border border-white/5">
                {/* Animated Orbs */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

                <div className="relative flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-emerald-100 bg-clip-text text-transparent">
                            User Management
                        </h1>
                        <p className="text-slate-300 mt-1.5">Manage platform users, providers, and administrators.</p>
                    </div>
                    <Button
                        onClick={() => setIsAddUserOpen(true)}
                        className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-lg shadow-teal-500/30"
                    >
                        Add New User
                    </Button>
                </div>
            </div>

            <Card className="overflow-hidden shadow-xl border-2 border-slate-100">
                {/* Enhanced Toolbar */}
                <div className="flex flex-col gap-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white p-6 md:flex-row md:items-center md:justify-between">
                    <div className="relative flex-1 md:max-w-md">
                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-teal-500" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="w-full rounded-xl border-2 border-slate-200 bg-white py-3 pl-12 pr-4 text-sm font-medium transition-all focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 hover:border-slate-300"
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" size="sm" className="border-2 border-slate-200 hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50 transition-all">
                            <Filter className="mr-2 h-4 w-4" /> Filter
                        </Button>
                    </div>
                </div>

                {/* Premium Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gradient-to-r from-slate-50 to-slate-100 text-slate-600 border-b-2 border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wide">Name</th>
                                <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wide">Role</th>
                                <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wide">Status</th>
                                <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wide">Last Active</th>
                                <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wide text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map((user) => (
                                <tr key={user.id} className="group hover:bg-gradient-to-r hover:from-teal-50/50 hover:to-emerald-50/50 transition-all duration-200">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-teal-100 to-emerald-100 text-sm font-bold text-teal-700 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-admin-sidebar group-hover:text-teal-700 transition-colors">{user.name}</div>
                                                <div className="text-xs text-slate-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold shadow-sm ${user.role === "Admin" ? "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700" :
                                            user.role === "Provider" ? "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700" :
                                                "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700"
                                            } `}>
                                            {user.role === "Admin" && <Shield className="h-3.5 w-3.5" />}
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => toggleStatus(user.id)} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all shadow-sm hover:shadow-md ${user.status === "Active" ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 hover:from-green-200 hover:to-emerald-200" : "bg-gradient-to-r from-red-100 to-red-200 text-red-700 hover:from-red-200 hover:to-red-300"
                                            } `}>
                                            {user.status === "Active" ? <CheckCircle className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                                            {user.status}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-600 font-medium">{user.lastActive}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <ActionsMenu user={user} onDelete={handleDeleteUser} onEdit={handleEditUser} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Add User Modal */}
            <Modal
                isOpen={isAddUserOpen}
                onClose={() => setIsAddUserOpen(false)}
                title="Add New User"
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Display Name</label>
                        <input
                            value={newUser.name}
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="John Doe"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Email Address</label>
                        <input
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="john@example.com"
                            type="email"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Role</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['User', 'Provider', 'Admin'].map(role => (
                                <button
                                    key={role}
                                    onClick={() => setNewUser({ ...newUser, role: role as RoleLabel })}
                                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${newUser.role === role
                                        ? 'bg-teal-50 border-teal-500 text-teal-700'
                                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setIsAddUserOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddUser}
                            className="bg-teal-600 hover:bg-teal-700"
                        >
                            Create User
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Edit User Modal */}
            <Modal
                isOpen={isEditUserOpen}
                onClose={() => setIsEditUserOpen(false)}
                title="Edit User Role"
            >
                <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                        Changing role for <span className="font-semibold text-slate-800">{editingUser?.name}</span>
                    </p>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Select New Role</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['User', 'Provider', 'Admin'].map(role => (
                                <button
                                    key={role}
                                    onClick={() => setSelectedRole(role as RoleLabel)}
                                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${selectedRole === role
                                        ? 'bg-teal-50 border-teal-500 text-teal-700'
                                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setIsEditUserOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdateRole}
                            className="bg-teal-600 hover:bg-teal-700"
                        >
                            Update Role
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default UserManagement;

const ActionsMenu = ({ user, onDelete, onEdit }: { user: User, onDelete: (id: string | number) => void, onEdit: (user: User) => void }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-teal-600 transition-all"
            >
                <MoreVertical className="h-5 w-5" />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-10 overflow-hidden">
                    <button
                        onClick={() => onEdit(user)}
                        className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                        Edit Role
                    </button>
                    <button
                        onClick={() => onDelete(user.realId || user.id)}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                        Delete User
                    </button>
                </div>
            )}
        </div>
    );
};
