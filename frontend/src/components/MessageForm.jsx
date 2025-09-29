import { useState } from "react";

function MessageForm({ onMessageSent }) {
    const [content, setContent] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) return;

        try {
            const response = await fetch("http://localhost:8080/api/publish", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content }),
            });

            if (response.ok) {
                setContent("");
                if (onMessageSent) onMessageSent(); // refresh table
            } else {
                console.error("Failed to send message");
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex space-x-2 mb-4">
            <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border rounded-lg p-2"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                Send
            </button>
        </form>
    );
}

export default MessageForm;
