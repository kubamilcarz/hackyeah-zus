/**
 * Custom Data Entry Section Component
 *
 * @description
 * A React component that provides an interface for users to input additional retirement data
 * to improve pension forecast accuracy. This component manages two main data categories:
 * historical salaries and sick leave periods (both past and planned future periods).
 *
 * @component
 * @location /Users/kubamilcarz/Developer/HackYeah/zus-sim/frontend/src/components/dashboard/custom-data-entry-section.tsx
 *
 * @features
 * - **Historical Salaries Management**: Allows users to add, edit, and remove historical salary data
 *   with year and gross amount fields. Data structure: `{ year: number, amount: number }`
 *
 * - **Sick Leave Periods Tracking**: Manages two separate arrays:
 *   - Past sick leave periods (red-themed UI)
 *   - Future/planned sick leave periods (blue-themed UI)
 *   Data structure: `{ startDate: string, endDate: string, reason: string }`
 *
 * - **Real-time Impact Summary**: Displays a summary showing how the entered data
 *   affects pension forecasts and counts of entered records
 *
 * @stateManagement
 * - `historicalSalaries`: Array of salary records with year and amount
 * - `sickLeavePeriods`: Array of past sick leave periods
 * - `futureSickLeave`: Array of planned future sick leave periods
 *
 * @apiIntegration
 * This component currently manages local state only. Backend integration needed for:
 * - Persisting historical salary data to user profile
 * - Storing sick leave periods for pension calculations
 * - Triggering pension forecast recalculation when data changes
 * - Validating date ranges and salary amounts
 *
 * @styling Uses ZUS design system with Tailwind CSS classes and custom ZUS color variables
 *
 * @accessibility Includes proper heading hierarchy, form labels, and keyboard navigation
 */
// Custom Data Entry Section Component

import { useState } from "react";
import { ZusText } from "../zus-ui";

