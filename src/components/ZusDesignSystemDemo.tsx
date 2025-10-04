import React, { useState } from 'react';
import {
  ZusCard,
  ZusCardHeader,
  ZusCardBody,
  ZusCardFooter,
  ZusButton,
  ZusBadge,
  ZusAlert,
  ZusInput,
  ZusSelect,
  ZusTextarea,
  ZusHeading,
  ZusText
} from './zus-ui';

const ZusDesignSystemDemo: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');

  const selectOptions = [
    { value: 'option1', label: 'Opcja 1' },
    { value: 'option2', label: 'Opcja 2' },
    { value: 'option3', label: 'Opcja 3' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <ZusHeading level={1} className="zus-text-display mb-4">
            ZUS Design System
          </ZusHeading>
          <ZusText variant="lead" className="text-center">
            Kompletny system projektowania zgodny z wytycznymi ZUS
          </ZusText>
        </div>

        {/* Typography Section */}
        <ZusCard className="mb-8">
          <ZusCardHeader>
            <ZusHeading level={2}>Typografia</ZusHeading>
          </ZusCardHeader>
          <ZusCardBody>
            <div className="space-y-4">
              <div>
                <ZusText variant="display">Display Text - Główny nagłówek</ZusText>
              </div>
              <div>
                <ZusHeading level={1}>Heading 1 - Tytuł sekcji</ZusHeading>
              </div>
              <div>
                <ZusHeading level={2}>Heading 2 - Podtytuł</ZusHeading>
              </div>
              <div>
                <ZusHeading level={3}>Heading 3 - Nagłówek karty</ZusHeading>
              </div>
              <div>
                <ZusHeading level={4}>Heading 4 - Mały nagłówek</ZusHeading>
              </div>
              <div>
                <ZusText variant="lead">Lead text - Wprowadzający tekst o większym znaczeniu</ZusText>
              </div>
              <div>
                <ZusText variant="body-large">Body Large - Większy tekst podstawowy</ZusText>
              </div>
              <div>
                <ZusText variant="body">Body - Standardowy tekst podstawowy dla długich treści</ZusText>
              </div>
              <div>
                <ZusText variant="small">Small - Mniejszy tekst pomocniczy</ZusText>
              </div>
              <div>
                <ZusText variant="caption">Caption - Podpisy i informacje pomocnicze</ZusText>
              </div>
            </div>
          </ZusCardBody>
        </ZusCard>

        {/* Buttons Section */}
        <ZusCard className="mb-8">
          <ZusCardHeader>
            <ZusHeading level={2}>Przyciski</ZusHeading>
          </ZusCardHeader>
          <ZusCardBody>
            <div className="space-y-6">
              <div>
                <ZusText variant="small" className="mb-3">Warianty przycisków:</ZusText>
                <div className="flex flex-wrap gap-3">
                  <ZusButton variant="primary">Primary</ZusButton>
                  <ZusButton variant="secondary">Secondary</ZusButton>
                  <ZusButton variant="outline">Outline</ZusButton>
                  <ZusButton variant="ghost">Ghost</ZusButton>
                  <ZusButton variant="success">Success</ZusButton>
                  <ZusButton variant="error">Error</ZusButton>
                </div>
              </div>
              
              <div>
                <ZusText variant="small" className="mb-3">Rozmiary przycisków:</ZusText>
                <div className="flex flex-wrap gap-3 items-center">
                  <ZusButton size="small">Mały</ZusButton>
                  <ZusButton size="default">Standardowy</ZusButton>
                  <ZusButton size="large">Duży</ZusButton>
                </div>
              </div>
              
              <div>
                <ZusText variant="small" className="mb-3">Stany przycisków:</ZusText>
                <div className="flex flex-wrap gap-3">
                  <ZusButton>Normalny</ZusButton>
                  <ZusButton loading>Ładowanie</ZusButton>
                  <ZusButton disabled>Nieaktywny</ZusButton>
                </div>
              </div>
            </div>
          </ZusCardBody>
        </ZusCard>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <ZusCard variant="default">
            <ZusCardHeader>
              <ZusHeading level={3}>Standardowa karta</ZusHeading>
            </ZusCardHeader>
            <ZusCardBody>
              <ZusText>To jest przykład standardowej karty z podstawowym stylem.</ZusText>
            </ZusCardBody>
            <ZusCardFooter>
              <ZusButton size="small">Akcja</ZusButton>
            </ZusCardFooter>
          </ZusCard>

          <ZusCard variant="primary">
            <ZusCardHeader>
              <ZusHeading level={3}>Karta główna</ZusHeading>
            </ZusCardHeader>
            <ZusCardBody>
              <ZusText>Karta z akcentem w kolorze głównym ZUS.</ZusText>
            </ZusCardBody>
            <ZusCardFooter>
              <ZusButton variant="outline" size="small">Zobacz więcej</ZusButton>
            </ZusCardFooter>
          </ZusCard>

          <ZusCard variant="featured">
            <ZusCardHeader>
              <ZusHeading level={3}>Karta wyróżniona</ZusHeading>
            </ZusCardHeader>
            <ZusCardBody>
              <ZusText>Karta z gradientem dla najważniejszych treści.</ZusText>
            </ZusCardBody>
            <ZusCardFooter>
              <ZusButton variant="secondary" size="small">Rozpocznij</ZusButton>
            </ZusCardFooter>
          </ZusCard>

          <ZusCard variant="success">
            <ZusCardHeader>
              <ZusHeading level={3}>Sukces</ZusHeading>
            </ZusCardHeader>
            <ZusCardBody>
              <ZusText>Karta dla pozytywnych informacji i sukcesów.</ZusText>
            </ZusCardBody>
          </ZusCard>

          <ZusCard variant="warning">
            <ZusCardHeader>
              <ZusHeading level={3}>Ostrzeżenie</ZusHeading>
            </ZusCardHeader>
            <ZusCardBody>
              <ZusText>Karta dla ostrzeżeń i ważnych informacji.</ZusText>
            </ZusCardBody>
          </ZusCard>

          <ZusCard variant="error">
            <ZusCardHeader>
              <ZusHeading level={3}>Błąd</ZusHeading>
            </ZusCardHeader>
            <ZusCardBody>
              <ZusText>Karta dla komunikatów o błędach.</ZusText>
            </ZusCardBody>
          </ZusCard>
        </div>

        {/* Badges Section */}
        <ZusCard className="mb-8">
          <ZusCardHeader>
            <ZusHeading level={2}>Etykiety (Badges)</ZusHeading>
          </ZusCardHeader>
          <ZusCardBody>
            <div className="flex flex-wrap gap-3">
              <ZusBadge variant="primary">Primary</ZusBadge>
              <ZusBadge variant="secondary">Secondary</ZusBadge>
              <ZusBadge variant="success">Sukces</ZusBadge>
              <ZusBadge variant="warning">Ostrzeżenie</ZusBadge>
              <ZusBadge variant="error">Błąd</ZusBadge>
              <ZusBadge variant="neutral">Neutralny</ZusBadge>
            </div>
          </ZusCardBody>
        </ZusCard>

        {/* Alerts Section */}
        <ZusCard className="mb-8">
          <ZusCardHeader>
            <ZusHeading level={2}>Alerty</ZusHeading>
          </ZusCardHeader>
          <ZusCardBody>
            <div className="space-y-4">
              <ZusAlert variant="info" title="Informacja">
                To jest komunikat informacyjny dla użytkownika.
              </ZusAlert>
              
              <ZusAlert variant="success" title="Sukces">
                Operacja została wykonana pomyślnie!
              </ZusAlert>
              
              <ZusAlert variant="warning" title="Ostrzeżenie">
                Proszę zwrócić uwagę na tę ważną informację.
              </ZusAlert>
              
              <ZusAlert variant="error" title="Błąd">
                Wystąpił błąd podczas przetwarzania żądania.
              </ZusAlert>
            </div>
          </ZusCardBody>
        </ZusCard>

        {/* Forms Section */}
        <ZusCard className="mb-8">
          <ZusCardHeader>
            <ZusHeading level={2}>Formularze</ZusHeading>
          </ZusCardHeader>
          <ZusCardBody>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ZusInput
                  label="Imię i nazwisko"
                  placeholder="Wprowadź imię i nazwisko"
                  value={inputValue}
                  onChange={setInputValue}
                  required
                />
                
                <ZusSelect
                  label="Wybierz opcję"
                  options={selectOptions}
                  value={selectValue}
                  onChange={setSelectValue}
                  placeholder="Wybierz..."
                />
              </div>
              
              <ZusInput
                label="Email"
                type="email"
                placeholder="twoj.email@example.com"
              />
              
              <ZusInput
                label="Hasło"
                type="password"
                placeholder="Wprowadź hasło"
                error="Hasło musi mieć co najmniej 8 znaków"
              />
              
              <ZusTextarea
                label="Wiadomość"
                placeholder="Wprowadź swoją wiadomość..."
                value={textareaValue}
                onChange={setTextareaValue}
                rows={4}
              />
            </div>
          </ZusCardBody>
          <ZusCardFooter>
            <div className="flex gap-3">
              <ZusButton type="submit">Wyślij formularz</ZusButton>
              <ZusButton variant="outline">Anuluj</ZusButton>
            </div>
          </ZusCardFooter>
        </ZusCard>

        {/* Color Palette */}
        <ZusCard className="mb-8">
          <ZusCardHeader>
            <ZusHeading level={2}>Paleta kolorów ZUS</ZusHeading>
          </ZusCardHeader>
          <ZusCardBody>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-lg zus-bg-navy mb-2"></div>
                <ZusText variant="small">Navy</ZusText>
                <ZusText variant="caption">#00416E</ZusText>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-lg zus-bg-yellow mb-2"></div>
                <ZusText variant="small">Yellow</ZusText>
                <ZusText variant="caption">#FFB34F</ZusText>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-lg zus-bg-blue mb-2"></div>
                <ZusText variant="small">Blue</ZusText>
                <ZusText variant="caption">#3F84D2</ZusText>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-lg zus-bg-green mb-2"></div>
                <ZusText variant="small">Green</ZusText>
                <ZusText variant="caption">#00993F</ZusText>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-lg zus-bg-red mb-2"></div>
                <ZusText variant="small">Red</ZusText>
                <ZusText variant="caption">#F05E5E</ZusText>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-lg zus-bg-gray mb-2"></div>
                <ZusText variant="small">Gray</ZusText>
                <ZusText variant="caption">#BEC3CE</ZusText>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-lg zus-bg-black mb-2"></div>
                <ZusText variant="small">Black</ZusText>
                <ZusText variant="caption">#000000</ZusText>
              </div>
            </div>
          </ZusCardBody>
        </ZusCard>

        {/* Table Example */}
        <ZusCard>
          <ZusCardHeader>
            <ZusHeading level={2}>Tabela</ZusHeading>
          </ZusCardHeader>
          <ZusCardBody>
            <table className="zus-table">
              <thead>
                <tr>
                  <th>Nazwa</th>
                  <th>Status</th>
                  <th>Data</th>
                  <th>Akcje</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Jan Kowalski</td>
                  <td><ZusBadge variant="success">Aktywny</ZusBadge></td>
                  <td>2024-01-15</td>
                  <td>
                    <ZusButton size="small" variant="ghost">Edytuj</ZusButton>
                  </td>
                </tr>
                <tr>
                  <td>Anna Nowak</td>
                  <td><ZusBadge variant="warning">Oczekujący</ZusBadge></td>
                  <td>2024-01-14</td>
                  <td>
                    <ZusButton size="small" variant="ghost">Edytuj</ZusButton>
                  </td>
                </tr>
                <tr>
                  <td>Piotr Wiśniewski</td>
                  <td><ZusBadge variant="error">Nieaktywny</ZusBadge></td>
                  <td>2024-01-13</td>
                  <td>
                    <ZusButton size="small" variant="ghost">Edytuj</ZusButton>
                  </td>
                </tr>
              </tbody>
            </table>
          </ZusCardBody>
        </ZusCard>
      </div>
    </div>
  );
};

export default ZusDesignSystemDemo;
