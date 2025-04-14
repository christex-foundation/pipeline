//testing starts here
// import axios from 'axios';
// import { supabase } from '$lib/server/supabase.js';
// import { error } from '@sveltejs/kit';

// export async function POST({ request, locals }) {
//   const SECRET_API_KEY = process.env.SECRET_API_KEY;
//   const PUBLIC_API_KEY = process.env.PUBLIC_API_KEY;
//   const WALLET_ID = process.env.WALLET_ID;
//   const CURRENCY_ID = process.env.CURRENCY_ID;
//   const WEBHOOK_URL = process.env.WEBHOOK_URL || `${process.env.BASE_URL}/api/payments/webhook/target`;

//   try {
//     const session = await locals.supabase.auth.getSession();
//     console.log("Session data:", session);

//     if (!session?.data?.session?.user) {
//       return new Response(JSON.stringify({
//         success: false,
//         error: "Authentication required"
//       }), {
//         status: 401,
//         headers: { 'Content-Type': 'application/json' }
//       });
//     }
    
//     const userId = session.data.session.user.id;
    
//     const { data: profileData, error: profileError } = await supabase
//       .from('profile')
//       .select('id')
//       .eq('user_id', userId)
//       .single();
    
//     if (profileError || !profileData) {
//       throw new Error(`Profile not found: ${profileError?.message || 'No profile exists for this user'}`);
//     }
    
//     const contributorId = profileData.id;
    
//     const body = await request.json();
//     console.log('Request body:', body);
    
//     const { projectId, projectTitle, projectBio, amount } = body;
//     console.log('Extracted values:', { projectId, projectTitle, projectBio, amount });

//     const priceInSmallestUnit = Math.round(amount * Math.pow(10, 6));
//     const helioResponse = await axios.post(
//       `https://api.dev.hel.io/v1/paylink/create/api-key`,
//       {
//         template: "OTHER",
//         name: `Contribution to ${projectTitle}`,
//         description: projectBio,
//         price: priceInSmallestUnit.toString(),
//         pricingCurrency: CURRENCY_ID,
//         features: {
//           canChangeQuantity: false,
//           canChangePrice: false,
//           canPayWithCard: true
//         },
//         recipients: [{ walletId: WALLET_ID, currencyId: CURRENCY_ID }]
//       },
//       {
//         headers: { 
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${SECRET_API_KEY}` 
//         },
//         params: { apiKey: PUBLIC_API_KEY }
//       }
//     );
    
//     console.log('Helio response:', helioResponse.data);
//     const paylinkId = helioResponse.data.id;
//     console.log('Payment link created:', paylinkId);
//     const paymentUrl = `https://app.dev.hel.io/pay/${paylinkId}`;
//     console.log('Payment URL:', paymentUrl);

 
//     try {
//       console.log('Attempting to register webhook for paylink:', paylinkId);
//       console.log('Target URL:', WEBHOOK_URL);

//       const webhookEndpoints = [
//         "https://api.dev.hel.io/v1/webhook/paylink/transaction",
//         "https://api.dev.hel.io/v1/webhook/paylink",
//         "https://app.hel.io/v1/webhook/paylink/transaction"
//       ];
      
//       let webhookResponse;
//       let lastError;
      
//       for (const endpoint of webhookEndpoints) {
//         try {
//           webhookResponse = await axios.post(
//             endpoint,
//             {
//               paylinkId: paylinkId,
//               targetUrl: WEBHOOK_URL,
//               events: ["CREATED"]
//             },
//             {
//               headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${SECRET_API_KEY}`
//               },
//               params: {
//                 apiKey: PUBLIC_API_KEY
//               }
//             }
//           );
//           break;
//         } catch (err) {
//           lastError = err;
//           console.log(`Attempt with endpoint ${endpoint} failed, trying next...`);
//         }
//       }
      
//       if (!webhookResponse) {
//         throw lastError || new Error('All webhook registration attempts failed');
//       }
      
//       console.log('Webhook registration response:', webhookResponse.data);
      

//       if (webhookResponse.data?.secret) {
//         await supabase
//           .from('webhook_secrets')
//           .insert({
//             payment_id: paylinkId,
//             webhook_secret: webhookResponse.data.secret,
//             created_at: new Date().toISOString()
//           });
//       }
//     } catch (webhookError) {
//       console.error('Failed to register webhook:', {
//         message: webhookError.message,
//         response: webhookError.response?.data,
//         config: webhookError.config
//       });
     
//     }

   
//     const { data: contributionRecord, error: dbError } = await supabase
//       .from('contributions')
//       .insert({
//         id: crypto.randomUUID(),
//         project_id: projectId,
//         contributor_id: contributorId,
//         amount: parseFloat(amount),
//         currency: 'USDC',
//         helio_payment_id: paylinkId,
//         payment_link: paymentUrl,
//         status: 'pending',
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString()
//       })
//       .select()
//       .single();
    
//     if (dbError) {
//       console.error('Database error:', {
//         message: dbError.message,
//         code: dbError.code,
//         details: dbError.details
//       });
//       throw new Error(`Database error: ${dbError.message}`);
//     }

//     console.log('Database record created:', contributionRecord);

