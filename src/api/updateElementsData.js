import NotificationService from "../services/NotificationService";

const updateElementsData = async (id, updatedData) => {
  try {
    const elementsResponse = await fetch(
      `http://localhost:3001/catalog/elements/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      }
    );

    if (!elementsResponse.ok) {
      NotificationService.showErrorNotification("Дані не оновлені");
      return;
    }

    NotificationService.showSuccessNotification("Дані успішно оновлені");
  } catch (error) {
    console.error("Error updating record:", error);
  }
};

export { updateElementsData };
