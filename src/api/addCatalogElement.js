import NotificationService from "../services/NotificationService";

const addCatalogElement = async (uuid, newElement) => {
  try {
    const addResponse = await fetch(
      `http://localhost:3001/catalog/elements/${uuid}`,
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newElement),
      }
    );

    if (!addResponse.ok) {
      NotificationService.showErrorNotification("Error adding element record");
      return;
    }
  } catch (error) {
    console.error("Error add record:", error);
  }
};

export { addCatalogElement };
