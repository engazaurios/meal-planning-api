var createError = require('http-errors');
var excel = require('exceljs');
var tempfile = require('tempfile');
var fs = require('fs');
var moment = require('moment');

var excelUtils = require('../../common/utils/excel-utils');
var dataProvider = require('../../common/helpers/data-provider');

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
    var reportType = ['UNIFIED', 'TABS', 'RAW_DATA'].includes(req.query.reportType)
      ? req.query.reportType
      : 'UNIFIED';

    var costCenters = Array.isArray(req.query.costCenters)
      ? req.query.costCenters
      : [req.query.costCenters];

    var users = Array.isArray(req.query.users)
      ? req.query.users
      : [req.query.users];

    function printReportHeader(sheet, dates, lunchTime) {
      lunchTime = ['breakfast', 'lunch', 'dinner'].includes(lunchTime) ? lunchTime : null;

      sheet.addRow(['Empleado', 'Centro de costo']);
      sheet.mergeCells(1, 1, lunchTime ? 2 : 3, 1);
      sheet.mergeCells(1, 2, lunchTime ? 2 : 3, 2);

      excelUtils.applyVerticalAligmentMiddleToCell(sheet.getCell('A1'));
      excelUtils.applyVerticalAligmentMiddleToCell(sheet.getCell('B1'));

      excelUtils.applyBoldToCell(sheet.getCell('A1'));
      excelUtils.applyBoldToCell(sheet.getCell('B1'));

      excelUtils.applyAllBordersToCell(sheet.getCell('A1'));
      excelUtils.applyAllBordersToCell(sheet.getCell('B1'));

      sheet.getColumn(1).width = 20;
      sheet.getColumn(2).width = 15;

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

        sheet.mergeCells(1, col, 1, lunchTime ? col + 2 : col + 8);

        col += lunchTime ? 3 : 9;
      });

      // --------- PRINT LUCNH TIMES ---------
      if (!lunchTime) {
        var lunchTimesRow = sheet.getRow(2);

        col = 3;
        dates.forEach(function(date) {
          cell = lunchTimesRow.getCell(col);

          cell.value = 'Desayuno';
          excelUtils.applyHorizontalAligmentCenterToCell(cell);
          excelUtils.applyBoldToCell(cell);
          excelUtils.applyAllBordersToCell(cell);

          sheet.mergeCells(2, col, 2, col + 2);
          col += 3;

          cell = lunchTimesRow.getCell(col);

          cell.value = 'Almuerzo';
          excelUtils.applyHorizontalAligmentCenterToCell(cell);
          excelUtils.applyBoldToCell(cell);
          excelUtils.applyAllBordersToCell(cell);

          sheet.mergeCells(2, col, 2, col + 2);
          col += 3;

          cell = lunchTimesRow.getCell(col);

          cell.value = 'Cena';
          excelUtils.applyHorizontalAligmentCenterToCell(cell);
          excelUtils.applyBoldToCell(cell);
          excelUtils.applyAllBordersToCell(cell);

          sheet.mergeCells(2, col, 2, col + 2);
          col += 3;
        });
      }

      // --------- PRINT MENUS ---------
      var menusRow = sheet.getRow(lunchTime ? 2 : 3);

      col = 3;
      dates.forEach(function(date) {
        for (var i = 0; i < (lunchTime ? 1 : 3); i++) {
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

    function printReportData(sheet, data, dates, lunchTime) {
      data = Array.isArray(data) && data.length ? data : [];
      dates = Array.isArray(dates) && dates.length ? dates : [];
      lunchTime = ['breakfast', 'lunch', 'dinner'].includes(lunchTime) ? lunchTime : null;

      var col;
      var row, cell;
      var userDayMeals;
      var multiplier = lunchTime ? 3 : 9;
      var startRow = lunchTime ? 3 : 4;
      var statusMap = {
        PENDING: 'Pendiente',
        SENT: 'Enviado',
        APPROVED: 'Aprobado',
        NOT_AVAILABLE: 'No disponible',
      };

      // --------- PRINT DATA ---------
      data.forEach(function(userData, index) {
        row = sheet.getRow(startRow + index);
        col = 1;

        cell = row.getCell(col++);
        cell.value = [userData.user.name, userData.user.lastName].join(' ');

        cell = row.getCell(col++);
        cell.value = userData.user.costCenter ? userData.user.costCenter.name : '';

        dates.forEach(function(date) {
          userDayMeals = userData.meals[date];

          if (!userDayMeals) {
            col += multiplier;

            return;
          }

          // Breakfast
          if (!lunchTime || (lunchTime === 'breakfast')) {
            if (userDayMeals.breakfast) {
              row.getCell(col++).value = userDayMeals.breakfast.menu;
              row.getCell(col++).value = statusMap[userDayMeals.breakfast.status];
              row.getCell(col++).value = userDayMeals.breakfast.cost;
            } else {
              col += 3;
            }
          }

          // Lunch
          if (!lunchTime || (lunchTime === 'lunch')) {
            if (userDayMeals.lunch) {
              row.getCell(col++).value = userDayMeals.lunch.menu;
              row.getCell(col++).value = statusMap[userDayMeals.lunch.status];
              row.getCell(col++).value = userDayMeals.lunch.cost;
            } else {
              col += 3;
            }
          }

          // Lunch
          if (!lunchTime || (lunchTime === 'dinner')) {
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
      var lastRow = (lunchTime ? 4 : 5) + data.length;

      totalsRow = sheet.getRow(lastRow);

      cell = totalsRow.getCell(1);
      cell.value = 'TOTALES';

      col = 5;
      dates.forEach(function(date) {
        // Breakfast total
        if (!lunchTime || (lunchTime === 'breakfast')) {
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
        if (!lunchTime || (lunchTime === 'lunch')) {
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
        if (!lunchTime || (lunchTime === 'dinner')) {
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
      data = Array.isArray(data) && data.length ? data : [];

      sheet.columns = [
        { header: 'Empleado', width: 30 },
        { header: 'Centro de costo', width: 20 },
        { header: 'Fecha', width: 15 },
        { header: 'Tiempo', width: 15 },
        { header: 'Menu', width: 20 },
        { header: 'Estado', width: 15 },
        { header: 'Asistencia', width: 15 },
        { header: 'Valor', width: 15 },
      ];

      sheet.getRow(1).eachCell(function(cell) {
        excelUtils.applyAllBordersToCell(cell);
        excelUtils.applyBoldToCell(cell);
      });

      var row, col, line, cell;
      var username, costCenter;
      var grandTotal = 0;

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

      line = 2;
      data.forEach(function(userData) {
        username = [userData.user.name, userData.user.lastName].join(' ');
        costCenter = userData.user.costCenter ? userData.user.costCenter.name : '';

        Object.values(userData.meals).forEach(function(userDayMeals) {
          ['breakfast', 'lunch', 'dinner'].forEach(function(mealTime) {
            if (!userDayMeals[mealTime]) {
              return;
            }

            row = sheet.getRow(line);
            col = 1;

            cell = row.getCell(col++);
            cell.value = username;

            cell = row.getCell(col++);
            cell.value = costCenter;

            cell = row.getCell(col++);
            cell.value = userDayMeals.date;

            cell = row.getCell(col++);
            cell.value = mealTimeMap[mealTime];

            cell = row.getCell(col++);
            cell.value = userDayMeals[mealTime].menu;

            cell = row.getCell(col++);
            cell.value = statusMap[userDayMeals[mealTime].status];

            cell = row.getCell(col++);
            cell.value = userDayMeals[mealTime].attendance ? 'Sí' : 'No';

            cell = row.getCell(col++);
            cell.value = userDayMeals[mealTime].cost;

            grandTotal += userDayMeals[mealTime].cost;

            line +=1;
          });
         });
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

    function createReportWithData(parsedData, reportType) {
      var workbook = new excel.Workbook();
      var sheet, dates;
      var arrayData = Object.values(parsedData);

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

        printReportRawData(sheet, arrayData);
      } else {
        throw Error('Invalid report type: ' + reportType);
      }

      return workbook;
    }

    function parseData({ userMenus, orders }) {
      let parsedData = {};

      userMenus.forEach(function(userMenu) {
        if (!parsedData[userMenu.userId]) {
          let user = userMenu.user();

          parsedData[userMenu.userId] = {
            user: {
              id: userMenu.userId,
              name: user.name,
              lastName: user.lastName,
              costCenter: {
                name: user.costCenter() ? user.costCenter().name : ''
              },
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

            parsedData[userMenu.userId].meals[dateKey][menu.meal().code] = {
              menu: menu.title,
              cost: menu.price,
              status: userMenu.status,
              attendance: menuOrder && (menuOrder.attendance === true),
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



    var reportData = dataProvider.getData(
      app.models,
      from,
      to,
      costCenters,
      users
    ).then((data) => {
      const parsedData = parseData(data);
      const workbook = createReportWithData(parsedData, reportType);

      // --------- SEND EXCEL RESPONSE ---------
      // Ref: http://www.ihamvic.com/2018/07/25/create-and-download-excel-file-in-node-js/

      var tempFilePath = tempfile('.xlsx');

      workbook.xlsx.writeFile(tempFilePath).then(function() {
        var resOptions = {
          headers: {
            'Content-Disposition': 'attachment; filename=Report.xlsx'
          }
        };

        res.sendFile(tempFilePath, resOptions, function(err) {
          deleteTempFile(tempFilePath);

          if (err) {
            return next(err);
          }
        });
      });
    });
  });
}

