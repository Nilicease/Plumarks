import { useState } from "react";

type DatePickerProps = {
    onAgeChange: (age: number) => void;
    onBlur: () => void;
};

export function DatePicker({ onAgeChange, onBlur }: DatePickerProps) {
    const currentYear = new Date().getFullYear();

    const [day, setDay] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");

    const daysInMonth =
        month && year
            ? new Date(Number(year), Number(month), 0).getDate()
            : 0;

    const days = Array.from(
        { length: daysInMonth },
        (_, i) => i + 1
    );

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);

    function handleDateChange(nextYear: string, nextMonth: string, nextDay: string) {
        if (!nextYear || !nextMonth || !nextDay) {
            onAgeChange(0);
            return;
        }

        const birthDate = new Date(Number(nextYear), Number(nextMonth) - 1, Number(nextDay));
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const birthdayHasPassed =
            today.getMonth() > birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

        if (!birthdayHasPassed) {
            age -= 1;
        }

        onAgeChange(age);
    }

    return (
        <div className="grid grid-cols-3 gap-2">
            <select
                className="min-h-[50px] w-full rounded-[10px] border border-border bg-[#fbfdfd] px-3 text-[0.9rem] text-text outline-none focus:border-primary focus:shadow-[0_0_0_4px_var(--plumarks-primary-light)]"
                value={year}
                onChange={(event) => {
                    setYear(event.target.value);
                    setDay("");
                    onAgeChange(0);
                }}
                onBlur={onBlur}
                required
            >
                <option value="" disabled>Year</option>
                {years.map((yearOption) => (
                    <option key={yearOption} value={yearOption}>{yearOption}</option>
                ))}
            </select>

            <select
                className="min-h-[50px] w-full rounded-[10px] border border-border bg-[#fbfdfd] px-3 text-[0.9rem] text-text outline-none focus:border-primary focus:shadow-[0_0_0_4px_var(--plumarks-primary-light)] disabled:cursor-not-allowed disabled:opacity-50"
                value={month}
                onChange={(event) => {
                    setMonth(event.target.value);
                    setDay("");
                    onAgeChange(0);
                }}
                onBlur={onBlur}
                disabled={!year}
                required
            >
                <option value="" disabled>Month</option>
                {months.map((monthName, index) => (
                    <option key={monthName} value={index + 1}>{monthName}</option>
                ))}
            </select>

            <select
                className="min-h-[50px] w-full rounded-[10px] border border-border bg-[#fbfdfd] px-3 text-[0.9rem] text-text outline-none focus:border-primary focus:shadow-[0_0_0_4px_var(--plumarks-primary-light)] disabled:cursor-not-allowed disabled:opacity-50"
                value={day}
                onChange={(event) => {
                    setDay(event.target.value);
                    handleDateChange(year, month, event.target.value);
                }}
                onBlur={onBlur}
                disabled={!month}
                required
            >
                <option value="" disabled>Day</option>
                {days.map((day) => (
                    <option key={day} value={day}>{day}</option>
                ))}
            </select>
        </div>
    );
}