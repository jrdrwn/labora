-- @param {String} $1:nim
SELECT mk.mkkurKode, mk.mkkurNamaResmi, krsdt.krsdtKodeNilai
FROM sia_t_krs AS krs
         JOIN sia_t_krs_detil AS krsdt ON krsdt.krsdtKrsId = krs.krsId
         JOIN sia_t_kelas AS kls ON kls.klsId = krsdt.krsdtKlsId
         JOIN sia_m_matakuliah_kurikulum as mk on mk.mkkurId = kls.klsMkkurId
WHERE krs.krsMhsNiu = :nim
  AND krsdt.krsdtKodeNilai in ('A');