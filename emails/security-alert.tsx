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

interface SecurityAlertEmailProps {
  userEmail: string;
  userName?: string;
  alertType: 'suspicious_login' | 'password_changed' | 'failed_attempts';
  ipAddress?: string;
  location?: string;
  device?: string;
  timestamp?: string;
  securityLink?: string;
}

export const SecurityAlertEmail = ({
  userEmail = 'user@example.com',
  userName = '',
  alertType = 'suspicious_login',
  ipAddress = '192.168.1.1',
  location = 'San Francisco, CA, USA',
  device = 'Chrome on Windows',
  timestamp = new Date().toLocaleString(),
  securityLink = 'https://app.senseiwyze.com/app/settings/security',
}: SecurityAlertEmailProps) => {
  const alertMessages = {
    suspicious_login: {
      preview: 'Suspicious login attempt on your SenseiiWyze account',
      heading: 'Suspicious login detected',
      description: 'We detected a login attempt from an unfamiliar location or device.',
    },
    password_changed: {
      preview: 'Your SenseiiWyze password was changed',
      heading: 'Password changed',
      description: 'Your account password was successfully changed.',
    },
    failed_attempts: {
      preview: 'Multiple failed login attempts on your SenseiiWyze account',
      heading: 'Account temporarily locked',
      description: 'We detected multiple failed login attempts and have temporarily locked your account for security.',
    },
  };

  const alert = alertMessages[alertType];

  return (
    <Html>
      <Head />
      <Preview>{alert.preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={alertHeader}>
            <Heading style={logo}>SenseiiWyze</Heading>
            <Text style={alertBadge}>Security Alert</Text>
          </Section>

          <Heading style={heading}>{alert.heading}</Heading>

          <Text style={text}>
            Hi {userName || userEmail},
          </Text>

          <Text style={text}>
            {alert.description}
          </Text>

          {(alertType === 'suspicious_login' || alertType === 'failed_attempts') && (
            <Section style={detailsBox}>
              <Heading style={detailsHeading}>Login details:</Heading>
              <table style={detailsTable}>
                <tr>
                  <td style={detailsLabel}>Time:</td>
                  <td style={detailsValue}>{timestamp}</td>
                </tr>
                <tr>
                  <td style={detailsLabel}>Location:</td>
                  <td style={detailsValue}>{location}</td>
                </tr>
                <tr>
                  <td style={detailsLabel}>IP Address:</td>
                  <td style={detailsValue}>{ipAddress}</td>
                </tr>
                <tr>
                  <td style={detailsLabel}>Device:</td>
                  <td style={detailsValue}>{device}</td>
                </tr>
              </table>
            </Section>
          )}

          <Section style={actionSection}>
            <Heading style={actionHeading}>Was this you?</Heading>
            
            <div style={actionButtons}>
              <Button style={yesButton} href={`${securityLink}?action=verify`}>
                Yes, this was me
              </Button>
              <Button style={noButton} href={`${securityLink}?action=secure`}>
                No, secure my account
              </Button>
            </div>
          </Section>

          <Section style={recommendationsBox}>
            <Heading style={recommendationsHeading}>Recommended actions:</Heading>
            <ul style={list}>
              <li style={listItem}>Review your recent account activity</li>
              <li style={listItem}>Change your password if you didn't authorize this</li>
              <li style={listItem}>Enable two-factor authentication for extra security</li>
              <li style={listItem}>Check your connected devices and sessions</li>
            </ul>
          </Section>

          <Hr style={hr} />

          <Text style={footerText}>
            This is an automated security alert. If you have concerns about your 
            account security, please contact our support team immediately.
          </Text>

          <Text style={footerText}>
            — The SenseiiWyze Security Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default SecurityAlertEmail;

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

const alertHeader = {
  textAlign: 'center' as const,
  margin: '0 0 30px',
};

const logo = {
  fontSize: '24px',
  fontWeight: '700',
  color: '#1a1a1a',
  textAlign: 'center' as const,
  letterSpacing: '-0.5px',
  margin: '0 0 10px',
};

const alertBadge = {
  color: '#dc2626',
  fontSize: '12px',
  fontWeight: '600',
  margin: '0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};


const heading = {
  fontSize: '24px',
  letterSpacing: '-0.5px',
  lineHeight: '1.3',
  fontWeight: '400',
  color: '#484848',
  padding: '17px 0 0',
};

const text = {
  margin: '0 0 15px',
  fontSize: '15px',
  lineHeight: '1.4',
  color: '#3c4149',
};

const detailsBox = {
  background: '#f4f4f5',
  borderRadius: '4px',
  padding: '16px',
  margin: '16px 0',
};

const detailsHeading = {
  color: 'oklch(0.371 0 0)', // base-700
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 16px',
};

const detailsTable = {
  width: '100%',
  borderCollapse: 'collapse' as const,
};

const detailsLabel = {
  color: 'oklch(0.556 0 0)', // base-500
  fontSize: '14px',
  fontWeight: '500',
  padding: '8px 0',
  width: '120px',
};

const detailsValue = {
  color: 'oklch(0.371 0 0)', // base-700
  fontSize: '14px',
  padding: '8px 0',
  fontFamily: 'monospace',
};

const actionSection = {
  margin: '40px',
  textAlign: 'center' as const,
};

const actionHeading = {
  color: 'oklch(0.269 0 0)', // base-800
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 24px',
};

const actionButtons = {
  display: 'flex' as const,
  gap: '16px',
  justifyContent: 'center' as const,
  flexWrap: 'wrap' as const,
};

const yesButton = {
  backgroundColor: '#ffffff',
  border: '1px solid #dfe1e4',
  borderRadius: '3px',
  color: '#3c4149',
  fontSize: '15px',
  fontWeight: '500',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '11px 23px',
  margin: '0 8px',
};

const noButton = {
  backgroundColor: '#dc2626',
  borderRadius: '3px',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '11px 23px',
  margin: '0 8px',
};

const recommendationsBox = {
  margin: '32px 0',
};

const recommendationsHeading = {
  color: 'oklch(0.371 0 0)', // base-700
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 12px',
};

const list = {
  margin: '0',
  paddingLeft: '20px',
};

const listItem = {
  color: 'oklch(0.439 0 0)', // base-600
  fontSize: '14px',
  lineHeight: '22px',
  marginBottom: '8px',
};

const hr = {
  borderColor: '#dfe1e4',
  margin: '42px 0 26px',
};

const footerText = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
};