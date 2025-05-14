const CSV_URL = 'https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLjz_-3__b_SfzKznR6avvABfMNoW8GAI4znLUBQREsFuKNtV-Tzu_EIm5z1C1pkoGpQQlyKWk39KGUkEdbjz-5Xm0EmHNA3Z4tcs38UZZvvFxJHwmHAxVXt3oDsZYQZIUDR3mYYoWtH7wR0cpi5jbiGSe5nHkKNA6NUS2JDy6oGodO16vHOILtqAjab9sslYGEYfNHHo-hdP-TvDEFjZ5HMvVTzls1alwqrQeWrE8nucTVQ1StBETYaC1MgMSfLumQBPNtXxX21UQq1iLljjx_wE6uUqw&lib=MgOyUZw9O4lSTxSssbhJMq2RrRt3Unk6i ';
const scheduleContainer = document.getElementById('schedule');

// Show loading indicator
function showLoading() {
  scheduleContainer.innerHTML = '<div class="loading">Memuat jadwal...</div>';
}

// Load schedule data
function loadSchedule() {
  showLoading();

  fetch(CSV_URL)
    .then(response => response.json())
    .then(data => {
      scheduleContainer.innerHTML = '';

      if (!Array.isArray(data) || data.length === 0) {
        scheduleContainer.innerHTML = '<p>Tidak ada jadwal streaming ditemukan.</p>';
        return;
      }

      const isMobile = window.matchMedia("(max-width: 600px)").matches;

      if (isMobile) {
        renderCards(data);
      } else {
        renderTable(data);
      }

      // Responsive re-render
      window.addEventListener('resize', () => {
        if (window.matchMedia("(max-width: 600px)").matches) {
          renderCards(data);
        } else {
          renderTable(data);
        }
      });

    })
    .catch(error => {
      console.error('Gagal memuat data:', error);
      scheduleContainer.innerHTML = '<p>Gagal memuat jadwal. Silakan coba lagi nanti.</p>';
    });
}

// Render as table (desktop)
function renderTable(data) {
  scheduleContainer.innerHTML = '';
  const table = document.createElement('table');
  table.className = 'schedule-table';

  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  headerRow.innerHTML = `
    <th>NO</th>
    <th>TANGGAL</th>
    <th>WAKTU</th>
    <th>AGENDA KEGIATAN</th>
  `;
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');

  data.forEach((row, index) => {
    if (!row || row.length < 2 || !row[0] || !row[1]) return;

    const tr = document.createElement('tr');
    
    // Normalize values to check for OFF/Libur
    const tanggal = (row[1] || '').trim().toUpperCase();
    const waktu = (row[2] || '').trim().toUpperCase();
    const agenda = (row[3] || '').trim().toUpperCase();

    // Check for OFF or Libur
    if (tanggal.includes("OFF") || waktu.includes("OFF") || agenda.includes("OFF") ||
        tanggal.includes("LIBUR") || waktu.includes("LIBUR") || agenda.includes("LIBUR")) {
      tr.style.backgroundColor = "#ffe0e0"; // Light red
      tr.style.color = "#b30000";
    } 
    // Check if all fields are filled
    else if (row[1] && row[2] && row[3]) {
      tr.style.backgroundColor = "#e0f7fa"; // Light blue
      tr.style.color = "#00695c";
    }

    tr.innerHTML = `
      <td>${row[0]}</td>
      <td>${row[1]}</td>
      <td>${row[2] || '-'}</td>
      <td>${row[3] || '-'}</td>
    `;
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  scheduleContainer.appendChild(table);
}

// Render as cards (mobile)
function renderCards(data) {
  scheduleContainer.innerHTML = '';
  data.forEach((row, index) => {
    if (!row || row.length < 2 || !row[0] || !row[1]) return;

    const card = document.createElement('div');
    card.className = 'schedule-card';

    const tanggal = (row[1] || '').toUpperCase();
    const waktu = (row[2] || '').toUpperCase();
    const agenda = (row[3] || '').toUpperCase();

    let bgColor = "#fff";
    let textColor = "#333";

    if (tanggal.includes("OFF") || waktu.includes("OFF") || agenda.includes("OFF") ||
        tanggal.includes("LIBUR") || waktu.includes("LIBUR") || agenda.includes("LIBUR")) {
      bgColor = "#ffe0e0";
      textColor = "#b30000";
    } else if (row[1] && row[2] && row[3]) {
      bgColor = "#e0f7fa";
      textColor = "#00695c";
    }

    card.style.backgroundColor = bgColor;
    card.style.color = textColor;

    card.innerHTML = `
      <p><strong>No:</strong> ${row[0]}</p>
      <p><strong>Tanggal:</strong> ${row[1]}</p>
      <p><strong>Waktu:</strong> ${row[2] || '-'}</p>
      <p><strong>Agenda:</strong> ${row[3] || '-'}</p>
    `;
    scheduleContainer.appendChild(card);
  });
}

// Call load function
loadSchedule();

// Toggle Dark Mode
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const icon = themeToggle.querySelector('i');
  if (document.body.classList.contains('dark-mode')) {
    icon.classList.replace('fa-moon', 'fa-sun');
  } else {
    icon.classList.replace('fa-sun', 'fa-moon');
  }
});
