import { Resend } from 'resend';

// Initialize Resend client lazily to avoid API key errors during build time
let resend: Resend | null = null;

function getResendClient(): Resend {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }
    resend = new Resend(apiKey);
  }
  return resend;
}

export interface MagicLinkEmailOptions {
  email: string;
  url: string;
  appName?: string;
}

export interface VerificationEmailOptions {
  email: string;
  url: string;
  appName?: string;
}

export interface WelcomeEmailOptions {
  email: string;
  name: string;
  appName?: string;
}

/**
 * Send magic link email for passwordless authentication
 */
export async function sendMagicLinkEmail({
  email,
  url,
  appName = 'SenseiiWyze'
}: MagicLinkEmailOptions) {
  try {
    const resendClient = getResendClient();
    const { data, error } = await resendClient.emails.send({
      from: `${appName} <auth@senseiiwyze.com>`, // Replace with your verified domain
      to: [email],
      subject: `Sign in to ${appName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">${appName}</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Your magic link is ready</p>
          </div>
          
          <div style="background: white; padding: 40px 20px; border: 1px solid #e1e5e9; border-top: none;">
            <h2 style="color: #333; margin: 0 0 20px 0;">Sign in to your account</h2>
            <p style="color: #666; line-height: 1.5; margin: 0 0 30px 0;">
              Click the button below to securely sign in to your ${appName} account. This link will expire in 10 minutes.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${url}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        text-decoration: none; 
                        padding: 15px 30px; 
                        border-radius: 8px; 
                        font-weight: bold; 
                        display: inline-block;
                        font-size: 16px;">
                Sign In to ${appName}
              </a>
            </div>
            
            <p style="color: #999; font-size: 14px; margin: 30px 0 0 0;">
              If you didn't request this email, you can safely ignore it.
            </p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #e1e5e9; border-top: none;">
            <p style="color: #666; font-size: 12px; margin: 0; text-align: center;">
              This email was sent by ${appName}. If you have questions, contact our support team.
            </p>
          </div>
        </div>
      `,
      text: `
        Sign in to ${appName}
        
        Click the link below to sign in to your account:
        ${url}
        
        This link will expire in 10 minutes.
        
        If you didn't request this email, you can safely ignore it.
      `
    });

    if (error) {
      console.error('Error sending magic link email:', error);
      throw new Error('Failed to send magic link email');
    }

    console.log('Magic link email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Error sending magic link email:', error);
    throw error;
  }
}

/**
 * Send email verification email
 */
export async function sendVerificationEmail({
  email,
  url,
  appName = 'SenseiiWyze'
}: VerificationEmailOptions) {
  try {
    const resendClient = getResendClient();
    const { data, error } = await resendClient.emails.send({
      from: `${appName} <auth@senseiiwyze.com>`, // Replace with your verified domain
      to: [email],
      subject: `Verify your ${appName} account`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">${appName}</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Welcome to the platform</p>
          </div>
          
          <div style="background: white; padding: 40px 20px; border: 1px solid #e1e5e9; border-top: none;">
            <h2 style="color: #333; margin: 0 0 20px 0;">Verify your email address</h2>
            <p style="color: #666; line-height: 1.5; margin: 0 0 30px 0;">
              Welcome to ${appName}! Please verify your email address to complete your account setup.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${url}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        text-decoration: none; 
                        padding: 15px 30px; 
                        border-radius: 8px; 
                        font-weight: bold; 
                        display: inline-block;
                        font-size: 16px;">
                Verify Email Address
              </a>
            </div>
            
            <p style="color: #999; font-size: 14px; margin: 30px 0 0 0;">
              If you didn't create this account, you can safely ignore this email.
            </p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #e1e5e9; border-top: none;">
            <p style="color: #666; font-size: 12px; margin: 0; text-align: center;">
              This email was sent by ${appName}. If you have questions, contact our support team.
            </p>
          </div>
        </div>
      `,
      text: `
        Welcome to ${appName}!
        
        Please verify your email address by clicking the link below:
        ${url}
        
        If you didn't create this account, you can safely ignore this email.
      `
    });

    if (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }

    console.log('Verification email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail({
  email,
  name,
  appName = 'SenseiiWyze'
}: WelcomeEmailOptions) {
  try {
    const resendClient = getResendClient();
    const { data, error } = await resendClient.emails.send({
      from: `${appName} <welcome@senseiiwyze.com>`, // Replace with your verified domain
      to: [email],
      subject: `Welcome to ${appName}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">${appName}</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Welcome aboard!</p>
          </div>
          
          <div style="background: white; padding: 40px 20px; border: 1px solid #e1e5e9; border-top: none;">
            <h2 style="color: #333; margin: 0 0 20px 0;">Welcome, ${name}!</h2>
            <p style="color: #666; line-height: 1.5; margin: 0 0 20px 0;">
              We're excited to have you join ${appName}. Your account has been successfully created and verified.
            </p>
            
            <h3 style="color: #333; margin: 30px 0 15px 0;">What's next?</h3>
            <ul style="color: #666; line-height: 1.6; padding-left: 20px;">
              <li>Complete your profile setup</li>
              <li>Explore your personalized dashboard</li>
              <li>Set up your learning goals</li>
              <li>Connect with your team members</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:3000/dashboard" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        text-decoration: none; 
                        padding: 15px 30px; 
                        border-radius: 8px; 
                        font-weight: bold; 
                        display: inline-block;
                        font-size: 16px;">
                Get Started
              </a>
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #e1e5e9; border-top: none;">
            <p style="color: #666; font-size: 12px; margin: 0; text-align: center;">
              Need help? Contact us at support@senseiiwyze.com
            </p>
          </div>
        </div>
      `,
      text: `
        Welcome to ${appName}, ${name}!
        
        We're excited to have you join our platform. Your account has been successfully created and verified.
        
        What's next?
        - Complete your profile setup
        - Explore your personalized dashboard
        - Set up your learning goals
        - Connect with your team members
        
        Get started: http://localhost:3000/dashboard
        
        Need help? Contact us at support@senseiiwyze.com
      `
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      throw new Error('Failed to send welcome email');
    }

    console.log('Welcome email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
}

// Export a function to get the Resend client for other modules that might need it
export function getResend() {
  return getResendClient();
}