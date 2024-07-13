import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@render.com',
            to: email,
            subject: 'True feedback Verification code',
            react: VerificationEmail({username, otp: verifyCode})
        });
        return {
            success: true,
            message: 'Verification Email send successfully'
        }
    } catch (emailError) {
        console.error(`Error sending verfication Email `);
        return {
            success: false,
            message: 'Failed to send verification email.'
        }
    }
}
