import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CapsuleResult } from "@/components/CapsuleResult";

export const metadata: Metadata = {
  title: "Tu cápsula",
};

export default async function CapsulaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Container className="max-w-2xl py-12">
      <CapsuleResult submissionId={id} />
    </Container>
  );
}
