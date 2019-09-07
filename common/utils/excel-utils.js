function applyAllBordersToCell(cell, type) {
  type = ['thin', 'double'].includes(type) ? type : 'thin';

  cell.border = {
    top: { style: type },
    right: { style: type },
    bottom: { style: type },
    left: { style: type },
  };
}

function applyBoldToCell(cell) {
  cell.style.font = { bold: true };
}

function applyVerticalAligmentMiddleToCell(cell) {
  cell.alignment = { vertical: 'middle' };
}

function applyHorizontalAligmentCenterToCell(cell) {
  cell.alignment = { horizontal: 'center' };
}

function applyBordersToCell(cell, borders, type) {
  borders = (typeof borders === 'object') ? borders : {};
  type = ['thin', 'double'].includes(type) ? type : 'thin';

  cell.border = {
    top: (borders.top === true) ? { style: type } : null,
    right: (borders.right === true) ? { style: type } : null,
    bottom: (borders.bottom === true) ? { style: type } : null,
    left: (borders.left === true) ? { style: type } : null,
  };
}


module.exports = {
  applyAllBordersToCell,
  applyBoldToCell,
  applyVerticalAligmentMiddleToCell,
  applyHorizontalAligmentCenterToCell,
  applyBordersToCell,
};
