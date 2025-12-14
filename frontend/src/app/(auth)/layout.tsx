import { AuthVisualLayout } from "@/components/auth/auth-visual-layout";
import GuestGuard from "@/components/auth/guest-guard";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return(
        <GuestGuard>
            <AuthVisualLayout>
                {children}
            </AuthVisualLayout>
        </GuestGuard> 
    );
}