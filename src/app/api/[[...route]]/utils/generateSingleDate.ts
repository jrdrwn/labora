const generateSingleDate = (
  tanggal_mulai: Date,
  jam_mulai: string,
  jam_selesai: string,
): { mulai: Date; selesai: Date } => {
  const [startHours, startMinutes] = jam_mulai.split(':').map(Number);
  const [endHours, endMinutes] = jam_selesai.split(':').map(Number);

  // Start from the given tanggal_mulai
  const mulai = new Date(tanggal_mulai);
  mulai.setHours(startHours, startMinutes, 0, 0);

  const selesai = new Date(mulai);
  selesai.setHours(endHours, endMinutes, 0, 0); // Set the end time

  return { mulai, selesai };
};

export default generateSingleDate;