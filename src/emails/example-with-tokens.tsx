import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

// Import tokens using direct imports
import { colors, fonts, spacing, createEmailStyles } from './tokens';

// Or import the hook for dynamic usage
import { useTokens } from './tokens';

interface ExampleEmailProps {
  userName?: string;
  actionUrl?: string;
}

export const ExampleEmailWithTokens = ({
  userName = 'User',
  actionUrl = 'https://example.com',
}: ExampleEmailProps) => {
  // Using the useTokens hook (for React components that need dynamic access)
  const tokens = useTokens();
  
  // Using the utility function for pre-defined styles
  const emailStyles = createEmailStyles();

  return (
    <Html>
      <Head />
      <Preview>Welcome to our platform!</Preview>
      <Body style={emailStyles.main}>
        <Container style={emailStyles.container}>
          <Section style={emailStyles.box}>
            {/* Using direct token imports */}
            <Heading style={emailStyles.h1}>
              Welcome, {userName}!
            </Heading>
            
            <Hr style={emailStyles.hr} />
            
            <Text style={emailStyles.paragraph}>
              Thank you for joining our platform. We're excited to have you on board!
            </Text>
            
            <Text style={emailStyles.paragraph}>
              To get started, please click the button below to verify your account.
            </Text>
            
            {/* Using tokens directly */}
            <Button 
              style={{
                ...emailStyles.buttonPrimary,
                marginTop: spacing.lg,
                marginBottom: spacing.lg,
              }} 
              href={actionUrl}
            >
              Verify Account
            </Button>
            
            <Hr style={emailStyles.hr} />
            
            {/* Demonstrating hook usage */}
            <Text 
              style={{
                ...emailStyles.small,
                color: tokens.colors.textMuted,
                textAlign: 'center' as const,
              }}
            >
              If you need help, visit our{' '}
              <Link 
                style={{
                  color: tokens.colors.primary,
                  textDecoration: 'underline',
                }}
                href="https://help.example.com"
              >
                Help Center
              </Link>
              {' '}or contact support.
            </Text>
            
            <Text style={emailStyles.footer}>
              Best regards,
              <br />
              The Example Team
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Preview props for development
ExampleEmailWithTokens.PreviewProps = {
  userName: 'John Doe',
  actionUrl: 'https://example.com/verify',
} as ExampleEmailProps;

export default ExampleEmailWithTokens;
