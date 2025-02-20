import React, { useState, useEffect } from "react";
import axios from "axios";
import "./dashboard.css"; // Import the CSS file

function Dashboard() {
    const [inputValue, setInputValue] = useState("");
    const [apiData, setApiData] = useState([]); // ✅ State to store users
    const [newUser, setNewUser] = useState({ name: "", email: "", age: "" }); // ✅ State for input values

    // ✅ Fetch Users from Flask API when the component loads
    useEffect(() => {
        axios.get("http://127.0.0.1:5000/api/users")
            .then((response) => {
                setApiData(response.data); // ✅ Store users in state
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
            });
    }, []);

    // ✅ Function to Add a New User
    const addUser = () => {
        if (!newUser.name || !newUser.email || !newUser.age) {
            alert("Please fill in all fields.");
            return;
        }

        const userToSend = {
            id: String(apiData.length + 1), // Assign unique ID
            ...newUser
        };

        axios.post("http://127.0.0.1:5000/api/users", userToSend)
            .then((response) => {
                setApiData([...apiData, response.data.user]); // ✅ Update UI with new user
                setNewUser({ name: "", email: "", age: "" }); // ✅ Clear form
            })
            .catch((error) => {
                console.error("Error adding user:", error);
            });
    };

    return (
        <>
            <div className="dashboard-header">
                <OrderText orderNumber="#678584" details="Sara Durham on January 17, 2025" />
                <input type="text" placeholder="Search by patient or order" className="dashboard-search" />
                <div className="dashboard-buttons">
                    <PrimaryButton text="Mark as Exception" color="Red"/>
                    <PrimaryButton text="Fill Order" />
                </div>
            </div>

            <h2>User List</h2>
            <ul>
                {apiData.map((user) => (
                    <li key={user.id}>
                        {user.name} - {user.email} - {user.age} years old
                    </li>
                ))}
            </ul>

            <h2>Add a User</h2>
            <input
                type="text"
                placeholder="Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <input
                type="number"
                placeholder="Age"
                value={newUser.age}
                onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
            />
            <button onClick={addUser}>Add User</button>

            <div>
                <DashboardContainer>
                    <DashboardContainerTitle title="Shipping Information" />
                    <p>Carrier: UPS 2nd Day Air</p>
                    <PrimaryButton text="Print Label" />
                    <PrimaryButton text="Download Invoice" />
                </DashboardContainer>
            </div>
        </>
    );
}

const OrderText = ({ orderNumber, details }) => {
    return (
        <div className="order-text-container">
            <h1 className="dashboard-ordertext order-number">{orderNumber}</h1>
            <p className="dashboard-ordertext order-details">{details}</p>
        </div>
    );
};

const DashboardContainer = ({ children }) => {
    return <div className="dashboard-container">{children}</div>;
};

const DashboardContainerTitle = ({ title }) => {
    return <h2 className="dashboard-container-title">{title}</h2>;
};

const PrimaryButton = ({ text, color = "Blue" }) => {
    return (
        <button className="dashboard-button" style={{ backgroundColor: color }}>
            {text}
        </button>
    );
};

export default Dashboard;