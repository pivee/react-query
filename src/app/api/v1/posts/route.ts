import { prisma } from '@/libraries/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const posts = await prisma.post.findMany({
    include: {
      User: true
    }
  });

  return NextResponse.json(posts);
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();

  if(!body.id) return NextResponse.error().json();
 
  const post = await prisma.post.delete({
    where: {
      id: body.id
    }
  });

  return NextResponse.json(post);
}