export default function CustomDataEntrySection() {
  const [historicalSalaries, setHistoricalSalaries] = useState([
    { year: 2020, amount: 4500 },
    { year: 2021, amount: 4800 },
    { year: 2022, amount: 5200 },
  ]);
  const [sickLeavePeriods, setSickLeavePeriods] = useState([
    { startDate: "2023-03-15", endDate: "2023-03-30", reason: "Choroba" },
    { startDate: "2024-01-10", endDate: "2024-01-20", reason: "Rehabilitacja" },
  ]);
  const [futureSickLeave, setFutureSickLeave] = useState([
    {
      startDate: "2025-06-01",
      endDate: "2025-06-15",
      reason: "Planowana operacja",
    },
  ]);

  const addHistoricalSalary = () => {
    const currentYear = new Date().getFullYear();
    setHistoricalSalaries([
      ...historicalSalaries,
      { year: currentYear - 1, amount: 5000 },
    ]);
  };

  const updateHistoricalSalary = (
    index: number,
    field: "year" | "amount",
    value: number
  ) => {
    const updated = [...historicalSalaries];
    updated[index][field] = value;
    setHistoricalSalaries(updated);
  };

  const removeHistoricalSalary = (index: number) => {
    setHistoricalSalaries(historicalSalaries.filter((_, i) => i !== index));
  };

  const addSickLeavePeriod = (type: "past" | "future") => {
    const newPeriod = {
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
      reason: "",
    };

    if (type === "past") {
      setSickLeavePeriods([...sickLeavePeriods, newPeriod]);
    } else {
      setFutureSickLeave([...futureSickLeave, newPeriod]);
    }
  };

  const updateSickLeavePeriod = (
    type: "past" | "future",
    index: number,
    field: string,
    value: string
  ) => {
    if (type === "past") {
      const updated = [...sickLeavePeriods];
      updated[index] = { ...updated[index], [field]: value };
      setSickLeavePeriods(updated);
    } else {
      const updated = [...futureSickLeave];
      updated[index] = { ...updated[index], [field]: value };
      setFutureSickLeave(updated);
    }
  };

  const removeSickLeavePeriod = (type: "past" | "future", index: number) => {
    if (type === "past") {
      setSickLeavePeriods(sickLeavePeriods.filter((_, i) => i !== index));
    } else {
      setFutureSickLeave(futureSickLeave.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="bg-zus-card rounded-2xl">
      <div className="p-6 md:p-8 flex flex-col gap-6">
        <header className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-semibold text-primary">
            Dodatkowe dane emerytalne
          </h1>
          <ZusText variant="body" className="text-secondary max-w-2xl">
            Wprowadź dodatkowe informacje o swoich historycznych wynagrodzeniach
            oraz okresach choroby, aby otrzymać bardziej precyzyjną prognozę
            emerytalną.
          </ZusText>
        </header>

        {/* Summary and Impact */}
        <div className="p-4 bg-gradient-to-r from-blue-50/50 to-transparent rounded-lg border border-neutral">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-info-light rounded-lg flex items-center justify-center">
              <span className="text-info font-bold text-xs">DATA</span>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">
                Wpływ na prognozę emerytalną
              </h4>
              <ZusText variant="small" className="text-secondary">
                Na podstawie wprowadzonych danych historycznych i planowanych
                okresów nieobecności zostanie zaktualizowana Twoja prognoza
                emerytalna. Okresy choroby mogą wpływać na wysokość przyszłej
                emerytury z ZUS.
              </ZusText>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-success">Wynagrodzenia:</span>
                  <span>{historicalSalaries.length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-warning">Okresy choroby:</span>
                  <span>{sickLeavePeriods.length + futureSickLeave.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Historical Salaries Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-success-light rounded-lg flex items-center justify-center">
                <span className="text-success font-bold text-xs">PLN</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary">
                  Historyczne wynagrodzenia
                </h3>
                <ZusText variant="small" className="text-secondary">
                  Wprowadź swoje wynagrodzenia z poprzednich lat
                </ZusText>
              </div>
            </div>

            <div className="space-y-3">
              {historicalSalaries.map((salary, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-zus-card border border-neutral rounded-lg"
                >
                  <input
                    type="number"
                    value={salary.year}
                    onChange={(e) =>
                      updateHistoricalSalary(
                        index,
                        "year",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-20 px-2 py-1 border border-neutral rounded text-sm bg-white"
                    min="1990"
                    max="2024"
                  />
                  <span className="text-sm text-secondary">rok:</span>
                  <input
                    type="number"
                    value={salary.amount}
                    onChange={(e) =>
                      updateHistoricalSalary(
                        index,
                        "amount",
                        parseInt(e.target.value)
                      )
                    }
                    className="flex-1 px-3 py-1 border border-neutral rounded text-sm bg-white"
                    placeholder="Wynagrodzenie brutto"
                  />
                  <span className="text-sm text-secondary">zł</span>
                  <button
                    onClick={() => removeHistoricalSalary(index)}
                    className="text-warning hover:text-warning px-2 py-1 text-sm font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}

              <button
                onClick={addHistoricalSalary}
                className="w-full p-3 border-2 border-dashed border-neutral hover:border-primary rounded-lg text-secondary hover:text-primary transition-colors"
              >
                + Dodaj wynagrodzenie
              </button>
            </div>
          </div>

          {/* Sick Leave Periods Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-warning-light rounded-lg flex items-center justify-center">
                <span className="text-warning font-bold text-xs">L4</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary">
                  Okresy choroby
                </h3>
                <ZusText variant="small" className="text-secondary">
                  Wprowadź okresy nieobecności z powodu choroby
                </ZusText>
              </div>
            </div>

            {/* Past Sick Leave */}
            <div className="space-y-4">
              <h4 className="font-medium text-primary flex items-center gap-2">
                <div className="w-4 h-4 bg-warning-light rounded flex items-center justify-center">
                  <span className="text-warning font-bold text-xs">P</span>
                </div>
                Przeszłe okresy choroby
              </h4>

              <div className="space-y-3">
                {sickLeavePeriods.map((period, index) => (
                  <div
                    key={index}
                    className="p-3 bg-zus-card border border-neutral rounded-lg space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={period.startDate}
                        onChange={(e) =>
                          updateSickLeavePeriod(
                            "past",
                            index,
                            "startDate",
                            e.target.value
                          )
                        }
                        className="px-2 py-1 border border-neutral rounded text-xs bg-white"
                      />
                      <span className="text-xs text-secondary">do</span>
                      <input
                        type="date"
                        value={period.endDate}
                        onChange={(e) =>
                          updateSickLeavePeriod(
                            "past",
                            index,
                            "endDate",
                            e.target.value
                          )
                        }
                        className="px-2 py-1 border border-neutral rounded text-xs bg-white"
                      />
                      <button
                        onClick={() => removeSickLeavePeriod("past", index)}
                        className="text-warning hover:text-warning px-2 py-1 text-sm font-bold"
                      >
                        ×
                      </button>
                    </div>
                    <input
                      type="text"
                      value={period.reason}
                      onChange={(e) =>
                        updateSickLeavePeriod(
                          "past",
                          index,
                          "reason",
                          e.target.value
                        )
                      }
                      placeholder="Powód nieobecności"
                      className="w-full px-2 py-1 border border-neutral rounded text-xs bg-white"
                    />
                  </div>
                ))}

                <button
                  onClick={() => addSickLeavePeriod("past")}
                  className="w-full p-2 border-2 border-dashed border-neutral hover:border-primary rounded-lg text-secondary hover:text-primary transition-colors text-sm"
                >
                  + Dodaj okres choroby z przeszłości
                </button>
              </div>
            </div>

            {/* Future Sick Leave */}
            <div className="space-y-4">
              <h4 className="font-medium text-primary flex items-center gap-2">
                <div className="w-4 h-4 bg-info-light rounded flex items-center justify-center">
                  <span className="text-info font-bold text-xs">F</span>
                </div>
                Planowane okresy choroby
              </h4>

              <div className="space-y-3">
                {futureSickLeave.map((period, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gradient-to-r from-blue-50/50 to-transparent border border-neutral rounded-lg space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={period.startDate}
                        onChange={(e) =>
                          updateSickLeavePeriod(
                            "future",
                            index,
                            "startDate",
                            e.target.value
                          )
                        }
                        className="px-2 py-1 border border-neutral rounded text-xs bg-white"
                      />
                      <span className="text-xs text-secondary">do</span>
                      <input
                        type="date"
                        value={period.endDate}
                        onChange={(e) =>
                          updateSickLeavePeriod(
                            "future",
                            index,
                            "endDate",
                            e.target.value
                          )
                        }
                        className="px-2 py-1 border border-neutral rounded text-xs bg-white"
                      />
                      <button
                        onClick={() => removeSickLeavePeriod("future", index)}
                        className="text-info hover:text-info px-2 py-1 text-sm font-bold"
                      >
                        ×
                      </button>
                    </div>
                    <input
                      type="text"
                      value={period.reason}
                      onChange={(e) =>
                        updateSickLeavePeriod(
                          "future",
                          index,
                          "reason",
                          e.target.value
                        )
                      }
                      placeholder="Planowany powód nieobecności"
                      className="w-full px-2 py-1 border border-neutral rounded text-xs bg-white"
                    />
                  </div>
                ))}

                <button
                  onClick={() => addSickLeavePeriod("future")}
                  className="w-full p-2 border-2 border-dashed border-neutral hover:border-primary rounded-lg text-secondary hover:text-primary transition-colors text-sm"
                >
                  + Dodaj planowany okres choroby
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
