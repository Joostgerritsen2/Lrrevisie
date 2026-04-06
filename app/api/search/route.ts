import { NextRequest, NextResponse } from 'next/server'
import { sanityClient } from '@/lib/sanity/client'
import { SEARCH_QUERY } from '@/lib/sanity/queries'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? ''
  if (q.length < 2) return NextResponse.json([])
  const results = await sanityClient.fetch(SEARCH_QUERY, { q })
  return NextResponse.json(results)
}
