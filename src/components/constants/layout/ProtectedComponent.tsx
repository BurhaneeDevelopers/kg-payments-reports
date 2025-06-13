"use client";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { usersService } from "@/supabase/services/userService";
import { useRouter } from "next/navigation";
import React, { PropsWithChildren, useEffect } from "react";
import { toast } from "sonner";

const ProtectedComponent: React.FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await usersService.getSession();
        if (!session) {
          router.push("/login");
          toast.error("Session expired. Please login again.");
          return;
        }

        const {
          data: { subscription },
        } = usersService.onAuthStateChange((event, session) => {
          if (event === "SIGNED_OUT" || !session) {
            toast.error("Session expired. Please login again.");
            router.push("/login");
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Session check failed:", error);
        toast.error("Authentication error. Please login again.");
        router.push("/login");
      }
    };

    checkSession();
  }, [router]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster />
    </ThemeProvider>
  );
};

export default ProtectedComponent;
