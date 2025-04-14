// export async function POST({ request }) {
//   console.log("hawa big head");
//   try {
//     const payload = await request.json(); 
//     console.log("Payload:", payload);
  
//     return new Response(JSON.stringify({ message: "Received successfully", data: payload }), {
//       status: 200,
//       headers: {
//         "Content-Type": "application/json"
//       }
//     });
//   } catch (error) {
//     console.error("Error parsing request:", error);

//     return new Response(JSON.stringify({ error: "Invalid JSON" }), {
//       status: 400,
//       headers: {
//         "Content-Type": "application/json"
//       }
//     });
//   }
//   }


//testing starts here
// import { supabase } from '$lib/server/supabase.js';
// export async function POST({ request }) {
//   console.log("Webhook received");
//   try {
//     const payload = await request.json(); 
//     console.log("Payload:", JSON.stringify(payload, null, 2));

//     const paymentId = payload.transactionObject?.paylinkId;
//     const status = payload.transactionObject?.meta?.transactionStatus;
    
//     if (!paymentId) {
//       throw new Error("Missing payment ID in payload (expected paylinkId)");
//     }
//     if (!status) {
//       throw new Error("Missing transaction status in payload");
//     }

//     console.log(`Updating contribution with helio_payment_id: ${paymentId} to status: ${status}`);

   
//     const { data, error } = await supabase
//       .from('contributions')
//       .update({ 
//         status: status.toLowerCase(), 
//         updated_at: new Date().toISOString()
//       })
//       .eq('helio_payment_id', paymentId);
    
//     if (error) {
//       throw error;
//     }

//     if (data && data.length === 0) {
//       console.warn(`No contribution found with helio_payment_id: ${paymentId}`);
//     }

//     console.log("Update result:", {
//       records_updated: data ? data.length : 0,
//       payment_id: paymentId,
//       new_status: status
//     });

//     return new Response(JSON.stringify({ 
//       success: true,
//       message: "Status updated successfully",
//       payment_id: paymentId,
//       new_status: status,
//       records_updated: data ? data.length : 0
//     }), {
//       status: 200,
//       headers: {
//         "Content-Type": "application/json"
//       }
//     });
//   } catch (error) {
//     console.error("Error processing webhook:", {
//       message: error.message,
//       stack: error.stack
//     });

//     return new Response(JSON.stringify({ 
//       success: false,
//       error: error.message || "Failed to process webhook",
//       details: process.env.NODE_ENV === 'development' ? error.stack : undefined
//     }), {
//       status: 400,
//       headers: {
//         "Content-Type": "application/json"
//       }
//     });
//   }
// }

//testing ends here

//mainnet
import { supabase } from '$lib/server/supabase.js';
export async function POST({ request }) {
  console.log("Webhook received");
  try {
    const payload = await request.json(); 
    console.log("Payload:", JSON.stringify(payload, null, 2));

    const paymentId = payload.transactionObject?.paylinkId;
    const status = payload.transactionObject?.meta?.transactionStatus;
    
    if (!paymentId) {
      throw new Error("Missing payment ID in payload (expected paylinkId)");
    }
    if (!status) {
      throw new Error("Missing transaction status in payload");
    }

    console.log(`Updating contribution with helio_payment_id: ${paymentId} to status: ${status}`);

   
    const { data, error } = await supabase
      .from('contributions')
      .update({ 
        status: status.toLowerCase(), 
        updated_at: new Date().toISOString()
      })
      .eq('helio_payment_id', paymentId);
    
    if (error) {
      throw error;
    }

    if (data && data.length === 0) {
      console.warn(`No contribution found with helio_payment_id: ${paymentId}`);
    }

    console.log("Update result:", {
      records_updated: data ? data.length : 0,
      payment_id: paymentId,
      new_status: status
    });

    return new Response(JSON.stringify({ 
      success: true,
      message: "Status updated successfully",
      payment_id: paymentId,
      new_status: status,
      records_updated: data ? data.length : 0
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error processing webhook:", {
      message: error.message,
      stack: error.stack
    });

    return new Response(JSON.stringify({ 
      success: false,
      error: error.message || "Failed to process webhook",
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }), {
      status: 400,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}