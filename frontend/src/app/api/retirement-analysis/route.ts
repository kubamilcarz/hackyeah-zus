import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simple in-memory cache to prevent duplicate requests
const requestCache = new Map<string, { conclusions: string[], timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();

    if (!userData) {
      return NextResponse.json({ error: 'User data is required' }, { status: 400 });
    }

    // Create a cache key based on user data
    const cacheKey = JSON.stringify({
      age: userData.signup?.age,
      gender: userData.signup?.gender,
      grossSalary: userData.signup?.grossSalary,
      expectedRetirement: userData.welcome?.expectedRetirement,
      estimatedPension: userData.calculation?.estimatedMonthlyPension
    });

    // Check cache first
    const cached = requestCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      console.log('Returning cached conclusions for user');
      return NextResponse.json({ conclusions: cached.conclusions });
    }

    console.log('Analyzing retirement data:', {
      age: userData.signup?.age,
      expectedRetirement: userData.welcome?.expectedRetirement,
      grossSalary: userData.signup?.grossSalary,
      estimatedPension: userData.calculation?.estimatedMonthlyPension
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Jesteś Emą - ekspertem ds. planowania emerytalnego w Polsce. Analizujesz dane emerytalne użytkowników i formułujesz spersonalizowane wnioski i rekomendacje.

ZADANIE: Na podstawie otrzymanych danych użytkownika, sformułuj dokładnie 3 spersonalizowane wnioski dotyczące jego sytuacji emerytalnej.

WYTYCZNE:
1. Każdy wniosek powinien być konkretny i odnoszący się do danych użytkownika
2. Używaj polskiego języka, bądź profesjonalna ale przyjazna
3. Uwzględniaj rzeczywiste liczby z danych użytkownika
4. Podawaj praktyczne porady i rekomendacje
5. Każdy wniosek powinien mieć 2-4 zdania
6. Numeruj wnioski (1., 2., 3.)

OBSZARY DO ANALIZY:
- Stosunek prognozowanej emerytury do oczekiwań
- Luka emerytalna (różnica między oczekiwaną a prognozowaną emeryturą)
- Potencjał dodatkowych oszczędności (IKE, IKZE, PPK)
- Wpływ wieku na strategie oszczędzania
- Siła nabywcza i inflacja
- Możliwości zwiększenia składek lub wydłużenia pracy

ODPOWIEDŹ: Zwróć tylko 3 wnioseki, każdy w nowej linii, bez dodatkowych komentarzy.`
        },
        {
          role: "user",
          content: `Przeanalizuj następujące dane emerytalne użytkownika:

DANE PODSTAWOWE:
- Wiek: ${userData.signup?.age || 'nieokreślony'} lat
- Płeć: ${userData.signup?.gender === 'female' ? 'kobieta' : userData.signup?.gender === 'male' ? 'mężczyzna' : 'nieokreślona'}
- Obecne wynagrodzenie brutto: ${userData.signup?.grossSalary || 'nieokreślone'} PLN
- Rok rozpoczęcia pracy: ${userData.signup?.workStartYear || 'nieokreślony'}
- Planowany rok przejścia na emeryturę: ${userData.signup?.plannedRetirementYear || 'nieokreślony'}

OCZEKIWANIA:
- Oczekiwana wysokość emerytury: ${userData.welcome?.expectedRetirement || 'nieokreślona'} PLN miesięcznie

PROGNOZA:
- Szacowana emerytura z ZUS: ${userData.calculation?.estimatedMonthlyPension ? Math.round(userData.calculation.estimatedMonthlyPension) : 'nieokreślona'} PLN miesięcznie
- Lata pracy: ${userData.calculation?.workingYears || 'nieokreślone'}

DODATKOWE OSZCZĘDNOŚCI:
- IKE: ${userData.retirementSources?.ike || 0} PLN
- IKZE: ${userData.retirementSources?.ikze || 0} PLN  
- PPK: ${userData.retirementSources?.ppk || 0} PLN

Sformułuj 3 spersonalizowane wnioski dla tego użytkownika.`
        }
      ],
      max_tokens: 400,
      temperature: 0.7,
    });

    const analysisText = completion.choices[0]?.message?.content || "Przepraszam, wystąpił błąd podczas analizy. Spróbuj ponownie.";
    
    // Split the response into individual conclusions
    const conclusions = analysisText
      .split('\n')
      .filter(line => line.trim().length > 0 && /^\d+\./.test(line.trim()))
      .map(line => line.trim());

    console.log('Generated conclusions:', conclusions);

    // Cache the result
    requestCache.set(cacheKey, { conclusions, timestamp: Date.now() });

    // Clean old cache entries (simple cleanup)
    const now = Date.now();
    for (const [key, value] of requestCache.entries()) {
      if (now - value.timestamp > CACHE_DURATION) {
        requestCache.delete(key);
      }
    }

    return NextResponse.json({ conclusions });

  } catch (error) {
    console.error('Error in retirement analysis API:', error);
    
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Problem z konfiguracją API. Skontaktuj się z administratorem.' },
          { status: 500 }
        );
      }
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Zbyt wiele zapytań. Spróbuj ponownie za chwilę.' },
          { status: 429 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas analizy emerytury: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}
