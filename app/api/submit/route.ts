import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name');
    const files = formData.getAll('files');

    console.log('Otrzymano dane:', { name, filesCount: files.length });
    
    // Symulacja pracy serwera
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Symulacja potencjalnego błędu
    if (name === 'test-error') {
        return NextResponse.json({ message: 'Symulowany błąd serwera.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Dane otrzymane pomyślnie' }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Wewnętrzny błąd serwera.' }, { status: 500 });
  }
}
