import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

// Import our tokens
import { colors, fonts, spacing, borders, createEmailStyles } from './tokens';

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export const StripeWelcomeEmailWithTokens = () => {
  const styles = createEmailStyles();
  
  return (
    <Html>
      <Head />
      <Preview>You're now ready to make live transactions with Stripe!</Preview>
      <Body style={styles.main}>
        <Container style={styles.container}>
          <Section style={styles.box}>
            <Img
              src={`${baseUrl}/static/stripe-logo.png`}
              width="49"
              height="21"
              alt="Stripe"
            />
            <Hr style={styles.hr} />
            <Text style={styles.paragraph}>
              Thanks for submitting your account information. You're now ready to
              make live transactions with Stripe!
            </Text>
            <Text style={styles.paragraph}>
              You can view your payments and a variety of other information about
              your account right from your dashboard.
            </Text>
            <Button 
              style={{
                ...styles.buttonPrimary,
                marginTop: spacing.lg,
                marginBottom: spacing.lg,
              }} 
              href="https://dashboard.stripe.com/login"
            >
              View your Stripe Dashboard
            </Button>
            <Hr style={styles.hr} />
            <Text style={styles.paragraph}>
              If you haven't finished your integration, you might find our{' '}
              <Link style={styles.link} href="https://stripe.com/docs">
                docs
              </Link>{' '}
              handy.
            </Text>
            <Text style={styles.paragraph}>
              Once you're ready to start accepting payments, you'll just need to
              use your live{' '}
              <Link
                style={styles.link}
                href="https://dashboard.stripe.com/login?redirect=%2Fapikeys"
              >
                API keys
              </Link>{' '}
              instead of your test API keys. Your account can simultaneously be
              used for both test and live requests, so you can continue testing
              while accepting live payments. Check out our{' '}
              <Link style={styles.link} href="https://stripe.com/docs/dashboard">
                tutorial about account basics
              </Link>
              .
            </Text>
            <Text style={styles.paragraph}>
              Finally, we've put together a{' '}
              <Link
                style={styles.link}
                href="https://stripe.com/docs/checklist/website"
              >
                quick checklist
              </Link>{' '}
              to ensure your website conforms to card network standards.
            </Text>
            <Text style={styles.paragraph}>
              We'll be here to help you with any step along the way. You can find
              answers to most questions and get in touch with us on our{' '}
              <Link style={styles.link} href="https://support.stripe.com/">
                support site
              </Link>
              .
            </Text>
            <Text style={styles.paragraph}>— The Stripe team</Text>
            <Hr style={styles.hr} />
            <Text style={styles.footer}>
              Stripe, 354 Oyster Point Blvd, South San Francisco, CA 94080
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default StripeWelcomeEmailWithTokens;
