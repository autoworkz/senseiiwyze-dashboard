import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

interface MemberInviteCodeEmailProps {
  organizationName: string;
  code: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';

export const MemberInviteCodeEmail = ({
  organizationName,
  code,
}: MemberInviteCodeEmailProps) => {
  const previewText = `Your invite code for ${organizationName}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-[#eaeaea] border-solid p-[20px]">
            <Section className="mt-[32px]">
              <Heading className="mx-0 my-[30px] p-0 text-center font-normal text-[24px] text-black">
                Your invite to <strong>{organizationName}</strong>
              </Heading>
            </Section>
            <Text className="text-[14px] text-black leading-[24px]">Hello,</Text>
            <Text className="text-[14px] text-black leading-[24px]">
              Use the code below in the SenseiiWyze mobile app to accept your invitation to
              <strong> {organizationName}</strong>.
            </Text>
            <Section className="mt-[24px] mb-[24px] text-center">
              <div className="inline-block rounded bg-gray-100 px-4 py-3 text-[18px] font-bold tracking-widest text-black">
                {code}
              </div>
            </Section>
            <Text className="text-[14px] text-black leading-[24px]">
              Download the app and enter this code on the invitation screen. This code may expire, so please use it soon.
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-[#eaeaea] border-solid" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              If you weren’t expecting this, you can ignore this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

MemberInviteCodeEmail.PreviewProps = {
  organizationName: 'Acme Corp',
  code: 'ABC123',
} as MemberInviteCodeEmailProps;

export default MemberInviteCodeEmail;


