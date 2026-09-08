// Dashboard.jsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import "./App.css"

const Dashboard = () => {
    return (
        <>
        <div>
            <nav className='side-view header'>
              <strong className='lf'>DASHBOARD</strong>
              <Link to="/">BACK HOME</Link>  
              <Link to="settings">SETTINGS</Link> 
              <Link to="settings2">PROFILES</Link>
            </nav>
                <hr />
            {/* The Outlet component renders the nested route's element */}
           <Outlet/> 
        </div>
</>
);
};

export default Dashboard;



// 3️⃣ SIDEBAR (BUSINESS NAVIGATION)
function Sidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg hidden md:flex flex-col">
      <div className="p-6 text-xl font-bold border-b dark:border-gray-700">
        BizManager
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {[
          "Dashboard", "Stores", "Sales", "Orders", "Purchases", "Staff", "Analytics", "Reports", "Feedbacks",
        ].map(item => (
          <a
            key={item}
            href="#"
            className="block px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {item}
          </a>
        ))}
      </nav>
    </aside>
  );
}
  

// 4️⃣ STAT CARD (REUSABLE KPI)
function StatCard({ title, value }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </div>
  );
}

// 5️⃣ SALES ANALYTICS (RECHARTS)
import {
  LineChart, Line, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

const data2 = [
  { month: "Jan", sales: 4000 },
  { month: "Feb", sales: 3000 },
  { month: "Mar", sales: 5000 },
  { month: "Apr", sales: 4200 },
];

function SalesChart() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
      <h3 className="font-semibold mb-4">Sales Analytics</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data2}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#22c55e"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

//PROFIT VS LOSS CHART
import {
  BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

const data3 = [
  { name: "Jan", profit: 2400, loss: 1200 },
  { name: "Feb", profit: 3000, loss: 900 },
  { name: "Mar", profit: 2800, loss: 1500 },
];

function ProfitLossChart() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
      <h3 className="font-semibold mb-4">Profit vs Loss</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data3}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="profit" fill="#3b82f6" />
            <Bar dataKey="loss" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
//main board
function NewDashboard() {
  return (
    <div className="p-6 space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Sales" value="₦4,200,000" />
        <StatCard title="Profit" value="₦1,150,000" />
        <StatCard title="Orders" value="1,245" />
        <StatCard title="Active Stores" value="8" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart />
        <ProfitLossChart />
      </div>

    </div>
  );
}

export {NewDashboard}

/*
## 8️⃣ WHY THIS IS BUSINESS-READY ✅

✔ Modular & scalable
✔ Clean UI for decision making
✔ Easy backend integration
✔ Supports multi-store business
✔ Admin & staff friendly
✔ Analytics focused
✔ Professional SaaS look

---

## 🔥 NEXT POWER MOVES

I can now:

1️⃣ Add **Orders & Purchases tables**
2️⃣ Build **Staff Management system**
3️⃣ Add **Role-based access (Admin, Manager, Staff)**
4️⃣ Connect to **Node.js + MongoDB backend**
5️⃣ Add **PDF / Excel report export**
6️⃣ Add **Notifications & Activity Log**
7️⃣ Mobile-first sidebar
*/