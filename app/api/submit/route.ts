import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Ta linia odczytuje dane z formularza
    const formData = await request.formData();
    const name = formData.get('name');

    // W logach serwera (na Vercelu) zobaczymy, że dane dotarły
    console.log(`Otrzymano formularz od: ${name}`);

    // Symulujemy pracę serwera
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Odsyłamy odpowiedź "sukces" do przeglądarki
    return NextResponse.json({ message: 'Dane otrzymane pomyślnie' }, { status: 200 });

  } catch (error) {
    console.error("Błąd w /api/submit:", error);
    // W razie błędu odsyłamy informację o błędzie serwera
    return NextResponse.json({ message: 'Wewnętrzny błąd serwera.' }, { status: 500 });
  }
}