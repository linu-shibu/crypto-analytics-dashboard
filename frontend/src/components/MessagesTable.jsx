// src/components/MessagesTable.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

export default function MessagesTable() {
    const [messages, setMessages] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [sortBy, setSortBy] = useState("timestamp");
    const [order, setOrder] = useState("desc"); // "asc" or "desc"
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [isFetching, setIsFetching] = useState(false);
    const [highlightedIds, setHighlightedIds] = useState(new Set());
    const [newMessageAlert, setNewMessageAlert] = useState(false);

    const loaderRef = useRef(null);

    // refs to hold the latest values (used inside SSE handler without re-subscribing)
    const pageRef = useRef(page);
    const orderRef = useRef(order);
    const sizeRef = useRef(size);

    useEffect(() => { pageRef.current = page; }, [page]);
    useEffect(() => { orderRef.current = order; }, [order]);
    useEffect(() => { sizeRef.current = size; }, [size]);

    const fetchMessages = async (targetPage = 0, replace = false) => {
        setIsFetching(true);
        try {
            const res = await axios.get("http://localhost:8080/api/messages", {
                params: {
                    page: targetPage,
                    size,
                    sortBy,
                    order
                }
            });
            const data = res.data;
            if (replace || targetPage === 0) {
                setMessages(data.content);
            } else {
                // append older pages
                setMessages(prev => [...prev, ...data.content]);
            }
            setTotalPages(data.totalPages ?? 0);
            setTotalElements(data.totalElements ?? 0);
        } catch (err) {
            console.error("Error fetching messages:", err);
        } finally {
            setIsFetching(false);
        }
    };

    // Initial load and when sortBy/order/size changes -> reset page to 0 and fetch
    useEffect(() => {
        setPage(0);
        fetchMessages(0, true);
        // hide any new messages alert when changing sorting/size
        setNewMessageAlert(false);
    }, [sortBy, order, size]);

    // load additional pages when page increments (page > 0)
    useEffect(() => {
        if (page === 0) return;
        fetchMessages(page, false);
    }, [page]);

    // SSE subscription: subscribe once on mount
    useEffect(() => {
        const es = new EventSource("http://localhost:8080/api/stream");

        es.onmessage = (event) => {
            try {
                const incoming = JSON.parse(event.data);
                // basic validation
                if (!incoming || !incoming.id) {
                    // If backend emits plain text or lacks id, log and ignore
                    console.warn("SSE: received invalid payload", event.data);
                    return;
                }

                // If user is on page 0 and ordering is DESC (latest-first), prepend
                if (pageRef.current === 0 && orderRef.current.toLowerCase() === "desc") {
                    setMessages(prev => {
                        // avoid duplicates
                        const exists = prev.some(m => m.id === incoming.id);
                        if (exists) return prev;
                        const next = [incoming, ...prev];
                        // keep only 'size' items on top page
                        return next.slice(0, sizeRef.current);
                    });

                    // highlight id
                    setHighlightedIds(prev => {
                        const copy = new Set(prev);
                        copy.add(incoming.id);
                        return copy;
                    });

                    // remove highlight after 5s
                    setTimeout(() => {
                        setHighlightedIds(prev => {
                            const copy = new Set(prev);
                            copy.delete(incoming.id);
                            return copy;
                        });
                    }, 5000);

                } else {
                    // user is not on page 0 -> show alert so they can manually refresh/go to page 0
                    setNewMessageAlert(true);
                }
            } catch (err) {
                console.error("SSE parse error:", err, "raw:", event.data);
            }
        };

        es.onerror = (err) => {
            console.error("SSE connection error:", err);
            // keep it open or implement reconnect logic as desired
        };

        return () => {
            es.close();
        };
    }, []); // empty deps -> subscribe once only

    // IntersectionObserver to implement infinite scroll
    const handleObserver = useCallback((entries) => {
        const target = entries[0];
        if (target.isIntersecting && !isFetching && page < totalPages - 1) {
            setPage(prev => prev + 1);
        }
    }, [isFetching, page, totalPages]);

    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: "200px",
            threshold: 0.1
        });
        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => {
            if (loaderRef.current) observer.unobserve(loaderRef.current);
        };
    }, [handleObserver]);

    // Sorting toggle handler
    const toggleSort = (field) => {
        if (sortBy === field) {
            setOrder(prev => prev === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            // default to DESC (latest first) when switching to timestamp
            setOrder("desc");
        }
        // page reset is handled by effect above
    };

    const handlePageSizeChange = (evt) => {
        setSize(Number(evt.target.value));
    };

    const gotoLatest = () => {
        setPage(0);
        setNewMessageAlert(false);
        fetchMessages(0, true);
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">📡 Real-Time Messages</h2>

                {newMessageAlert && (
                    <button
                        onClick={gotoLatest}
                        className="bg-blue-600 text-white px-3 py-1 rounded shadow"
                    >
                        New messages — go to latest
                    </button>
                )}
            </div>

            <div className="overflow-hidden rounded-lg shadow">
                <table className="min-w-full bg-white">
                    <thead>
                    <tr className="bg-gray-50 text-left">
                        <th
                            className="px-6 py-3 cursor-pointer"
                            onClick={() => toggleSort("timestamp")}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-700">Timestamp</span>
                                <span className="text-xs text-gray-500">{order === "desc" ? "↓" : "↑"}</span>
                            </div>
                        </th>
                        <th className="px-6 py-3">
                            <div className="text-sm font-medium text-gray-700">Content</div>
                        </th>
                    </tr>
                    </thead>

                    <tbody>
                    {messages.map((msg) => (
                        <tr
                            key={msg.id}
                            className={`border-b transition-colors duration-700 ${
                                highlightedIds.has(msg.id) ? "bg-yellow-200" : "hover:bg-gray-50"
                            }`}
                        >
                            <td className="px-6 py-4 text-sm text-gray-700">{msg.timestamp}</td>
                            <td className="px-6 py-4 text-sm text-gray-800">{msg.content}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between mt-4 gap-4">
                <div className="text-sm text-gray-600">Total: {totalElements}</div>

                <div className="flex items-center gap-3">
                    <label className="text-sm text-gray-700">Rows:</label>
                    <select
                        value={size}
                        onChange={handlePageSizeChange}
                        className="border px-2 py-1 rounded"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                </div>
            </div>

            {/* loader sentinel for infinite scroll */}
            <div ref={loaderRef} className="text-center py-4 text-gray-500">
                {isFetching ? "Loading..." : page < totalPages - 1 ? "Scroll to load more" : "No more messages"}
            </div>
        </div>
    );
}
