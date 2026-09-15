import * as React from "react";
import { cn } from "../../lib/cn";
import { AgentMessage } from "../AgentMessage";
import { UserMessage } from "../UserMessage";
import { Reasoning } from "../Reasoning";
import { ToolCall, type ToolContent } from "../ToolCall";
import { ChatInput } from "../ChatInput";
import { ScrollToBottom } from "../ScrollToBottom";
import type { Attachment } from "../Attachments";

// ============================================================================
// Types
// ============================================================================

export interface ConversationMessage {
  id: string;
  role: "user" | "agent";
  content?: string;
  streaming?: boolean;
  attachments?: Attachment[];
  reasoning?: {
    content: string;
    streaming?: boolean;
    duration?: number;
  };
  toolCalls?: {
    toolTitle?: string;
    toolStatus?: "in_progress" | "success" | "error" | "";
    toolContent?: ToolContent[];
  }[];
  question?: {
    question: string;
    type?: "text" | "single-select" | "multi-select";
    options?: { label: string; value: string }[];
    allowOther?: boolean;
    onSubmit?: (answer: string) => void;
    answer?: string;
  };
}

export interface ConversationProps {
  messages: ConversationMessage[];
  isGenerating?: boolean;
  onSubmit?: (value: string) => void;
  onStop?: () => void;
  onAttach?: () => void;
  attachments?: Attachment[];
  onRemoveAttachment?: (id: string) => void;
  placeholder?: string;
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function Conversation({
  messages,
  isGenerating = false,
  onSubmit,
  onStop,
  onAttach,
  attachments,
  onRemoveAttachment,
  placeholder = "Type a message…",
  className,
}: ConversationProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [showScrollBtn, setShowScrollBtn] = React.useState(false);

  // Check if user is scrolled away from bottom
  const handleScroll = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    setShowScrollBtn(!atBottom);
  }, []);

  // Auto-scroll to bottom on new messages — only if user is already at bottom
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    if (atBottom) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  const scrollToBottom = React.useCallback(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    setShowScrollBtn(false);
  }, []);

  return (
    <div className={cn("flex h-full flex-col bg-ak-surface", className)}>
      {/* Messages — scroll container with relative wrapper for the floating button */}
      <div className="relative flex-1 overflow-hidden">
        <div ref={scrollRef} onScroll={handleScroll} className="ak-scroll h-full overflow-y-auto">
          <div className="flex flex-col gap-4 px-3 py-4">
          {messages.map((msg) => {
            if (msg.role === "user") {
              return (
                <UserMessage
                  key={msg.id}
                  content={msg.content}
                  attachments={msg.attachments}
                />
              );
            }

            return (
              <div
                key={msg.id}
                className="flex w-full shrink-0 flex-col gap-1"
              >
                {/* Reasoning (if any) */}
                  {msg.reasoning && (
                    <Reasoning
                      content={msg.reasoning.content}
                      streaming={msg.reasoning.streaming}
                      duration={msg.reasoning.duration}
                    />
                  )}

                  {/* Tool calls (if any) */}
                  {msg.toolCalls?.map((tc, i) => (
                    <ToolCall
                      key={`${msg.id}-tc-${i}`}
                      toolTitle={tc.toolTitle}
                      toolStatus={tc.toolStatus}
                      toolContent={tc.toolContent}
                      defaultExpanded={false}
                    />
                  ))}

                  {/* Agent message content */}
                  {msg.content && (
                    <AgentMessage
                      content={msg.content}
                      streaming={msg.streaming}
                    />
                  )}
              </div>
            );
          })}
        </div>
        </div>

        {/* Scroll to bottom — floats at the bottom of the messages area */}
        {showScrollBtn && (
          <div className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2">
            <ScrollToBottom visible onClick={scrollToBottom} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 px-3 py-2.5">
        <ChatInput
          placeholder={placeholder}
          isGenerating={isGenerating}
          onSubmit={onSubmit}
          onStop={onStop}
          onAttach={onAttach}
          attachments={attachments}
          onRemoveAttachment={onRemoveAttachment}
        />
      </div>
    </div>
  );
}
