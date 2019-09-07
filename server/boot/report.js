var excel = require('exceljs');
var tempfile = require('tempfile');
var fs = require('fs');
var excelUtils = require('../../common/utils/excel-utils');

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
    var reportType = ['UNIFIED', 'TABS', 'RAW_DATA'].includes(req.query.reportType)
      ? req.query.reportType
      : 'UNIFIED';

    var objArray = [
      {
        user: {
          name: 'James',
          lastName: 'Luis',
          department: {
            name: 'Informatica'
          },
          role: {
            name: 'employee'
          }
        },
        meals: [
          {
            day: '2019-10-1',
            meals: {
              breakfast: {
                menu: {
                  name: 'Arroz con platanos'
                },
                cost: 20,
                status: 'SENT'
              },
              lunch: {
                menu: {
                  name: 'Arroz con pollo'
                },
                cost: 30,
                status: 'SENT'
              },
              dinner: {
                menu: {
                  name: 'Arroz con frijoles'
                },
                cost: 15,
                status: 'SENT'
              }
            }
          },
          {
            day: '2019-10-2',
            meals: {
              breakfast: {
                menu: {
                  name: 'Arroz con platanos'
                },
                cost: 20,
                status: 'SENT'
              },
              lunch: {
                menu: {
                  name: 'Arroz con pollo'
                },
                cost: 30,
                status: 'SENT'
              },
              dinner: {
                menu: {
                  name: 'Arroz con frijoles'
                },
                cost: 15,
                status: 'SENT'
              }
            }
          },
          {
            day: '2019-10-3',
            meals: {
              breakfast: {
                menu: {
                  name: 'Arroz con platanos'
                },
                cost: 20,
                status: 'SENT'
              },
              lunch: {
                menu: {
                  name: 'Arroz con pollo'
                },
                cost: 30,
                status: 'SENT'
              },
              dinner: {
                menu: {
                  name: 'Arroz con frijoles'
                },
                cost: 15,
                status: 'SENT'
              }
            }
          },
          {
            day: '2019-10-4',
            meals: {
              breakfast: {
                menu: {
                  name: 'Arroz con platanos'
                },
                cost: 20,
                status: 'SENT'
              },
              lunch: {
                menu: {
                  name: 'Arroz con pollo'
                },
                cost: 30,
                status: 'SENT'
              },
              dinner: {
                menu: {
                  name: 'Arroz con frijoles'
                },
                cost: 15,
                status: 'SENT'
              }
            }
          },
          {
            day: '2019-10-5',
            meals: {
              breakfast: {
                menu: {
                  name: 'Arroz con platanos'
                },
                cost: 20,
                status: 'SENT'
              },
              lunch: {
                menu: {
                  name: 'Arroz con pollo'
                },
                cost: 30,
                status: 'SENT'
              },
              dinner: {
                menu: {
                  name: 'Arroz con frijoles'
                },
                cost: 15,
                status: 'SENT'
              }
            }
          },
          {
            day: '2019-10-6',
            meals: {
              breakfast: {
                menu: {
                  name: 'Arroz con platanos'
                },
                cost: 20,
                status: 'SENT'
              },
              lunch: {
                menu: {
                  name: 'Arroz con pollo'
                },
                cost: 30,
                status: 'SENT'
              },
              dinner: {
                menu: {
                  name: 'Arroz con frijoles'
                },
                cost: 15,
                status: 'SENT'
              }
            }
          },
          {
            day: '2019-10-7',
            meals: {
              breakfast: {
                menu: {
                  name: 'Arroz con platanos'
                },
                cost: 20,
                status: 'SENT'
              },
              lunch: {
                menu: {
                  name: 'Arroz con pollo'
                },
                cost: 30,
                status: 'SENT'
              },
              dinner: {
                menu: {
                  name: 'Arroz con frijoles'
                },
                cost: 15,
                status: 'SENT'
              }
            }
          },
          {
            day: '2019-10-8',
            meals: {
              breakfast: {
                menu: {
                  name: 'Arroz con platanos'
                },
                cost: 20,
                status: 'SENT'
              },
              lunch: {
                menu: {
                  name: 'Arroz con pollo'
                },
                cost: 30,
                status: 'SENT'
              },
              dinner: {
                menu: {
                  name: 'Arroz con frijoles'
                },
                cost: 15,
                status: 'SENT'
              }
            }
          },
          {
            day: '2019-10-9',
            meals: {
              breakfast: {
                menu: {
                  name: 'Arroz con platanos'
                },
                cost: 20,
                status: 'SENT'
              },
              lunch: {
                menu: {
                  name: 'Arroz con pollo'
                },
                cost: 30,
                status: 'SENT'
              },
              dinner: {
                menu: {
                  name: 'Arroz con frijoles'
                },
                cost: 15,
                status: 'SENT'
              }
            }
          },
          {
            day: '2019-10-10',
            meals: {
              breakfast: {
                menu: {
                  name: 'Arroz con platanos'
                },
                cost: 20,
                status: 'SENT'
              },
              lunch: {
                menu: {
                  name: 'Arroz con pollo'
                },
                cost: 30,
                status: 'SENT'
              },
              dinner: {
                menu: {
                  name: 'Arroz con frijoles'
                },
                cost: 15,
                status: 'SENT'
              }
            }
          },
          {
            day: '2019-10-11',
            meals: {
              breakfast: {
                menu: {
                  name: 'Arroz con platanos'
                },
                cost: 20,
                status: 'SENT'
              },
              lunch: {
                menu: {
                  name: 'Arroz con pollo'
                },
                cost: 30,
                status: 'SENT'
              },
              dinner: {
                menu: {
                  name: 'Arroz con frijoles'
                },
                cost: 15,
                status: 'SENT'
              }
            }
          },
          {
            day: '2019-10-12',
            meals: {
              breakfast: {
                menu: {
                  name: 'Arroz con platanos'
                },
                cost: 20,
                status: 'SENT'
              },
              lunch: {
                menu: {
                  name: 'Arroz con pollo'
                },
                cost: 30,
                status: 'SENT'
              },
              dinner: {
                menu: {
                  name: 'Arroz con frijoles'
                },
                cost: 15,
                status: 'SENT'
              }
            }
          },
          {
            day: '2019-10-13',
            meals: {
              breakfast: {
                menu: {
                  name: 'Arroz con platanos'
                },
                cost: 20,
                status: 'SENT'
              },
              lunch: {
                menu: {
                  name: 'Arroz con pollo'
                },
                cost: 30,
                status: 'SENT'
              },
              dinner: {
                menu: {
                  name: 'Arroz con frijoles'
                },
                cost: 15,
                status: 'SENT'
              }
            }
          },
          {
            day: '2019-10-14',
            meals: {
              breakfast: {
                menu: {
                  name: 'Arroz con platanos'
                },
                cost: 20,
                status: 'SENT'
              },
              lunch: {
                menu: {
                  name: 'Arroz con pollo'
                },
                cost: 30,
                status: 'SENT'
              },
              dinner: {
                menu: {
                  name: 'Arroz con frijoles'
                },
                cost: 15,
                status: 'SENT'
              }
            }
          },
          {
            day: '2019-10-15',
            meals: {
              breakfast: {
                menu: {
                  name: 'Arroz con platanos'
                },
                cost: 20,
                status: 'SENT'
              },
              lunch: {
                menu: {
                  name: 'Arroz con pollo'
                },
                cost: 30,
                status: 'SENT'
              },
              dinner: {
                menu: {
                  name: 'Arroz con frijoles'
                },
                cost: 15,
                status: 'SENT'
              }
            }
          },
          {
            day: '2019-10-16',
            meals: {
              breakfast: {
                menu: {
                  name: 'Arroz con platanos'
                },
                cost: 20,
                status: 'SENT'
              },
              lunch: {
                menu: {
                  name: 'Arroz con pollo'
                },
                cost: 30,
                status: 'SENT'
              },
              dinner: {
                menu: {
                  name: 'Arroz con frijoles'
                },
                cost: 15,
                status: 'SENT'
              }
            }
          }
        ]
      },
      {
        user: {
          name: 'Carlos',
          lastName: 'Salazar',
          department: {
            name: 'Planta'
          },
          role: {
            name: 'employee'
          }
        },
        meals: [
          {
            day: '2019-10-1',
            meals: {
              breakfast: {
                menu: {
                  name: 'Arroz con platanos'
                },
                cost: 20,
                status: 'SENT'
              },
              lunch: {
                menu: {
                  name: 'Arroz con pollo'
                },
                cost: 30,
                status: 'SENT'
              },
              dinner: {
                menu: {
                  name: 'Arroz con frijoles'
                },
                cost: 15,
                status: 'SENT'
              }
            }
          },
          {
            day: '2019-10-3',
            meals: {
              breakfast: {
                menu: {
                  name: 'Arroz con platanos'
                },
                cost: 20,
                status: 'SENT'
              },
              lunch: {
                menu: {
                  name: 'Arroz con pollo'
                },
                cost: 30,
                status: 'SENT'
              },
              dinner: {
                menu: {
                  name: 'Arroz con frijoles'
                },
                cost: 15,
                status: 'SENT'
              }
            }
          },
          {
            day: '2019-10-4',
            meals: {
              breakfast: {
                menu: {
                  name: 'Arroz con platanos'
                },
                cost: 20,
                status: 'SENT'
              },
              lunch: {
                menu: {
                  name: 'Arroz con pollo'
                },
                cost: 30,
                status: 'SENT'
              },
              dinner: {
                menu: {
                  name: 'Arroz con frijoles'
                },
                cost: 15,
                status: 'SENT'
              }
            }
          },
          {
            day: '2019-10-5',
            meals: {
              breakfast: {
                menu: {
                  name: 'Arroz con platanos'
                },
                cost: 20,
                status: 'SENT'
              },
              lunch: {
                menu: {
                  name: 'Arroz con pollo'
                },
                cost: 30,
                status: 'SENT'
              },
              dinner: {
                menu: {
                  name: 'Arroz con frijoles'
                },
                cost: 15,
                status: 'SENT'
              }
            }
          },
          {
            day: '2019-10-6',
            meals: {
              breakfast: {
                menu: {
                  name: 'Arroz con platanos'
                },
                cost: 20,
                status: 'SENT'
              },
              lunch: {
                menu: {
                  name: 'Arroz con pollo'
                },
                cost: 30,
                status: 'SENT'
              },
              dinner: {
                menu: {
                  name: 'Arroz con frijoles'
                },
                cost: 15,
                status: 'SENT'
              }
            }
          },
          {
            day: '2019-10-7',
            meals: {
              breakfast: {
                menu: {
                  name: 'Arroz con platanos'
                },
                cost: 20,
                status: 'SENT'
              },
              lunch: {
                menu: {
                  name: 'Arroz con pollo'
                },
                cost: 30,
                status: 'SENT'
              },
              dinner: {
                menu: {
                  name: 'Arroz con frijoles'
                },
                cost: 15,
                status: 'SENT'
              }
            }
          },
          {
            day: '2019-10-8',
            meals: {
              breakfast: {
                menu: {
                  name: 'Arroz con platanos'
                },
                cost: 20,
                status: 'SENT'
              },
              lunch: {
                menu: {
                  name: 'Arroz con pollo'
                },
                cost: 30,
                status: 'SENT'
              },
              dinner: {
                menu: {
                  name: 'Arroz con frijoles'
                },
                cost: 15,
                status: 'SENT'
              }
            }
          },
          {
            day: '2019-10-10',
            meals: {
              breakfast: {
                menu: {
                  name: 'Arroz con platanos'
                },
                cost: 20,
                status: 'SENT'
              },
              lunch: {
                menu: {
                  name: 'Arroz con pollo'
                },
                cost: 30,
                status: 'SENT'
              },
              dinner: {
                menu: {
                  name: 'Arroz con frijoles'
                },
                cost: 15,
                status: 'SENT'
              }
            }
          },
          {
            day: '2019-10-11',
            meals: {
              breakfast: {
                menu: {
                  name: 'Arroz con platanos'
                },
                cost: 20,
                status: 'SENT'
              },
              lunch: {
                menu: {
                  name: 'Arroz con pollo'
                },
                cost: 30,
                status: 'SENT'
              },
              dinner: {
                menu: {
                  name: 'Arroz con frijoles'
                },
                cost: 15,
                status: 'SENT'
              }
            }
          },
          {
            day: '2019-10-12',
            meals: {
              breakfast: {
                menu: {
                  name: 'Arroz con platanos'
                },
                cost: 20,
                status: 'SENT'
              },
              lunch: {
                menu: {
                  name: 'Arroz con pollo'
                },
                cost: 30,
                status: 'SENT'
              },
              dinner: {
                menu: {
                  name: 'Arroz con frijoles'
                },
                cost: 15,
                status: 'SENT'
              }
            }
          },
          {
            day: '2019-10-13',
            meals: {
              breakfast: {
                menu: {
                  name: 'Arroz con platanos'
                },
                cost: 20,
                status: 'SENT'
              },
              lunch: {
                menu: {
                  name: 'Arroz con pollo'
                },
                cost: 30,
                status: 'SENT'
              },
              dinner: {
                menu: {
                  name: 'Arroz con frijoles'
                },
                cost: 15,
                status: 'SENT'
              }
            }
          },
          {
            day: '2019-10-14',
            meals: {
              breakfast: {
                menu: {
                  name: 'Arroz con platanos'
                },
                cost: 20,
                status: 'SENT'
              },
              lunch: {
                menu: {
                  name: 'Arroz con pollo'
                },
                cost: 30,
                status: 'SENT'
              },
              dinner: {
                menu: {
                  name: 'Arroz con frijoles'
                },
                cost: 15,
                status: 'SENT'
              }
            }
          },
          {
            day: '2019-10-15',
            meals: {
              breakfast: {
                menu: {
                  name: 'Arroz con platanos'
                },
                cost: 20,
                status: 'SENT'
              },
              lunch: {
                menu: {
                  name: 'Arroz con pollo'
                },
                cost: 30,
                status: 'SENT'
              },
              dinner: {
                menu: {
                  name: 'Arroz con frijoles'
                },
                cost: 15,
                status: 'SENT'
              }
            }
          },
          {
            day: '2019-10-16',
            meals: {
              breakfast: {
                menu: {
                  name: 'Arroz con platanos'
                },
                cost: 20,
                status: 'SENT'
              },
              lunch: {
                menu: {
                  name: 'Arroz con pollo'
                },
                cost: 30,
                status: 'SENT'
              },
              dinner: {
                menu: {
                  name: 'Arroz con frijoles'
                },
                cost: 15,
                status: 'SENT'
              }
            }
          }
        ]
      },
    ];


    function printReportHeader(sheet, dates, lunchTime) {
      lunchTime = ['breakfast', 'lunch', 'dinner'].includes(lunchTime) ? lunchTime : null;

      sheet.addRow(['Empleado', 'Departamento']);
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
      dates.forEach(function(day) {
        cell = datesRow.getCell(col);

        cell.value = day;

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
        dates.forEach(function(day) {
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
      dates.forEach(function(day) {
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

      // --------- PRINT DATA ---------
      data.forEach(function(userData, index) {
        row = sheet.getRow(startRow + index);
        col = 1;

        cell = row.getCell(col++);
        cell.value = [userData.user.name, userData.user.lastName].join(' ');

        cell = row.getCell(col++);
        cell.value = userData.user.department ? userData.user.department.name : '';

        dates.forEach(function(date) {
          userDayMeals = userData.meals.find(function(dayMeal) {
            return dayMeal.day === date;
          });

          if (!userDayMeals) {
            col += multiplier;

            return;
          }

          // Breakfast
          if (!lunchTime || (lunchTime === 'breakfast')) {
            if (userDayMeals.meals.breakfast) {
              row.getCell(col++).value = userDayMeals.meals.breakfast.menu.name;
              row.getCell(col++).value = userDayMeals.meals.breakfast.status;
              row.getCell(col++).value = userDayMeals.meals.breakfast.cost;
            } else {
              col += 3;
            }
          }

          // Lunch
          if (!lunchTime || (lunchTime === 'lunch')) {
            if (userDayMeals.meals.lunch) {
              row.getCell(col++).value = userDayMeals.meals.lunch.menu.name;
              row.getCell(col++).value = userDayMeals.meals.lunch.status;
              row.getCell(col++).value = userDayMeals.meals.lunch.cost;
            } else {
              col += 3;
            }
          }

          // Lunch
          if (!lunchTime || (lunchTime === 'dinner')) {
            if (userDayMeals.meals.dinner) {
              row.getCell(col++).value = userDayMeals.meals.dinner.menu.name;
              row.getCell(col++).value = userDayMeals.meals.dinner.status;
              row.getCell(col++).value = userDayMeals.meals.dinner.cost;
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
        breakfastTotal = data.reduce(function(sum, userData) {
          userDayMeals = userData.meals.find(function(dayMeal) {
            return dayMeal.day === date;
          });

          if (userDayMeals && userDayMeals.meals.breakfast) {
            sum += parseFloat(userDayMeals.meals.breakfast.cost);
          }

          return sum;
        }, 0);

        // Lunch total
        lunchTotal = data.reduce(function(sum, userData) {
          userDayMeals = userData.meals.find(function(dayMeal) {
            return dayMeal.day === date;
          });

          if (userDayMeals && userDayMeals.meals.lunch) {
            sum += parseFloat(userDayMeals.meals.lunch.cost);
          }

          return sum;
        }, 0);

        // Breakfast total
        dinnerTotal = data.reduce(function(sum, userData) {
          userDayMeals = userData.meals.find(function(dayMeal) {
            return dayMeal.day === date;
          });

          if (userDayMeals && userDayMeals.meals.dinner) {
            sum += parseFloat(userDayMeals.meals.dinner.cost);
          }

          return sum;
        }, 0);


        if (!lunchTime || (lunchTime === 'breakfast')) {
          cell = totalsRow.getCell(col);
          cell.value = breakfastTotal;
          col += 3;

          grandTotal += breakfastTotal;
        }

        if (!lunchTime || (lunchTime === 'lunch')) {
          cell = totalsRow.getCell(col);
          cell.value = lunchTotal;
          col += 3;

          grandTotal += lunchTotal;
        }

        if (!lunchTime || (lunchTime === 'dinner')) {
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
        { header: 'Departamento', width: 20 },
        { header: 'Fecha', width: 15 },
        { header: 'Tiempo', width: 15 },
        { header: 'Menu', width: 20 },
        { header: 'Estado', width: 15 },
        { header: 'Valor', width: 15 },
      ];

      sheet.getRow(1).eachCell(function(cell) {
        excelUtils.applyAllBordersToCell(cell);
        excelUtils.applyBoldToCell(cell);
      });

      var row, col, line, cell;
      var username, department;
      var grandTotal = 0;

      var mealTimeMap = {
        breakfast: 'Desayuno',
        lunch: 'Almuerzo',
        dinner: 'Cena',
      };

      line = 2;
      data.forEach(function(userData) {
        username = [userData.user.name, userData.user.lastName].join(' ');
        department = userData.user.department ? userData.user.department.name : '';

        userData.meals.forEach(function(userDayMeals) {
          ['breakfast', 'lunch', 'dinner'].forEach(function(mealTime) {
            if (!userDayMeals.meals[mealTime]) {
              return;
            }

            row = sheet.getRow(line);
            col = 1;

            cell = row.getCell(col++);
            cell.value = username;

            cell = row.getCell(col++);
            cell.value = department;

            cell = row.getCell(col++);
            cell.value = userDayMeals.day;

            cell = row.getCell(col++);
            cell.value = mealTimeMap[mealTime];

            cell = row.getCell(col++);
            cell.value = userDayMeals.meals[mealTime].menu.name;

            cell = row.getCell(col++);
            cell.value = userDayMeals.meals[mealTime].status;

            cell = row.getCell(col++);
            cell.value = userDayMeals.meals[mealTime].cost;

            grandTotal += userDayMeals.meals[mealTime].cost;

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


    var workbook = new excel.Workbook();
    var sheet, dates;

    dates = objArray[0].meals.reduce(function(dates, userDayData) {
      if (!dates.includes(userDayData.day)) {
        dates.push(userDayData.day);
      }

      return dates;
    }, []);


    if (reportType === 'UNIFIED') {
      sheet = workbook.addWorksheet('Report');
      sheet.views = [
        { state: 'frozen', xSplit: 1, ySplit: 3 }
      ];

      printReportHeader(sheet, dates);
      printReportData(sheet, objArray, dates);
    } else if (reportType === 'TABS') {
      sheet = workbook.addWorksheet('Desayuno');
      sheet.views = [
        { state: 'frozen', xSplit: 1, ySplit: 2 }
      ];

      printReportHeader(sheet, dates, 'breakfast');
      printReportData(sheet, objArray, dates, 'breakfast');

      sheet = workbook.addWorksheet('Almuerzo');
      sheet.views = [
        { state: 'frozen', xSplit: 1, ySplit: 2 }
      ];

      printReportHeader(sheet, dates, 'lunch');
      printReportData(sheet, objArray, dates, 'lunch');

      sheet = workbook.addWorksheet('Cena');
      sheet.views = [
        { state: 'frozen', xSplit: 1, ySplit: 2 }
      ];

      printReportHeader(sheet, dates, 'dinner');
      printReportData(sheet, objArray, dates, 'dinner');
    } else if (reportType === 'RAW_DATA') {
      sheet = workbook.addWorksheet('Report');
      sheet.views = [
        { state: 'frozen', xSplit: 0, ySplit: 1 }
      ];

      printReportRawData(sheet, objArray);
    } else {
      throw Error('Invalid report type: ' + reportType);
    }


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
}

