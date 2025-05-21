export function convertDurationToMinutes(durationStr: string): number {
  const [minutesStr, secondsStr] = durationStr.split(':');
  const minutes = parseInt(minutesStr, 10);
  const seconds = parseInt(secondsStr, 10);
  return minutes + seconds / 60;
}
