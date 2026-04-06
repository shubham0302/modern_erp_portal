export function formatAddress(address: any): string {
  if (!address || typeof address !== "object") {
    throw new Error("Invalid address object");
  }

  const {
    personName,
    personPhone,
    line1,
    line2,
    area,
    city,
    state,
    zip,
    country,
    addressType,
  } = address;

  const parts: string[] = [];

  if (personName) parts.push(personName);
  if (personPhone) parts.push(`${personPhone}`);
  if (line1) parts.push(line1);
  if (line2) parts.push(line2);
  if (area) parts.push(area);
  if (city) parts.push(city);
  if (state) parts.push(state);
  if (zip) parts.push(zip);
  if (country) parts.push(country);
  if (addressType) parts.push(`(${addressType})`);

  return parts.filter(Boolean).join(", ");
}
