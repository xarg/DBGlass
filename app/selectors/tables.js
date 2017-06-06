import _ from 'lodash';
import { createSelector } from 'reselect';
import { getFavoritesMap } from './favorites';

export const getTablesMap = ({ tables }) => tables.byId;
export const getTablesByIds = ({ tables }) => tables.allIds;
export const getTableNameSearchKey = ({ tables }) => tables.meta.tableNameSearchKey;

export const getTables = createSelector(
  [getTablesByIds, getTablesMap],
  (ids, map) => ids.map(id => map[id]),
);

export const getCurrentFavoriteId = ({ favorites }) => favorites.meta.currentFavoriteId;

export const getTablesQuantity = createSelector(
  [getCurrentFavoriteId, getFavoritesMap],
  (id, map) => {
    const tablesQuantity = id ?
      Object.values(map).filter(item => item.id === id)[0].tablesQuantity : 10;
    return [...Array(tablesQuantity).keys()];
  },
);

export const getFiltredTables = createSelector(
  [getTablesByIds, getTablesMap, getTableNameSearchKey],
  (ids, map, searchKey) => {
    const tablesList = ids.map(id => map[id]);
    const filtredTables = tablesList.filter(item => item.tableName.includes(searchKey));
    return searchKey
      ? filtredTables
      : tablesList;
  },
);

export const getTableId = ({ tables }) => tables.meta.currentTableId;
export const getCurrentTableFieldsIds = ({ tables }) =>
  tables.byId[tables.meta.currentTableId].fieldsIds;
export const getCurrentTableFields = ({ tables }) =>
  tables.byId[tables.meta.currentTableId].fields;

export const getTableFields = createSelector(
  [getCurrentTableFieldsIds, getCurrentTableFields],
  (ids, map) => ids ? ids.map(id => map[id].fieldName) : [],
);

export const getCurrentTableRowsIds = ({ tables }) =>
  tables.byId[tables.meta.currentTableId].rowsIds;
export const getCurrentTableRows = ({ tables }) =>
  tables.byId[tables.meta.currentTableId].rows;

export const getTableRows = createSelector(
  [getCurrentTableRowsIds, getCurrentTableRows, getCurrentTableFields],
  (ids, map, fields) => {
    if (!ids) {
      return [];
    }
    return ids.map(id => {
      const currentRow = map[id];
      return Object.values(fields).map(field => currentRow[field.fieldName]);
    });
  },
);

export const getDataForMeasure = createSelector(
  [getTableId, getTablesMap],
  (id, map) => {
    if (id) {
      const data = Object.values(map).filter(item => item.id === id)[0].dataForMeasure;
      return data;
    }
    return {};
  },
);

export const getDataForMeasureCells = createSelector(
  [getTablesByIds, getTablesMap],
  (ids, map) => {
    const arr = [];
    ids.forEach(id => {
      if (Object.keys(map[id].dataForMeasure).length) {
        const data = Object.values(map[id].dataForMeasure).filter(item => !item.isMeasured);
        data.forEach(item => _.assign(item, { tableId: id }));
        arr.push(...data);
      }
    });
    return arr;
  },
);

export const getCurrentTableName = createSelector(
  [getTableId, getTablesMap],
  (id, map) => Object.values(map).filter(item => item.id === id)[0].tableName,
);

export const getCurrentTable = createSelector(
  [getTablesByIds, getTablesMap, getTableId],
  (ids, map, currentId) => ids.map(id => map[id]).filter(item => item.id === currentId),
);
