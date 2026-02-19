# 🚀 Automation Flow Visualizer

Alat orkestrasi alur kerja (workflow) berbasis web yang interaktif, dirancang untuk menjembatani desain logika visual dengan eksekusi otomasi pada sistem backend.

## 👨‍💻 Dikembangkan oleh Dani
Sebagai seorang **Automation Developer** sejak November 2016, saya merancang alat ini untuk menyederhanakan proses orkestrasi alur kerja yang kompleks. Proyek ini merefleksikan pengalaman profesional saya dalam menangani sistem seperti **BMC Atrium Orchestrator** serta latar belakang teknis saya di bidang networking dan scripting.

---

## ✨ Fitur Utama

* **Canvas Interaktif**: Editor visual performa tinggi yang dibangun dengan **React Flow**, memungkinkan penyusunan pipeline otomasi secara mulus.
* **Arsitektur Node Kustom**:
    * **Trigger Nodes**: Blok pemicu berdasarkan waktu (Cron) atau kejadian tertentu (event).
    * **Action Nodes**: Blok eksekusi untuk skrip SSH, perintah shell, atau pemanggilan API.
* **Sinkronisasi Real-time**: **Panel Properti** dinamis yang memperbarui data node secara instan menggunakan manajemen state **Zustand**.
* **Ekspor Siap Produksi**: Fitur "Export to JSON" yang menghasilkan konfigurasi terstruktur yang kompatibel dengan mesin eksekusi backend.
* **Tech Stack Modern**: Dibangun menggunakan **Next.js 15+**, **Tailwind CSS**, dan **Lucide React** untuk antarmuka yang bersih dan profesional.

---

## 🛠 Tech Stack

| Kategori | Teknologi |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router) |
| **Visual Library** | React Flow (@xyflow/react) |
| **State Management** | Zustand |
| **Styling** | Tailwind CSS |
| **Icons** | Lucide React |

---

## 🚀 Cara Menjalankan Proyek

1.  **Clone repositori**:
    ```bash
    git clone [https://github.com/username_kamu/automation-visualizer.git](https://github.com/username_kamu/automation-visualizer.git)
    ```

2.  **Instal dependensi**:
    ```bash
    npm install
    ```

3.  **Jalankan server pengembangan**:
    ```bash
    npm run dev
    ```

4.  **Akses aplikasi**:
    Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---    
![Test Success](image.png)
---

## 💡 Mengapa Proyek Ini Dibuat?

Proyek ini lebih dari sekadar antarmuka visual; ini adalah solusi untuk mengotomatiskan tugas-tugas repetitif—yang merupakan minat utama saya. Baik itu mengelola router **OpenWrt**, mengeksekusi perintah **SSH** pada server jarak jauh, atau memantau kesehatan jaringan, visualizer ini menyediakan struktur yang dibutuhkan untuk otomasi yang andal.

---
