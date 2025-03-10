// /src/app/api/dnsrecon/route.ts

import { NextResponse } from 'next/server';
import { exec } from 'child_process';

// POST request handler for DNSRecon scan
export async function POST(request: Request) {
  const { target } = await request.json();

  if (!target) {
    return NextResponse.json({ error: 'Target is required' }, { status: 400 });
  }

  const venvPython = 'src/tools/venv/bin/python3';
  const command = `${venvPython} src/tools/dnsrecon/dnsrecon.py -d ${target}`;

  return new Promise((resolve) => {
    exec(command, { maxBuffer: 1024 * 500 }, (error, stdout, stderr) => {
      if (error) {
        console.error(`DNSRecon error: ${stderr}`);
        resolve(NextResponse.json({ error: `Failed to execute DNSRecon. Details: ${stderr}` }, { status: 500 }));
      } else {
        resolve(NextResponse.json({ result: stdout }));
      }
    });
  });
}
