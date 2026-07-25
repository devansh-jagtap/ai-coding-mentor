import ChatbotClient from "@/components/chatbot-client";

export default async function ChatbotPage({
  searchParams,
}: {
  searchParams: Promise<{ prompt?: string }>;
}) {
  const params = await searchParams;

  return <ChatbotClient initialPrompt={params.prompt ?? ""} />;
}
