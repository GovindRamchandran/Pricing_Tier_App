import { NextResponse } from 'next/server'

type PricingTier = {
  name: string
  monthlyPrice: number
  yearlyPrice: number
  features: string[]
}

const PRICING_DATA: PricingTier[] = [
  {
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: ['Basic Feature A', 'Basic Feature B'],
  },
  {
    name: 'Pro',
    monthlyPrice: 15,
    yearlyPrice: 150,
    features: ['Pro Feature A', 'Pro Feature B', 'Basic Feature A', 'Basic Feature B'],
  },
  {
    name: 'Enterprise',
    monthlyPrice: 30,
    yearlyPrice: 300,
    features: [
      'Enterprise Feature A',
      'Enterprise Feature B',
      'Pro Feature A',
      'Pro Feature B',
      'Basic Feature A',
      'Basic Feature B',
    ],
  },
]

export async function GET() {
  return NextResponse.json(PRICING_DATA, {
    status: 200,
    headers: { 'Cache-Control': 'public, max-age=300' },
  })
}