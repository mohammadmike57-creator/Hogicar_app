export interface Location {
  id: string;
  name: string;
  subtitle: string;
  type: "airport" | "city" | "station";
}

export const popularLocations: Location[] = [
  { id: "lhr", name: "London Heathrow Airport", subtitle: "LHR • London, UK", type: "airport" },
  { id: "lgw", name: "London Gatwick Airport", subtitle: "LGW • London, UK", type: "airport" },
  { id: "cdg", name: "Paris Charles de Gaulle", subtitle: "CDG • Paris, France", type: "airport" },
  { id: "jfk", name: "New York JFK Airport", subtitle: "JFK • New York, USA", type: "airport" },
  { id: "lax", name: "Los Angeles Airport", subtitle: "LAX • Los Angeles, USA", type: "airport" },
  { id: "ams", name: "Amsterdam Schiphol", subtitle: "AMS • Amsterdam, Netherlands", type: "airport" },
  { id: "bcn", name: "Barcelona El Prat", subtitle: "BCN • Barcelona, Spain", type: "airport" },
  { id: "mad", name: "Madrid Barajas", subtitle: "MAD • Madrid, Spain", type: "airport" },
  { id: "fco", name: "Rome Fiumicino", subtitle: "FCO • Rome, Italy", type: "airport" },
  { id: "lon", name: "London City Centre", subtitle: "City • London, UK", type: "city" },
  { id: "par", name: "Paris City Centre", subtitle: "City • Paris, France", type: "city" },
  { id: "nyc", name: "New York City Centre", subtitle: "City • New York, USA", type: "city" },
  { id: "mia", name: "Miami Airport", subtitle: "MIA • Miami, USA", type: "airport" },
  { id: "dxb", name: "Dubai International", subtitle: "DXB • Dubai, UAE", type: "airport" },
  { id: "syd", name: "Sydney Kingsford Smith", subtitle: "SYD • Sydney, Australia", type: "airport" },
];

export function searchLocations(query: string): Location[] {
  if (!query || query.length < 2) return popularLocations.slice(0, 6);
  const q = query.toLowerCase();
  return popularLocations.filter(
    (l) =>
      l.name.toLowerCase().includes(q) ||
      l.subtitle.toLowerCase().includes(q)
  );
}
