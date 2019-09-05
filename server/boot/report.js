var excel = require('exceljs');
var tempfile = require('tempfile');
var fs = require('fs');

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
    // Ref: http://www.ihamvic.com/2018/07/25/create-and-download-excel-file-in-node-js/
    var workbook = new excel.Workbook();
    var sheet = workbook.addWorksheet('Report');

    var objArray =[
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

    sheet.views = [
      { state: 'frozen', xSplit: 1, ySplit: 3 }
    ];

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


    function printReportHeader(sheet, dates) {
      sheet.addRow(['Empleado', 'Departamento']);
      sheet.mergeCells(1, 1, 3, 1);
      sheet.mergeCells(1, 2, 3, 2);

      applyVerticalAligmentMiddleToCell(sheet.getCell('A1'));
      applyVerticalAligmentMiddleToCell(sheet.getCell('B1'));

      applyBoldToCell(sheet.getCell('A1'));
      applyBoldToCell(sheet.getCell('B1'));

      applyAllBordersToCell(sheet.getCell('A1'));
      applyAllBordersToCell(sheet.getCell('B1'));

      sheet.getColumn(1).width = 20;
      sheet.getColumn(2).width = 15;

      if (!Array.isArray(dates) || !dates.length) {
        return;
      }

      // --------- PRINT DAYS ---------
      var col, cell;

      col = 3;
      var firstRow = sheet.getRow(1);

      dates.forEach(function(day) {
        cell = firstRow.getCell(col);

        cell.value = day;

        applyHorizontalAligmentCenterToCell(cell);
        applyBoldToCell(cell);
        applyAllBordersToCell(cell);

        sheet.mergeCells(1, col, 1, col + 8);

        col += 9;
      });

      // --------- PRINT LUCNH TIMES ---------
      col = 3;
      var secondRow = sheet.getRow(2);

      dates.forEach(function(day) {
        cell = secondRow.getCell(col);

        cell.value = 'Desayuno';
        applyHorizontalAligmentCenterToCell(cell);
        applyBoldToCell(cell);
        applyAllBordersToCell(cell);

        sheet.mergeCells(2, col, 2, col + 2);
        col += 3;

        cell = secondRow.getCell(col);

        cell.value = 'Almuerzo';
        applyHorizontalAligmentCenterToCell(cell);
        applyBoldToCell(cell);
        applyAllBordersToCell(cell);

        sheet.mergeCells(2, col, 2, col + 2);
        col += 3;

        cell = secondRow.getCell(col);

        cell.value = 'Cena';
        applyHorizontalAligmentCenterToCell(cell);
        applyBoldToCell(cell);
        applyAllBordersToCell(cell);

        sheet.mergeCells(2, col, 2, col + 2);
        col += 3;
      });

      // --------- PRINT MENUS ---------
      col = 3;
      var thirdRow = sheet.getRow(3);

      dates.forEach(function(day) {
        for (var i = 0; i < 3; i++) {
          cell = thirdRow.getCell(col);
          cell.value = 'Menu';
          applyHorizontalAligmentCenterToCell(cell);
          applyBoldToCell(cell);
          applyAllBordersToCell(cell);
          sheet.getColumn(col).width = 20;

          col += 1;

          cell = thirdRow.getCell(col);
          cell.value = 'Estado';
          applyHorizontalAligmentCenterToCell(cell);
          applyBoldToCell(cell);
          applyAllBordersToCell(cell);

          col += 1;

          cell = thirdRow.getCell(col);
          cell.value = 'Valor';
          applyHorizontalAligmentCenterToCell(cell);
          applyBoldToCell(cell);
          applyAllBordersToCell(cell);

          col += 1;
        }
      });
    }

    function printReportData(sheet, data, dates) {
      data = Array.isArray(data) && data.length ? data : [];
      dates = Array.isArray(dates) && dates.length ? dates : [];

      var col;
      var row, cell;
      var userDayMeals;

      data.forEach(function(userData, index) {
        row = sheet.getRow(4 + index);
        col = 1;

        cell = row.getCell(col);
        cell.value = [userData.user.name, userData.user.lastName].join(' ');
        col += 1;

        cell = row.getCell(col);
        cell.value = userData.user.department ? userData.user.department.name : '';
        col += 1;

        dates.forEach(function(date) {
          userDayMeals = userData.meals.find(function(dayMeal) {
            return dayMeal.day === date;
          });

          if (!userDayMeals) {
            col += 9;

            return;
          }

          // Breakfast
          if ('breakfast' in userDayMeals.meals) {
            row.getCell(col).value = userDayMeals.meals.breakfast.menu.name;
            col += 1;
            row.getCell(col).value = userDayMeals.meals.breakfast.status;
            col += 1;
            row.getCell(col).value = userDayMeals.meals.breakfast.cost;
            col += 1;
          } else {
            col += 3;
          }

          // Lunch
          if ('lunch' in userDayMeals.meals) {
            row.getCell(col).value = userDayMeals.meals.lunch.menu.name;
            col += 1;
            row.getCell(col).value = userDayMeals.meals.lunch.status;
            col += 1;
            row.getCell(col).value = userDayMeals.meals.lunch.cost;
            col += 1;
          } else {
            col += 3;
          }

          // Lunch
          if ('dinner' in userDayMeals.meals) {
            row.getCell(col).value = userDayMeals.meals.dinner.menu.name;
            col += 1;
            row.getCell(col).value = userDayMeals.meals.dinner.status;
            col += 1;
            row.getCell(col).value = userDayMeals.meals.dinner.cost;
            col += 1;
          } else {
            col += 3;
          }
        });
      });

      // TOTALS
      var lastRow = 5 + data.length;

      row = sheet.getRow(lastRow);

      cell = row.getCell(1);
      cell.value = 'TOTALES';

      var breakfastTotal, lunchTotal, dinnerTotal;
      var grandTotal = 0;

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

        grandTotal += breakfastTotal + lunchTotal + dinnerTotal;

        cell = row.getCell(col);
        cell.value = breakfastTotal;
        col += 3;

        cell = row.getCell(col);
        cell.value = lunchTotal;
        col += 3;

        cell = row.getCell(col);
        cell.value = dinnerTotal;
        col += 3;
      });

      for (var i = 1; i <= 4 + dates.length * 9; i++) {
        cell = row.getCell(i);

        applyBordersToCell(cell, { top: true, bottom: true }, 'double');
        applyBoldToCell(cell);
      }

      cell = row.getCell(3 + dates.length * 9);
      cell.value = grandTotal;
      applyBordersToCell(cell, { left: true, top: true, bottom: true }, 'double');

      // Merge grand total cells.
      sheet.mergeCells(lastRow, 3 + dates.length * 9, lastRow, 4 + dates.length * 9);
    }

    var dates = objArray[0].meals.reduce(function(dates, userDayData) {
      if (!dates.includes(userDayData.day)) {
        dates.push(userDayData.day);
      }

      return dates;
    }, []);

    printReportHeader(sheet, dates);
    printReportData(sheet, objArray, dates);

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

