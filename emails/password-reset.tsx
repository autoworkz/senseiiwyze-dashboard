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
import * as React from 'react';

interface PasswordResetEmailProps {
  resetLink?: string;
  userEmail?: string;
}

export const PasswordResetEmail = ({
  resetLink = 'https://app.senseiwyze.com/auth/reset-password?token=dummy-token',
  userEmail = 'user@example.com',
}: PasswordResetEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>Reset your password</Preview>
      <Container style={container}>
        <Heading style={logo}>SenseiiWyze</Heading>
        <Hr style={hr} />
        <Heading style={heading}>Reset your password</Heading>
        <Text style={paragraph}>
          Hi {userEmail},
        </Text>
        <Text style={paragraph}>
          Someone recently requested a password change for your SenseiiWyze
          account. If this was you, you can set a new password here:
        </Text>
        <Section style={buttonContainer}>
          <Button style={button} href={resetLink}>
            Reset password
          </Button>
        </Section>
        <Text style={paragraph}>
          If you don't want to change your password or didn't request this,
          just ignore and delete this message.
        </Text>
        <Text style={paragraph}>
          To keep your account secure, please don't forward this email to
          anyone.
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          SenseiiWyze - AI-Powered Tech Skill Coaching
        </Text>
      </Container>
    </Body>
  </Html>
);

PasswordResetEmail.PreviewProps = {
  userEmail: 'alan.turing@example.com',
} as PasswordResetEmailProps;

export default PasswordResetEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '560px',
};

const logo = {
  fontSize: '24px',
  fontWeight: '700',
  color: '#1a1a1a',
  textAlign: 'center' as const,
  letterSpacing: '-0.5px',
  margin: '0 0 10px',
};

const heading = {
  fontSize: '24px',
  letterSpacing: '-0.5px',
  lineHeight: '1.3',
  fontWeight: '400',
  color: '#484848',
  padding: '17px 0 0',
};

const paragraph = {
  margin: '0 0 15px',
  fontSize: '15px',
  lineHeight: '1.4',
  color: '#3c4149',
};

const buttonContainer = {
  padding: '27px 0 27px',
};

const button = {
  backgroundColor: '#5e6ad2',
  borderRadius: '3px',
  fontWeight: '600',
  color: '#fff',
  fontSize: '15px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '11px 23px',
};

const hr = {
  borderColor: '#dfe1e4',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
};