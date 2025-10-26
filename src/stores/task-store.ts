import { create } from "zustand";
import type { FilterType, Task } from "@/types/task";

type TaskStore = {
  filterType: FilterType;
  selectedTask: Task;
  tasks: Task[];
  totalTasks: number;
  resetSelectedTask(): void;
  setFilterType(filterType: FilterType): void;
  setSelectedTask(task: Task): void;
  setTasks(tasks: Task[]): void;
  setTotalTasks(total: number): void;
};

export const useTaskStore = create<TaskStore>()((set) => ({
  filterType: "all",

  selectedTask: {
    id: "",
    title: "",
    description: "",
    isCompleted: false,
    createdAt: "",
  },

  tasks: [],

  totalTasks: 0,

  resetSelectedTask() {
    set(() => ({
      selectedTask: {
        id: "",
        title: "",
        description: "",
        isCompleted: false,
        createdAt: "",
      },
    }));
  },

  setFilterType(filterType) {
    set(() => ({ filterType }));
  },

  setSelectedTask(task) {
    set(() => ({ selectedTask: task }));
  },

  setTasks(tasks) {
    set(() => ({ tasks }));
  },

  setTotalTasks(total) {
    set(() => ({ totalTasks: total }));
  },
}));
