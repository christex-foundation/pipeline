// import { db } from '$lib/server/supabase.js';
// import { error } from '@sveltejs/kit';

// export async function POST({ request }) {  
//   const event = await request.json();

//   try {
//     switch (event.type) {
//       case 'payment.succeeded':
//         await db.contribution.update({
//           where: { helioPaymentId: event.data.id },
//           data: { 
//             status: 'paid',
//             updatedAt: new Date()
//           }
//         });
//         break;

//       case 'payment.failed':
//         await db.contribution.update({
//           where: { helioPaymentId: event.data.id },
//           data: { status: 'failed' }
//         });
//         break;
//     }

//     return new Response('OK');

//   } catch (err) {
//     throw error(500, 'Webhook processing failed');
//   }
// }



// src/routes/api/payments/webhook/+server.js
// import { supabase } from '$lib/server/supabase.js';
// import { error } from '@sveltejs/kit';

// export async function POST({ request }) {  
//   console.log('=== WEBHOOK RECEIVED ===', new Date().toISOString());
  
//   try {
//     const rawBody = await request.text();
//     console.log('Raw webhook payload:', rawBody);

//     const event = JSON.parse(rawBody);
//     console.log('Webhook payload:', JSON.stringify(event, null, 2));

//     if (!event?.type || !event?.data?.id) {
//       console.error('Invalid webhook payload structure');
//       return new Response('Invalid payload', { status: 400 });
//     }

//     // Log important payment details
//     console.log('Payment ID:', event.data.id);
//     console.log('Event type:', event.type);
//     console.log('Payment status:', event.type.includes('succeeded') ? 'paid' : 'failed');
    
//     // Log additional details if available
//     if (event.data.amount) console.log('Amount:', event.data.amount);
//     if (event.data.currency) console.log('Currency:', event.data.currency);
//     if (event.data.createdAt) console.log('Created at:', event.data.createdAt);

//     const updateData = {
//       updated_at: new Date().toISOString(),
//       payment_data: event.data,
//       status: event.type.includes('succeeded') ? 'paid' : 'failed'
//     };

//     const { data, error: dbError } = await supabase
//       .from('contributions')
//       .update(updateData)
//       .eq('helio_payment_id', event.data.id)
//       .select();

//     if (dbError) throw dbError;

//     console.log(`Updated payment ${event.data.id} to status: ${updateData.status}`);
//     if (data && data.length > 0) {
//       console.log('Updated contribution record:', data[0]);
//     } else {
//       console.log('No contribution record found for payment ID:', event.data.id);
//     }
    
//     return new Response('OK', { status: 200 });

//   } catch (err) {
//     console.error('WEBHOOK ERROR:', err);
//     console.error('Error stack:', err.stack);
//     return new Response(`Error: ${err.message}`, { status: 500 });
//   }
// }



//testing starts here
// import axios from "axios";
// const BASE_URL = process.env.BASE_URL;

// export async function POST(req, res) {
//   if (req.method === "POST") {
//     const paylinkId = helioResponse.data.id;

    
//     const targetUrl = `${process.env.BASE_URL}/api/payments/webhook/target`;
//     const events = ["CREATED"];

//     try {
//       const response = await axios.post(
//         "https://api.dev.hel.io/v1/webhook/paylink/transaction",
//         {
//           paylinkId,
//           targetUrl,
//           events,
//         },
//         {
//           headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${process.env.SECRET_API_KEY}`,
//             "cache-control": "no-cache",
//           },
//           params: {
//             apiKey: process.env.PUBLIC_API_KEY,
//           },
//         },
//       );

//       return new Response(JSON.stringify(response.data), {
//         status: 200,
//       });
//     } catch (error) {
//       console.error(
//         `${error.response?.data?.code} ${error.response?.data?.message}`,
//       );
//       return new Response(error, {
//         status: 500,
//       });
//     }
//   } else {
//     return new Response("Method not allowed", {
//       status: 405,
//     });
//   }
// }

//testing ends here

//mainnet
import axios from "axios";
const BASE_URL = process.env.BASE_URL;

export async function POST(req, res) {
  if (req.method === "POST") {
    const paylinkId = helioResponse.data.id;

    
    const targetUrl = `${process.env.BASE_URL}/api/payments/webhook/target`;
    const events = ["CREATED"];

    try {
      const response = await axios.post(
        "https://api.hel.io/v1/webhook/paylink/transaction",
        {
          paylinkId,
          targetUrl,
          events,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.SECRET_API_KEY}`,
            "cache-control": "no-cache",
          },
          params: {
            apiKey: process.env.PUBLIC_API_KEY,
          },
        },
      );

      return new Response(JSON.stringify(response.data), {
        status: 200,
      });
    } catch (error) {
      console.error(
        `${error.response?.data?.code} ${error.response?.data?.message}`,
      );
      return new Response(error, {
        status: 500,
      });
    }
  } else {
    return new Response("Method not allowed", {
      status: 405,
    });
  }
}
