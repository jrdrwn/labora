'use client';

import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Biohazard, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface Props {
  suffix?: ReactNode;
  menus: {
    title: string;
    href: string;
  }[];
  prefix?: ReactNode;
}

export default function Header({ suffix, menus, prefix }: Props) {
  const pathname = usePathname();

  return (
    <>
      {[
        '/asisten/login',
        '/admin/login',
        '/asisten/register',
        '/praktikan/register',
        '/praktikan/login',
      ].includes(pathname) ? null : (
        <header className="fixed inset-x-0 top-0 z-9 h-16 border-b-2 bg-background">
          <div className="flex h-full w-full items-center justify-between bg-background px-4">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                scroll={false}
                className="flex items-center gap-2"
                prefetch={false}
              >
                <Button className="rounded-full">
                  <Biohazard />
                  <span className="">{suffix}</span>
                </Button>
              </Link>
              <NavigationMenu>
                <NavigationMenuList className="hidden items-center gap-2 text-sm font-medium lg:flex lg:gap-2 xl:gap-4">
                  {menus.map((menu) => (
                    <NavigationMenuItem key={menu.title}>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle({
                          className: cn(
                            'bg-transparent',
                            pathname === menu.href
                              ? 'underline underline-offset-2'
                              : '',
                          ),
                        })}
                        active={pathname === menu.href}
                        asChild
                      >
                        <Link href={menu.href}>{menu.title}</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
            <div className="flex items-center gap-4">
              {prefix}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full lg:hidden"
                  >
                    <Menu className="size-5 text-foreground/70" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-4 lg:hidden">
                  <SheetTitle>Menu</SheetTitle>
                  <NavigationMenu className="items-start">
                    <NavigationMenuList className="grid gap-4">
                      {menus.map((menu) => (
                        <NavigationMenuItem key={menu.title}>
                          <NavigationMenuLink
                            className={navigationMenuTriggerStyle()}
                            active={pathname === menu.href}
                            asChild
                          >
                            <Link href={menu.href}>{menu.title}</Link>
                          </NavigationMenuLink>
                        </NavigationMenuItem>
                      ))}
                    </NavigationMenuList>
                  </NavigationMenu>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>
      )}
    </>
  );
}
