// import { NextResponse } from 'next/server'
// import Stripe from 'stripe'

// // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
// //   apiKey: process.env.STRIPE_SECRET_KEY!,
// // })

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!) // ✅

// export async function POST(req: Request) {
//   try {
//     const body = await req.json()

//     const line_items = body.items.map((item: any) => ({
//       price_data: {
//         currency: 'usd',
//         product_data: {
//           name: item.name,
//           // images: [item.image],
//           images: [
//             item.image.startsWith('http')
//               ? item.image
//               : `${req.headers.get('origin')}${item.image}`,
//           ],
//         },
//         unit_amount: Math.round(item.price * 100), // cents
//       },
//       quantity: item.quantity,
//     }))

//     const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       mode: 'payment',
//       line_items,
//       success_url: `${origin}/thank-you`,
//       cancel_url: `${origin}/cart`,
//     })

//     return NextResponse.json({ sessionId: session.id })
//   } catch (err) {
//     console.error('❌ Stripe session creation error:', err)
//     return NextResponse.json(
//       { error: 'Stripe session creation failed' },
//       { status: 500 }
//     )
//   }
// }

import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// ❌ Old (missing apiVersion)
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// ✅ Fixed: Include required apiVersion
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2022-11-15',
// })

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // ❌ Old: Used 'any' (TypeScript doesn't like it)
    // const line_items = body.items.map((item: any) => ({

    // ✅ Fixed: Declare a simple type for item structure
    type CartItem = {
      name: string
      image: string
      price: number
      quantity: number
    }

    const line_items = body.items.map((item: CartItem) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: [
            item.image.startsWith('http')
              ? item.image
              : `${req.headers.get('origin')}${item.image}`,
          ],
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects amount in cents
      },
      quantity: item.quantity,
    }))

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL

    const session: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items,
        success_url: `${origin}/thank-you`,
        cancel_url: `${origin}/cart`,
      })

    return NextResponse.json({ sessionId: session.id })
  } catch (err) {
    console.error('❌ Stripe session creation error:', err)
    return NextResponse.json(
      { error: 'Stripe session creation failed' },
      { status: 500 }
    )
  }
}
