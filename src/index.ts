// Agent components
export { ChatInput } from "./components/ChatInput";
export type { ChatInputProps } from "./components/ChatInput";

export { AgentMessage } from "./components/AgentMessage";
export type { AgentMessageProps, AgentMessageAction } from "./components/AgentMessage";

export { UserMessage } from "./components/UserMessage";
export type { UserMessageProps } from "./components/UserMessage";

export { Reasoning } from "./components/Reasoning";
export type { ReasoningProps } from "./components/Reasoning";

export { ToolCall, resolveToolKind, getToolKindLabel } from "./components/ToolCall";
export type { ToolCallProps, ToolKind, ToolStatus, ToolContent } from "./components/ToolCall";

export { AgentQuestion } from "./components/AgentQuestion";
export type {
  AgentQuestionProps,
  AgentQuestionType,
  AgentQuestionOption,
  AgentQuestionItem,
} from "./components/AgentQuestion";

export { Attachments } from "./components/Attachments";
export type { Attachment, AttachmentsProps } from "./components/Attachments";

export { CodeBlock } from "./components/CodeBlock";
export type { CodeBlockProps } from "./components/CodeBlock";

export { ScrollToBottom } from "./components/ScrollToBottom";
export type { ScrollToBottomProps } from "./components/ScrollToBottom";

export { Plan } from "./components/Plan";
export type { PlanProps, PlanEntry, PlanEntryStatus } from "./components/Plan";

// Primitives
export { Markdown } from "./primitives/Markdown";
export type { MarkdownProps } from "./primitives/Markdown";

export { MessageActions } from "./primitives/MessageActions";
export type { MessageAction } from "./primitives/MessageActions";

// Icons
export { Icon } from "./components/Icon";
export type { IconName, IconProps } from "./components/Icon";
