import { read, utils, write } from 'xlsx';
import { Header } from "../components";
import React from 'react';

const { sheet_to_json } = utils;
const Schedule = () => {
    const handleFile = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
          const workbook = read(event.target.result, { type: 'binary' });
          const sheet1Name = workbook.SheetNames[0];
          const sheet1 = workbook.Sheets[sheet1Name];
          const data1 = utils.sheet_to_json(sheet1);
      
          const sheet2Name = workbook.SheetNames[1];
          const sheet2 = workbook.Sheets[sheet2Name];
          const data2 = utils.sheet_to_json(sheet2);
      
          console.log(data1); // In dữ liệu từ trang tính 1 ra console
          console.log(data2); // In dữ liệu từ trang tính 2 ra console
      
          // Ghép hai mảng JSON lại với nhau nếu cần
          const mergedData = [...data1, ...data2];
          console.log(mergedData); // In dữ liệu ghép lại ra console
        };
        reader.readAsBinaryString(file);
      };

    return (
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
            <Header category="Schedule" title="Import Schedule" />
            <div>
                <input type="file" onChange={handleFile} />
            </div>
        </div>
    );
};
export default Schedule