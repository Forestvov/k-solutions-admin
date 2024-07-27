// @ts-nocheck
export function fixTime(dateTine: string) {
  const splitDate = dateTine.split(',')[0].split('-');
  const splitTime = dateTine.split(',')[1].split(':');

  // @ts-ignore
  const date = [splitDate[0], Number(splitDate[1] - 1), Number(splitDate[2])];
  const utcData = new Date(
    Date.UTC(date[0], date[1], date[2], splitTime[0], splitTime[1], splitTime[2])
  );

  return utcData;
}
