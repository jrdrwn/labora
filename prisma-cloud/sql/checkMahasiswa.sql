-- @param {String} $1:nim
-- @param {String} $2:password
-- @param {String} $3:key
select username as nim, prodi, fakultas, nama, mhsEmail as email from simari_user
  join sia_m_mahasiswa on mhsNiu = username
  where username = :nim and password = md5(concat(md5(:password), :key)) and isMhs = 1;
