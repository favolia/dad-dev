// script.js

const CSV_URL = 'https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLjz_-3__b_SfzKznR6avvABfMNoW8GAI4znLUBQREsFuKNtV-Tzu_EIm5z1C1pkoGpQQlyKWk39KGUkEdbjz-5Xm0EmHNA3Z4tcs38UZZvvFxJHwmHAxVXt3oDsZYQZIUDR3mYYoWtH7wR0cpi5jbiGSe5nHkKNA6NUS2JDy6oGodO16vHOILtqAjab9sslYGEYfNHHo-hdP-TvDEFjZ5HMvVTzls1alwqrQeWrE8nucTVQ1StBETYaC1MgMSfLumQBPNtXxX21UQq1iLljjx_wE6uUqw&lib=MgOyUZw9O4lSTxSssbhJMq2RrRt3Unk6i';
const scheduleContainer = document.getElementById('schedule');

fetch(CSV_URL)
  .then(response => response.json())
  .then(data => {
    // Kosongkan container dulu
    scheduleContainer.innerHTML = '';

    if (!Array.isArray(data) || data.length === 0) {
      scheduleContainer.innerHTML = '<p>Tidak ada jadwal streaming ditemukan.</p>';
      return;
    }

    // Buat tabel
    const table = document.createElement('table');
    table.className = 'schedule-table';

    // Header tabel
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

    // Body tabel
    const tbody = document.createElement('tbody');

    data.forEach((row, index) => {
      // Lewati baris kosong atau tidak sesuai format
      if (!row || row.length < 2 || !row[0] || !row[1]) return;

      const tr = document.createElement('tr');

      const no = row[0];
      const tanggal = row[1];
      const waktu = row[2] || '-';
      const agenda = row[3] || '-';

      tr.innerHTML = `
        <td>${no}</td>
        <td>${tanggal}</td>
        <td>${waktu}</td>
        <td>${agenda}</td>
      `;

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    scheduleContainer.appendChild(table);
  })
  .catch(error => {
    console.error('Gagal memuat data:', error);
    scheduleContainer.innerHTML = '<p>Gagal memuat jadwal. Silakan coba lagi nanti.</p>';
  });