import NotificationService from "../services/NotificationService";

const deleteRecordsByUuid = async (uuid) => {
  try {
    const elementsResponse = await fetch(
      `http://localhost:3001/elements/${uuid}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!elementsResponse.ok) {
      NotificationService.showErrorNotification("Дані не видалені");
      return;
    }

    const explDzResponse = await fetch(
      `http://localhost:3001/expl_dz/${uuid}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!explDzResponse.ok) {
      NotificationService.showErrorNotification("Дані не видалені");
      return;
    }

    const workTableResponse = await fetch(
      `http://localhost:3001/work_table/${uuid}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!workTableResponse.ok) {
      NotificationService.showErrorNotification("Дані не видалені");
      return;
    }

    NotificationService.showSuccessNotification("Запис успішно видалений!");
    window.location.reload();
  } catch (error) {
    console.error("Error deleting record:", error);
  }
};

export { deleteRecordsByUuid };
