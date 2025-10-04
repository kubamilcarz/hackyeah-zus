"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ZusText, ZusButton, ZusInput, ZusSelect } from "@/components/ui/";
import { PueLoginPanel } from "@/components/pue/pue-panel";

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 70 }, (_, i) => currentYear - i).reverse();
const RETIRE_YEARS = Array.from({ length: 60 }, (_, i) => currentYear + i);

export default function SignUpFormPage() {
  const router = useRouter();

  // --- form state
  const [age, setAge] = useState<number>(30);
  const [sex, setSex] = useState<string>("M");
  const [salary, setSalary] = useState<number>(9000);
  const [startYear, setStartYear] = useState<number>(currentYear - 6);
  const [retireYear, setRetireYear] = useState<number>(currentYear + 35);

  // Salary: keep arrows stepping by 500 (typing freeform still allowed)
  const onSalaryKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        const delta = e.key === "ArrowUp" ? 500 : -500;
        setSalary((v) => Math.max(0, Math.round((v + delta) / 500) * 500));
      }
    },
    []
  );
  const onSalaryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = Number(e.target.value.replace(/\s/g, "").replace(",", "."));
      setSalary(Number.isFinite(raw) ? raw : 0);
    },
    []
  );

  const isValid = useMemo(() => {
    return (
      Number.isFinite(age) &&
      age >= 16 &&
      (sex === "F" || sex === "M") &&
      Number.isFinite(salary) &&
      salary >= 0 &&
      Number.isFinite(startYear) &&
      Number.isFinite(retireYear) &&
      retireYear > startYear
    );
  }, [age, sex, salary, startYear, retireYear]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    const q = new URLSearchParams({
      age: String(age),
      sex,
      grossSalary: String(Math.round(salary)),
      workStartYear: String(startYear),
      retireYear: String(retireYear),
    });
    router.push(`/simulator?${q.toString()}`);
  }

  return (
    <form onSubmit={onSubmit} noValidate className="bg-white rounded-2xl">
      <div className="grid grid-cols-1 md:grid-cols-17">
        {/* LEFT: Demographics */}
        <div className="p-6 md:p-8 flex flex-col gap-4 md:col-span-8">
          <div className="flex flex-col mb-4">
            <h2 className="mt-2 text-[22px] leading-7 font-semibold text-[rgb(var(--zus-black))]">
              Twoje dane
            </h2>

            <ZusText className="mt-2 text-neutral-700">
              Wypełnij podstawowe informacje demograficzne. Te dane pomogą nam
              lepiej dopasować prognozę i porównania kontekstowe.
            </ZusText>
          </div>

<div className="flex flex-row gap-6">
        <div className="flex flex-col">
            {/* Age */}
            <ZusInput
              id="age"
              label="Wiek"
              type="number"
              min={16}
              max={80}
              step={1}
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value || "0", 10))}
              className="w-40"
              required
            />
            <p className="zus-text-small mt-1 text-gray-700">
              Minimalny wiek: 16 lat.
            </p>
        </div>

            <div className="flex flex-col items-stretch">
              <label htmlFor="sex" className="block text-[14px] font-medium text-neutral-800">
                Płeć
              </label>
              <ZusSelect
                options={[
                  { value: "F", label: "Kobieta" },
                  { value: "M", label: "Mężczyzna" },
                ]}
                value={sex}
                onChange={setSex}
                className="zus-select w-48 mt-2"
              />
            </div>
          </div>

            {/* Salary */}
            <div>
              <ZusInput
                id="salary"
                label="Pensja brutto (PLN / m-c)"
                type="number"
                min={0}
                step={500}
                value={Number.isFinite(salary) ? salary : 0}
                onChange={onSalaryChange}
                onKeyDown={onSalaryKeyDown}
                className="w-56"
                aria-describedby="salary-help"
                required
              />
              <p
                id="salary-help"
                className="zus-text-small mt-1 text-gray-700"
              >
                Strzałki ↑/↓ zmieniają kwotę o 500.
              </p>
            </div>

            {/* Work start year (picker left as native select for now) */}
            <div>
              <label htmlFor="startYear" className="block text-[14px] font-medium text-neutral-800">
                Rok rozpoczęcia pracy
              </label>
              <ZusSelect
                options={YEARS.map((y) => ({ value: y.toString(), label: y.toString() }))}
                id="startYear"
                value={startYear}
                onChange={(value) => setStartYear(parseInt(value, 10))}
                className="zus-select w-48 mt-2"
              />
            </div>
                
            {/* Planned retirement year (picker left as native select for now) */}
            <div>
              <label htmlFor="retireYear" className="block text-[14px] font-medium text-neutral-800">
                Planowany rok przejścia na emeryturę
              </label>
              <ZusSelect
                options={RETIRE_YEARS.map((y) => ({ value: y.toString(), label: y.toString() }))}
                id="retireYear"
                value={retireYear}
                onChange={(value) => setRetireYear(parseInt(value, 10))}
                className="zus-select w-56 mt-2"
              />

              <p className="zus-text-small mt-1 text-neutral-600">
                Musi być później niż rok rozpoczęcia pracy.
              </p>
            </div>

            <ZusButton type="submit" className="mt-6 w-40 ml-auto">
            Kontynuuj
            </ZusButton>
          </div>

        {/* Divider with "LUB" */}
        <div className="flex flex-col items-center justify-center my-6 md:col-span-1">
            <div className="w-px h-20 bg-gray-300"></div>
            <span className="py-4 text-sm text-gray-500 font-medium">LUB</span>
            <div className="w-px h-20 bg-gray-300"></div>
        </div>


<div className="md:col-span-8">
        <PueLoginPanel />
    </div>
        </div>

        {/* RIGHT: PUE/eZUS login panel */}
    </form>
  );
}
