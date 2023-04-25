const XLSX = require("xlsx");

async function readEmailData(file) {
  const bufferFile = await file.arrayBuffer();
  const excelfile = await XLSX.read(bufferFile);
  let data = [];

  const sheets = excelfile.SheetNames;

  for (let i = 0; i < sheets.length; i++) {
    const temp = XLSX.utils.sheet_to_json(
      excelfile.Sheets[excelfile.SheetNames[i]]
    );
    temp.forEach((res) => {
      data.push(res.email);
    });
  }
  return data;
}

async function readTopicsData(file) {
  const bufferFile = await file.arrayBuffer();
  const excelfile = await XLSX.read(bufferFile);
  let data = [];

  const sheets = excelfile.SheetNames;

  for (let i = 0; i < sheets.length; i++) {
    const temp = XLSX.utils.sheet_to_json(
      excelfile.Sheets[excelfile.SheetNames[i]]
    );
    temp.forEach((res) => {
      data.push(res);
    });
  }
  return data;
}

async function writeSubjectStatistic(data) {
  let workBook = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workBook, ws, `Thành công`);
  let exportFileName = `data.xlsx`;
  XLSX.writeFile(workBook, exportFileName);
}

export default {
  readEmailData,
  writeSubjectStatistic,
  readTopicsData,
};
