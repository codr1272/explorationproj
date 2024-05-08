import NotificationService from "../services/NotificationService";

const deleteDZCatalog = async (uuid, length, work_uuid, expldz_uuid) => {
  try {
    if (uuid !== null && uuid !== undefined) { 
      const elementsResponse = await fetch(
        `http://localhost:3001/dz/elements/${uuid}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!elementsResponse.ok) {
        NotificationService.showErrorNotification(
          "Дані не видалені з таблиці elements"
        );
        return;
      }
    }

    const explDzResponse = await fetch(
      `http://localhost:3001/dz/expl_dz/${uuid || expldz_uuid}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!explDzResponse.ok) {
      NotificationService.showErrorNotification(
        "Дані не видалені з таблиці expl_dz"
      );
      return;
    }

    if (length === 1) {
      const workTableResponse = await fetch(
        `http://localhost:3001/dz/work_table/${work_uuid}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!workTableResponse.ok) {
        NotificationService.showErrorNotification(
          "Дані не видалені з таблиці work_table"
        );
        return;
      }
    }
  } catch (error) {
    console.error("Error deleting records:", error);
    NotificationService.showErrorNotification("Помилка при видаленні записів");
  }
};

export { deleteDZCatalog };


