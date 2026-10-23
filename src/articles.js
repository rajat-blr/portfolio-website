export const articles = {
  'why-agent-evals-matter': {
    title: 'Why agent evals matter',
    dek: 'A practical approach to comparing coding agents: stable tasks, independent checks and enough evidence to explain a regression.',
    evals: true,
    sections: [
      ['Define what a successful task means', [
        'A coding agent can produce a convincing explanation and still leave the repository broken. An evaluation needs an observable outcome: the reported bug is fixed, related behavior still works and the change stays within the permitted scope. The completion message is useful context, but it is not a grader.',
        'Start with failures the team already understands. A validation edge case, a recovery path or a change that must preserve an existing API is easier to grade than an open-ended request to improve a codebase. Verify that the task fails on the original revision and that the checks can distinguish a valid repair from an unrelated edit.',
      ]],
      ['Control the inputs to each attempt', [
        'The configuration includes the model, instructions, tools, reasoning settings and execution permissions. Record all of them. Pin the repository baseline, version the task and freeze the suite before comparing configurations. Run each attempt in a fresh worktree so a previous attempt cannot leave useful edits behind.',
        'Change one input when you need to attribute a difference to that input. If the model and instructions both change, the result compares two complete configurations. It does not isolate the effect of the model upgrade. Setup commands and graders also need validation: a broken dependency should not be mistaken for an agent regression.',
      ]],
      ['Grade the result independently', [
        'Use executable checks for behavior, file assertions for required artifacts and diff constraints for scope. A regression check should reproduce the original failure and pass after a valid fix. Existing tests help detect collateral changes, but a green suite is only evidence for the behavior it covers.',
        'Keep outcome grading separate from trace inspection. The final repository and checks tell you whether the task succeeded; the trace helps explain the route taken. Held-out checks reduce direct exposure to the grader. They do not make the execution environment a hardened boundary against malicious code.',
      ]],
      ['Report operational failures alongside task results', [
        'Suppose ten attempts are scheduled: six pass, two fail their checks, one times out and one cannot start. The conditional task result is six passes among eight attempts with a functional result. The operational report still needs to show the timeout and setup error, and only six of the ten scheduled attempts produced a verified pass.',
        'State the denominator and the treatment of timeouts before presenting a percentage. Otherwise a system can appear to improve simply because difficult attempts stop producing results. Record unavailable token usage as unknown; treating it as zero also distorts comparisons.',
      ]],
      ['Compare matched cases and repeat the runs', [
        'Inspect which cases improved and which regressed before trusting an aggregate score. A configuration that gains one easy task and loses a critical recovery path may be a poor release even if its overall pass rate rises.',
        'Repeat attempts under the same conditions to observe variability. Repeated runs on one case describe reliability on that case; they are not independent evidence about a wider range of tasks. Report uncertainty and keep the conclusion proportional to the suite’s coverage.',
      ]],
      ['Measure cost and time without mixing phases', [
        'Measure agent execution separately from setup and scoring. Keep timeouts, concurrency and machine conditions visible. A slow dependency install or an overloaded runner can dominate elapsed time without saying anything about the agent.',
        'Record available token usage. If estimating monetary cost, retain the pricing assumptions used for that calculation. Compare efficiency among configurations that meet the required correctness level; a faster failed attempt is not equivalent to a successful one.',
      ]],
      ['Retain enough evidence to investigate a result', [
        'Keep the task revision, configuration snapshot, source diff, grader output, ordered events and raw trace for every attempt. A retry should create another record. Overwriting the first failure with a later success removes evidence of instability.',
        'This is the workflow implemented in Agent Workbench’s local Evals lab. Its five-case T3 Code comparisons remain inconclusive. The suite can help detect regressions in those tasks, but the available evidence does not support a general model ranking. Add confirmed user failures to the suite and run it before meaningful agent changes; offline coverage still needs production feedback.',
      ]],
    ],
  },
  'why-an-ai-agent-should-not-verify-its-own-repair': {
    title: 'Why an AI agent should not verify its own repair',
    dek: 'Let the agent propose and test a patch. Give a separate verifier responsibility for the final result.',
    sections: [
      ['A completion claim is not a verification result', [
        'An agent starts with a diagnosis, changes the code and explains why the change should work. Asking it to review that explanation gives it another opportunity to reason, but does not introduce independent evidence. The diagnosis and the review can share the same incorrect assumption.',
        'The distinction matters in incident response. A patch can address the model’s proposed cause while leaving the observed failure intact. A successful result therefore needs to come from checks against the system, rather than from the plausibility of the repair narrative.',
      ]],
      ['Separate proposal, permission and verification', [
        'In IncidentLab, model adapters receive bounded evidence and propose a repair. Human approval and deterministic policy govern whether the workflow may proceed. A separate verifier executes checks and records their outputs. The model does not author the final status.',
        'Using a second model would not establish this separation by itself. The relevant boundary is authority: which component can choose the checks, execute the candidate and declare the outcome? Independent verification requires a result derived from recorded checks, even if the proposing agent also runs tests during development.',
      ]],
      ['Check the baseline before the candidate', [
        'Reproduce the incident against a pinned source revision before applying a repair. If the baseline no longer fails, a passing candidate cannot establish that the patch fixed the reported problem. The environment, reproduction or incident definition may have changed.',
        'Then apply the candidate and run the fixed verification sequence: compilation, static analysis, unit and integration checks, and incident replay. Retain each result. A useful record lets a reviewer distinguish a build failure from a failed regression check without interpreting the agent’s summary.',
      ]],
      ['Validate the patch before executing it', [
        'A generated diff is executable input to the rest of the workflow. Deterministic rules should reject candidates that violate path, size, secret, syntax or clean-application policy before sandbox execution. Failure to validate a rule must block progression rather than silently permitting it.',
        'Policy and verification answer different questions. A permitted patch can still be incorrect. A patch that passes a test can still exceed the allowed change scope. Both results are needed before treating a repair as acceptable.',
      ]],
      ['Represent missing evidence explicitly', [
        'A failed check provides a result. A check that never ran, a missing signal or a broken environment provides insufficient evidence. Collapsing these cases into a pass/fail summary hides the difference between an incorrect repair and a repair that could not be assessed.',
        'IncidentLab keeps failed and inconclusive outcomes separate. A generated explanation cannot compensate for a missing verification result. This makes incomplete runs visible to a reviewer and preserves the reason a workflow stopped.',
      ]],
      ['Keep the security claim within the tested scope', [
        'IncidentLab runs checks in non-root containers with networking disabled and resource limits. The model worker does not receive the Docker socket. These controls reduce execution privileges within the project’s controlled scenarios.',
        'They do not establish a hardened environment for arbitrary untrusted repositories. Independent grading improves the credibility of an outcome; it does not, by itself, make running the candidate safe. Verification coverage and execution isolation need separate review.',
      ]],
    ],
  },
  'designing-an-evidence-backed-incident-workflow': {
    title: 'Designing an evidence-backed incident investigation workflow',
    dek: 'How IncidentLab moves from stored telemetry to an approved patch and a separately verified result.',
    sections: [
      ['Store observations before generating a diagnosis', [
        'An investigation needs a stable account of what happened. IncidentLab collects attributable traces, metrics, logs and pinned source before asking a model to explain the failure. Stored evidence gives the reviewer something concrete to inspect when a diagnosis makes a claim.',
        'This also separates an observation from an inference. Telemetry can establish that a pool was exhausted; the explanation of why it happened is still a hypothesis. A diagnosis should cite its supporting observations and leave evidence gaps visible.',
      ]],
      ['Give state and execution explicit owners', [
        'React provides the review interface. FastAPI and PostgreSQL own application state and stored evidence. Temporal coordinates the durable investigation workflow. Model adapters receive bounded context; a separate verifier owns sandbox execution.',
        'This division keeps generated text from becoming workflow authority. The model can propose a diagnosis or repair, while persisted state records whether approval occurred, whether policy accepted the candidate and what verification actually returned.',
      ]],
      ['Make approval a persisted checkpoint', [
        'A prompt asking an agent to wait does not enforce a workflow transition. The application needs a checkpoint that prevents repair generation until a human decision changes the stored state.',
        'Approval permits the next step; it does not certify the repair. A reviewer can agree that a hypothesis is worth testing without knowing whether the resulting patch will work. Policy checks and verification remain necessary after that decision.',
      ]],
      ['Apply deterministic rules to the candidate', [
        'Represent the repair as a unified diff and validate it before execution. IncidentLab checks path, size, secret, syntax and clean-application rules. These checks limit what the candidate is allowed to change and reject invalid proposals without relying on another model judgment.',
        'The rules fail closed. If the system cannot establish that a candidate complies, it cannot safely infer permission to proceed. A rejected candidate remains a proposal, with the rejection available for review.',
      ]],
      ['Derive the outcome from recorded checks', [
        'The verifier reproduces the baseline, applies the candidate and runs compilation, static analysis, unit and integration tests, and repeated incident replay. Each phase provides evidence for a different part of the repair claim.',
        'Successful, failed and inconclusive outcomes remain distinct. Closed and cancelled runs are tracked separately. A timeout or missing signal should remain visible in the result rather than being rewritten into a confident explanation.',
      ]],
      ['Distinguish the browser replay from a live run', [
        'The public browser demo uses saved investigation data and guided replays. It shows the review flow without requiring an account, backend or API key. The local Docker Compose system runs the workflow, telemetry stack, model integration and sandboxed verifier.',
        'The implemented scenarios cover database pool exhaustion and inventory underflow. That is a bounded demonstration of the design. It is not evidence that the system can diagnose arbitrary production incidents or safely execute patches from arbitrary repositories.',
      ]],
    ],
  },
}
