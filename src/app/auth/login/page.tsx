import LoginPage from "@/components/LoginPage";

export default function Login() {
  return (
    <LoginPage 
      heading="Welcome to SenseiiWyze"
      logo={{
        url: "/",
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblocks-logo.svg",
        alt: "SenseiiWyze",
        title: "SenseiiWyze",
      }}
      buttonText="Sign In"
      signupText="Don't have an account?"
      signupUrl="/auth/signup"
    />
  );
} 