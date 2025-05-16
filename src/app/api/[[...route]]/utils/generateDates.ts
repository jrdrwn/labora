const generateDates = (
  tanggal_mulai: Date,
  hari: number,
  jam_mulai: string,
  jam_selesai: string,
  jumlah_pertemuan: number,
): { mulai: Date; selesai: Date }[] => {
  const dates: { mulai: Date; selesai: Date }[] = [];
  const [startHours, startMinutes] = jam_mulai.split(':').map(Number);
  const [endHours, endMinutes] = jam_selesai.split(':').map(Number);

  // Start from the given tanggal_mulai
  const startDate = new Date(tanggal_mulai);
  startDate.setHours(startHours, startMinutes, 0, 0);

  for (let i = 0; i < jumlah_pertemuan; i++) {
    const mulai = new Date(startDate);
    mulai.setDate(startDate.getDate() + i * 7); // Add 7 days for each subsequent meeting

    const selesai = new Date(mulai);
    selesai.setHours(endHours, endMinutes, 0, 0); // Set the end time

    dates.push({ mulai, selesai });
  }

  return dates;
};

export default generateDates;
