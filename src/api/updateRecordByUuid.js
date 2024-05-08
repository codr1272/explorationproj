import NotificationService from "../services/NotificationService";

const updateRecordByUuid = async (uuid, updatedData) => {
  try {
    const workTableResponse = await fetch(
      `http://localhost:3001/work_table/${uuid}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      }
    );

    if (!workTableResponse.ok) {
      NotificationService.showErrorNotification("Дані не оновлені");
      return;
    }

    NotificationService.showSuccessNotification("Дані успішно оновлені");
  } catch (error) {
    console.error("Error updating record:", error);
  }
};

export { updateRecordByUuid };
