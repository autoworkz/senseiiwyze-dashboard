import {
  Body,
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

interface LoginCodeEmailProps {
  validationCode?: string;
}

export const LoginCodeEmail = ({
  validationCode = '123456',
}: LoginCodeEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>Your login code for SenseiiWyze</Preview>
      <Container style={container}>
        <Heading style={logo}>SenseiiWyze</Heading>
        <Heading style={heading}>Your login code</Heading>
        <Text style={paragraph}>
          Use this code to complete your sign in:
        </Text>
        <Section style={codeContainer}>
          <Text style={code}>{validationCode}</Text>
        </Section>
        <Text style={paragraph}>
          This code will expire in 10 minutes. If you didn't request this code,
          you can safely ignore this email.
        </Text>
        <Hr style={hr} />
        <Link href="https://senseiwyze.com" style={reportLink}>
          SenseiiWyze
        </Link>
      </Container>
    </Body>
  </Html>
);

LoginCodeEmail.PreviewProps = {
  validationCode: '467543',
} as LoginCodeEmailProps;

export default LoginCodeEmail;

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

const codeContainer = {
  background: '#f4f4f5',
  borderRadius: '4px',
  margin: '16px 0',
  verticalAlign: 'middle',
  width: '280px',
};

const code = {
  color: '#000',
  display: 'inline-block',
  fontFamily: 'monospace',
  fontSize: '32px',
  fontWeight: '700',
  letterSpacing: '6px',
  lineHeight: '40px',
  paddingBottom: '8px',
  paddingTop: '8px',
  margin: '0 auto',
  width: '100%',
  textAlign: 'center' as const,
};

const reportLink = {
  fontSize: '14px',
  color: '#b4becc',
};

const hr = {
  borderColor: '#dfe1e4',
  margin: '42px 0 26px',
};