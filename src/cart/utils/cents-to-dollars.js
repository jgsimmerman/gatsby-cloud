export default function centsToDollars(n) {
  if (!n) return 0;
  let str = n.toString();
  str = str.substring(0, str.length - 2) + `.` + str.substring(str.length - 2);
  return Number(str);
}
