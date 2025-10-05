"use client";

import React, { useState, useMemo } from "react";
import { ZusCard, ZusCardHeader, ZusCardBody } from "@/components/ui/zus-card";
import { ZusButton } from "@/components/ui/zus-button";
import { ZusInput } from "@/components/ui/zus-input";
import { ZusSelect } from "@/components/ui/zus-select";

// Mock data structure for retirement calculations
interface RetirementData {
  id: string;
  dateUsed: string;
  timeUsed: string;
  expectedRetirement: number;
  age: number;
  gender: "M" | "F";
  salaryAmount: number;
  includesSickLeave: boolean;
  mainAccountFunds: number;
  subAccountFunds: number;
  actualRetirement: number;
  adjustedRetirement: number;
  postalCode: string;
}

// Mock data for demonstration
const mockData: RetirementData[] = [
  {
    id: "1",
    dateUsed: "2024-10-05",
    timeUsed: "14:32",
    expectedRetirement: 2800.50,
    age: 45,
    gender: "M",
    salaryAmount: 4500.00,
    includesSickLeave: true,
    mainAccountFunds: 85000.00,
    subAccountFunds: 12000.00,
    actualRetirement: 2650.30,
    adjustedRetirement: 2890.75,
    postalCode: "00-001"
  },
  {
    id: "2",
    dateUsed: "2024-10-05",
    timeUsed: "15:45",
    expectedRetirement: 3200.00,
    age: 52,
    gender: "F",
    salaryAmount: 5200.00,
    includesSickLeave: false,
    mainAccountFunds: 125000.00,
    subAccountFunds: 18500.00,
    actualRetirement: 3100.20,
    adjustedRetirement: 3350.45,
    postalCode: "30-001"
  },
  {
    id: "3",
    dateUsed: "2024-10-04",
    timeUsed: "10:15",
    expectedRetirement: 2100.75,
    age: 38,
    gender: "M",
    salaryAmount: 3800.00,
    includesSickLeave: true,
    mainAccountFunds: 45000.00,
    subAccountFunds: 8000.00,
    actualRetirement: 1980.50,
    adjustedRetirement: 2200.90,
    postalCode: "80-001"
  },
];

