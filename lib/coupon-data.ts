// ─── All 67 one-time use coupon codes ─────────────────────────────────────────
// First 2 chars = discount %. Max discount = ₹1000.
// Logic: code "30XYZZ" = 30% off, capped at ₹1000

export const ONE_TIME_CODES: string[] = [
  '732705ZEES','251401EKLV','251109LUXY','250312ARPI','301203GAUR',
  '253005SAKS','691409SAUR','302802SUMI','692506ATHA','691511ROHI',
  '692604ATHA','352712UJJA','400711GUNJ','691809PARI','402405SHRU',
  '401505YASH','401705UTK1','252812KRIS','251109TARU','301601KAND',
  '350210RITI','300712NITI','303105HARS','302510RAVI','301007NICK',
  '252403VIDI','302608HEMA','300707PRAS','300303ADIT','301006shry',
  '400307SPAN','252109SHAU','252111ANKU','352207hari','902006JANA',
  '301107RAVI','300312ANKI','301808KULD','692309DEVT','302208RISH',
  '302112AASH','251301ANJA','711406RIJO','71290IMELV','691311KART',
  '250011alfr','350301KINS','692603KUSH','400602RAJV','151511KART',
  '401708NISH','402412SATY','400609RAVI','402201RISH','401305TUSH',
  '400401SWAT','403008TUSH','302309ATIN','300507SHIV','300604ARNA',
  '252305MANY','400509AMAN','401405RISH','401712TEJU','402806HIRU',
  '301012ASHi','301105ARUL',
]

export function parseOneTimeCode(code: string): { percent: number; maxOff: number } | null {
  const upper = code.toUpperCase()
  const found = ONE_TIME_CODES.find(c => c.toUpperCase() === upper)
  if (!found) return null
  const percent = parseInt(found.slice(0, 2), 10)
  if (isNaN(percent) || percent <= 0 || percent > 100) return null
  return { percent, maxOff: 1000 }
}