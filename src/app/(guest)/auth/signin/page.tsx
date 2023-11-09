import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AuthSignIn from "@/components/auth/auth.signin";
import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
export const metadata: Metadata = {
  title: "Login Page",
  description: "Login",
};
const SignInPage = async () => {
  const session = await getServerSession(authOptions);
  if (session) {
    //redirect to homepage
    redirect("/");
  }
  return (
    <div>
      <AuthSignIn />
    </div>
  );
};
export default SignInPage;
