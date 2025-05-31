import React, { useState } from "react";

export default function App() {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [formValues, setFormValues] = useState({
    topic: "",
    major: "",
    method: "",
    university: "",
  });
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const packages = [
    {
      id: 1,
      name: "Paket Gratis",
      price: 0,
      features: ["Hanya untuk membuat Judul Skripsi", "Tanpa isi konten"],
      allowedFields: ["topic"],
    },
    {
      id: 2,
      name: "Paket Dasar",
      price: 50000,
      features: ["Judul + Pendahuluan", "Kata Pengantar", "Daftar Isi"],
      allowedFields: ["topic", "major", "university"],
    },
    {
      id: 3,
      name: "Paket Lengkap",
      price: 150000,
      features: [
        "Judul + Pendahuluan",
        "Tinjauan Pustaka",
        "Metodologi Penelitian",
        "Analisis Data",
        "Penutup",
        "Daftar Pustaka",
        "Format Word, PDF, Excel",
      ],
      allowedFields: ["topic", "major", "method", "university"],
    },
    {
      id: 4,
      name: "Paket Premium",
      price: 250000,
      features: [
        "Semua fitur Paket Lengkap",
        "Olah Data SPSS / Excel",
        "Slide Presentasi PowerPoint",
        "Revisi 3x tanpa batas",
      ],
      allowedFields: ["topic", "major", "method", "university"],
    },
  ];

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
    setFormValues({
      topic: "",
      major: "",
      method: "",
      university: "",
    });
  };

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const applyVoucher = () => {
    if (voucherCode === "OWNER123") {
      setAppliedVoucher(true);
      alert("Voucher berhasil diterapkan! Anda mendapat akses GRATIS.");
    } else {
      alert("Kode voucher tidak valid");
    }
  };

  const handleGenerateSkripsi = async () => {
    if (!selectedPackage) return alert("Silakan pilih paket terlebih dahulu");

    const missingFields = selectedPackage.allowedFields.filter(
      (field) => !formValues[field]
    );

    if (missingFields.length > 0) {
      alert(`Harap lengkapi field: ${missingFields.join(", ")}`);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/generate-skripsi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });

      const data = await response.json();
      setResult(data.text || "Gagal menghasilkan skripsi");
    } catch (error) {
      console.error(error);
      alert("Gagal menghubungi API");
    }

    setLoading(false);
  };

  const downloadFile = (format) => {
    if (!result) {
      alert("Belum ada hasil skripsi untuk didownload");
      return;
    }

    const blob = new Blob([result], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `skripsi.${format}`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">SkripsiAI</h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold mb-4 text-gray-900 leading-tight">
            Buat Skripsi Otomatis dalam 1 Klik
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8">
            Dengan AI Generator kami, buat skripsi lengkap dari pendahuluan hingga daftar pustaka hanya dalam hitungan menit.
          </p>
          <a href="#paket" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-300">
            Lihat Paket
          </a>
        </div>
      </section>

      {/* Paket Layanan */}
      <section id="paket" className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Pilih Paket Anda</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => handleSelectPackage(pkg)}
                className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transform hover:scale-105 transition-all ${
                  selectedPackage?.id === pkg.id ? "ring-2 ring-indigo-500" : ""
                }`}
              >
                <h4 className="text-xl font-bold mb-2">{pkg.name}</h4>
                <p className="text-2xl font-semibold text-indigo-600 mb-4">
                  {pkg.price === 0 ? "Gratis" : `Rp${pkg.price.toLocaleString()}`}
                </p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                  {pkg.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Input Berdasarkan Paket */}
      {selectedPackage && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h3 className="text-2xl font-bold mb-6 text-center">Isi Detail Skripsi Anda</h3>
            <div className="max-w-3xl mx-auto bg-gray-50 p-6 rounded-lg shadow-md">
              <form onSubmit={(e) => e.preventDefault()}>
                {selectedPackage.allowedFields.includes("topic") && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Topik Skripsi</label>
                    <input
                      type="text"
                      name="topic"
                      value={formValues.topic}
                      onChange={handleChange}
                      placeholder="Masukkan judul/topik skripsi"
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                )}
                {selectedPackage.allowedFields.includes("major") && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Jurusan</label>
                    <input
                      type="text"
                      name="major"
                      value={formValues.major}
                      onChange={handleChange}
                      placeholder="Contoh: Teknik Informatika"
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                )}
                {selectedPackage.allowedFields.includes("method") && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Metode Penelitian</label>
                    <select
                      name="method"
                      value={formValues.method}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="">-- Pilih --</option>
                      <option value="kualitatif">Kualitatif</option>
                      <option value="kuantitatif">Kuantitatif</option>
                      <option value="eksperimen">Eksperimen</option>
                      <option value="studi kasus">Studi Kasus</option>
                    </select>
                  </div>
                )}
                {selectedPackage.allowedFields.includes("university") && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Universitas</label>
                    <input
                      type="text"
                      name="university"
                      value={formValues.university}
                      onChange={handleChange}
                      placeholder="Contoh: Universitas Indonesia"
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                )}

                <div className="flex flex-col md:flex-row gap-4 mt-6">
                  <input
                    type="text"
                    placeholder="Masukkan kode voucher"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    className="px-4 py-2 border rounded-lg flex-grow"
                  />
                  <button
                    onClick={applyVoucher}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
                  >
                    Terapkan Voucher
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <button
                    onClick={handleGenerateSkripsi}
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-bold text-lg"
                  >
                    {loading ? "Memproses..." : "Buat Skripsi Sekarang"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* Preview Skripsi */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-8">Hasil Skripsi</h3>
          <div className="bg-gray-100 p-6 rounded-lg shadow-inner max-w-4xl mx-auto min-h-[300px] overflow-x-auto">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Sedang memproses...</div>
            ) : result ? (
              <pre className="whitespace-pre-wrap text-sm text-gray-700">{result}</pre>
            ) : (
              <div className="text-center py-8 text-gray-400">Belum ada hasil</div>
            )}
          </div>
        </div>
      </section>

      {/* Download Options */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-8">Pilihan Format File</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => downloadFile("docx")} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2">
              Word (.docx)
            </button>
            <button onClick={() => downloadFile("pdf")} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center gap-2">
              PDF (.pdf)
            </button>
            <button onClick={() => downloadFile("pptx")} className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg flex items-center gap-2">
              PowerPoint (.pptx)
            </button>
            <button onClick={() => downloadFile("xlsx")} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2">
              Excel (.xlsx)
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 SkripsiAI - All rights reserved.</p>
          <p className="mt-2 text-sm text-gray-400">Powered by AI | Hosted on Vercel</p>
        </div>
      </footer>
    </div>
  );
}
