/**
 * Shared time change handler for TimePicker.
 * @param str - Raw input string "HH:mm".
 * @param setInternal - State setter.
 * @param onChange - Optional callback.
 */
export function handleTimeChange(
  str: string,
  setInternal: (d: Date | null) => void,
  onChange?: (d: Date | null) => void,
): void {
  if (!str) {
    setInternal(null);
    onChange?.(null);
    return;
  }
  const [hours, minutes] = str
    .split(':').map(Number);
  if (
    hours === undefined
    || minutes === undefined
  ) {
    return;
  }
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  setInternal(d);
  onChange?.(d);
}
