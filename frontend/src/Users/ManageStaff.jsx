import React from "react";
import UnderDevelopmentCard from "../components/UnderDev";

export default function ManageStaff() { 
    return (
        <div className="p-4 flex flex-col gap-4">
            <h2 className="text-2xl font-bold mb-4">Manage Staff</h2>
            <UnderDevelopmentCard />
        </div>
    );
}
