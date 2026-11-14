// ============================================
// APLIKASI CRYPTO MARKET
// MSIM4401 - TUGAS 03
// HTML, CSS, JAVASCRIPT
// API COINLORE
// ============================================

// 1. ALAMAT API COINLORE

const API_URL = "https://api.coinlore.net/api/tickers/?start=0&limit=100";

// 2. MENGAMBIL ELEMEN HTML

const cryptoList = document.getElementById("cryptoList");

const refreshButton = document.getElementById("refreshButton");

const updateStatus = document.getElementById("updateStatus");

const errorMessage = document.getElementById("errorMessage");

// 3. FORMAT HARGA USD

function formatPrice(price) {
  const number = Number(price);

  if (!Number.isFinite(number)) {
    return "N/A";
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(number);
}

// 4. MEMBUAT ELEMEN KOLOM

function createColumn(className, label, value) {
  const column = document.createElement("div");

  column.className = className;

  const labelElement = document.createElement("span");

  labelElement.className = "crypto-label";

  labelElement.textContent = label;

  const valueElement = document.createElement("strong");

  valueElement.textContent = value;

  column.appendChild(labelElement);

  column.appendChild(valueElement);

  return column;
}

// 5. MENAMPILKAN DATA CRYPTOCURRENCY

function displayCrypto(data) {
  // Menghapus data sebelumnya
  cryptoList.replaceChildren();

  // Mengurutkan berdasarkan rank
  const sortedData = [...data].sort((a, b) => {
    return Number(a.rank) - Number(b.rank);
  });

  // Mengambil tujuh data teratas
  const topCrypto = sortedData.slice(0, 7);

  // Memeriksa ketersediaan data
  if (topCrypto.length === 0) {
    throw new Error("Data cryptocurrency kosong.");
  }

  // Menampilkan setiap cryptocurrency
  topCrypto.forEach((coin) => {
    // Membuat baris cryptocurrency
    const item = document.createElement("div");

    item.className = "crypto-item";

    // Kolom rank
    const rankColumn = createColumn("crypto-rank", "Rank", coin.rank ?? "-");

    // Kolom nama
    const nameColumn = document.createElement("div");

    nameColumn.className = "crypto-name";

    const nameLabel = document.createElement("span");

    nameLabel.className = "crypto-label";

    nameLabel.textContent = "Name";

    const nameValue = document.createElement("strong");

    nameValue.textContent = coin.name ?? "Unknown";

    const symbolValue = document.createElement("span");

    symbolValue.textContent = coin.symbol ?? "-";

    nameColumn.appendChild(nameLabel);

    nameColumn.appendChild(nameValue);

    nameColumn.appendChild(symbolValue);

    // Kolom harga USD
    const priceColumn = createColumn(
      "crypto-price",
      "USD",
      formatPrice(coin.price_usd),
    );

    // Menggabungkan semua kolom
    item.appendChild(rankColumn);

    item.appendChild(nameColumn);

    item.appendChild(priceColumn);

    // Memasukkan ke daftar
    cryptoList.appendChild(item);
  });
}

// 6. MENGAMBIL DATA DARI API

async function loadCryptoData() {
  // Mengaktifkan loading
  refreshButton.disabled = true;

  refreshButton.classList.add("loading");

  updateStatus.textContent = "Sedang mengambil data...";

  errorMessage.style.display = "none";

  cryptoList.replaceChildren();

  const loadingElement = document.createElement("div");

  loadingElement.className = "loading";

  loadingElement.textContent = "Memuat data cryptocurrency...";

  cryptoList.appendChild(loadingElement);

  try {
    // Mengirim request API
    const response = await fetch(API_URL);

    // Memeriksa respons server
    if (!response.ok) {
      throw new Error("Gagal mengakses API. Status: " + response.status);
    }

    // Mengubah respons menjadi JSON
    const result = await response.json();

    // Memeriksa struktur data API
    if (!result || !Array.isArray(result.data)) {
      throw new Error("Format data dari API tidak sesuai.");
    }

    // Menampilkan data cryptocurrency
    displayCrypto(result.data);

    // Menampilkan waktu pembaruan
    const currentTime = new Date();

    updateStatus.textContent =
      "Terakhir diperbarui: " + currentTime.toLocaleTimeString("id-ID");
  } catch (error) {
    // Menampilkan error di console
    console.error("Kesalahan:", error);

    // Membersihkan daftar
    cryptoList.replaceChildren();

    const errorElement = document.createElement("div");

    errorElement.className = "loading";

    errorElement.textContent = "Data gagal dimuat.";

    cryptoList.appendChild(errorElement);

    // Menampilkan pesan kesalahan
    errorMessage.textContent =
      "Tidak dapat mengambil data cryptocurrency. " +
      "Periksa koneksi internet atau coba tekan Refresh kembali. " +
      "Detail: " +
      error.message;

    errorMessage.style.display = "block";

    updateStatus.textContent = "Gagal memperbarui data.";
  } finally {
    // Mengembalikan tombol ke kondisi normal
    refreshButton.disabled = false;

    refreshButton.classList.remove("loading");
  }
}

// 7. EVENT TOMBOL REFRESH

refreshButton.addEventListener("click", function () {
  loadCryptoData();
});

// 8. MENJALANKAN APLIKASI PERTAMA KALI

loadCryptoData();
