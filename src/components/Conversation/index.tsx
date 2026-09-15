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

  // Find the last unanswered question to float over the input
  const floatingQuestion = React.useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (msg.question && !msg.question.answer) {
        return { msg, question: msg.question };
      }
    }
    return null;
  }, [messages]);

  // Auto-scroll to bottom on new messages
  React.useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  return (
    <div className={cn("flex h-full flex-col bg-ak-surface", className)}>
      {/* Messages */}
      <div ref={scrollRef} className="ak-scroll flex-1 overflow-y-auto">
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

                  {/* Question — rendered inline only if already answered */}
                  {msg.question && msg.question.answer && (
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

      {/* Input with floating question overlay */}
      <div className="relative shrink-0 px-3 py-2.5">
        {floatingQuestion && (
          <div className="absolute bottom-full left-2 right-2 z-10 pb-0.5">
            <AgentQuestion
              question={floatingQuestion.question.question}
              type={floatingQuestion.question.type}
              options={floatingQuestion.question.options}
              allowOther={floatingQuestion.question.allowOther}
              onSubmit={floatingQuestion.question.onSubmit}
              answer={floatingQuestion.question.answer}
            />
          </div>
        )}
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
