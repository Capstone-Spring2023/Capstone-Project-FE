import { read, utils, write } from 'xlsx';
import { Header } from "../components";
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import moment from "moment";
import { startOfWeek, endOfWeek, format, addDays } from "date-fns";

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
    const [startDate, setStartDate] = useState(new Date());
    const startOfWeekDate = startOfWeek(startDate);
    const endOfWeekDate = endOfWeek(startDate);

    const handleStartDateChange = (e) => {
        setStartDate(new Date(e.target.value));
    };

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const courseList = ['Math', 'History', 'Physics', 'Biology', 'Chemistry', 'English', 'Geography', 'Art'];
    const daysOfMonth = [];
    for (let i = 0; i < 7; i++) {
        const day = addDays(startOfWeekDate, i + 1);
        daysOfMonth.push(format(day, "dd/MM/yyyy"));
    }
    const timetable = [];
    const slots = [];

    // Thêm các slot vào danh sách `slots`
    for (let i = 0; i < 8; i++) {
        slots.push(
            <td key={`slot-${i}`}>
                <div className="slot">Slot {i + 1}</div>
            </td>
        );
    }
    return (
        <>
            <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
                <div>
                    <input type="file" onChange={handleFile} />
                </div>
                <div className="app-container">
                    <div className="container">
                        <div className="header">
                            <h2>Timetable</h2>
                        </div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <input
                                        type="date"
                                        value={format(startDate, "yyyy-MM-dd")}
                                        onChange={handleStartDateChange}
                                        className="date-picker"
                                    />
                                    {daysOfWeek.map((day, index) => (
                                        <th key={`${day}-${daysOfMonth[index]}`} className="text-center">
                                            <div className="day-container">
                                                <div className="day">{day}</div>
                                                <div className="date">{daysOfMonth[index]}</div>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {slots.map((slot, index) => (
                                    <tr key={`slot-row-${index}`}>
                                        {slot}
                                        <td className="td-style"></td>
                                        <td className="td-style"></td>
                                        <td className="td-style"></td>
                                        <td className="td-style"></td>
                                        <td className="td-style"></td>
                                        <td className="td-style"></td>
                                        <td className="td-style"></td>
                                    </tr>
                                ))}
                                <tr>{timetable}</tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Schedule