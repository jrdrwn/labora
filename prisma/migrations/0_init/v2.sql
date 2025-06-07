-- CreateTable
CREATE TABLE `admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(100) NULL,
    `password` VARCHAR(100) NULL,
    `email` VARCHAR(120) NULL,

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `asisten` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nim` VARCHAR(12) NULL,
    `email` VARCHAR(120) NULL,
    `nama` VARCHAR(120) NULL,
    `status` ENUM('diproses', 'diterima', 'ditolak') NULL,
    `komitmen_url` TEXT NULL,
    `dokumen_pendukung_url` TEXT NULL,
    `event_id` INTEGER NULL,
    `mata_kuliah_pilihan` JSON NULL,

    UNIQUE INDEX `nim`(`nim`),
    UNIQUE INDEX `email`(`email`),
    INDEX `event_id`(`event_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `admin_id` INTEGER NULL,
    `nama` VARCHAR(120) NULL,
    `jenis` ENUM('pendaftaran_asisten', 'pendaftaran_praktikan', 'praktikum') NULL,
    `mulai` TIMESTAMP(0) NULL,
    `selesai` TIMESTAMP(0) NULL,

    INDEX `admin_id`(`admin_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `penilaian` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `laporan_id` INTEGER NULL,
    `praktikan_id` INTEGER NULL,
    `tipe` ENUM('pretest', 'laporan', 'praktikum', 'responsi') NULL,
    `nilai` DOUBLE NULL,

    INDEX `laporan_id`(`laporan_id`),
    INDEX `praktikan_id`(`praktikan_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `praktikan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nim` VARCHAR(12) NULL,
    `email` VARCHAR(120) NULL,
    `nama` VARCHAR(120) NULL,
    `event_id` INTEGER NULL,

    UNIQUE INDEX `nim`(`nim`),
    UNIQUE INDEX `email`(`email`),
    INDEX `event_id`(`event_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jadwal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ruang_id` INTEGER NULL,
    `kelas_id` INTEGER NULL,
    `mulai` TIMESTAMP(0) NULL,
    `selesai` TIMESTAMP(0) NULL,
    `is_dilaksanakan` BOOLEAN NULL DEFAULT false,

    INDEX `kelas_id`(`kelas_id`),
    INDEX `ruang_id`(`ruang_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kehadiran` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `laporan_id` INTEGER NULL,
    `praktikan_id` INTEGER NULL,
    `tipe` ENUM('hadir', 'izin', 'alpha') NULL,

    INDEX `laporan_id`(`laporan_id`),
    INDEX `praktikan_id`(`praktikan_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kelas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(120) NULL,
    `kapasitas_praktikan` INTEGER NULL,
    `mata_kuliah_id` INTEGER NULL,
    `asisten_id` INTEGER NULL,
    `admin_id` INTEGER NULL,

    INDEX `admin_id`(`admin_id`),
    INDEX `asisten_id`(`asisten_id`),
    INDEX `mata_kuliah_id`(`mata_kuliah_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `laporan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jadwal_id` INTEGER NULL,
    `judul` VARCHAR(120) NULL,
    `bukti_pertemuan_url` TEXT NULL,

    INDEX `jadwal_id`(`jadwal_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mata_kuliah` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kode` VARCHAR(120) NULL,
    `nama` VARCHAR(120) NULL,
    `admin_id` INTEGER NULL,

    UNIQUE INDEX `kode`(`kode`),
    INDEX `admin_id`(`admin_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `praktikan_kelas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `praktikan_id` INTEGER NULL,
    `kelas_id` INTEGER NULL,
    `perangkat` ENUM('laptop', 'komputer_lab') NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT (now()),
    `updated_at` TIMESTAMP(0) NULL DEFAULT (now()),

    INDEX `kelas_id`(`kelas_id`),
    INDEX `praktikan_id`(`praktikan_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ruangan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(100) NULL,
    `kapasitas` JSON NULL,
    `admin_id` INTEGER NULL,

    INDEX `admin_id`(`admin_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `asisten` ADD CONSTRAINT `asisten_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `event` ADD CONSTRAINT `event_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admin`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `penilaian` ADD CONSTRAINT `penilaian_ibfk_1` FOREIGN KEY (`laporan_id`) REFERENCES `laporan`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `penilaian` ADD CONSTRAINT `penilaian_ibfk_2` FOREIGN KEY (`praktikan_id`) REFERENCES `praktikan`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `praktikan` ADD CONSTRAINT `praktikan_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `jadwal` ADD CONSTRAINT `jadwal_ibfk_1` FOREIGN KEY (`ruang_id`) REFERENCES `ruangan`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `jadwal` ADD CONSTRAINT `jadwal_ibfk_2` FOREIGN KEY (`kelas_id`) REFERENCES `kelas`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `kehadiran` ADD CONSTRAINT `kehadiran_ibfk_1` FOREIGN KEY (`laporan_id`) REFERENCES `laporan`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `kehadiran` ADD CONSTRAINT `kehadiran_ibfk_2` FOREIGN KEY (`praktikan_id`) REFERENCES `praktikan`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `kelas` ADD CONSTRAINT `kelas_ibfk_1` FOREIGN KEY (`mata_kuliah_id`) REFERENCES `mata_kuliah`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `kelas` ADD CONSTRAINT `kelas_ibfk_2` FOREIGN KEY (`asisten_id`) REFERENCES `asisten`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `kelas` ADD CONSTRAINT `kelas_ibfk_3` FOREIGN KEY (`admin_id`) REFERENCES `admin`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `laporan` ADD CONSTRAINT `laporan_ibfk_1` FOREIGN KEY (`jadwal_id`) REFERENCES `jadwal`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `mata_kuliah` ADD CONSTRAINT `mata_kuliah_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admin`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `praktikan_kelas` ADD CONSTRAINT `praktikan_kelas_ibfk_1` FOREIGN KEY (`praktikan_id`) REFERENCES `praktikan`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `praktikan_kelas` ADD CONSTRAINT `praktikan_kelas_ibfk_2` FOREIGN KEY (`kelas_id`) REFERENCES `kelas`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ruangan` ADD CONSTRAINT `ruangan_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admin`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

