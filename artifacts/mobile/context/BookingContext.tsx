import React, { createContext, useContext, useState } from "react";
import { Car } from "@/data/mockCars";

export interface SearchParams {
  pickupLocation: string;
  returnLocation: string;
  sameReturnLocation: boolean;
  pickupDate: Date;
  dropoffDate: Date;
  pickupTime: string;
  dropoffTime: string;
  driverAge: number;
  driverAgeUnder30OrOver65: boolean;
}

export interface FilterState {
  transmission: "All" | "Automatic" | "Manual";
  fuelType: "All" | "Petrol" | "Diesel" | "Electric" | "Hybrid";
  minRating: number;
  suppliers: string[];
  fuelPolicy: "All" | "Full-to-Full" | "Same-to-Same" | "Prepaid";
  maxDeposit: number;
}

export type SortBy = "cheapest" | "best_rated" | "closest";

interface BookingContextType {
  searchParams: SearchParams;
  setSearchParams: (p: SearchParams) => void;
  selectedCar: Car | null;
  setSelectedCar: (c: Car | null) => void;
  addInsurance: boolean;
  setAddInsurance: (v: boolean) => void;
  filters: FilterState;
  setFilters: (f: FilterState) => void;
  sortBy: SortBy;
  setSortBy: (s: SortBy) => void;
  driverName: string;
  setDriverName: (v: string) => void;
  driverEmail: string;
  setDriverEmail: (v: string) => void;
  driverPhone: string;
  setDriverPhone: (v: string) => void;
  flightNumber: string;
  setFlightNumber: (v: string) => void;
  bookingRef: string;
  setBookingRef: (v: string) => void;
}

const defaultSearch: SearchParams = {
  pickupLocation: "",
  returnLocation: "",
  sameReturnLocation: true,
  pickupDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  dropoffDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
  pickupTime: "10:00",
  dropoffTime: "10:00",
  driverAge: 30,
  driverAgeUnder30OrOver65: false,
};

const defaultFilters: FilterState = {
  transmission: "All",
  fuelType: "All",
  minRating: 0,
  suppliers: [],
  fuelPolicy: "All",
  maxDeposit: 2000,
};

const BookingContext = createContext<BookingContextType>({} as BookingContextType);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [searchParams, setSearchParams] = useState<SearchParams>(defaultSearch);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [addInsurance, setAddInsurance] = useState(false);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [sortBy, setSortBy] = useState<SortBy>("cheapest");
  const [driverName, setDriverName] = useState("");
  const [driverEmail, setDriverEmail] = useState("");
  const [driverPhone, setDriverPhone] = useState("");
  const [flightNumber, setFlightNumber] = useState("");
  const [bookingRef, setBookingRef] = useState("");

  return (
    <BookingContext.Provider
      value={{
        searchParams, setSearchParams,
        selectedCar, setSelectedCar,
        addInsurance, setAddInsurance,
        filters, setFilters,
        sortBy, setSortBy,
        driverName, setDriverName,
        driverEmail, setDriverEmail,
        driverPhone, setDriverPhone,
        flightNumber, setFlightNumber,
        bookingRef, setBookingRef,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  return useContext(BookingContext);
}
