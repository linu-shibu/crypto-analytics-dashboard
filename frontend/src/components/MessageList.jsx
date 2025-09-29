import { useEffect, useState } from "react";
import { getAllMessages } from "../services/messageService";

function MessageList() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        getAllMessages().then((res) => {
            setMessages(res.data);
        });
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Messages</h2>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2">ID</th>
                    <th className="border border-gray-300 px-4 py-2">Content</th>
                    <th className="border border-gray-300 px-4 py-2">Sender</th>
                    <th className="border border-gray-300 px-4 py-2">Timestamp</th>
                </tr>
                </thead>
                <tbody>
                {messages.map((msg) => (
                    <tr key={msg.id}>
                        <td className="border px-4 py-2">{msg.id}</td>
                        <td className="border px-4 py-2">{msg.content}</td>
                        <td className="border px-4 py-2">{msg.sender}</td>
                        <td className="border px-4 py-2">{msg.timestamp}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default MessageList;
