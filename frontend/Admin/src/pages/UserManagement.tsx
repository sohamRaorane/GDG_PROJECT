import { useState, useEffect } from "react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { Search, Filter, MoreVertical, CheckCircle, XCircle, Shield } from "lucide-react";
import { getAllUsers } from "../services/db";

type RoleLabel = "Admin" | "Provider" | "User";

interface User {
    id: number;
    name: string;
    email: string;
    role: "Admin" | "Provider" | "User";
    status: "Active" | "Inactive";
    lastActive: string;
}

const UserManagement = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    // Map backend role to UI label
    const mapRole = (role: string): RoleLabel => {
        if (role === "admin") return "Admin";
        if (role === "organiser") return "Provider";
        return "User";
    };

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            setLoading(true);
            try {
                const profiles = await getAllUsers();
                if (!mounted) return;
                const mapped: User[] = profiles.map((p, idx) => ({
                    id: idx + 1,
                    name: p.displayName || p.email || "Unknown",
                    email: p.email || "",
                    role: mapRole(p.role || ""),
                    status: "Active",
                    lastActive: "just now",
                }));
                setUsers(mapped);
            } catch (err) {
                console.error("Failed to load users", err);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        load();
        return () => { mounted = false };
    }, []);

    const toggleStatus = (id: number) => {
        setUsers(users.map(u => u.id === id ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-dark-slate">User Management</h1>
                    <p className="text-slate-500 mt-1">Manage platform users, providers, and administrators.</p>
                </div>
                <Button>
                    Add New User
                </Button>
            </div>

            <Card className="overflow-hidden">
                {/* Toolbar */}
                <div className="flex flex-col gap-4 border-b border-gray-100 p-4 md:flex-row md:items-center md:justify-between">
                    <div className="relative flex-1 md:max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 focus:border-deep-forest focus:outline-none"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            <Filter className="mr-2 h-4 w-4" /> Filter
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr>
                                <th className="px-6 py-3 font-medium">Name</th>
                                <th className="px-6 py-3 font-medium">Role</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium">Last Active</th>
                                <th className="px-6 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-medium text-slate-600">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-dark-slate">{user.name}</div>
                                                <div className="text-xs text-slate-400">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${user.role === "Admin" ? "bg-purple-100 text-purple-700" :
                                            user.role === "Provider" ? "bg-blue-100 text-blue-700" :
                                                "bg-slate-100 text-slate-700"
                                            } `}>
                                            {user.role === "Admin" && <Shield className="h-3 w-3" />}
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => toggleStatus(user.id)} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium cursor-pointer transition-colors ${user.status === "Active" ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-700 hover:bg-red-200"
                                            } `}>
                                            {user.status === "Active" ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                            {user.status}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        {user.lastActive}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 hover:text-dark-slate">
                                            <MoreVertical className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default UserManagement;
