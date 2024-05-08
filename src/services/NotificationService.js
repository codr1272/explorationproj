import { NotificationManager } from "react-notifications";

class NotificationService {
  static showSuccessNotification(message) {
    NotificationManager.success(message);
  }

  static showErrorNotification(message) {
    NotificationManager.error(message);
  }

  static showWarningNotification(message) {
    NotificationManager.warning(message);
  }

  static showInfoNotification(message) {
    NotificationManager.info(message);
  }
}

export default NotificationService;
