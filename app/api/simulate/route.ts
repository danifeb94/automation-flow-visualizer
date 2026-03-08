import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Di sini Anda bisa memvalidasi struktur body (nodes, edges)
        // untuk memastikan payload yang dikirim dari klien sudah valid.
        if (!body || !body.canvas_data) {
            return NextResponse.json(
                { status: 'error', message: 'Payload JSON tidak valid atau kosong.' },
                { status: 400 }
            );
        }

        // Melakukan simulasi "proses" oleh server dengan jeda 2.5 detik
        await new Promise((resolve) => setTimeout(resolve, 2500));

        // Anda dapat menambahkan logika khusus di sini, seperti
        // if (body.canvas_data.nodes.length > 10) return "Too complex"; dsb.

        return NextResponse.json({
            status: 'success',
            message: 'Workflow berhasil dieksekusi oleh mesin simulasi backend.',
            data_received: body.canvas_data.nodes.length + ' Nodes diproses.',
        });
    } catch (error) {
        return NextResponse.json(
            { status: 'error', message: 'Terjadi kesalahan sistem internal.' },
            { status: 500 }
        );
    }
}
