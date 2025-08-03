import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface VerifyEmailProps {
  verificationLink?: string;
}

export const VerifyEmail = ({
  verificationLink = 'https://app.senseiwyze.com/auth/verify-email?token=dummy-token',
}: VerifyEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>Verify your email address</Preview>
      <Container style={container}>
        <Heading style={logo}>SenseiiWyze</Heading>
        <Heading style={heading}>Verify your email address</Heading>
        <Text style={paragraph}>
          Thanks for signing up! Please verify your email address to get started
          with SenseiiWyze.
        </Text>
        <Section style={buttonContainer}>
          <Button style={button} href={verificationLink}>
            Verify email address
          </Button>
        </Section>
        <Text style={paragraph}>
          This link will expire in 24 hours. If you didn't create an account,
          you can safely ignore this email.
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          SenseiiWyze - AI-Powered Tech Skill Coaching
        </Text>
      </Container>
    </Body>
  </Html>
);

VerifyEmail.PreviewProps = {} as VerifyEmailProps;

export default VerifyEmail;

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
};

const logo = {
  fontSize: '24px',
  fontWeight: '700',
  color: '#1a1a1a',
  textAlign: 'center' as const,
  letterSpacing: '-0.5px',
  margin: '0 0 30px',
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
  margin: '42px 0 26px',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
};