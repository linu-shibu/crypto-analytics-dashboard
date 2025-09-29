import { useEffect, useState } from "react";
import axios from "axios";

export default function MessagesTable() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/api/messages")
            .then(res => setMessages(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
            <tr className="bg-gray-200">
                <th className="border p-2">ID</th>
                <th className="border p-2">Content</th>
                <th className="border p-2">Timestamp</th>
            </tr>
            </thead>
            <tbody>
            {messages.map(msg => (
                <tr key={msg.id}>
                    <td className="border p-2">{msg.id}</td>
                    <td className="border p-2">{msg.content}</td>
                    <td className="border p-2">{new Date(msg.timestamp).toLocaleString()}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}
