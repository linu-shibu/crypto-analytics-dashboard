import axios from "axios";

const API_URL = "http://localhost:8080/api/messages";

export const getAllMessages = () => axios.get(API_URL);
export const searchMessages = (keyword) => axios.get(`${API_URL}/search?keyword=${keyword}`);
export const getMessagesBySender = (sender) => axios.get(`${API_URL}/sender/${sender}`);
