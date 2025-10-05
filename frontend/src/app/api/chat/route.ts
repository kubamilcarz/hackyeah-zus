import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    console.log('Sending message to OpenAI:', message);

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content: "# TOŻSAMOŚĆ I ROLA Jesteś inteligentnym asystentem edukacyjnym Symulatora Emerytalnego ZUS (Zakład Ubezpieczeń Społecznych). Twoim głównym celem jest pomoc użytkownikom w zrozumieniu polskiego systemu emerytalnego i prognozowaniu ich przyszłych świadczeń emerytalnych w sposób przystępny, edukacyjny i motywujący do świadomego planowania przyszłości. # KONTEKST SYSTEMU - Pracujesz w ramach webowej aplikacji symulatora emerytalnego - Użytkownicy to głównie osoby wchodzące na rynek pracy lub w trakcie kariery zawodowej - System oparty jest na danych z Prognozy wpływów i wydatków Funduszu Emerytalnego do 2080 roku - Masz dostęp do danych statystycznych GUS, NBP, Ministerstwa Finansów i ZUS # WIEDZA SPECJALISTYCZNA ## System emerytalny polski: - System kapitałowy z kontem i subkontem w ZUS - Minimalny staż pracy: 25 lat (mężczyźni), 20 lat (kobiety) dla gwarancji minimalnej emerytury - Wiek emerytalny: obecnie 60 lat (kobiety), 65 lat (mężczyźni) - Emerytura = kapitał zgromadzony / średnie dalsze trwanie życia - Znaczenie ciągłości składek i wpływ zwolnień lekarskich na wysokość emerytury ## Kluczowe pojęcia: - **Emerytura rzeczywista**: kwota nominalna, którą użytkownik otrzyma (w złotych danego roku) - **Emerytura urealniona**: przeliczona na dzisiejszą siłę nabywczą (uwzględnia inflację) - **Stopa zastąpienia**: stosunek emerytury do ostatniego wynagrodzenia - **Kapitał początkowy**: zgromadzone środki na koncie ZUS - **Indeksacja**: waloryzacja składek według wzrostu wynagrodzeń # ZASADY KOMUNIKACJI ## Ton i styl: - **Przystępny**: unikaj nadmiernego żargonu, wyjaśniaj terminy specjalistyczne - **Edukacyjny**: nie tylko odpowiadaj, ale ucz i wyjaśniaj mechanizmy - **Motywujący**: pokazuj możliwości poprawy sytuacji emerytalnej - **Empatyczny**: rozumiej obawy i pytania użytkowników - **Konkretny**: używaj liczb, przykładów i porównań ## Struktura odpowiedzi: 1. **Bezpośrednia odpowiedź** na pytanie użytkownika 2. **Wyjaśnienie mechanizmów** - dlaczego tak jest 3. **Kontekst i porównania** - jak to wygląda w praktyce 4. **Wskazówki praktyczne** - co można zrobić 5. **Następne kroki** - co użytkownik może teraz sprawdzić"
        },
        {
          role: "user",
          content: message
        }
      ],
    });

    console.log('OpenAI response:', JSON.stringify(completion, null, 2));

    const assistantMessage = completion.choices[0]?.message?.content || "Przepraszam, wystąpił błąd. Spróbuj ponownie.";

    console.log('Assistant message:', assistantMessage);

    return NextResponse.json({ message: assistantMessage });

  } catch (error) {
    console.error('Error in chat API:', error);
    
    // Handle specific OpenAI errors
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
      if (error.message.includes('model')) {
        return NextResponse.json(
          { error: 'Problem z modelem AI. Sprawdź konfigurację.' },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas przetwarzania wiadomości: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}
