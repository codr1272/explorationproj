import React, { useState, useEffect } from "react";
import NotificationService from '../../services/NotificationService';
import DraggablePopup from "../DraggablePopup/DraggablePopup";
import Input from "../Input/Input";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

const FormUpdateElementsInfo = ({
  selectedElement,
  setShowUpdateElements,
  allElementsData,
  setAllElementsData,
}) => {
  const [elements, setElements] = useState([]);
  const [formData, setFormData] = useState({
    element: '',
    quantity: ''
  });
  const [invalidInputs, setInvalidInputs] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateElements = (e) => {
    e.preventDefault();

    setInvalidInputs([]);

    if (!formData.element) {
      setInvalidInputs((prevInvalidInputs) => [...prevInvalidInputs, "element"]);
      NotificationService.showWarningNotification('Будь ласка, оберіть елемент');
      return;
    }

    if (formData.quantity === "" || formData.quantity <= 0) {
      setInvalidInputs((prevInvalidInputs) => [...prevInvalidInputs, "quantity"]);
      NotificationService.showWarningNotification('Кількість елементів повинна бути більше 0');
      return;
    }

    const elementId = selectedElement.id;

    const updatedData = allElementsData.map((element) => {
      if (element.id === elementId) {
        return { ...element, ...formData };
      }
      return element;
    });

    setAllElementsData(updatedData);
    setShowUpdateElements(false);

    NotificationService.showSuccessNotification('Данні успішно оновлені');
  };

  useEffect(() => {
    if (selectedElement) {
      setFormData((prevData) => ({
        ...prevData,
        element: selectedElement.name_elmns
      }));
    }
  }, [selectedElement]);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3001/dict_elmnts");
      const data = await response.json();
      setElements(data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const selectedElement = elements.find((element) => element.name_elmns === value);

    setFormData({
      ...formData,
      [name]: value,
      id_elmts: selectedElement ? selectedElement.id_elmts : ''
    });
  };


  const handleEscapeClick = () => {
    setShowUpdateElements(false)
  }

  return (
    <DraggablePopup>
      <div>
        <label className="block-label">Оновити дані елемента</label>
        <form className="form form-info">
          <div className="form__group">
            <label className="form-input_title">Елемент</label>
            <select
              className="form__input form__input-select"
              name="element"
              value={formData.element}
              onChange={handleChange}
            >
              <option value="" selected hidden>Оберіть елемент</option>
              {elements.map((element) => (
                <option
                  key={element}
                  value={element}
                  className="form__input-option"
                >
                  {element}
                </option>
              ))}
            </select>
            {invalidInputs.includes("element") && (
              <ErrorMessage errorMessage={"Оберіть тип роботи з переліку"} />
            )}
          </div>
          <div className="form__group">
            <label className="form-input_title">Кількість елементів</label>
            <Input
              type="number"
              name="quantity"
              className={`form__input ${invalidInputs.includes("quantity") ? "has-error" : ""}`}
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              errorMessage={"Введіть кількість елементів"}
              hasError={invalidInputs.includes("quantity")}
            />
          </div>
          <div className="form__button-container">
            <button
              className="form__button"
              onClick={handleUpdateElements}
            >
              Оновити данні
            </button>
            <button
              className="form__button button-escape"
              onClick={handleEscapeClick}
            >
              Скасувати
            </button>
          </div>
        </form>
      </div>
    </DraggablePopup>

  );
};

export default FormUpdateElementsInfo;
