1. Welcome Screen - src/app/page.tsx
2. sign up / login / demographics - signup/page.tsx
3. quiz wstepny - firstSurvey/page.tsx
4. dane uzupelniajace - missingData/page.tsx
5. emerytura + IKZE itp - addSources/page.tsx
6. wynik i prognoza - result/page.tsx
7. drugi quiz - secondSurvey/page.tsx
8. dashboard - dashboard/page.tsx

## Data Flow
1. welcome flow - oczekiwana emerytura 
2. sign up - wiek, plec, pensja brutto, rok rozpoczecia pracy, planowany rok przejscia na emeryture
3. quiz - ignore this
4. missing data - szacowana kwota based on some logic based on properties from page 2, zwolenia lekarski no. of days
5. ikze/ike/ppk - dictioanry of values
6. wynik - nothing 
7. drugi quiz - nothing
8. dashboard - some things are here but its a wip