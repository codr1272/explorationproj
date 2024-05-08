import React, { useState, useEffect } from 'react';
import markerImage from '../../img';
import ModalMessage from '../ModalMessage/ModalMessage';
import CheckSVG from '../../img/CheckSVG';
import CloseSVG from '../../img/CloseSVG';
import AddIcon from '../../img/AddIcon';
import CatalogAddElements from '../CatalogAddElements/CatalogAddElements';
import NotificationService from "../../services/NotificationService";

const AdditionalInfo = ({
  dataList = [],
  formatDate,
  handleDzDelete,
  handleElementDelete,
  editingElementRow,
  editedElementData,
  setEditingElementRow,
  setEditedElementData,
  handleUpdateElements,
  setElementsCatalog,
  clickedRowDZ,
}) => {
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [clickedRow, setClickedRow] = useState(null);
  const [arrowUpActiveInfo, setArrowUpActiveInfo] = useState(true);

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteConfirmationData, setDeleteConfirmationData] = useState(null);

  const [namesElements, setNamesElements] = useState([]);
  const [showUpdateConfirmation, setShowUpdateConfirmation] = useState(false);

  const [showDeleteElementConfirmation, setShowDeleteElementConfirmation] = useState(false);
  const [deleteElementConfirmationData, setDeleteElementConfirmationData] = useState(null);
  const [showAddElementsForm, setShowElementsForm] = useState(false);
  const [filteredElementData, setFilteredElementData] = useState([]);

  const fetchNamesElements = async () => {
    try {
      const response = await fetch("http://localhost:3001/elementsNames");
      const data = await response.json();
      setNamesElements(data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchNamesElements();
  }, []);

  const handleRowClick = (expldz_uuid, index) => () => {
    const selectedData = dataList.find((data) => data.expldz_uuid === expldz_uuid);
    setSelectedRowData(selectedData);
    if (index !== null) {
      setClickedRow(index);
    }
    setArrowUpActiveInfo(true);
  };


  const uniqueDataList = Array.isArray(dataList)
    ? dataList.filter((data, index, self) =>
      index === self.findIndex((d) =>
        d.work_uuid === data.work_uuid &&
        d.element_uuid === data.element_uuid &&
        d.expldz_uuid === data.expldz_uuid
      ))
    : [];

  useEffect(() => {
    setFilteredElementData(dataList);
  }, [dataList]);

  const handleDeleteConfirmation = async () => {
    if (deleteConfirmationData) {
      await handleDzDelete(
        deleteConfirmationData.element_uuid,
        deleteConfirmationData.length,
        deleteConfirmationData.work_uuid,
        deleteConfirmationData.expldz_uuid,
      );
      setShowDeleteConfirmation(false);
      setDeleteConfirmationData(null);
    }
  };

  const handleDeleteElementConfirmation = async () => {
    if (deleteElementConfirmationData) {
      await handleElementDelete(deleteElementConfirmationData);
      setShowDeleteElementConfirmation(false);
      setDeleteElementConfirmationData(null);
    }
  };

  const handleUpdateConfirmation = async () => {
    await handleUpdateElements();
    setShowUpdateConfirmation(false);
  };

  const handleDoubleClick = async (element) => {
    if (!editingElementRow || editingElementRow === element.id_elmts) {
      setEditingElementRow(element.id_elmts);
      await fetchNamesElements();
      setEditedElementData({ ...element });
    } else {
      setEditingElementRow(element.id_elmts);
      setEditedElementData({ ...element });
    }
  };

  const handleCancelEdit = () => {
    setEditingElementRow(null);
    setEditedElementData({});
  };

  const handleShowElementsForm = (event) => {
    event.stopPropagation();
    setShowElementsForm(true);
  }

  const handleHIdeElementsForm = (event) => {
    event.stopPropagation();
    setShowElementsForm(false);
  }

  return (
    <div>
      <table className='catalogTable catalogTable_Additional'>
        <thead>
          <tr className={`catalogTable__tr ${clickedRow === null ? '' : 'clicked'}`}>
            <th className='catalogTable__th'>Умовний знак</th>
            <th className='catalogTable__th'>Номер знаку</th>
            <th className='catalogTable__th'>Форма знаку</th>
            <th className='catalogTable__th'>Дата створення</th>
            <th className='catalogTable__th'></th>
          </tr>
        </thead>
        <tbody>
          {uniqueDataList.map((data, index) => {
            const { num_dz, dz_form, expldz_uuid, expldzdate } = data;
            const imagePath = markerImage[num_dz];
            const rowClassName = clickedRow === index ? 'clicked' : '';
            return (
              <React.Fragment key={index}>
                <tr className={`catalogTable__tr ${rowClassName}`}>
                  <td className='catalogTable__td catalogTable__td-logo' onClick={handleRowClick(expldz_uuid, index)}>
                    {imagePath && <img src={imagePath} alt={`photoDz-${index}`} style={{ width: '30px', height: '30px'}} />}
                  </td>
                  <td className='catalogTable__td' onClick={handleRowClick(expldz_uuid, index)}>{num_dz}</td>
                  <td className='catalogTable__td' onClick={handleRowClick(expldz_uuid, index)}>{dz_form}</td>
                  <td className='catalogTable__td' onClick={handleRowClick(expldz_uuid, index)}>{formatDate(expldzdate)}</td>
                  <td className='catalogTable__td'>
                    <div className="iconContainer">
                      {<button
                        className="delete-icon"
                        onClick={() => {
                          setDeleteConfirmationData({
                            element_uuid: data.element_uuid,
                            length: uniqueDataList.length,
                            work_uuid: data.work_uuid,
                            expldz_uuid: data.expldz_uuid,
                          });
                          setShowDeleteConfirmation(true);
                        }}
                      >
                        X
                      </button>}
                    </div>
                  </td>
                </tr>
                {
                  selectedRowData && selectedRowData.expldz_uuid === expldz_uuid && arrowUpActiveInfo && (
                    <tr className='catalogTable__additional'>
                      <td colSpan="4" style={{padding: '0'}}>
                        <table className='catalogTable catalogTable_Additional catalogTable_Additional-info'>
                          <thead>
                            <tr className='catalogTable__tr'>
                              <th className='catalogTable__th'>Назва елементу</th>
                              <th className='catalogTable__th'>Кількість елементів</th>
                              <th className='catalogTable__th'>Дата додавання</th>
                              <th className='catalogTable__th'>
                                <div className="iconContainer">
                                  <AddIcon onClick={handleShowElementsForm} />
                                </div>
                              </th>
                            </tr>
                          </thead>
                          {filteredElementData.length !== 0 && filteredElementData.some(element => element.element_uuid !== null) ? (
                            <tbody>
                              {filteredElementData
                                .filter(element => element.element_uuid !== null)
                                .map((element, elementIndex) => (
                                  <tr key={elementIndex} className='catalogTable__tr'>
                                    <td className='catalogTable__td' onDoubleClick={() => handleDoubleClick(element)}>
                                      {editingElementRow === element.id_elmts && namesElements && namesElements.length > 0 ? (
                                        <select
                                          className="catalogTable__select"
                                          onChange={(e) => setEditedElementData({ ...editedElementData, name_elmns: e.target.value })}
                                          value={editedElementData.name_elmns || ''}
                                          style={{ cursor: 'pointer' }}
                                        >
                                          {namesElements.map((option) => (
                                            <option
                                              key={option.id_elm}
                                              value={option.name_elm}
                                              className="catalogTable__option"
                                            >
                                              {option.name_elm}
                                            </option>
                                          ))}
                                        </select>
                                      ) : element.name_elmns}
                                    </td>
                                    <td
                                      className='catalogTable__td'
                                      onDoubleClick={() => handleDoubleClick(element)}
                                    >
                                      {editingElementRow === element.id_elmts ? (
                                        <input
                                          type="text"
                                          className='catalogTable__input'
                                          value={editedElementData.cnt_elmnt || ''}
                                          pattern="[1-9][0-9]*"
                                          onChange={(e) => {
                                            const newValue = e.target.value;
                                            if (/^[1-9][0-9]*$/.test(newValue)) {
                                              setEditedElementData({ ...editedElementData, cnt_elmnt: newValue });
                                            } else {
                                              NotificationService.showWarningNotification('Будь ласка введіть коректне число!');
                                            }
                                          }}
                                        />
                                      ) :
                                        element.cnt_elmnt}
                                    </td>
                                    <td
                                      className='catalogTable__td'
                                      onDoubleClick={() => handleDoubleClick(element)}
                                    >
                                      {formatDate(element.elementdate)}
                                    </td>
                                    <td className='catalogTable__td'>
                                      {editingElementRow === element.id_elmts ? (
                                        <>
                                           <CheckSVG
                                            onClick={() => {
                                              if (editedElementData.name_elmns !== element.name_elmns || editedElementData.cnt_elmnt !== element.cnt_elmnt) {
                                                setShowUpdateConfirmation(true);
                                              }  else {
                                                handleUpdateElements();
                                              }
                                            }}
                                          >
                                          </CheckSVG>
                                          <CloseSVG onClick={() => handleCancelEdit()}></CloseSVG>
                                        </>
                                      ) : (
                                        <>
                                          <div className="iconContainer">
                                            <button
                                              className="delete-icon"
                                              onClick={() => {
                                                setDeleteElementConfirmationData(element.id_elmts);
                                                setShowDeleteElementConfirmation(true);
                                              }}
                                            >
                                              X
                                            </button>
                                          </div>
                                        </>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          ) : (
                            <tbody>
                              <tr>
                                <td colSpan="4" className='catalogTable__user'>
                                  {'Елементів не знайдено!'}
                                </td>
                              </tr>
                            </tbody>
                          )}
                        </table>
                      </td>
                    </tr>
                  )
                }
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      {showAddElementsForm &&
        <CatalogAddElements
          handleHIdeElementsForm={handleHIdeElementsForm}
          selectedRowData={selectedRowData}
          setShowElementsForm={setShowElementsForm}
          setElementsCatalog={setElementsCatalog}
          clickedRowDZ={clickedRowDZ}
          handleRowClick={handleRowClick}
          setFilteredElementData={setFilteredElementData}
        />}

      <ModalMessage
        title={uniqueDataList.length === 1 ? "Ви впевнені що хочете видалити запис?" : "Ви впевнені що хочете видалити ДЗ та елементи до нього?"}
        butonText="Видалити запис"
        isOpen={showDeleteConfirmation}
        onConfirm={handleDeleteConfirmation}
        onReject={() => {
          setShowDeleteConfirmation(false);
          setDeleteConfirmationData(null);
        }}
      />

      <ModalMessage
        title={'Ви впевнені що хочете оновити данні елементів?'}
        butonText="Оновити"
        isOpen={showUpdateConfirmation}
        onConfirm={() => handleUpdateConfirmation()}
        onReject={() => {
          setShowUpdateConfirmation(false);
        }}
      />

      <ModalMessage
        title={'Ви впевнені що хочете видалити елемент?'}
        butonText="Видалити елемент"
        isOpen={showDeleteElementConfirmation}
        onConfirm={() => handleDeleteElementConfirmation()}
        onReject={() => {
          setShowDeleteElementConfirmation(false);
        }}
      />
    </div >
  );
};

export default AdditionalInfo;
