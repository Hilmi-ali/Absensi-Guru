import { useState, useCallback } from "react";
import {
  checkTodayAttendance,
  saveAttendance,
} from "../services/attendanceService";

export default function useAttendance(profile, settings, clock, location) {
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loadingAttendance, setLoadingAttendance] = useState(true);

  // ========================================
  // CEK ABSENSI HARI INI
  // ========================================

  const loadTodayAttendance = useCallback(async () => {
    if (!profile?.uid) {
      setTodayAttendance(null);
      setLoadingAttendance(false);
      return null;
    }

    try {
      setLoadingAttendance(true);

      const data = await checkTodayAttendance(profile.uid);

      setTodayAttendance(data);

      return data;
    } catch (error) {
      console.error("Gagal mengecek absensi:", error);
      return null;
    } finally {
      setLoadingAttendance(false);
    }
  }, [profile?.uid]);

  // ========================================
  // ABSEN
  // ========================================

  async function attend() {
    if (saving) {
      return {
        success: false,
        message: "Sedang menyimpan absensi.",
      };
    }

    if (!profile?.uid) {
      return {
        success: false,
        message: "Data pengguna tidak ditemukan.",
      };
    }

    if (!settings) {
      return {
        success: false,
        message: "Pengaturan absensi belum tersedia.",
      };
    }

    // ========================================
    // CEK ABSENSI HARI INI
    // ========================================

    const existingAttendance = await checkTodayAttendance(profile.uid);

    setTodayAttendance(existingAttendance);

    /*
     * Jika sudah HADIR atau TERLAMBAT,
     * jangan membuat absensi utama lagi.
     *
     * Percobaan di luar radius tidak dihitung
     * sebagai absensi utama sehingga guru masih
     * boleh mencoba kembali setelah masuk radius.
     */

    if (
      existingAttendance?.status === "hadir" ||
      existingAttendance?.status === "terlambat"
    ) {
      return {
        success: false,
        status: existingAttendance.status,
        message:
          existingAttendance.status === "hadir"
            ? "Anda sudah melakukan absensi hari ini."
            : "Anda sudah melakukan absensi terlambat hari ini.",
      };
    }

    // ========================================
    // GPS WAJIB AKTIF
    // ========================================

    if (
      location?.latitude === null ||
      location?.latitude === undefined ||
      location?.longitude === null ||
      location?.longitude === undefined
    ) {
      return {
        success: false,
        status: null,
        message: "GPS wajib diaktifkan untuk melakukan absensi.",
      };
    }

    setSaving(true);

    try {
      const result = await saveAttendance(
        {
          uid: profile.uid,
          nama: profile.nama,
          role: profile.role,

          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: location.accuracy,
          distance: location.distance,
          insideArea: location.insideArea,

          // Penting:
          // status waktu berasal dari useClock
          clockStatus: clock.status,
        },
        settings,
      );

      if (!result.success) {
        return result;
      }

      /*
       * Hanya HADIR dan TERLAMBAT yang menjadi
       * absensi utama guru.
       *
       * Jika di luar radius:
       * saveAttendance mencatat attempt,
       * tetapi tidak membuat absensi utama.
       */

      if (result.status === "hadir" || result.status === "terlambat") {
        const updatedAttendance = await checkTodayAttendance(profile.uid);

        setTodayAttendance(updatedAttendance);
      }

      return result;
    } catch (error) {
      console.error("Gagal melakukan absensi:", error);

      return {
        success: false,
        status: null,
        error: error.message,
        message: "Terjadi kesalahan saat menyimpan absensi.",
      };
    } finally {
      setSaving(false);
    }
  }

  return {
    todayAttendance,
    saving,
    loadingAttendance,
    loadTodayAttendance,
    attend,
  };
}
