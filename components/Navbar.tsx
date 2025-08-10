import Link from 'next/link';
import Image from 'next/image';
import {Navigation} from "lucide-react";
import Navitems from "@/components/NavItems";
import {SignInButton, SignedIn, SignedOut, UserButton} from "@clerk/nextjs";

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link href="/">
                <div className="flex items-center gap-2.5 cursor-pointer">
                    <Image
                        src="/images/logo.png"
                        alt="logo"
                        width={100}
                        height={40}
                    />
                </div>
            </Link>
            <div className="flex items-center gap-8">
                <Navitems />
                <SignedOut>
                    <SignInButton>
                        <button className="btn-signin">Sign In</button>
                    </SignInButton>
                </SignedOut>
                <SignedIn>
                    <UserButton afterSignOutUrl="/"/>
                </SignedIn>
            </div>
        </nav>
    )
}

export default Navbar