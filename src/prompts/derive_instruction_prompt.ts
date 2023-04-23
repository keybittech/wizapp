import { ChatCompletionRequestMessage } from "openai";
import { GuardValidations } from "../types.js";

// aHR0cHM6Ly9tYXJ0aW5mb3dsZXIuY29tL2FydGljbGVzLzIwMjMtY2hhdGdwdC14dS1oYW8uaHRtbA==
export const deriveInstructionPrompt: ChatCompletionRequestMessage[] = [
  { role: 'system', content: '' },
  { role: 'assistant', content: `{introduction}

  The current system is a {system_name}. Tech stack: {tech_stack}. And {testing_tools}.
  
  All codes should be written in the tech stack mentioned above. Requirements should be implemented as {architecture_pattern}.
  
  {view_models_block}
  
  {common_implementation_strategy}
  
  Here is the common implementation strategy for the project:
  
  {strategy_block_which_covers_strategies_relating_to_view_models}
  
  {strategy_block_which_covers_strategies_relating_to_component_implementation}
  
  {strategy_block_which_covers_strategies_relating_to_testing}
  
  {patterns_to_follow}
  
  Here are certain patterns that should be followed when implementing and testing the components:
  
  {test_pattern_guideline_block_1}
  
  {test_pattern_guideline_block_2}
  
  {test_pattern_guideline_block_3}
  
  {feature_requirement}
  
  {feature_name}
  
  Requirement:
  
  {requirement_description}
  
  {acceptance_criteria}
  
  AC1: {criteria1_description}.
  
  AC2: {criteria2_description}.
  
  {solution_guidance}
  
  Provide an overall solution following the guidance mentioned above. Hint, {solution_hint}. Don't generate code. Describe the solution and break it down into a task list based on the guidance mentioned above. We will refer to this task list as our master plan.`}
];

const derivedInstructionResponseRegex = /export default function/igm;
type DerivedInstructionKey = string;
export type DerivedInstructionResponse = `export default function ${DerivedInstructionKey}() {`;

export function isDerivedInstructionResponse(obj: GuardValidations): boolean {
  return 'string' === typeof obj && derivedInstructionResponseRegex.test(obj);
}