const createError = require('http-errors');
const excel = require('exceljs');
const stringify = require('csv-stringify');
const tempfile = require('tempfile');
const fs = require('fs');
const moment = require('moment');

const constants = require('../../common/constants/constants');
const excelUtils = require('../../common/utils/excel-utils');
const dataProvider = require('../../common/helpers/data-provider');

module.exports = function(app) {
  function deleteTempFile(file) {
    fs.unlink(file, function (err) {
      if (err) {
        console.error(err.toString());
        return;
      }

      console.warn('Temporary file ' + file + ' deleted.');
    });
  }


  app.get('/api/get-report', function(req, res, next) {
    if (!req.query.from || !req.query.to || !req.query.reportType) {
      return next(createError(400, 'Missing some parameters.'));
    }

    var from = new Date(req.query.from);
    var to = new Date(req.query.to);

    var reportType = ['UNIFIED', 'TABS', 'RAW_DATA', 'CSV'].includes(req.query.reportType)
      ? req.query.reportType
      : 'RAW_DATA';

    var costCenters = Array.isArray(req.query.costCenters)
      ? req.query.costCenters
      : [req.query.costCenters];

    var users = Array.isArray(req.query.users)
      ? req.query.users
      : [req.query.users];


    function parseData({ userMenus, orders }) {
      let parsedData = {};

      userMenus.forEach(function(userMenu) {
        const user = userMenu.user();
        const costCenter = user.costCenter();
        const discountPercent = (costCenter && costCenter.discountPercent) || 0;

        if (!parsedData[userMenu.userId]) {
          parsedData[userMenu.userId] = {
            user: {
              id: userMenu.userId,
              name: user.name,
              lastName: user.lastName,
              costCenter: costCenter,
              role: {
                name: user.roles().length ? user.roles()[0].name : ''
              }
            },
            meals: {},
          };
        }

        const dateKey = moment(userMenu.date).format('YYYY-MM-DD');

        if (!parsedData[userMenu.userId].meals[dateKey]) {
          parsedData[userMenu.userId].meals[dateKey] = {
            date: dateKey
          };
        }

        userMenu.menus().forEach(function(menu) {
          if (['breakfast', 'lunch', 'dinner'].includes(menu.meal().code)) {
            const menuOrder = orders.find((order) => (
              (order.menuId.toString() === menu.id.toString()) &&
              (order.userMenuId.toString() === userMenu.id.toString())
            ));

            const attendanceAt = (menuOrder && menuOrder.attendanceAt)
              ? moment(menuOrder.attendanceAt).utcOffset(-6).format('DD/MM/YYYY HH:mm')
              : null;

            const mealTime = menu.meal().code;
            const mealBasePrice = constants.MEALS_DEFAULT_PRICES[mealTime];
            const mealPercentCost = (1 - (discountPercent / 100));
            const mealCost = attendanceAt ? (mealBasePrice * mealPercentCost) : mealBasePrice;

            parsedData[userMenu.userId].meals[dateKey][mealTime] = {
              menu: menu.title,
              cost: parseFloat(mealCost.toFixed(2)),
              status: userMenu.status,
              attendanceAt: attendanceAt,
            };
          }
        });

        // If user has no meals for current date, refuse the date from data.
        if (
          !parsedData[userMenu.userId].meals[dateKey].breakfast
          && !parsedData[userMenu.userId].meals[dateKey].lunch
          && !parsedData[userMenu.userId].meals[dateKey].dinner
        ) {
          delete parsedData[userMenu.userId].meals[dateKey];
        }
      });

      return parsedData;
    }

    function prepareRawData(arrayData) {
      if (!Array.isArray(arrayData)) {
        throw Error('Invalid data provided.');
      }

      var username, costCenter;

      var mealTimeMap = {
        breakfast: 'Desayuno',
        lunch: 'Almuerzo',
        dinner: 'Cena',
      };

      var statusMap = {
        PENDING: 'Pendiente',
        SENT: 'Enviado',
        APPROVED: 'Aprobado',
        NOT_AVAILABLE: 'No disponible',
      };

      var rawData = [];

      arrayData.forEach(function(userData) {
        username = [userData.user.name, userData.user.lastName].join(' ');
        costCenter = userData.user.costCenter;

        Object.values(userData.meals).forEach(function(userDayMeals) {
          ['breakfast', 'lunch', 'dinner'].forEach(function(mealTime) {
            if (!userDayMeals[mealTime]) {
              return;
            }

            rawData.push({
              username: username,
              costCenter: costCenter.name,
              costCenterCode: costCenter.code,
              date: userDayMeals.date,
              mealTime: mealTimeMap[mealTime],
              menu: userDayMeals[mealTime].menu,
              status: statusMap[userDayMeals[mealTime].status],
              attendanceAt: userDayMeals[mealTime].attendanceAt,
              cost: userDayMeals[mealTime].cost,
            });
          });
         });
      });

      return rawData;
    }

    function printReportHeader(sheet, dates, mealTime) {
      mealTime = ['breakfast', 'lunch', 'dinner'].includes(mealTime) ? mealTime : null;

      sheet.addRow(['Empleado', 'Centro de costo']);
      sheet.mergeCells(1, 1, mealTime ? 2 : 3, 1);
      sheet.mergeCells(1, 2, mealTime ? 2 : 3, 2);

      excelUtils.applyVerticalAligmentMiddleToCell(sheet.getCell('A1'));
      excelUtils.applyVerticalAligmentMiddleToCell(sheet.getCell('B1'));

      excelUtils.applyBoldToCell(sheet.getCell('A1'));
      excelUtils.applyBoldToCell(sheet.getCell('B1'));

      excelUtils.applyAllBordersToCell(sheet.getCell('A1'));
      excelUtils.applyAllBordersToCell(sheet.getCell('B1'));

      sheet.getColumn(1).width = 25;
      sheet.getColumn(2).width = 20;

      if (!Array.isArray(dates) || !dates.length) {
        return;
      }

      // --------- PRINT DAYS ---------
      var col, cell;
      var datesRow = sheet.getRow(1);

      col = 3;
      dates.forEach(function(date) {
        cell = datesRow.getCell(col);

        cell.value = date;

        excelUtils.applyHorizontalAligmentCenterToCell(cell);
        excelUtils.applyBoldToCell(cell);
        excelUtils.applyAllBordersToCell(cell);

        sheet.mergeCells(1, col, 1, mealTime ? col + 2 : col + 8);

        col += mealTime ? 3 : 9;
      });

      // --------- PRINT LUCNH TIMES ---------
      if (!mealTime) {
        var mealTimesRow = sheet.getRow(2);

        col = 3;
        dates.forEach(function(date) {
          cell = mealTimesRow.getCell(col);

          cell.value = 'Desayuno';
          excelUtils.applyHorizontalAligmentCenterToCell(cell);
          excelUtils.applyBoldToCell(cell);
          excelUtils.applyAllBordersToCell(cell);

          sheet.mergeCells(2, col, 2, col + 2);
          col += 3;

          cell = mealTimesRow.getCell(col);

          cell.value = 'Almuerzo';
          excelUtils.applyHorizontalAligmentCenterToCell(cell);
          excelUtils.applyBoldToCell(cell);
          excelUtils.applyAllBordersToCell(cell);

          sheet.mergeCells(2, col, 2, col + 2);
          col += 3;

          cell = mealTimesRow.getCell(col);

          cell.value = 'Cena';
          excelUtils.applyHorizontalAligmentCenterToCell(cell);
          excelUtils.applyBoldToCell(cell);
          excelUtils.applyAllBordersToCell(cell);

          sheet.mergeCells(2, col, 2, col + 2);
          col += 3;
        });
      }

      // --------- PRINT MENUS ---------
      var menusRow = sheet.getRow(mealTime ? 2 : 3);

      col = 3;
      dates.forEach(function(date) {
        for (var i = 0; i < (mealTime ? 1 : 3); i++) {
          cell = menusRow.getCell(col);
          cell.value = 'Menu';
          excelUtils.applyHorizontalAligmentCenterToCell(cell);
          excelUtils.applyBoldToCell(cell);
          excelUtils.applyAllBordersToCell(cell);
          sheet.getColumn(col).width = 20;

          col += 1;

          cell = menusRow.getCell(col);
          cell.value = 'Estado';
          excelUtils.applyHorizontalAligmentCenterToCell(cell);
          excelUtils.applyBoldToCell(cell);
          excelUtils.applyAllBordersToCell(cell);

          col += 1;

          cell = menusRow.getCell(col);
          cell.value = 'Valor';
          excelUtils.applyHorizontalAligmentCenterToCell(cell);
          excelUtils.applyBoldToCell(cell);
          excelUtils.applyAllBordersToCell(cell);

          col += 1;
        }
      });
    }

    function printReportData(sheet, data, dates, mealTime) {
      data = Array.isArray(data) && data.length ? data : [];
      dates = Array.isArray(dates) && dates.length ? dates : [];
      mealTime = ['breakfast', 'lunch', 'dinner'].includes(mealTime) ? mealTime : null;

      var col;
      var row, cell;
      var userDayMeals, costCenter;
      var multiplier = mealTime ? 3 : 9;
      var startRow = mealTime ? 3 : 4;
      var statusMap = {
        PENDING: 'Pendiente',
        SENT: 'Enviado',
        APPROVED: 'Aprobado',
        NOT_AVAILABLE: 'No disponible',
      };

      // --------- PRINT DATA ---------
      data.forEach(function(userData, index) {
        costCenter =  userData.user.costCenter;

        row = sheet.getRow(startRow + index);
        col = 1;

        cell = row.getCell(col++);
        cell.value = [userData.user.name, userData.user.lastName].join(' ');

        cell = row.getCell(col++);
        cell.value = costCenter ? [costCenter.code, costCenter.name].join(' - ') : '';

        dates.forEach(function(date) {
          userDayMeals = userData.meals[date];

          if (!userDayMeals) {
            col += multiplier;

            return;
          }

          // Breakfast
          if (!mealTime || (mealTime === 'breakfast')) {
            if (userDayMeals.breakfast) {
              row.getCell(col++).value = userDayMeals.breakfast.menu;
              row.getCell(col++).value = statusMap[userDayMeals.breakfast.status];
              row.getCell(col++).value = userDayMeals.breakfast.cost;
            } else {
              col += 3;
            }
          }

          // Lunch
          if (!mealTime || (mealTime === 'lunch')) {
            if (userDayMeals.lunch) {
              row.getCell(col++).value = userDayMeals.lunch.menu;
              row.getCell(col++).value = statusMap[userDayMeals.lunch.status];
              row.getCell(col++).value = userDayMeals.lunch.cost;
            } else {
              col += 3;
            }
          }

          // Lunch
          if (!mealTime || (mealTime === 'dinner')) {
            if (userDayMeals.dinner) {
              row.getCell(col++).value = userDayMeals.dinner.menu;
              row.getCell(col++).value = statusMap[userDayMeals.dinner.status];
              row.getCell(col++).value = userDayMeals.dinner.cost;
            } else {
              col += 3;
            }
          }
        });
      });

      // --------- PRINT TOTALS ---------
      var breakfastTotal, lunchTotal, dinnerTotal;
      var grandTotal = 0;
      var lastRow = (mealTime ? 4 : 5) + data.length;

      totalsRow = sheet.getRow(lastRow);

      cell = totalsRow.getCell(1);
      cell.value = 'TOTALES';

      col = 5;
      dates.forEach(function(date) {
        // Breakfast total
        if (!mealTime || (mealTime === 'breakfast')) {
          breakfastTotal = data.reduce(function(sum, userData) {
            userDayMeals = userData.meals[date];

            if (userDayMeals && userDayMeals.breakfast) {
              sum += userDayMeals.breakfast.cost;
            }

            return sum;
          }, 0);

          cell = totalsRow.getCell(col);
          cell.value = breakfastTotal;
          col += 3;

          grandTotal += breakfastTotal;
        }

        // Lunch total
        if (!mealTime || (mealTime === 'lunch')) {
          lunchTotal = data.reduce(function(sum, userData) {
            userDayMeals = userData.meals[date];

            if (userDayMeals && userDayMeals.lunch) {
              sum += userDayMeals.lunch.cost;
            }

            return sum;
          }, 0);

          cell = totalsRow.getCell(col);
          cell.value = lunchTotal;
          col += 3;

          grandTotal += lunchTotal;
        }

        // Dinner total
        if (!mealTime || (mealTime === 'dinner')) {
          dinnerTotal = data.reduce(function(sum, userData) {
            userDayMeals = userData.meals[date];

            if (userDayMeals && userDayMeals.dinner) {
              sum += userDayMeals.dinner.cost;
            }

            return sum;
          }, 0);

          cell = totalsRow.getCell(col);
          cell.value = dinnerTotal;
          col += 3;

          grandTotal += dinnerTotal;
        }
      });

      // Apply border and bold to totals row.
      for (var i = 1; i <= 4 + dates.length * multiplier; i++) {
        cell = totalsRow.getCell(i);

        excelUtils.applyBordersToCell(cell, { top: true, bottom: true }, 'double');
        excelUtils.applyBoldToCell(cell);
      }

      // Print grand total.
      cell = totalsRow.getCell(3 + dates.length * multiplier);
      cell.value = grandTotal;
      excelUtils.applyBordersToCell(cell, { left: true, top: true, bottom: true }, 'double');

      // Merge grand total cells.
      sheet.mergeCells(lastRow, 3 + dates.length * multiplier, lastRow, 4 + dates.length * multiplier);
    }

    function printReportRawData(sheet, data) {
      if (!Array.isArray(data)) {
        throw Error('Invalid data provided.');
      }

      sheet.columns = [
        { header: 'Empleado', width: 30 },
        { header: 'Cod. Centro Costo', width: 18 },
        { header: 'Centro Costo', width: 20 },
        { header: 'Fecha', width: 15 },
        { header: 'Tiempo', width: 15 },
        { header: 'Menu', width: 20 },
        { header: 'Estado', width: 15 },
        { header: 'Asistencia', width: 12 },
        { header: 'Fecha Asistencia', width: 20 },
        { header: 'Valor', width: 15 },
      ];

      sheet.getRow(1).eachCell(function(cell) {
        excelUtils.applyAllBordersToCell(cell);
        excelUtils.applyBoldToCell(cell);
      });

      var row, col, cell;
      var grandTotal = 0;
      var line = 2;

      data.forEach(function(userMenuData) {
        row = sheet.getRow(line);
        col = 1;

        cell = row.getCell(col++);
        cell.value = userMenuData.username;

        cell = row.getCell(col++);
        cell.value = userMenuData.costCenterCode;

        cell = row.getCell(col++);
        cell.value = userMenuData.costCenter;

        cell = row.getCell(col++);
        cell.value = userMenuData.date;

        cell = row.getCell(col++);
        cell.value = userMenuData.mealTime;

        cell = row.getCell(col++);
        cell.value = userMenuData.menu;

        cell = row.getCell(col++);
        cell.value = userMenuData.status;

        cell = row.getCell(col++);
        cell.value = userMenuData.attendanceAt ? 'Si' : 'No';

        cell = row.getCell(col++);
        cell.value = userMenuData.attendanceAt;

        cell = row.getCell(col++);
        cell.value = userMenuData.cost;

        grandTotal += userMenuData.cost;

        line +=1;
      });

      var totalsRow = sheet.getRow(++line);

      cell = totalsRow.getCell(1);
      cell.value = 'TOTAL';

      // Print grand total.
      cell = totalsRow.getCell(sheet.columns.length);
      cell.value = grandTotal;

      // Apply border and bold to totals row.
      for (var i = 1; i <= sheet.columns.length; i++) {
        cell = totalsRow.getCell(i);

        excelUtils.applyBordersToCell(cell, { top: true, bottom: true }, 'double');
        excelUtils.applyBoldToCell(cell);
      }
    }

    function createExcelReportWithData(arrayData, reportType) {
      if (!Array.isArray(arrayData)) {
        throw Error('Invalid data provided.');
      }

      var workbook = new excel.Workbook();
      var sheet, dates;

      dates = arrayData.reduce(function(carry, userData) {
        Object.keys(userData.meals).forEach(function(userMenuDay) {
          if (!carry.includes(userMenuDay)) {
            carry.push(userMenuDay);
          }
        });

        return carry;
      }, []);

      if (reportType === 'UNIFIED') {
        sheet = workbook.addWorksheet('Report');
        sheet.views = [
          { state: 'frozen', xSplit: 1, ySplit: 3 }
        ];

        printReportHeader(sheet, dates);
        printReportData(sheet, arrayData, dates);
      } else if (reportType === 'TABS') {
        sheet = workbook.addWorksheet('Desayuno');
        sheet.views = [
          { state: 'frozen', xSplit: 1, ySplit: 2 }
        ];

        printReportHeader(sheet, dates, 'breakfast');
        printReportData(sheet, arrayData, dates, 'breakfast');

        sheet = workbook.addWorksheet('Almuerzo');
        sheet.views = [
          { state: 'frozen', xSplit: 1, ySplit: 2 }
        ];

        printReportHeader(sheet, dates, 'lunch');
        printReportData(sheet, arrayData, dates, 'lunch');

        sheet = workbook.addWorksheet('Cena');
        sheet.views = [
          { state: 'frozen', xSplit: 1, ySplit: 2 }
        ];

        printReportHeader(sheet, dates, 'dinner');
        printReportData(sheet, arrayData, dates, 'dinner');
      } else if (reportType === 'RAW_DATA') {
        sheet = workbook.addWorksheet('Report');
        sheet.views = [
          { state: 'frozen', xSplit: 0, ySplit: 1 }
        ];

        printReportRawData(sheet, prepareRawData(arrayData));
      } else {
        throw Error('Invalid report type: ' + reportType);
      }

      return workbook;
    }


    var reportData = dataProvider.getData(
      app.models,
      from,
      to,
      costCenters,
      users
    ).then((data) => {
      const parsedData = parseData(data);
      const arrayData = Object.values(parsedData);

      try {
        if (reportType === 'CSV') {
          res.setHeader('Content-Type', 'text/csv');
          res.setHeader('Content-Disposition', 'attachment; filename=\"Report.csv\"');

          const csvReportData = prepareRawData(arrayData);

          return stringify(csvReportData, { header: true }).pipe(res);
        }

        const workbook = createExcelReportWithData(arrayData, reportType);

        // --------- SEND EXCEL RESPONSE ---------
        // Ref: http://www.ihamvic.com/2018/07/25/create-and-download-excel-file-in-node-js/

        var tempFilePath = tempfile('.xlsx');

        workbook.xlsx.writeFile(tempFilePath).then(function() {
          var resOptions = {
            headers: {
              'Content-Disposition': 'attachment; filename=\"Report.xlsx\"'
            }
          };

          res.sendFile(tempFilePath, resOptions, function(err) {
            deleteTempFile(tempFilePath);

            if (err) {
              return next(err);
            }
          });
        });
      } catch(error) {
        next(error);
      }
    });
  });
}