export default function AdminPage() {
  const [data] = useState<RetirementData[]>(mockData);
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [ageRangeFilter, setAgeRangeFilter] = useState("all");
  const [sortBy, setSortBy] = useState<keyof RetirementData>("dateUsed");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Filter and sort data
  const filteredData = useMemo(() => {
    const filtered = data.filter(item => {
      const matchesSearch = 
        item.postalCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesGender = genderFilter === "all" || item.gender === genderFilter;
      
      const matchesAge = ageRangeFilter === "all" || 
        (ageRangeFilter === "young" && item.age < 40) ||
        (ageRangeFilter === "middle" && item.age >= 40 && item.age < 55) ||
        (ageRangeFilter === "senior" && item.age >= 55);

      return matchesSearch && matchesGender && matchesAge;
    });

    // Sort data
    filtered.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }
      
      return 0;
    });

    return filtered;
  }, [data, searchTerm, genderFilter, ageRangeFilter, sortBy, sortOrder]);

  // Export to Excel functionality
  const exportToExcel = () => {
    const headers = [
      "ID",
      "Data użycia",
      "Godzina użycia", 
      "Emerytura oczekiwana",
      "Wiek",
      "Płeć",
      "Wysokość wynagrodzenia",
      "Uwzględnia okresy choroby",
      "Środki na koncie głównym",
      "Środki na subkoncie",
      "Emerytura rzeczywista",
      "Emerytura urealniona",
      "Kod pocztowy"
    ];

    const csvContent = [
      headers.join(","),
      ...filteredData.map(row => [
        row.id,
        row.dateUsed,
        row.timeUsed,
        row.expectedRetirement.toFixed(2),
        row.age,
        row.gender,
        row.salaryAmount.toFixed(2),
        row.includesSickLeave ? "Tak" : "Nie",
        row.mainAccountFunds.toFixed(2),
        row.subAccountFunds.toFixed(2),
        row.actualRetirement.toFixed(2),
        row.adjustedRetirement.toFixed(2),
        row.postalCode
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `dane_emerytalne_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSort = (column: keyof RetirementData) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN'
    }).format(amount);
  };

  const getSortIcon = (column: keyof RetirementData) => {
    if (sortBy !== column) return "↕";
    return sortOrder === "asc" ? "↑" : "↓";
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: `rgb(var(--color-bg))` }}>
      {/* Header */}
      <div className="mb-8">
        <h1 
          className="text-3xl font-bold mb-2"
          style={{ 
            color: `rgb(var(--color-text))`,
            fontSize: `calc(1.875rem * var(--font-scale))`
          }}
        >
          Panel Administracyjny ZUS
        </h1>
        <p 
          className="text-lg"
          style={{ 
            color: `rgb(var(--color-text) / 0.8)`,
            fontSize: `calc(1.125rem * var(--font-scale))`
          }}
        >
          System zarządzania danymi emerytalnymi
        </p>
      </div>

      {/* Controls */}
      <ZusCard className="mb-6 p-6">
        <ZusCardHeader className="mb-4">
          <h2 
            className="text-xl font-semibold"
            style={{ 
              color: `rgb(var(--color-text))`,
              fontSize: `calc(1.25rem * var(--font-scale))`
            }}
          >
            Narzędzia i Filtry
          </h2>
        </ZusCardHeader>
        <ZusCardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <ZusInput
              id="search"
              label="Szukaj po kodzie pocztowym lub ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="np. 00-001"
            />
            
            <ZusSelect
              id="gender-filter"
              label="Filtruj po płci"
              value={genderFilter}
              onChange={setGenderFilter}
              options={[
                { value: "all", label: "Wszyscy" },
                { value: "M", label: "Mężczyźni" },
                { value: "F", label: "Kobiety" }
              ]}
            />
            
            <ZusSelect
              id="age-filter"
              label="Filtruj po wieku"
              value={ageRangeFilter}
              onChange={setAgeRangeFilter}
              options={[
                { value: "all", label: "Wszystkie grupy" },
                { value: "young", label: "Młodzi (< 40)" },
                { value: "middle", label: "Średni (40-54)" },
                { value: "senior", label: "Starsi (55+)" }
              ]}
            />
            
            <ZusSelect
              id="sort-by"
              label="Sortuj według"
              value={sortBy}
              onChange={(value) => setSortBy(value as keyof RetirementData)}
              options={[
                { value: "dateUsed", label: "Data użycia" },
                { value: "expectedRetirement", label: "Emerytura oczekiwana" },
                { value: "age", label: "Wiek" },
                { value: "salaryAmount", label: "Wynagrodzenie" },
                { value: "actualRetirement", label: "Emerytura rzeczywista" }
              ]}
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <ZusButton onClick={exportToExcel} variant="primary">
              Eksportuj do Excel
            </ZusButton>
            <ZusButton 
              onClick={() => {
                setSearchTerm("");
                setGenderFilter("all");
                setAgeRangeFilter("all");
                setSortBy("dateUsed");
                setSortOrder("desc");
              }} 
              variant="secondary"
            >
              Resetuj filtry
            </ZusButton>
            <div 
              className="px-3 py-2 rounded-md text-sm font-medium"
              style={{ 
                backgroundColor: `rgb(var(--color-accent) / 0.1)`,
                color: `rgb(var(--color-text))`
              }}
            >
              Wyników: {filteredData.length}
            </div>
          </div>
        </ZusCardBody>
      </ZusCard>

      {/* Data Table */}
      <ZusCard className="overflow-hidden">
        <ZusCardHeader className="p-6 pb-0">
          <h2 
            className="text-xl font-semibold"
            style={{ 
              color: `rgb(var(--color-text))`,
              fontSize: `calc(1.25rem * var(--font-scale))`
            }}
          >
            Dane Emerytalne
          </h2>
        </ZusCardHeader>
        <ZusCardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr 
                  className="border-b"
                  style={{ 
                    backgroundColor: `rgb(var(--color-accent) / 0.05)`,
                    borderColor: `rgb(var(--color-accent) / 0.2)`
                  }}
                >
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80"
                    onClick={() => handleSort("id")}
                    style={{ color: `rgb(var(--color-text))` }}
                  >
                    ID {getSortIcon("id")}
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80"
                    onClick={() => handleSort("dateUsed")}
                    style={{ color: `rgb(var(--color-text))` }}
                  >
                    Data użycia {getSortIcon("dateUsed")}
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80"
                    onClick={() => handleSort("timeUsed")}
                    style={{ color: `rgb(var(--color-text))` }}
                  >
                    Godzina {getSortIcon("timeUsed")}
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80"
                    onClick={() => handleSort("expectedRetirement")}
                    style={{ color: `rgb(var(--color-text))` }}
                  >
                    Emerytura oczekiwana {getSortIcon("expectedRetirement")}
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80"
                    onClick={() => handleSort("age")}
                    style={{ color: `rgb(var(--color-text))` }}
                  >
                    Wiek {getSortIcon("age")}
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80"
                    onClick={() => handleSort("gender")}
                    style={{ color: `rgb(var(--color-text))` }}
                  >
                    Płeć {getSortIcon("gender")}
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80"
                    onClick={() => handleSort("salaryAmount")}
                    style={{ color: `rgb(var(--color-text))` }}
                  >
                    Wynagrodzenie {getSortIcon("salaryAmount")}
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: `rgb(var(--color-text))` }}
                  >
                    Okresy choroby
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80"
                    onClick={() => handleSort("mainAccountFunds")}
                    style={{ color: `rgb(var(--color-text))` }}
                  >
                    Konto główne {getSortIcon("mainAccountFunds")}
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80"
                    onClick={() => handleSort("subAccountFunds")}
                    style={{ color: `rgb(var(--color-text))` }}
                  >
                    Subkonto {getSortIcon("subAccountFunds")}
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80"
                    onClick={() => handleSort("actualRetirement")}
                    style={{ color: `rgb(var(--color-text))` }}
                  >
                    Emerytura rzeczywista {getSortIcon("actualRetirement")}
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80"
                    onClick={() => handleSort("adjustedRetirement")}
                    style={{ color: `rgb(var(--color-text))` }}
                  >
                    Emerytura urealniona {getSortIcon("adjustedRetirement")}
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80"
                    onClick={() => handleSort("postalCode")}
                    style={{ color: `rgb(var(--color-text))` }}
                  >
                    Kod pocztowy {getSortIcon("postalCode")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: `rgb(var(--color-accent) / 0.1)` }}>
                {filteredData.map((row, index) => (
                  <tr 
                    key={row.id}
                    className="hover:bg-opacity-50 transition-colors"
                    style={{ 
                      backgroundColor: index % 2 === 0 ? 'transparent' : `rgb(var(--color-accent) / 0.03)`
                    }}
                  >
                    <td 
                      className="px-4 py-3 text-sm font-medium"
                      style={{ color: `rgb(var(--color-text))` }}
                    >
                      {row.id}
                    </td>
                    <td 
                      className="px-4 py-3 text-sm"
                      style={{ color: `rgb(var(--color-text))` }}
                    >
                      {row.dateUsed}
                    </td>
                    <td 
                      className="px-4 py-3 text-sm"
                      style={{ color: `rgb(var(--color-text))` }}
                    >
                      {row.timeUsed}
                    </td>
                    <td 
                      className="px-4 py-3 text-sm font-medium"
                      style={{ color: `rgb(var(--zus-green))` }}
                    >
                      {formatCurrency(row.expectedRetirement)}
                    </td>
                    <td 
                      className="px-4 py-3 text-sm"
                      style={{ color: `rgb(var(--color-text))` }}
                    >
                      {row.age}
                    </td>
                    <td 
                      className="px-4 py-3 text-sm"
                      style={{ color: `rgb(var(--color-text))` }}
                    >
                      {row.gender === "M" ? "Mężczyzna" : "Kobieta"}
                    </td>
                    <td 
                      className="px-4 py-3 text-sm font-medium"
                      style={{ color: `rgb(var(--zus-blue))` }}
                    >
                      {formatCurrency(row.salaryAmount)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span 
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          row.includesSickLeave 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {row.includesSickLeave ? "Tak" : "Nie"}
                      </span>
                    </td>
                    <td 
                      className="px-4 py-3 text-sm font-medium"
                      style={{ color: `rgb(var(--zus-navy))` }}
                    >
                      {formatCurrency(row.mainAccountFunds)}
                    </td>
                    <td 
                      className="px-4 py-3 text-sm font-medium"
                      style={{ color: `rgb(var(--zus-navy))` }}
                    >
                      {formatCurrency(row.subAccountFunds)}
                    </td>
                    <td 
                      className="px-4 py-3 text-sm font-medium"
                      style={{ color: `rgb(var(--zus-green))` }}
                    >
                      {formatCurrency(row.actualRetirement)}
                    </td>
                    <td 
                      className="px-4 py-3 text-sm font-medium"
                      style={{ color: `rgb(var(--zus-yellow))` }}
                    >
                      {formatCurrency(row.adjustedRetirement)}
                    </td>
                    <td 
                      className="px-4 py-3 text-sm"
                      style={{ color: `rgb(var(--color-text))` }}
                    >
                      {row.postalCode}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredData.length === 0 && (
            <div 
              className="text-center py-12"
              style={{ color: `rgb(var(--color-text) / 0.6)` }}
            >
              <p className="text-lg">Brak danych spełniających kryteria wyszukiwania</p>
              <p className="text-sm mt-2">Spróbuj zmienić filtry lub wprowadzić inne hasło wyszukiwania</p>
            </div>
          )}
        </ZusCardBody>
      </ZusCard>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <ZusCard className="p-6">
          <div className="text-center">
            <div 
              className="text-3xl font-bold"
              style={{ color: `rgb(var(--zus-blue))` }}
            >
              {filteredData.length}
            </div>
            <div 
              className="text-sm font-medium mt-1"
              style={{ color: `rgb(var(--color-text) / 0.7)` }}
            >
              Całkowita liczba rekordów
            </div>
          </div>
        </ZusCard>
        
        <ZusCard className="p-6">
          <div className="text-center">
            <div 
              className="text-3xl font-bold"
              style={{ color: `rgb(var(--zus-green))` }}
            >
              {formatCurrency(
                filteredData.reduce((sum, item) => sum + item.expectedRetirement, 0) / filteredData.length || 0
              )}
            </div>
            <div 
              className="text-sm font-medium mt-1"
              style={{ color: `rgb(var(--color-text) / 0.7)` }}
            >
              Średnia emerytura oczekiwana
            </div>
          </div>
        </ZusCard>
        
        <ZusCard className="p-6">
          <div className="text-center">
            <div 
              className="text-3xl font-bold"
              style={{ color: `rgb(var(--zus-navy))` }}
            >
              {Math.round(
                filteredData.reduce((sum, item) => sum + item.age, 0) / filteredData.length || 0
              )}
            </div>
            <div 
              className="text-sm font-medium mt-1"
              style={{ color: `rgb(var(--color-text) / 0.7)` }}
            >
              Średni wiek użytkowników
            </div>
          </div>
        </ZusCard>
        
        <ZusCard className="p-6">
          <div className="text-center">
            <div 
              className="text-3xl font-bold"
              style={{ color: `rgb(var(--zus-yellow))` }}
            >
              {filteredData.filter(item => item.includesSickLeave).length}
            </div>
            <div 
              className="text-sm font-medium mt-1"
              style={{ color: `rgb(var(--color-text) / 0.7)` }}
            >
              Z okresami choroby
            </div>
          </div>
        </ZusCard>
      </div>
    </div>
  );
}