import LoginPage from "@/components/LoginPage";

export default function Signup() {
  return (
    <LoginPage 
      heading="Join SenseiiWyze"
      logo={{
        url: "/",
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblocks-logo.svg",
        alt: "SenseiiWyze",
        title: "SenseiiWyze",
      }}
      buttonText="Create Account"
      signupText="Already have an account?"
      signupUrl="/auth/login"
    />
  );
} 