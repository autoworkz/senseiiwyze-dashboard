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

interface OrganizationMagicLinkEmailProps {
  magicLink?: string;
  organizationName?: string;
  invitedByUsername?: string;
  invitedByEmail?: string;
  inviteeEmail?: string;
}

export const OrganizationMagicLinkEmail = ({
  magicLink = 'https://app.senseiwyze.com/auth/verify?token=dummy-token',
  organizationName = 'Your Organization',
  invitedByUsername = 'Team Member',
  invitedByEmail = 'team@example.com',
  inviteeEmail = 'you@example.com',
}: OrganizationMagicLinkEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>You're invited to join {organizationName} on SenseiiWyze</Preview>
      <Container style={container}>
        <Heading style={logo}>SenseiiWyze</Heading>
        <Heading style={heading}>You're invited to join {organizationName}</Heading>
        <Text style={paragraph}>
          <strong>{invitedByUsername}</strong> ({invitedByEmail}) has invited you to join <strong>{organizationName}</strong> on SenseiiWyze.
        </Text>
        <Text style={paragraph}>
          Click the button below to accept your invitation and get started. This link will expire in 10 minutes.
        </Text>
        <Section style={buttonContainer}>
          <Button style={button} href={magicLink}>
            Join {organizationName}
          </Button>
        </Section>
        <Text style={paragraph}>
          If you didn't expect this invitation, you can safely ignore this email.
        </Text>
        <Text style={smallText}>
          For {inviteeEmail} only. Link expires in 10 minutes.
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          SenseiiWyze - AI-Powered Tech Skill Coaching
        </Text>
      </Container>
    </Body>
  </Html>
);

OrganizationMagicLinkEmail.PreviewProps = {} as OrganizationMagicLinkEmailProps;

export default OrganizationMagicLinkEmail;

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

const smallText = {
  margin: '0 0 15px',
  fontSize: '13px',
  lineHeight: '1.4',
  color: '#8898aa',
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
