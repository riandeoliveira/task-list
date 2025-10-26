import axios from "axios";

export const taskListApi = axios.create({
  baseURL: import.meta.env.VITE_TASK_LIST_API_URL,
});
