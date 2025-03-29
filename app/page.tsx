import Link from "next/link";
import { Button } from "@/components/ui/button";
//import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background px-4 py-12 md:py-20">
      <div className="text-center max-w-3xl w-full space-y-6 px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
          Welcome to <span className="text-primary">Hercules Billing</span>
        </h1>

        <p className="text-muted-foreground text-base sm:text-lg md:text-xl">
          Effortlessly manage your billing, users, and items with role-based dashboards, real-time toasts, and clean UI.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/dashboard/user/create">Get Started</Link>
          </Button>
          <Button variant="outline" asChild size="lg" className="w-full sm:w-auto">
            <Link href="/dashboard/admin">Admin Dashboard</Link>
          </Button>
        </div>
      </div>

      {/* <div className="mt-12 md:mt-20 w-full max-w-3xl px-4">
        <Image
          src="/hero-billing.svg"
          alt="Billing Illustration"
          width={800}
          height={500}
          className="w-full h-auto object-contain"
          priority
        />
      </div> */}
    </div>
  );
}
