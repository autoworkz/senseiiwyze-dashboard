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

interface NewDeviceEmailProps {
  loginDate?: string;
  loginDevice?: string;
  loginLocation?: string;
  loginIp?: string;
}

export const NewDeviceEmail = ({
  loginDate = new Date().toLocaleString(),
  loginDevice = 'Chrome on Mac OS X',
  loginLocation = 'San Francisco, CA',
  loginIp = '47.149.53.167',
}: NewDeviceEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>New device login</Preview>
      <Container style={container}>
        <Heading style={logo}>SenseiiWyze</Heading>
        <Heading style={heading}>New device login</Heading>
        <Text style={paragraph}>
          Your SenseiiWyze account was just signed in from a new device.
        </Text>
        <Section style={dataContainer}>
          <Text style={dataRow}>
            <strong>Time:</strong> {loginDate}
          </Text>
          <Text style={dataRow}>
            <strong>Device:</strong> {loginDevice}
          </Text>
          <Text style={dataRow}>
            <strong>Location:</strong> {loginLocation}
          </Text>
          <Text style={dataRow}>
            <strong>IP Address:</strong> {loginIp}
          </Text>
        </Section>
        <Text style={paragraph}>
          If this was you, you can safely ignore this email. If you didn't sign
          in from this device,{' '}
          <Link style={link} href="https://app.senseiwyze.com/settings/security">
            secure your account now
          </Link>
          .
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          This is a security notification from SenseiiWyze
        </Text>
      </Container>
    </Body>
  </Html>
);

NewDeviceEmail.PreviewProps = {} as NewDeviceEmailProps;

export default NewDeviceEmail;

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

const dataContainer = {
  background: '#f4f4f5',
  borderRadius: '4px',
  padding: '16px',
  margin: '16px 0',
};

const dataRow = {
  fontSize: '14px',
  lineHeight: '1.4',
  color: '#3c4149',
  margin: '4px 0',
};

const link = {
  color: '#5e6ad2',
  textDecoration: 'underline',
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