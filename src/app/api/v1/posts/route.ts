import { prisma } from '@/libs/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const posts = await prisma.post.findMany();

  return NextResponse.json(posts);
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();

  const post = await prisma.post.delete({
    where: {
      id: body.id
    }
  });

  return NextResponse.json(post);
}