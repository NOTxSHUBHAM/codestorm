import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Terminal({ autoFocus = true }) {
  const [lines, setLines] = useState([
    { type: "output", content: "Welcome to CodeStorm Terminal v1.0.0" },
    { type: "output", content: "Type 'codestorm --help' to get started." },
    { type: "output", content: "" },
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  const commands = {
    help: () => [
      <span key="help-title" className="text-primary font-semibold">
        CodeStorm Terminal Help
      </span>,
      "",
      <span key="help-cmds" className="text-muted-foreground">
        Available commands:
      </span>,
      <span key="cmd-help">
        <span className="text-primary">help</span> - Show this help message
      </span>,
      <span key="cmd-cshelp">
        <span className="text-primary">codestorm --help</span> - Show CodeStorm
        commands
      </span>,
      <span key="cmd-clear">
        <span className="text-primary">clear</span> - Clear the terminal
      </span>,
      <span key="cmd-whoami">
        <span className="text-primary">whoami</span> - Display current user
      </span>,
      <span key="cmd-date">
        <span className="text-primary">date</span> - Show current date and time
      </span>,
      <span key="cmd-echo">
        <span className="text-primary">echo &lt;message&gt;</span> - Echo a
        message
      </span>,
    ],
    "codestorm --help": () => [
      <span key="cshelp-title" className="text-primary font-semibold">
        CodeStorm CLI
      </span>,
      "",
      <span key="cshelp-desc" className="text-muted-foreground">
        Try these commands:
      </span>,
      <span key="cshelp-1">
        <span className="text-primary">whoami</span> - See your CodeStorm
        identity
      </span>,
      <span key="cshelp-2">
        <span className="text-primary">date</span> - Get the current date/time
      </span>,
      <span key="cshelp-3">
        <span className="text-primary">echo &lt;msg&gt;</span> - Echo your
        message
      </span>,
      <span key="cshelp-4">
        <span className="text-primary">clear</span> - Clear the terminal
      </span>,
      "",
      <span key="cshelp-tip" className="text-muted-foreground">
        More coming soon. Stay tuned!
      </span>,
    ],
    clear: () => {
      setLines([]);
      return [];
    },
    whoami: () => [<span className="text-primary">codestorm-user</span>],
    date: () => [<span>{new Date().toLocaleString()}</span>],
  };

  const executeCommand = (command) => {
    const trimmedCommand = command.trim();

    setCommandHistory((prev) => [...prev, trimmedCommand]);
    setHistoryIndex(-1);

    setLines((prev) => [
      ...prev,
      { type: "input", content: `$ ${trimmedCommand}` },
    ]);

    if (trimmedCommand === "") return;

    if (trimmedCommand.startsWith("echo ")) {
      const message = trimmedCommand.substring(5);
      setLines((prev) => [...prev, { type: "output", content: message }]);
      return;
    }

    const commandFunc = commands[trimmedCommand];
    if (commandFunc) {
      const output = commandFunc();
      if (Array.isArray(output)) {
        setLines((prev) => [
          ...prev,
          ...output.map((line, i) => ({
            type: "output",
            content: line,
            key: i,
          })),
        ]);
      }
    } else {
      setLines((prev) => [
        ...prev,
        { type: "error", content: `Command not found: ${trimmedCommand}` },
        {
          type: "output",
          content: "Type 'help' or 'codestorm --help' for available commands.",
        },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      executeCommand(currentInput);
      setCurrentInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentInput("");
        } else {
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
        }
      }
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const quickHints = ["help", "codestorm --help", "whoami", "date", "clear"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative w-full max-w-4xl mx-auto my-4"
    >
      {/* Ambient glow behind terminal */}
      <div className="pointer-events-none absolute -inset-4 -z-10">
        <div className="absolute inset-0 rounded-3xl bg-primary/15 blur-3xl" />
      </div>

      <div
        className="relative w-full rounded-2xl border border-border/60 bg-background/80 backdrop-blur-xl overflow-hidden shadow-2xl"
        style={{
          fontFamily: "var(--font-mono), monospace",
        }}
      >
        {/* top sheen */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        {/* Header */}
        <div className="relative flex items-center gap-3 px-4 py-2.5 border-b border-border/60 bg-card/60">
          {/* traffic lights */}
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive/80 hover:bg-destructive transition-colors" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors" />
          </div>

          {/* centered title */}
          <div className="flex-1 text-center text-xs text-muted-foreground font-semibold tracking-widest uppercase select-none">
            codestorm — terminal
          </div>

          {/* right side badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-primary/30 bg-primary/10">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            <span className="text-[10px] font-semibold tracking-wider text-primary uppercase">
              online
            </span>
          </div>
        </div>

        {/* Body */}
        <div
          ref={terminalRef}
          onClick={() => inputRef.current?.focus()}
          className="relative h-80 sm:h-[26rem] overflow-y-auto px-4 py-3 font-mono text-[0.98rem] cursor-text bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03),transparent_70%)]"
          style={{ minHeight: "14rem" }}
        >
          {lines.map((line, index) => (
            <div key={line.key ?? index} className="mb-1 break-words">
              {line.type === "input" && (
                <div className="flex items-start gap-2">
                  <span className="text-primary/70 select-none">$</span>
                  <span className="text-primary font-medium">
                    {line.content.replace(/^\$\s?/, "")}
                  </span>
                </div>
              )}
              {line.type === "output" && (
                <div className="text-foreground/90">{line.content}</div>
              )}
              {line.type === "error" && (
                <div className="text-destructive">{line.content}</div>
              )}
            </div>
          ))}

          {/* Current Input Line */}
          <div className="flex items-center text-primary">
            <span className="mr-2 select-none font-bold">$</span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none text-foreground caret-primary placeholder:text-muted-foreground/60 py-1"
              placeholder="type a command..."
              autoComplete="off"
              spellCheck="false"
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: "1rem",
                minWidth: 0,
              }}
              aria-label="Terminal input"
            />
            {/* fake cursor glow when input is empty */}
            {currentInput === "" && (
              <motion.span
                aria-hidden
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="ml-0.5 inline-block h-4 w-1.5 bg-primary rounded-sm"
              />
            )}
          </div>
        </div>

        {/* Quick hints bar */}
        <div className="relative flex items-center gap-2 px-3 py-2 border-t border-border/60 bg-card/40 overflow-x-auto">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground shrink-0">
            Try:
          </span>
          {quickHints.map((hint) => (
            <button
              key={hint}
              onClick={() => {
                setCurrentInput(hint);
                inputRef.current?.focus();
              }}
              className="shrink-0 rounded-md border border-border/60 bg-background/60 px-2 py-0.5 text-[11px] font-mono text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/10 transition-colors"
            >
              {hint}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}