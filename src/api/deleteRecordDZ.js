import NotificationService from "../services/NotificationService";

const deleteRecordDZ = async (id) => {
  try {
    const deleteResponse = await fetch(
      `http://localhost:3001/dz/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!deleteResponse.ok) {
      NotificationService.showErrorNotification("Error deleting DZ record");
      return;
    }

    const result = await deleteResponse.json();
    NotificationService.showSuccessNotification("Record deleted successfully", result);
  } catch (error) {
    console.error("Error deleting record:", error);
  }
};

export { deleteRecordDZ };
