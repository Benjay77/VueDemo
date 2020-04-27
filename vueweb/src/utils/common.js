export function timestampToTime(timestamp) {
  const now = new Date(timestamp * 1000);
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const second = now.getSeconds();
  return `${year}-${month}-${date}   ${hour}:${minute}:${second}`;
}
