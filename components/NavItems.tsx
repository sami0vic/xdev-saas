'use client';

import Link from "next/link";
import {usePathname} from "next/navigation";
import {cn} from "@/lib/utils"

const navitems = [
    {label: 'Home', href: '/'},
    {label: 'Courses', href: '/courses'},
    {label: 'My journey', href: '/my-journey'},
]

const NavItems = () => {
    const pathname = usePathname();

    return (
        <nav className="flex items-center gap-4">
            {navitems.map((item) => (
                <Link
                    href={item.href}
                    key={item.label}
                    className={cn(pathname === item.href && 'text-primary font-semibold')}
                >
                    {item.label}
                </Link>
            ))}
        </nav>
    )
}

export default NavItems