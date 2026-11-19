/**
 * updateVisibleColumns Function
 *
 * Calculates column visibility based on screen size and current screen width.
 */
export const updateVisibleColumns = (colViews, width) => {
  const screenSizeMap = {
    na: 0,
    xs: 585,
    s: 690,
    m: 775,
    l: 915,
    xl: 1140,
  };

  const safeWidth = typeof width === 'number' && Number.isFinite(width) ? width : 0;

  const showCols = {};

  if (!Array.isArray(colViews)) {
    return showCols;
  }

  colViews.forEach((col) => {
    if (!Array.isArray(col) || col.length !== 2) {
      return;
    }

    const [columnName, screenSize] = col;

    if (
      typeof columnName !== 'string' ||
      columnName.trim() === '' ||
      typeof screenSize !== 'string'
    ) {
      return;
    }

    const minScreenWidth = screenSizeMap[screenSize] || 0;

    if (screenSize === 'na') {
      showCols[columnName] = false;
    } else if (screenSize === 'xs') {
      showCols[columnName] = true;
    } else {
      showCols[columnName] = safeWidth >= minScreenWidth;
    }
  });

  return showCols;
};

export const getResponsiveColumnVisibility = (columnNames, colViews, width) => {
  if (!Array.isArray(columnNames)) {
    return {};
  }

  const showCols = updateVisibleColumns(colViews, width);

  return Object.fromEntries(
    columnNames
      .filter((columnName) => typeof columnName === 'string' && columnName.trim() !== '')
      .map((columnName) => [columnName, showCols[columnName]]),
  );
};
