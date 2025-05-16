// URL sumber data CSV
const CSV_URL = 'https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLjz_-3__b_SfzKznR6avvABfMNoW8GAI4znLUBQREsFuKNtV-Tzu_EIm5z1C1pkoGpQQlyKWk39KGUkEdbjz-5Xm0EmHNA3Z4tcs38UZZvvFxJHwmHAxVXt3oDsZYQZIUDR3mYYoWtH7wR0cpi5jbiGSe5nHkKNA6NUS2JDy6oGodO16vHOILtqAjab9sslYGEYfNHHo-hdP-TvDEFjZ5HMvVTzls1alwqrQeWrE8nucTVQ1StBETYaC1MgMSfLumQBPNtXxX21UQq1iLljjx_wE6uUqw&lib=MgOyUZw9O4lSTxSssbhJMq2RrRt3Unk6i ';

const scheduleContainer = document.getElementById('schedule');

// Smooth Scroll Navigation
document.querySelectorAll('.glass-navbar a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
  });
});

// Hamburger Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  // Tutup menu saat klik link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });
}

// Tampilkan indikator loading
function showLoading() {
  scheduleContainer.innerHTML = '<div class="loading">Memuat jadwal...</div>';
}

// Muat data jadwal dari CSV
function loadSchedule() {
  showLoading();

  fetch(CSV_URL)
    .then(response => {
      if (!response.ok) throw new Error("Jaringan bermasalah");
      return response.json();
    })
    .then(data => {
      scheduleContainer.innerHTML = '';

      if (!Array.isArray(data) || data.length === 0) {
        scheduleContainer.innerHTML = '<p>Tidak ada jadwal streaming ditemukan.</p>';
        return;
      }

      renderTimeline(data);

      // Animasi fade-in
      setTimeout(() => {
        scheduleContainer.style.opacity = '1';
        scheduleContainer.style.transform = 'translateY(0)';
      }, 100);
    })
    .catch(error => {
      console.error('Gagal memuat data:', error);
      scheduleContainer.innerHTML = '<p>Gagal memuat jadwal. Silakan coba lagi nanti.</p>';
    });
}

// Render timeline jadwal
function renderTimeline(data) {
  scheduleContainer.innerHTML = '';

  // Scroll event untuk navbar
  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.glass-navbar');
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Reset transformasi untuk animasi ulang
  scheduleContainer.style.opacity = '0';
  scheduleContainer.style.transform = 'translateY(20px)';

  data.forEach((row, index) => {
    if (!row || row.length < 2 || !row[0] || !row[1]) return;

    const tanggal = (row[1] || '').trim().toUpperCase();
    const waktu = (row[2] || '').trim();
    const agenda = (row[3] || '').trim();

    // Deteksi hari dari tanggal (format: HARI-tanggal)
    const hari = tanggal.split('-')[0].trim();

    // Tentukan apakah ini OFF/LIBUR
    const isOffOrLibur =
      tanggal.includes("OFF") ||
      tanggal.includes("LIBUR") ||
      waktu.includes("OFF") ||
      waktu.includes("LIBUR") ||
      agenda.includes("OFF") ||
      agenda.includes("LIBUR");

    // Buat elemen item timeline
    const scheduleItem = document.createElement('div');
    scheduleItem.className = 'schedule-item';

    // Elemen Hari
    const dayElement = document.createElement('span');
    dayElement.className = 'schedule-day';
    dayElement.textContent = hari;

    // Jika OFF/LIBUR, tambahkan kelas khusus untuk warna merah
    if (isOffOrLibur) {
      dayElement.classList.add('off-or-libur');
    }

    // Elemen Info Jadwal
    const infoElement = document.createElement('div');
    infoElement.className = 'schedule-info';

    const agendaText = document.createElement('p');
    agendaText.className = 'info-agenda'; // 🔹 Kelas baru
    agendaText.textContent = agenda || '-';
    agendaText.title = agenda || '-'; // 🔎 Tooltip saat hover

    const timeText = document.createElement('p');
    timeText.className = 'info-time'; // 🔹 Kelas baru
    timeText.textContent = waktu || '-';

    infoElement.appendChild(agendaText);
    infoElement.appendChild(timeText);

    scheduleItem.appendChild(dayElement);
    scheduleItem.appendChild(infoElement);

    scheduleContainer.appendChild(scheduleItem);
  });
}

// Jalankan fungsi muat jadwal saat halaman dibuka
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
