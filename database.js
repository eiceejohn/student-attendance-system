(function () {
  "use strict";

  const STORAGE_KEY = "attendance_logging_database_v1";

  function emptyDatabase() {
    return { version: 1, employees: [], attendance: [], sampleStudentsSeeded: false };
  }

  function read() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return emptyDatabase();
      const data = JSON.parse(saved);
      return {
        version: 1,
        employees: Array.isArray(data.employees) ? data.employees : [],
        attendance: Array.isArray(data.attendance) ? data.attendance : [],
        sampleStudentsSeeded: data.sampleStudentsSeeded === true
      };
    } catch (error) {
      console.error("Hindi mabasa ang local database:", error);
      return emptyDatabase();
    }
  }

  function write(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function makeId(prefix) {
    const random = Math.random().toString(36).slice(2, 8);
    return prefix + "_" + Date.now() + "_" + random;
  }

  function localDateKey(value) {
    const date = value instanceof Date ? value : new Date(value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
  }

  function getEmployees() {
    return read().employees.sort((a, b) => a.name.localeCompare(b.name));
  }

  function getSections() {
    return [...new Set(getEmployees().map((student) => student.role).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b));
  }

  function seedSampleStudents() {
    const data = read();
    if (data.sampleStudentsSeeded) return 0;

    const firstNames = ["Aaron", "Bianca", "Carlo", "Denise", "Ethan", "Faith", "Gabriel", "Hannah", "Ivan", "Julia"];
    const lastNames = ["Aquino", "Bautista", "Cruz", "Domingo", "Evangelista", "Flores", "Garcia", "Hernandez", "Ignacio", "Jimenez"];
    const sections = [
      "Grade 7 - Rizal", "Grade 7 - Mabini", "Grade 8 - Bonifacio", "Grade 8 - Luna",
      "Grade 9 - Jacinto", "Grade 9 - Del Pilar", "Grade 10 - Aguinaldo", "Grade 10 - Silang",
      "Grade 11 - STEM A", "Grade 12 - HUMSS A"
    ];
    const existingCodes = new Set(data.employees.map((student) => student.code.toUpperCase()));
    let added = 0;

    for (let index = 0; index < 100; index += 1) {
      const code = "2026-" + String(index + 1).padStart(3, "0");
      if (existingCodes.has(code)) continue;
      data.employees.push({
        id: makeId("emp"),
        name: firstNames[index % firstNames.length] + " " + String.fromCharCode(65 + (index % 26)) + ". " + lastNames[Math.floor(index / 10)],
        code,
        role: sections[Math.floor(index / 10)],
        createdAt: new Date().toISOString()
      });
      added += 1;
    }

    data.sampleStudentsSeeded = true;
    write(data);
    return added;
  }

  function addEmployee(employee) {
    const data = read();
    const code = employee.code.trim().toUpperCase();
    if (data.employees.some((item) => item.code.toUpperCase() === code)) {
      throw new Error("May gumagamit na ng Student ID na ito.");
    }
    const newEmployee = {
      id: makeId("emp"),
      name: employee.name.trim(),
      code,
      role: employee.role.trim(),
      createdAt: new Date().toISOString()
    };
    data.employees.push(newEmployee);
    write(data);
    return newEmployee;
  }

  function updateEmployee(id, updates) {
    const data = read();
    const employee = data.employees.find((item) => item.id === id);
    if (!employee) throw new Error("Hindi makita ang estudyante.");
    const code = updates.code.trim().toUpperCase();
    if (data.employees.some((item) => item.id !== id && item.code.toUpperCase() === code)) {
      throw new Error("May gumagamit na ng Student ID na ito.");
    }
    employee.name = updates.name.trim();
    employee.code = code;
    employee.role = updates.role.trim();
    write(data);
    return employee;
  }

  function deleteEmployee(id) {
    const data = read();
    const hasRecords = data.attendance.some((record) => record.employeeId === id);
    if (hasRecords) throw new Error("May attendance record ang estudyanteng ito kaya hindi siya maaaring burahin.");
    data.employees = data.employees.filter((item) => item.id !== id);
    write(data);
  }

  function getAttendance() {
    return read().attendance.sort((a, b) => new Date(b.timeIn) - new Date(a.timeIn));
  }

  function getAttendanceForDate(dateKey) {
    return getAttendance().filter((record) => localDateKey(record.timeIn) === dateKey);
  }

  function getOpenAttendance(employeeId) {
    return getAttendance().find((record) => record.employeeId === employeeId && !record.timeOut) || null;
  }

  function timeIn(employeeId) {
    const data = read();
    const employee = data.employees.find((item) => item.id === employeeId);
    if (!employee) throw new Error("Hindi makita ang estudyante.");
    if (data.attendance.some((record) => record.employeeId === employeeId && !record.timeOut)) {
      throw new Error("Naka-time in na ang estudyanteng ito.");
    }
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();
    const record = {
      id: makeId("log"),
      employeeId,
      employeeName: employee.name,
      employeeCode: employee.code,
      timeIn: now.toISOString(),
      timeOut: null,
      status: minutes > 8 * 60 + 15 ? "Late" : "On time"
    };
    data.attendance.push(record);
    write(data);
    return record;
  }

  function timeOut(employeeId) {
    const data = read();
    const record = data.attendance
      .filter((item) => item.employeeId === employeeId && !item.timeOut)
      .sort((a, b) => new Date(b.timeIn) - new Date(a.timeIn))[0];
    if (!record) throw new Error("Walang aktibong time in para sa estudyanteng ito.");
    record.timeOut = new Date().toISOString();
    write(data);
    return record;
  }

  function deleteAttendance(id) {
    const data = read();
    data.attendance = data.attendance.filter((record) => record.id !== id);
    write(data);
  }

  function exportBackup() {
    return JSON.stringify(read(), null, 2);
  }

  function importBackup(jsonText) {
    const parsed = JSON.parse(jsonText);
    if (!parsed || !Array.isArray(parsed.employees) || !Array.isArray(parsed.attendance)) {
      throw new Error("Hindi valid na attendance backup ang file.");
    }
    write({ version: 1, employees: parsed.employees, attendance: parsed.attendance, sampleStudentsSeeded: true });
  }

  function reset() {
    const data = emptyDatabase();
    data.sampleStudentsSeeded = true;
    write(data);
  }

  window.AttendanceDB = {
    localDateKey,
    getEmployees,
    getSections,
    seedSampleStudents,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getAttendance,
    getAttendanceForDate,
    getOpenAttendance,
    timeIn,
    timeOut,
    deleteAttendance,
    exportBackup,
    importBackup,
    reset
  };
})();