(function () {
  "use strict";

  const db = window.AttendanceDB;
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const TODAY = () => db.localDateKey(new Date());

  const elements = {
    clockSectionSelect: $("#clockSectionSelect"),
    employeeSelect: $("#employeeSelect"),
    employeeSectionFilter: $("#employeeSectionFilter"),
    recordSectionFilter: $("#recordSectionFilter"),
    recordEmployeeFilter: $("#recordEmployeeFilter"),
    employeeStatus: $("#employeeStatus"),
    timeInButton: $("#timeInButton"),
    timeOutButton: $("#timeOutButton"),
    employeeDialog: $("#employeeDialog"),
    backupDialog: $("#backupDialog"),
    employeeForm: $("#employeeForm"),
    employeeGrid: $("#employeeGrid"),
    employeeEmptyState: $("#employeeEmptyState"),
    todayTableBody: $("#todayTableBody"),
    todayEmptyState: $("#todayEmptyState"),
    recordsTableBody: $("#recordsTableBody"),
    recordsEmptyState: $("#recordsEmptyState"),
    toast: $("#toast"),
    themeToggle: $("#themeToggle")
  };

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function formatTime(value) {
    if (!value) return "—";
    return new Intl.DateTimeFormat("en-PH", { hour: "numeric", minute: "2-digit", hour12: true }).format(new Date(value));
  }

  function formatDate(value) {
    return new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
  }

  function hoursBetween(record, includeRunning = false) {
    if (!record.timeOut && !includeRunning) return null;
    const end = record.timeOut ? new Date(record.timeOut) : new Date();
    return Math.max(0, (end - new Date(record.timeIn)) / 3600000);
  }

  function initials(name) {
    return name.split(/\s+/).slice(0, 2).map((part) => part[0] || "").join("").toUpperCase();
  }

  function showToast(message, type = "success") {
    elements.toast.textContent = message;
    elements.toast.className = `toast show ${type}`;
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => elements.toast.className = "toast", 3200);
  }

  function downloadFile(filename, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  const THEME_KEY = "attendance_theme";

  function getSavedTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (error) {
      return null;
    }
  }

  function applyTheme(theme) {
    const selectedTheme = theme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = selectedTheme;
    elements.themeToggle.setAttribute(
      "aria-label",
      selectedTheme === "dark" ? "Use light mode" : "Use dark mode"
    );

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.setAttribute("content", selectedTheme === "dark" ? "#091225" : "#132f68");
    }
  }

  function initializeTheme() {
    const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    applyTheme(getSavedTheme() || preferredTheme);
  }

  function toggleTheme() {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(THEME_KEY, nextTheme);
    } catch (error) {
      // The theme still changes for this visit when storage is unavailable.
    }
    applyTheme(nextTheme);
  }

  function updateClock() {
    const now = new Date();
    $("#liveTime").textContent = new Intl.DateTimeFormat("en-PH", { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true }).format(now);
    $("#todayLabel").textContent = new Intl.DateTimeFormat("en-PH", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(now);

    const hour = now.getHours();
    const greeting = hour < 12
      ? "Good morning!"
      : hour < 18
        ? "Good afternoon!"
        : "Good evening!";
    const heroGreeting = $("#heroGreeting");
    if (heroGreeting) heroGreeting.textContent = greeting;
  }

  function populateEmployeeOptions() {
    const selectedStudent = elements.employeeSelect.value;
    const selectedClockSection = elements.clockSectionSelect.value;
    const selectedDirectorySection = elements.employeeSectionFilter.value;
    const selectedRecordSection = elements.recordSectionFilter.value;
    const selectedRecordStudent = elements.recordEmployeeFilter.value;
    const students = db.getEmployees();
    const sections = db.getSections();
    const sectionOptions = sections.map((section) => `<option value="${escapeHtml(section)}">${escapeHtml(section)}</option>`).join("");

    elements.clockSectionSelect.innerHTML = '<option value="">Select a section</option>' + sectionOptions;
    elements.employeeSectionFilter.innerHTML = '<option value="">All sections</option>' + sectionOptions;
    elements.recordSectionFilter.innerHTML = '<option value="">All sections</option>' + sectionOptions;

    if (sections.includes(selectedClockSection)) elements.clockSectionSelect.value = selectedClockSection;
    if (sections.includes(selectedDirectorySection)) elements.employeeSectionFilter.value = selectedDirectorySection;
    if (sections.includes(selectedRecordSection)) elements.recordSectionFilter.value = selectedRecordSection;

    const clockSection = elements.clockSectionSelect.value;
    const sectionStudents = clockSection ? students.filter((student) => student.role === clockSection) : [];
    elements.employeeSelect.disabled = !clockSection;
    elements.employeeSelect.innerHTML = (clockSection
      ? '<option value="">Select a student</option>'
      : '<option value="">Select a section first</option>') +
      sectionStudents.map((student) => `<option value="${student.id}">${escapeHtml(student.name)} · ${escapeHtml(student.code)}</option>`).join("");
    elements.recordEmployeeFilter.innerHTML = '<option value="">All</option>' +
      students.map((student) => `<option value="${student.id}">${escapeHtml(student.name)}</option>`).join("");

    if (sectionStudents.some((student) => student.id === selectedStudent)) elements.employeeSelect.value = selectedStudent;
    if (students.some((student) => student.id === selectedRecordStudent)) elements.recordEmployeeFilter.value = selectedRecordStudent;
  }

  function renderEmployeeStatus() {
    const employeeId = elements.employeeSelect.value;
    if (!elements.clockSectionSelect.value) {
      elements.employeeStatus.textContent = "Select a section first.";
      elements.employeeStatus.className = "status-line";
      elements.timeInButton.disabled = true;
      elements.timeOutButton.disabled = true;
      return;
    }
    if (!employeeId) {
      elements.employeeStatus.textContent = "Select a student first.";
      elements.employeeStatus.className = "status-line";
      elements.timeInButton.disabled = true;
      elements.timeOutButton.disabled = true;
      return;
    }
    const openRecord = db.getOpenAttendance(employeeId);
    if (openRecord) {
      elements.employeeStatus.textContent = `Timed in since ${formatTime(openRecord.timeIn)}.`;
      elements.employeeStatus.className = "status-line active";
      elements.timeInButton.disabled = true;
      elements.timeOutButton.disabled = false;
    } else {
      elements.employeeStatus.textContent = "Ready to time in.";
      elements.employeeStatus.className = "status-line ready";
      elements.timeInButton.disabled = false;
      elements.timeOutButton.disabled = true;
    }
  }

  function renderDashboard() {
    const records = db.getAttendanceForDate(TODAY());
    const studentsById = new Map(db.getEmployees().map((student) => [student.id, student]));
    $("#presentCount").textContent = new Set(records.map((item) => item.employeeId)).size;
    $("#lateCount").textContent = records.filter((item) => item.status === "Late").length;
    $("#totalHours").textContent = records.reduce((total, item) => total + (hoursBetween(item, true) || 0), 0).toFixed(1);
    $("#employeeCount").textContent = db.getEmployees().length;

    elements.todayTableBody.innerHTML = records.map((record) => {
      const section = studentsById.get(record.employeeId)?.role || "No section";
      return `
      <tr>
        <td><div class="person-cell"><span class="avatar">${escapeHtml(initials(record.employeeName))}</span><div><strong>${escapeHtml(record.employeeName)}</strong><small>${escapeHtml(record.employeeCode)}</small></div></div></td>
        <td><span class="section-chip">${escapeHtml(section)}</span></td>
        <td>${formatTime(record.timeIn)}</td>
        <td>${formatTime(record.timeOut)}</td>
        <td>${record.timeOut ? `${hoursBetween(record).toFixed(1)} h` : '<span class="muted">In progress</span>'}</td>
        <td><span class="status-badge ${record.status === "Late" ? "late" : "ontime"}">${escapeHtml(record.status)}</span></td>
      </tr>`;
    }).join("");
    elements.todayEmptyState.hidden = records.length > 0;
  }

  function renderEmployees() {
    const query = $("#employeeSearch").value.trim().toLowerCase();
    const selectedSection = elements.employeeSectionFilter.value;
    const students = db.getEmployees().filter((student) =>
      (!selectedSection || student.role === selectedSection) &&
      `${student.name} ${student.code} ${student.role}`.toLowerCase().includes(query)
    );
    $("#employeeResultCount").textContent = `${students.length} student${students.length === 1 ? "" : "s"}`;

    const groupedStudents = students.reduce((groups, student) => {
      const section = student.role || "No section";
      if (!groups[section]) groups[section] = [];
      groups[section].push(student);
      return groups;
    }, {});

    elements.employeeGrid.innerHTML = Object.keys(groupedStudents).sort((a, b) => a.localeCompare(b)).map((section) => `
      <section class="section-group">
        <div class="section-heading">
          <div><span class="section-dot"></span><h3>${escapeHtml(section)}</h3></div>
          <span>${groupedStudents[section].length} student${groupedStudents[section].length === 1 ? "" : "s"}</span>
        </div>
        <div class="employee-grid">
          ${groupedStudents[section].map((student) => `
            <article class="employee-card">
              <span class="avatar large">${escapeHtml(initials(student.name))}</span>
              <div class="employee-info"><h3>${escapeHtml(student.name)}</h3><p>${escapeHtml(student.role)}</p><small>${escapeHtml(student.code)}</small></div>
              <div class="card-menu">
                <button class="icon-button edit-employee" data-id="${student.id}" type="button" aria-label="Edit ${escapeHtml(student.name)}">✎</button>
                <button class="icon-button delete-employee" data-id="${student.id}" type="button" aria-label="Delete ${escapeHtml(student.name)}">×</button>
              </div>
            </article>`).join("")}
        </div>
      </section>`).join("");
    elements.employeeEmptyState.hidden = students.length > 0;

    $$(".edit-employee").forEach((button) => button.addEventListener("click", () => openEmployeeDialog(button.dataset.id)));
    $$(".delete-employee").forEach((button) => button.addEventListener("click", () => removeEmployee(button.dataset.id)));
  }

  function renderRecords() {
    const date = $("#recordDateFilter").value;
    const employeeId = elements.recordEmployeeFilter.value;
    const selectedSection = elements.recordSectionFilter.value;
    const studentsById = new Map(db.getEmployees().map((student) => [student.id, student]));
    const records = db.getAttendance().filter((record) => {
      const section = studentsById.get(record.employeeId)?.role || "";
      return (!date || db.localDateKey(record.timeIn) === date) &&
        (!employeeId || record.employeeId === employeeId) &&
        (!selectedSection || section === selectedSection);
    });
    elements.recordsTableBody.innerHTML = records.map((record) => {
      const section = studentsById.get(record.employeeId)?.role || "No section";
      return `
      <tr>
        <td>${formatDate(record.timeIn)}</td>
        <td><div class="person-cell"><span class="avatar">${escapeHtml(initials(record.employeeName))}</span><div><strong>${escapeHtml(record.employeeName)}</strong><small>${escapeHtml(record.employeeCode)}</small></div></div></td>
        <td><span class="section-chip">${escapeHtml(section)}</span></td>
        <td>${formatTime(record.timeIn)}</td>
        <td>${formatTime(record.timeOut)}</td>
        <td>${record.timeOut ? `${hoursBetween(record).toFixed(2)} h` : "—"}</td>
        <td><span class="status-badge ${record.status === "Late" ? "late" : "ontime"}">${escapeHtml(record.status)}</span></td>
        <td><button class="icon-button delete-record" data-id="${record.id}" type="button" aria-label="Delete record">×</button></td>
      </tr>`;
    }).join("");
    elements.recordsEmptyState.hidden = records.length > 0;
    $$(".delete-record").forEach((button) => button.addEventListener("click", () => removeRecord(button.dataset.id)));
  }

  function renderAll() {
    populateEmployeeOptions();
    renderEmployeeStatus();
    renderDashboard();
    renderEmployees();
    renderRecords();
  }

  function openEmployeeDialog(employeeId = "") {
    elements.employeeForm.reset();
    $("#editingEmployeeId").value = employeeId;
    if (employeeId) {
      const employee = db.getEmployees().find((item) => item.id === employeeId);
      if (!employee) return;
      $("#employeeDialogTitle").textContent = "Edit Student";
      $("#employeeNameInput").value = employee.name;
      $("#employeeCodeInput").value = employee.code;
      $("#employeeRoleInput").value = employee.role;
    } else {
      $("#employeeDialogTitle").textContent = "New Student";
    }
    elements.employeeDialog.showModal();
    setTimeout(() => $("#employeeNameInput").focus(), 50);
  }

  function saveEmployee() {
    if (!elements.employeeForm.reportValidity()) return;
    const employee = {
      name: $("#employeeNameInput").value,
      code: $("#employeeCodeInput").value,
      role: $("#employeeRoleInput").value
    };
    try {
      const editingId = $("#editingEmployeeId").value;
      if (editingId) db.updateEmployee(editingId, employee);
      else db.addEmployee(employee);
      elements.employeeDialog.close();
      renderAll();
      showToast(editingId ? "Student updated." : "Student added.");
    } catch (error) {
      showToast(error.message, "error");
    }
  }

  function removeEmployee(id) {
    const employee = db.getEmployees().find((item) => item.id === id);
    if (!employee || !confirm(`Delete ${employee.name}?`)) return;
    try {
      db.deleteEmployee(id);
      renderAll();
      showToast("Student deleted.");
    } catch (error) {
      showToast(error.message, "error");
    }
  }

  function removeRecord(id) {
    if (!confirm("Delete this attendance record?")) return;
    db.deleteAttendance(id);
    renderAll();
    showToast("Attendance record deleted.");
  }

  function changeSection() {
    const sectionId = location.hash.slice(1) || "dashboard";
    const validSection = ["dashboard", "employees", "records"].includes(sectionId) ? sectionId : "dashboard";
    $$(".page-section").forEach((section) => section.classList.toggle("active", section.id === validSection));
    $$('[data-section-link]').forEach((link) => link.classList.toggle("active", link.dataset.sectionLink === validSection));
    $("#pageTitle").textContent = { dashboard: "Dashboard", employees: "Students", records: "Attendance Records" }[validSection];
    document.body.classList.remove("menu-open");
    $("#menuButton").setAttribute("aria-expanded", "false");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function exportCsv() {
    const records = db.getAttendance();
    if (!records.length) return showToast("There are no records to export.", "error");
    const studentsById = new Map(db.getEmployees().map((student) => [student.id, student]));
    const rows = [["Date", "Student ID", "Name", "Section", "Time In", "Time Out", "Hours", "Status"]];
    records.forEach((record) => rows.push([
      db.localDateKey(record.timeIn), record.employeeCode, record.employeeName,
      studentsById.get(record.employeeId)?.role || "",
      formatTime(record.timeIn), formatTime(record.timeOut),
      record.timeOut ? hoursBetween(record).toFixed(2) : "", record.status
    ]));
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\r\n");
    downloadFile(`attendance-${TODAY()}.csv`, "\ufeff" + csv, "text/csv;charset=utf-8");
    showToast("CSV file downloaded.");
  }

  elements.timeInButton.addEventListener("click", () => {
    try {
      db.timeIn(elements.employeeSelect.value);
      renderAll();
      showToast("Time in recorded successfully.");
    } catch (error) { showToast(error.message, "error"); }
  });

  elements.timeOutButton.addEventListener("click", () => {
    try {
      db.timeOut(elements.employeeSelect.value);
      renderAll();
      showToast("Time out recorded successfully.");
    } catch (error) { showToast(error.message, "error"); }
  });

  elements.clockSectionSelect.addEventListener("change", () => {
    elements.employeeSelect.value = "";
    populateEmployeeOptions();
    renderEmployeeStatus();
  });
  elements.employeeSelect.addEventListener("change", renderEmployeeStatus);
  $("#quickAddButton").addEventListener("click", () => openEmployeeDialog());
  $("#addEmployeeButton").addEventListener("click", () => openEmployeeDialog());
  $("#saveEmployeeButton").addEventListener("click", saveEmployee);
  $("#employeeSearch").addEventListener("input", renderEmployees);
  elements.employeeSectionFilter.addEventListener("change", renderEmployees);
  $("#recordDateFilter").addEventListener("change", renderRecords);
  elements.recordSectionFilter.addEventListener("change", () => {
    elements.recordEmployeeFilter.value = "";
    renderRecords();
  });
  elements.recordEmployeeFilter.addEventListener("change", renderRecords);
  $("#clearFiltersButton").addEventListener("click", () => {
    $("#recordDateFilter").value = "";
    elements.recordSectionFilter.value = "";
    elements.recordEmployeeFilter.value = "";
    renderRecords();
  });
  $("#exportCsvButton").addEventListener("click", exportCsv);
  $("#openBackupButton").addEventListener("click", () => elements.backupDialog.showModal());
  $("#closeBackupButton").addEventListener("click", () => elements.backupDialog.close());
  $("#downloadBackupButton").addEventListener("click", () => {
    downloadFile(`attendance-backup-${TODAY()}.json`, db.exportBackup(), "application/json");
    showToast("Backup downloaded.");
  });
  $("#restoreFileInput").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      db.importBackup(await file.text());
      elements.backupDialog.close();
      renderAll();
      showToast("Backup restored successfully.");
    } catch (error) { showToast(error.message, "error"); }
    event.target.value = "";
  });
  $("#resetDataButton").addEventListener("click", () => {
    if (!confirm("Are you sure you want to delete all students and attendance records?")) return;
    db.reset();
    elements.backupDialog.close();
    renderAll();
    showToast("All data deleted.");
  });
  $("#menuButton").addEventListener("click", () => {
    document.body.classList.toggle("menu-open");
    $("#menuButton").setAttribute("aria-expanded", document.body.classList.contains("menu-open"));
  });
  $("#sidebarBackdrop").addEventListener("click", () => document.body.classList.remove("menu-open"));
  elements.themeToggle.addEventListener("click", toggleTheme);
  window.addEventListener("hashchange", changeSection);

  db.seedSampleStudents();
  initializeTheme();
  updateClock();
  setInterval(updateClock, 1000);
  changeSection();
  renderAll();
})();
