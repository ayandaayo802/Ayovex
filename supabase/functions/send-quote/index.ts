Deno.serve(async (req) => {
  try {
    const { name, phone, email, service, date, message } = await req.json()

    if (!name || !phone || !email || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 })
    }

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500 })
    }

    const html = `
      <h2>New Quote Request - Ayovex Interior</h2>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Name</td><td style="padding:8px;border:1px solid #ddd">${name}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Phone</td><td style="padding:8px;border:1px solid #ddd">${phone}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Email</td><td style="padding:8px;border:1px solid #ddd">${email}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Service</td><td style="padding:8px;border:1px solid #ddd">${service || 'Not specified'}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Preferred Date</td><td style="padding:8px;border:1px solid #ddd">${date || 'Not specified'}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Message</td><td style="padding:8px;border:1px solid #ddd">${message}</td></tr>
      </table>
    `

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Ayovex Website <noreply@ayovexinterio.co.za>',
        to: ['quotes@ayovexinterio.co.za'],
        subject: 'New Quote Request - Ayovex Interior',
        html,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      return new Response(JSON.stringify({ error: `Email API error: ${res.status}` }), { status: 500 })
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})
