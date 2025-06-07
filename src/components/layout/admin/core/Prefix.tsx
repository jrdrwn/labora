'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Prefix() {
  return (
    <>
      <Link href={'/admin/event'}>
        <Button variant={'secondary'} className="rounded-full">
          Event
        </Button>
      </Link>
      <Button variant={'outline'} className="rounded-full px-2">
        Admin
        <Avatar className="size-6">
          <AvatarImage
            src={'https://images.unsplash.com/photo-1733621770053-9b1a5f433a8c'}
          />
          <AvatarFallback>LB</AvatarFallback>
        </Avatar>
      </Button>
    </>
  );
}
