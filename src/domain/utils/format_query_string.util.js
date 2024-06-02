function formattedStringAreasSql(areas) {
  let formattedAreasSQL = '';
  if (areas === null || areas === undefined || areas.length === 0) {
    return '';
  }

  for (let i = 0; i < areas.length; i++) {
    formattedAreasSQL += `N'${areas[i]}'`;
    if (i !== areas.length - 1) {
      formattedAreasSQL += ', ';
    }
  }

  return `(${formattedAreasSQL})`;
}

function formattedStringProvincesSql(provinces) {
  if (provinces === null || provinces === undefined || provinces.length === 0) {
    return '';
  }

  return `(${provinces.map((province) => `N'${province}'`).join(', ')})`;
}

function formattedStringDistrictsSql(districts) {
  if (districts === null || districts === undefined || districts.length === 0) {
    return '';
  }

  return `(${districts.map((district) => `N'${district}'`).join(', ')})`;
}

module.exports = {
  formattedStringAreasSql,
  formattedStringProvincesSql,
  formattedStringDistrictsSql,
};
