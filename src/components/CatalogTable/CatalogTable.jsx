import React, { useState, useEffect } from 'react';
import './styles.scss';
import SweetPagination from "sweetpagination";
import { deleteRecordsByUuid } from '../../api/deleteRecordByUuid';

import { BeatLoader } from 'react-spinners';
import DeleteSVG from '../../img/delete_icon';
import AdditionalInfo from './AdditionalInfo';
import ArrowDown from '../../img/ArrowDown';
import ArrowUp from '../../img/ArrowUp';
import ModalMessage from '../ModalMessage/ModalMessage';

import { deleteDZCatalog } from '../../api/deleteDZCatalog';
import { deleteElementCatalog } from '../../api/deleteElementCatalog';
import { updateElementsData } from '../../api/updateElementsData';

const CatalogTable = React.memo(({ user }) => {
  const [catalogData, setCatalogData] = useState([]);
  const [sortOrder, setSortOrder] = useState({
    field: null,
    ascending: true,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [elementsCatalog, setElementsCatalog] = useState(null);
  const [clickedRow, setClickedRow] = useState(null);
  const [arrowDownActive, setArrowDownActive] = useState(true);
  const [arrowUpActive, setArrowUpActive] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedRowUuid, setSelectedRowUuid] = useState(null);

  const [editingElementRow, setEditingElementRow] = useState(null);
  const [editedElementData, setEditedElementData] = useState({});

  const [currentPageData, setCurrentPageData] = useState([]);

  const fetchDataFromDB = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/catalog/work_table?pers_work=${user}`);
      const data = await response.json();
      setCatalogData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  useEffect(() => {
    fetchDataFromDB();
  }, [user]);

  const handleDeleteClick = (rowUuid) => {
    setSelectedRowUuid(rowUuid);
    setShowCancelModal(true);
  };

  const handleCancelConfirmed = async (rowUuid) => {
    try {
      await deleteRecordsByUuid(rowUuid);
      fetchDataFromDB();
    } catch (error) {
      console.error('Error deleting record:', error);
    } finally {
      setShowCancelModal(false);
      setSelectedRowUuid(null);
    }
  };

  const handleCancelRejected = () => {
    setShowCancelModal(false);
    setSelectedRowUuid(null);
  };

  const handleDzDelete = async (uuid, length, work_uuid, expldz_uuid) => {
    await deleteDZCatalog(uuid, length, work_uuid, expldz_uuid || uuid);
    fetchDataFromDB();
    handleRowClick(clickedRow);
  };

  const handleElementDelete = async (uuid) => {
    await deleteElementCatalog(uuid);
    fetchDataFromDB();
    handleRowClick(clickedRow);
  }

  const formatDate = (originalDate) => {
    const dateObject = new Date(originalDate);
    const day = dateObject.getDate().toString().padStart(2, '0');
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObject.getFullYear();
    const hours = dateObject.getHours().toString().padStart(2, '0');
    const minutes = dateObject.getMinutes().toString().padStart(2, '0');

    return `${day}.${month}.${year} ${hours}:${minutes}`;
  };

  const handleSort = (field) => {
    setSortOrder({
      field,
      ascending: sortOrder.field === field ? !sortOrder.ascending : true,
    });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleRowClick = async (row) => {
    try {
      const response = await fetch(`http://localhost:3001/catalog/elements?uuid=${row.uuid}`);
      const data = await response.json();

      setElementsCatalog(data);
      setClickedRow(row);
      setArrowUpActive(true);
      setArrowDownActive(false);
    } catch (error) {
      console.error('Error updating data', error);
    }
  }

  const filteredData = currentPageData.filter((row) => {
    const lowerCaseQuery = searchQuery.toLowerCase();

    return Object.entries(row).some(([key, value]) => {
      const lowerCaseValue = value ? value.toString().toLowerCase() : '';

      switch (key) {
        case 'cdate':
          if (!isNaN(new Date(value).getTime())) {
            const formattedDate = formatDate(value);
            return formattedDate.includes(lowerCaseQuery);
          }
          return false;

        case 'is_doc':
          return lowerCaseQuery === '' || (lowerCaseQuery === '+' && value) || (lowerCaseQuery === '-' && !value);

        case 'address':
        case 'type_work':
          return lowerCaseValue.includes(lowerCaseQuery) || lowerCaseQuery === '';

        case 'id_doc':
          return lowerCaseValue.includes(lowerCaseQuery) || lowerCaseQuery === 'не документ';

        default:
          return false;
      }
    });
  });


  const sortedData = filteredData.slice().sort((a, b) => {
    const aValue = sortOrder.field ? a[sortOrder.field] : null;
    const bValue = sortOrder.field ? b[sortOrder.field] : null;

    if (aValue === bValue) {
      return 0;
    }

    if (sortOrder.ascending) {
      return aValue < bValue ? -1 : 1;
    } else {
      return aValue > bValue ? -1 : 1;
    }
  });

  const handleArrowClickCatalog = () => {
    setElementsCatalog(null);
    setClickedRow(null);
    setArrowDownActive(true);
    setArrowUpActive(false);
  };

  const handleArrowDownClickCatalog = (row) => {
    handleRowClick(row);
    setArrowUpActive(true);
    setArrowDownActive(false);
  };

  const handleUpdateElements = async () => {
    if (
      editedElementData.name_elmns === elementsCatalog.find(data => data.id_elmts === editedElementData.id_elmts)?.name_elmns &&
      editedElementData.cnt_elmnt === elementsCatalog.find(data => data.id_elmts === editedElementData.id_elmts)?.cnt_elmnt
    ) {
      setEditingElementRow(null);
      setEditedElementData({});
      handleRowClick(clickedRow);
      return;
    }
    try {
      const updatePayload = {
        element: editedElementData.name_elmns,
        quantity: editedElementData.cnt_elmnt,
      };
      await updateElementsData(editedElementData.id_elmts, updatePayload);
      setEditingElementRow(null);
      setEditedElementData({});
      handleRowClick(clickedRow);
    } catch (error) {
      console.error('Error updating data', error);
    }
  };

  return (
    <div className='catalogTable__container'>
      <label className='catalogTable__title'>{`Операції користувача `}
        <input
          type="text"
          className='catalogTable__search'
          placeholder="Пошук"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </label>
      <table className='catalogTable'>
        <thead>
          <tr className='catalogTable__tr'>
            <th
              className={`catalogTable__th ${sortOrder.field === 'address' ? `catalogTable__th-${sortOrder.ascending ? 'asc' : 'desc'}` : ''}`}
              onClick={() => handleSort('address')}
            >
              Назва вулиці
            </th>
            <th
              className={`catalogTable__th ${sortOrder.field === 'id_doc' ? `catalogTable__th-${sortOrder.ascending ? 'asc' : 'desc'}` : ''}`}
              onClick={() => handleSort('id_doc')}
            >
              ID документа
            </th>
            <th
              className={`catalogTable__th ${sortOrder.field === 'type_work' ? `catalogTable__th-${sortOrder.ascending ? 'asc' : 'desc'}` : ''}`}
              onClick={() => handleSort('type_work')}
            >
              Тип операції
            </th>
            <th
              className={`catalogTable__th ${sortOrder.field === 'cdate' ? `catalogTable__th-${sortOrder.ascending ? 'asc' : 'desc'}` : ''}`}
              onClick={() => handleSort('cdate')}
            >
              Дата роботи
            </th>
            <th className={`catalogTable__th catalogTable__th-delete`}></th>
          </tr>
        </thead>
        <tbody>
          {sortedData.length > 0 ? (
            sortedData.map((row, index) => (
              <React.Fragment key={index}>
                <tr
                  key={index}
                  className={`catalogTable__tr ${clickedRow && clickedRow.id_wrk_tbl === row.id_wrk_tbl && arrowUpActive ? 'clicked catalogTable__tr-header' : ''}`}
                >
                  <td className='catalogTable__td' onClick={() => handleRowClick(row)}>
                    <div className="catalogTable__td-title">
                      {row.address}
                    </div>
                  </td>
                  <td className='catalogTable__td' onClick={() => handleRowClick(row)}>
                  <div className="catalogTable__td-title">{row.id_doc ? row.id_doc : 'Не документ'}</div>
                  </td>
                  <td className='catalogTable__td' onClick={() => handleRowClick(row)}>
                  <div className="catalogTable__td-title">{row.type_work}</div>
                  </td>
                  <td className='catalogTable__td' onClick={() => handleRowClick(row)}>
                  <div className="catalogTable__td-title">{formatDate(row.cdate)}</div>
                  </td>
                  <td className='catalogTable__td catalogTable__td-edit'>
                    <ArrowDown
                      onClick={() => handleArrowDownClickCatalog(row)}
                      arrowDownActive={arrowDownActive}
                    />
                    {clickedRow && clickedRow.uuid === row.uuid &&
                      <ArrowUp
                        onClick={handleArrowClickCatalog}
                        arrowUpActive={arrowUpActive}
                      />}
                  </td>
                  <td className='catalogTable__td catalogTable__td-edit'>
                    <div className="iconContainer">
                      <DeleteSVG onClick={() => handleDeleteClick(row.uuid)} />
                    </div>
                  </td>
                </tr>
                {clickedRow && clickedRow.uuid === row.uuid && (
                  <tr>
                    <td colSpan="6" className='catalogTable-additionalInfo'>
                      <AdditionalInfo
                        dataList={elementsCatalog}
                        formatDate={formatDate}
                        handleDzDelete={handleDzDelete}
                        handleElementDelete={handleElementDelete}
                        editingElementRow={editingElementRow}
                        editedElementData={editedElementData}
                        setEditingElementRow={setEditingElementRow}
                        setEditedElementData={setEditedElementData}
                        handleUpdateElements={handleUpdateElements}
                        setElementsCatalog={setElementsCatalog}
                        clickedRowDZ={clickedRow}
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="6">
                <span className='catalogTable__user'>{user.length > 0 ? 'Операцій не знайдено' : "Користувач не залогінений"}</span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <SweetPagination
        currentPageData={setCurrentPageData}
        dataPerPage={12}
        getData={catalogData}
        navigation={true}
      />
      {loading && (
        <div className={`loader-overlay ${loading ? 'show' : ''}`}>
          <BeatLoader color="#36d7b7" loading={true} size={50} />
        </div>
      )}

      <ModalMessage
        title="Ви дійсно хочете видалити Ваш запис?"
        butonText="Видалити запис"
        isOpen={showCancelModal}
        onConfirm={() => handleCancelConfirmed(selectedRowUuid)}
        onReject={handleCancelRejected}
      />
    </div>
  );
});

export default CatalogTable;
