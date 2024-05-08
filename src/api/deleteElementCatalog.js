import NotificationService from "../services/NotificationService";

const deleteElementCatalog = async (id_elmts) => {
  try {
    const elementsResponse = await fetch(
      `http://localhost:3001/catalog/elements/${id_elmts}`,
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

  } catch (error) {
    console.error("Error deleting records:", error);
    NotificationService.showErrorNotification("Помилка при видаленні записів");
  }
};

export { deleteElementCatalog };
