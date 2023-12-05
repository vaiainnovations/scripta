import { defineStore } from "pinia";
import { registerModuleHMR } from "~~/core/store";

interface Notification {
    id: number;
    title: string;
    body: string;
    icon: string;
    duration: number;
}

export const useNotificationStore = defineStore({
  id: "NotificationStore",
  state: () => ({
    lastId: 0,
    queue: [] as Notification[]
  }),
  actions: {
    /**
     * Display a notification
     * @param title Notification title
     * @param description Notification description
     * @param duration Notification duration in seconds
     * @param icon Notification icon path
     */
    push (title: string, body: string, duration: number, icon: string) {
      const id = this.lastId + 1;
      this.lastId = id;
      const notification = {
        id,
        body,
        icon,
        title,
        duration
      };
      this.queue.push(notification);
      if (duration > 0) {
        setTimeout(() => {
          this.close(notification.id);
        }, duration * 1000);
      }
    },
    close (id: number) {
      this.queue = this.queue.filter(n => n.id !== id);
    },
    /**
     * Display an error notification
     * @param title Error title
     * @param description Error description
     * @param duration Error notification duration in seconds
     */
    error (title: string, description: string, duration = 10) {
      this.push(title, description, duration, "/icons/linear/danger.svg");
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useNotificationStore);
