-- @param {String} $1:nim1
-- @param {String} $2:nim2
SELECT mk.mkkurKode, mk.mkkurNamaResmi
FROM sia_t_krs AS krs
JOIN sia_t_krs_detil AS krsdt ON krsdt.krsdtKrsId = krs.krsId
JOIN sia_t_kelas AS kls ON kls.klsId = krsdt.krsdtKlsId
JOIN sia_m_matakuliah_kurikulum as mk on mk.mkkurId = kls.klsMkkurId
WHERE krs.krsMhsNiu = :nim1
AND krs.krsId = (
	SELECT krsId
	FROM sia_t_krs
	WHERE krsMhsNiu = :nim2
	ORDER BY krsSemId DESC
	LIMIT 1
);