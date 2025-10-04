"use client";

import React from "react";
import {
  ZusText,
  ZusButton,
  ZusCard,
  ZusCardHeader,
  ZusCardBody,
  ZusInput,
  ZusPasswordInput,
  ZusActionTile,
  ZusBrandBar,
} from "@/components/ui/";

function GovIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
      <path d="M3 10h18M6 10V7a6 6 0 0 1 12 0v3" stroke="currentColor" strokeWidth="2" fill="none" />
      <rect x="4" y="10" width="16" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
      <rect x="7" y="2" width="10" height="20" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="18" r="1" fill="currentColor" />
    </svg>
  );
}
function CertIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
      <path d="M6 4h12v12H6z" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 16v5l2-1 2 1v-5" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function PueLoginPanel() {
  return (
    <ZusCard className="p-6 md:p-8 bg-zus-card">
      {/* Top brand line */}
      <ZusCardHeader>
        <ZusBrandBar />
        <div className="text-[13px] font-medium mt-0.5 text-gray-600">
          PUE ZUS zmienia się w eZUS
        </div>
      </ZusCardHeader>

      {/* Title + subtitle */}
      <h2 className="mt-2 text-[22px] leading-7 font-semibold text-[rgb(var(--zus-black))]">Zaloguj się do eZUS</h2>
      <ZusText className="mt-1">
        Wybierz metodę logowania do konta w eZUS.
        <br />
        Nie masz konta w eZUS?{" "}
        <a
          href="#"
          className="underline font-medium"
          style={{ color: "rgb(var(--zus-blue))" }}
          onClick={(e) => e.preventDefault()}
        >
          Zarejestruj się
        </a>
      </ZusText>

      {/* Form */}
      <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
        <ZusInput
          id="login"
          name="login"
          type="text"
          autoComplete="username"
          label="Login"
          hintAction={{ label: "Nie pamiętam loginu", onClick: (e) => e.preventDefault() }}
        />

        <div className="pt-2">
          <ZusPasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            label="Hasło"
            hintAction={{ label: "Nie pamiętam hasła", onClick: (e) => e.preventDefault() }}
          />
        </div>

        <ZusButton type="submit" className="mt-6">
          Zaloguj się
        </ZusButton>
      </form>

      {/* Method tiles */}
      <ZusCardBody className="mt-7 space-y-3">
        <ZusActionTile
          title="Aplikacja mobilna ZUS"
          desc="Skanuj kod QR za pomocą aplikacji mobilnej"
          icon={<PhoneIcon />}
        />
        <ZusActionTile
          title="login.gov.pl"
          desc="Profil zaufany, bankowość, mObywatel, e-Dowód lub eID"
          icon={<GovIcon />}
        />
        <ZusActionTile
          title="Kwalifikowany podpis elektroniczny"
          desc="Certyfikat przypisany do konkretnej osoby"
          icon={<CertIcon />}
        />
      </ZusCardBody>
    </ZusCard>
  );
}