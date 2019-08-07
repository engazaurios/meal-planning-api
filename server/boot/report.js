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
        id : 0,
        name : 'Carlos',
        is_active : 'false'
      },
      {
        id : 1,
        name : 'Juan',
        is_active : 'true'
      }
    ];

    // Headers
    var header = sheet.addRow(Object.keys(objArray[0]));

    // Styling headers
    header._cells.map(function(cell) {
      cell.style.font = {
        bold: true
      };

      cell.border = {
        top: { style:'thin' },
        bottom: { style:'thin' },
      }
    });

    // Data
    objArray.forEach(function(item){
      sheet.addRow(Object.values(item));
    });

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

