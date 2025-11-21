import React, { useState } from "react";
import { db } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export default function TestFirestore() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleClick = async () => {
    setLoading(true);
    setMsg("");
    try {
      await addDoc(collection(db, "users"), {
        username: "TestUser",
        email: "test@example.com",
        password: "123456",
        createdAt: new Date(),
      });
      setMsg("✅ Data added successfully!");
    } catch (err) {
      console.error("Error adding document: ", err);
      setMsg("❌ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>Firestore Connection Test</h2>
      <button onClick={handleClick} disabled={loading}>
        {loading ? "Adding..." : "Add Test Data"}
      </button>
      <p>{msg}</p>
    </div>
  );
}