//     return new Response(JSON.stringify({
//       success: true,
//       payLink: paymentUrl,
//       contributionId: contributionRecord.id
//     }), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' }
//     });

//   } catch (err) {
//     console.error('Full error:', {
//       message: err.message,
//       stack: err.stack,
//       response: err.response?.data
//     });
//     return new Response(JSON.stringify({
//       success: false,
//       error: err.message || "Payment processing failed"
//     }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' }
//     });
//   }
// }

//testing ends here


// mainnet
import axios from 'axios';
import { supabase } from '$lib/server/supabase.js';
import { error } from '@sveltejs/kit';

export async function POST({ request, locals }) {
  const SECRET_API_KEY = process.env.SECRET_API_KEY;
  const PUBLIC_API_KEY = process.env.PUBLIC_API_KEY;
  const WALLET_ID = process.env.WALLET_ID;
  const CURRENCY_ID = process.env.CURRENCY_ID;
  const WEBHOOK_URL = process.env.WEBHOOK_URL || `${process.env.BASE_URL}/api/payments/webhook/target`;

  try {
    const session = await locals.supabase.auth.getSession();
    console.log("Session data:", session);

    if (!session?.data?.session?.user) {
      return new Response(JSON.stringify({
        success: false,
        error: "Authentication required"
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const userId = session.data.session.user.id;
    
    const { data: profileData, error: profileError } = await supabase
      .from('profile')
      .select('id')
      .eq('user_id', userId)
      .single();
    
    if (profileError || !profileData) {
      throw new Error(`Profile not found: ${profileError?.message || 'No profile exists for this user'}`);
    }
    
    const contributorId = profileData.id;
    
    const body = await request.json();
    console.log('Request body:', body);
    
    const { projectId, projectTitle, projectBio, amount } = body;
    console.log('Extracted values:', { projectId, projectTitle, projectBio, amount });

    const priceInSmallestUnit = Math.round(amount * Math.pow(10, 6));
    const helioResponse = await axios.post(
      `https://api.hel.io/v1/paylink/create/api-key`,
      {
        template: "OTHER",
        name: `Contribution to ${projectTitle}`,
        description: projectBio,
        price: priceInSmallestUnit.toString(),
        pricingCurrency: CURRENCY_ID,
        features: {
          canChangeQuantity: false,
          canChangePrice: false,
          canPayWithCard: true
        },
        recipients: [{ walletId: WALLET_ID, currencyId: CURRENCY_ID }]
      },
      {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SECRET_API_KEY}` 
        },
        params: { apiKey: PUBLIC_API_KEY }
      }
    );
    
    console.log('Helio response:', helioResponse.data);
    const paylinkId = helioResponse.data.id;
    console.log('Payment link created:', paylinkId);
    const paymentUrl = `https://hel.io/pay/${paylinkId}`;
    console.log('Payment URL:', paymentUrl);

 
    try {
      console.log('Attempting to register webhook for paylink:', paylinkId);
      console.log('Target URL:', WEBHOOK_URL);

      const webhookEndpoints = [
        "https://api.hel.io/v1/webhook/paylink/transaction",
        "https://api.hel.io/v1/webhook/paylink",
        "https://app.hel.io/v1/webhook/paylink/transaction"
      ];
      
      let webhookResponse;
      let lastError;
      
      for (const endpoint of webhookEndpoints) {
        try {
          webhookResponse = await axios.post(
            endpoint,
            {
              paylinkId: paylinkId,
              targetUrl: WEBHOOK_URL,
              events: ["CREATED"]
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${SECRET_API_KEY}`
              },
              params: {
                apiKey: PUBLIC_API_KEY
              }
            }
          );
          break;
        } catch (err) {
          lastError = err;
          console.log(`Attempt with endpoint ${endpoint} failed, trying next...`);
        }
      }
      
      if (!webhookResponse) {
        throw lastError || new Error('All webhook registration attempts failed');
      }
      
      console.log('Webhook registration response:', webhookResponse.data);
      

      if (webhookResponse.data?.secret) {
        await supabase
          .from('webhook_secrets')
          .insert({
            payment_id: paylinkId,
            webhook_secret: webhookResponse.data.secret,
            created_at: new Date().toISOString()
          });
      }
    } catch (webhookError) {
      console.error('Failed to register webhook:', {
        message: webhookError.message,
        response: webhookError.response?.data,
        config: webhookError.config
      });
     
    }

   
    const { data: contributionRecord, error: dbError } = await supabase
      .from('contributions')
      .insert({
        id: crypto.randomUUID(),
        project_id: projectId,
        contributor_id: contributorId,
        amount: parseFloat(amount),
        currency: 'USDC',
        helio_payment_id: paylinkId,
        payment_link: paymentUrl,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (dbError) {
      console.error('Database error:', {
        message: dbError.message,
        code: dbError.code,
        details: dbError.details
      });
      throw new Error(`Database error: ${dbError.message}`);
    }

    console.log('Database record created:', contributionRecord);

    return new Response(JSON.stringify({
      success: true,
      payLink: paymentUrl,
      contributionId: contributionRecord.id
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('Full error:', {
      message: err.message,
      stack: err.stack,
      response: err.response?.data
    });
    return new Response(JSON.stringify({
      success: false,
      error: err.message || "Payment processing failed"
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}