import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export async function exportMonthlyReport(data, year, month) {
  const workbook = new ExcelJS.Workbook();

  workbook.creator = "Sistem Absensi Guru";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet("Rekap Absensi");

  const monthName = MONTH_NAMES[month - 1];

  worksheet.mergeCells("A1:F1");

  const title = worksheet.getCell("A1");

  title.value = `REKAP KEHADIRAN GURU`;
  title.font = {
    bold: true,
    size: 16,
  };

  title.alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  worksheet.mergeCells("A2:F2");

  const period = worksheet.getCell("A2");

  period.value = `Periode ${monthName} ${year}`;

  period.font = {
    bold: true,
    size: 11,
  };

  period.alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  worksheet.getRow(1).height = 25;
  worksheet.getRow(2).height = 20;

  const headerRow = worksheet.getRow(4);

  headerRow.values = [
    "No",
    "Nama",
    "Hadir",
    "Terlambat",
    "Absen",
    "Keterangan",
  ];

  headerRow.height = 22;

  headerRow.eachCell((cell) => {
    cell.font = {
      bold: true,
      size: 11,
    };

    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  data.forEach((item, index) => {
    let keterangan = "Normal";

    if (item.multipleDevices) {
      keterangan = `${item.deviceCount} perangkat`;
    }

    const row = worksheet.addRow([
      index + 1,
      item.nama || "-",
      item.hadir || 0,
      item.terlambat || 0,
      item.absen || 0,
      keterangan,
    ]);

    row.height = 20;

    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };

      cell.alignment = {
        vertical: "middle",
      };
    });
    row.getCell(1).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    row.getCell(2).alignment = {
      horizontal: "left",
      vertical: "middle",
    };

    row.getCell(3).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    row.getCell(4).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    row.getCell(5).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    row.getCell(6).alignment = {
      horizontal: "center",
      vertical: "middle",
    };
  });

  worksheet.columns = [
    {
      key: "no",
      width: 8,
    },
    {
      key: "nama",
      width: 30,
    },
    {
      key: "hadir",
      width: 14,
    },
    {
      key: "terlambat",
      width: 15,
    },
    {
      key: "absen",
      width: 14,
    },
    {
      key: "keterangan",
      width: 22,
    },
  ];
  worksheet.views = [
    {
      state: "frozen",
      ySplit: 4,
    },
  ];

  if (data.length > 0) {
    worksheet.autoFilter = {
      from: "A4",
      to: "F4",
    };
  }

  const buffer = await workbook.xlsx.writeBuffer();

  const fileName = `Rekap_Absensi_Guru_${monthName}_${year}.xlsx`;

  saveAs(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    fileName,
  );
}
