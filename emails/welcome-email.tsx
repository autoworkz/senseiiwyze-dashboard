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

interface WelcomeEmailProps {
  name?: string;
}

export const WelcomeEmail = ({
  name = '',
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>Welcome to SenseiiWyze</Preview>
      <Container style={container}>
        <Heading style={logo}>SenseiiWyze</Heading>
        <Hr style={hr} />
        <Heading style={heading}>
          Welcome to SenseiiWyze!
        </Heading>
        <Text style={paragraph}>
          Hi {name || 'there'},
        </Text>
        <Text style={paragraph}>
          We're excited to have you on board! You're now part of a community that's
          revolutionizing tech skill development with AI-powered coaching.
        </Text>
        <Section style={featureBox}>
          <Text style={featureHeading}>What you can do with SenseiiWyze:</Text>
          <Text style={feature}>
            <strong>📊 Readiness Assessment</strong> - Predict your training success
            with 87% accuracy
          </Text>
          <Text style={feature}>
            <strong>🤖 AI Coaching</strong> - Get personalized guidance 24/7
          </Text>
          <Text style={feature}>
            <strong>🚀 Smart Learning Paths</strong> - Achieve 2-3x faster skill
            acquisition
          </Text>
        </Section>
        <Section style={buttonContainer}>
          <Button style={button} href="https://app.senseiwyze.com/dashboard">
            Get Started
          </Button>
        </Section>
        <Text style={paragraph}>
          If you have any questions, just reply to this email—we're always happy
          to help.
        </Text>
        <Text style={paragraph}>
          — The SenseiiWyze Team
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          SenseiiWyze Inc. • AI-Powered Tech Skill Coaching
        </Text>
      </Container>
    </Body>
  </Html>
);

WelcomeEmail.PreviewProps = {
  name: 'Alan',
} as WelcomeEmailProps;

export default WelcomeEmail;

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
  fontSize: '32px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#484848',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.4',
  color: '#525f7f',
  margin: '16px 0',
};

const featureBox = {
  backgroundColor: '#f6f9fc',
  borderRadius: '4px',
  padding: '24px',
  margin: '32px 0',
};

const featureHeading = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#484848',
  margin: '0 0 16px',
};

const feature = {
  fontSize: '14px',
  lineHeight: '1.5',
  color: '#525f7f',
  margin: '8px 0',
};

const buttonContainer = {
  padding: '27px 0 27px',
};

const button = {
  backgroundColor: '#5e6ad2',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '200px',
  padding: '12px',
  margin: '0 auto',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
};