/**
 * Format Korean phone numbers automatically.
 * Converts '01012345678' -> '010-1234-5678'
 * Handles 010 mobile numbers, 02 Seoul numbers, and regional 3-digit prefixes.
 */
export function formatKoreanPhoneNumber(value: string): string {
  if (!value) return '';
  const numbers = value.replace(/[^0-9]/g, '').slice(0, 11);

  if (numbers.startsWith('02')) {
    // Seoul phone numbers (02-xxx-xxxx or 02-xxxx-xxxx)
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 5) return `${numbers.slice(0, 2)}-${numbers.slice(2)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 2)}-${numbers.slice(2, 5)}-${numbers.slice(5)}`;
    return `${numbers.slice(0, 2)}-${numbers.slice(2, 6)}-${numbers.slice(6, 10)}`;
  }

  // Standard mobile (010, 011, etc.) or regional prefixes
  if (numbers.length <= 3) {
    return numbers;
  }
  if (numbers.length <= 7) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  }
  if (numbers.length <= 10) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
  }
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
}
