export enum Role {
  ADMIN = 'admin',
  ASISTEN = 'asisten',
  PRAKTIKAN = 'praktikan',
}

export enum EventType {
  pendaftaran_asisten = 'pendaftaran_asisten',
  pendaftaran_praktikan = 'pendaftaran_praktikan',
  praktikum = 'praktikum',
}

export enum AsistenStatus {
  diterima = 'diterima',
  diproses = 'diproses',
  ditolak = 'ditolak',
}

export enum KehadiranType {
  hadir = 'hadir',
  izin = 'izin',
  alpha = 'alpha',
}

export enum PenilaianType {
  pretest = 'pretest',
  praktikum = 'praktikum',
  laporan = 'laporan',
  responsi = 'responsi',
}
