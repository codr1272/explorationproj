import React, { useState, useEffect } from "react";
import DraggablePopup from "../DraggablePopup/DraggablePopup";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Input from "../Input/Input";


const FormAddElements = ({
  handleRemoveElements,
  handleSubmitElements,
  handleChange,
  invalidInputs
}) => {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3001/dict_elmnts");
      const data = await response.json();
      setElements(data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  return (
    <DraggablePopup>
      <div>
        <label className="block-label">Додати елементи</label>
        <form className="form form-info">
          <div className="form__group">
            <label className="form-input_title">Елемент</label>
            <select
              className={`form__input form__input-select ${invalidInputs.includes("element") ? "has-error" : ""}`}
              name="element"
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
              <ErrorMessage errorMessage={"Оберіть елемент з переліку"} />
            )}
          </div>
          <div className="form__group">
            <label className="form-input_title">Кількість елементів</label>
            <Input
              type="number"
              name="quantity"
              className={`form__input ${invalidInputs.includes("quantity") ? "has-error" : ""}`}
              onChange={handleChange}
              min="1"
              pattern="[1-9][0-9]*"
              errorMessage={"Введіть правильну кількість елементів"}
              hasError={invalidInputs.includes("quantity")}
            />
          </div>

          <div className="form__button-container">
            <button className="form__button" onClick={handleSubmitElements}>
              Додати елементи
            </button>
            <button
              className="form__button button-escape"
              onClick={handleRemoveElements}
            >
              Скасувати
            </button>
          </div>
        </form>
      </div>
    </DraggablePopup>
  );
};

export default FormAddElements;