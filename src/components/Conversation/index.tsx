import * as React from "react";
import { cn } from "../../lib/cn";
import { AgentMessage } from "../AgentMessage";
import { UserMessage } from "../UserMessage";
import { Reasoning } from "../Reasoning";
import { ToolCall, type ToolContent } from "../ToolCall";
import { AgentQuestion } from "../AgentQuestion";
import { ChatInput } from "../ChatInput";
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

  // Auto-scroll to bottom on new messages
  React.useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-6 p-6">
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
              <div key={msg.id} className="flex flex-col gap-3">
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
                  />
                ))}

                {/* Agent message content */}
                {msg.content && (
                  <AgentMessage
                    content={msg.content}
                    streaming={msg.streaming}
                  />
                )}

                {/* Question (if any) */}
                {msg.question && (
                  <AgentQuestion
                    question={msg.question.question}
                    type={msg.question.type}
                    options={msg.question.options}
                    allowOther={msg.question.allowOther}
                    onSubmit={msg.question.onSubmit}
                    answer={msg.question.answer}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-ak-border p-4">
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
