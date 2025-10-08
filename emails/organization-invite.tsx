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
  Tailwind,
  Text,
  Link,
} from '@react-email/components';

interface OrganizationInviteEmailProps {
  invitedByUsername: string;
  invitedByEmail: string;
  organizationName: string;
  inviteLink: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';

export const OrganizationInviteEmail = ({
  invitedByUsername,
  invitedByEmail,
  organizationName,
  inviteLink,
}: OrganizationInviteEmailProps) => {
  const previewText = `You're invited to join ${organizationName} on SenseiiWyze`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-[#eaeaea] border-solid p-[20px]">
            <Section className="mt-[32px]">
              <Heading className="mx-0 my-[30px] p-0 text-center font-normal text-[24px] text-black">
                You're invited to <strong>{organizationName}</strong>
              </Heading>
            </Section>
            <Text className="text-[14px] text-black leading-[24px]">
              Hello,
            </Text>
            <Text className="text-[14px] text-black leading-[24px]">
              <strong>{invitedByUsername}</strong> (
              <Link
                href={`mailto:${invitedByEmail}`}
                className="text-blue-600 no-underline"
              >
                {invitedByEmail}
              </Link>
              ) has invited you to join the <strong>{organizationName}</strong> organization on{' '}
              <strong>SenseiiWyze</strong>.
            </Text>
            <Section className="mt-[32px] mb-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center font-semibold text-[12px] text-white no-underline"
                href={inviteLink}
              >
                Accept invitation
              </Button>
            </Section>
            <Text className="text-[14px] text-black leading-[24px]">
              If the button doesn't work, copy and paste this URL into your browser:{' '}
              <Link href={inviteLink} className="text-blue-600 no-underline">
                {inviteLink}
              </Link>
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-[#eaeaea] border-solid" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              This invitation was sent from SenseiiWyze. If you were not expecting this invitation, 
              you can ignore this email. If you are concerned about your account's safety, please 
              reply to this email to get in touch with us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

OrganizationInviteEmail.PreviewProps = {
  invitedByUsername: 'John Doe',
  invitedByEmail: 'john.doe@example.com',
  organizationName: 'Acme Corp',
  inviteLink: 'https://senseiiwyze.com/app/organization/accept-invite/123',
} as OrganizationInviteEmailProps;

export default OrganizationInviteEmail;
