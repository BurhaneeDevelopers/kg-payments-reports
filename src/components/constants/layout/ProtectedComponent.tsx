"use client";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { usersService } from "@/supabase/services/userService";
import { useRouter } from "next/navigation";
import React, { PropsWithChildren, useEffect } from "react";
import { toast } from "sonner";
import { useSetAtom } from "jotai";
import { currentUserAtom } from "@/jotai/store";

const ProtectedComponent: React.FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const setCurrentUser = useSetAtom(currentUserAtom);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await usersService.getSession();

        if (!session) {
          router.push("/login");
          toast.error("Session Invalid. Please login again.");
          return;
        }

        // ✅ Fetch and set the current user
        const user = await usersService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
        }

        // ✅ Handle sign-out or invalid session
        const {
          data: { subscription },
        } = usersService.onAuthStateChange((event, session) => {
          if (event === "SIGNED_OUT" || !session) {
            toast.error("Session expired. Please login again.");
            setCurrentUser(null);
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
  }, [router, setCurrentUser]);

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
