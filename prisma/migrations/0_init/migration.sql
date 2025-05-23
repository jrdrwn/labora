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
    `status` ENUM('pending', 'diterima', 'ditolak') NULL,
    `komitmen_url` TEXT NULL,
    `event_id` INTEGER NULL,

    UNIQUE INDEX `nim`(`nim`),
    UNIQUE INDEX `email`(`email`),
    INDEX `event_id`(`event_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detailpenilaian` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `penilaian_id` INTEGER NULL,
    `praktikan_id` INTEGER NULL,
    `kehadiran` ENUM('hadir', 'izin', 'alpha') NULL,
    `tipe` ENUM('pretest', 'posttest', 'praktikum', 'responsi') NULL,
    `nilai` DOUBLE NULL,

    INDEX `penilaian_id`(`penilaian_id`),
    INDEX `praktikan_id`(`praktikan_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `admin_id` INTEGER NULL,
    `jenis` ENUM('pendaftaran_asisten', 'pendaftaran_praktikan', 'praktikum') NULL,
    `mulai` TIMESTAMP(0) NULL,
    `selesai` TIMESTAMP(0) NULL,

    INDEX `admin_id`(`admin_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jadwalpraktikum` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ruang_id` INTEGER NULL,
    `kelas_praktikum_id` INTEGER NULL,
    `mulai` TIMESTAMP(0) NULL,
    `selesai` TIMESTAMP(0) NULL,
    `status` ENUM('belum_dilaksanakan', 'telah_dilaksanakan') NULL,

    INDEX `kelas_praktikum_id`(`kelas_praktikum_id`),
    INDEX `ruang_id`(`ruang_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kelaspraktikum` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(120) NULL,
    `kuota_praktikan` INTEGER NULL,
    `mata_kuliah_praktikum_id` INTEGER NULL,
    `asisten_id` INTEGER NULL,

    INDEX `asisten_id`(`asisten_id`),
    INDEX `mata_kuliah_praktikum_id`(`mata_kuliah_praktikum_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kelaspraktikumpraktikan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `praktikan_id` INTEGER NULL,
    `kelas_praktikum_id` INTEGER NULL,

    INDEX `kelas_praktikum_id`(`kelas_praktikum_id`),
    INDEX `praktikan_id`(`praktikan_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `matakuliahpraktikum` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kode` VARCHAR(120) NULL,
    `nama` VARCHAR(120) NULL,

    UNIQUE INDEX `kode`(`kode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `penilaian` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kelas_praktikum_id` INTEGER NULL,
    `judul` VARCHAR(120) NULL,
    `bukti_pertemuan` TEXT NULL,

    INDEX `kelas_praktikum_id`(`kelas_praktikum_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `praktikan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nim` VARCHAR(12) NULL,
    `email` VARCHAR(120) NULL,
    `nama` VARCHAR(120) NULL,
    `perangkat` ENUM('laptop', 'komputer_lab') NULL,
    `event_id` INTEGER NULL,

    UNIQUE INDEX `nim`(`nim`),
    UNIQUE INDEX `email`(`email`),
    INDEX `event_id`(`event_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ruang` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(100) NULL,
    `kuota` JSON NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `asisten` ADD CONSTRAINT `asisten_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `detailpenilaian` ADD CONSTRAINT `detailpenilaian_ibfk_1` FOREIGN KEY (`penilaian_id`) REFERENCES `penilaian`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `detailpenilaian` ADD CONSTRAINT `detailpenilaian_ibfk_2` FOREIGN KEY (`praktikan_id`) REFERENCES `praktikan`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `event` ADD CONSTRAINT `event_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admin`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `jadwalpraktikum` ADD CONSTRAINT `jadwalpraktikum_ibfk_1` FOREIGN KEY (`ruang_id`) REFERENCES `ruang`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `jadwalpraktikum` ADD CONSTRAINT `jadwalpraktikum_ibfk_2` FOREIGN KEY (`kelas_praktikum_id`) REFERENCES `kelaspraktikum`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `kelaspraktikum` ADD CONSTRAINT `kelaspraktikum_ibfk_1` FOREIGN KEY (`mata_kuliah_praktikum_id`) REFERENCES `matakuliahpraktikum`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `kelaspraktikum` ADD CONSTRAINT `kelaspraktikum_ibfk_2` FOREIGN KEY (`asisten_id`) REFERENCES `asisten`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `kelaspraktikumpraktikan` ADD CONSTRAINT `kelaspraktikumpraktikan_ibfk_1` FOREIGN KEY (`praktikan_id`) REFERENCES `praktikan`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `kelaspraktikumpraktikan` ADD CONSTRAINT `kelaspraktikumpraktikan_ibfk_2` FOREIGN KEY (`kelas_praktikum_id`) REFERENCES `kelaspraktikum`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `penilaian` ADD CONSTRAINT `penilaian_ibfk_1` FOREIGN KEY (`kelas_praktikum_id`) REFERENCES `kelaspraktikum`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `praktikan` ADD CONSTRAINT `praktikan_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `event`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

