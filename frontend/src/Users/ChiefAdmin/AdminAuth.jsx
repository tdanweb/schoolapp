import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { mainApi } from "../../api";

export default function AdminAuth({ permission, children }) {

    const [allowed, setAllowed] = useState(null);

    useEffect(() => {
        async function getUser() {

            const savedUser = JSON.parse(
                localStorage.getItem("logged-user") || "null"
            );

            if (!savedUser?.user || !savedUser?.token) {
                setAllowed(false);
                return;
            }

            const params = new URLSearchParams({
                token: savedUser.token, regNo: savedUser.user
            })
            try {

                const res = await axios.get(
                    `${mainApi}/user/admin-roles?regNo=${savedUser.user}&token=${savedUser.token}`
                );

                const info = res.data;

                // Adjust this depending on your backend response
                const roles = info.permission || info;

                const isMainAdmin =
                    info.role === "admin" ||
                    info.role === "chief-admin";

                const hasPermission =
                    permission ? roles[permission] === true : false;

                setAllowed(isMainAdmin || hasPermission);

            } catch (error) {

                console.log("Error Report", error.response?.data)
                console.error("Admin authentication failed:", error);
                setAllowed(false);

            }
        }

        getUser();

    }, [permission]);


    // Still checking
    if (allowed === null) {
        return <div>Checking authorization...</div>;
    }

    // Not allowed
    if (!allowed) {
        return <Navigate to="/app/user/unauthorized" replace />;
    }

    // Allowed
    return children;
}


import { ShieldX } from "lucide-react";

export function AccessDenied() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">

        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <ShieldX size={34} className="text-red-500" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800">
          Access Denied
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          You don't have access to this link.
        </p>

      </div>
    </div>
  );
}