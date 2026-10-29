import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ContactSection() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);

  const handleSend = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await addDoc(collection(db, "contacts"), {
        email: email.trim(),
        message: message.trim(),
        timestamp: serverTimestamp(),
      });
      setStatus("sent");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("Error saving contact form:", error);
      setStatus("error");
    }
  };

  return (
    <div className="relative mx-auto mb-20 mt-12 w-full max-w-7xl px-5 sm:mb-28 sm:px-8 lg:px-12">
      {/* Soft gradient glow behind the card */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[250px] w-[250px] rounded-full bg-accent/20 blur-[100px]" />
      </div>

      <section
        id="contact-section"
        className="relative grid overflow-hidden rounded-[2rem] border border-border/60 bg-card shadow-2xl lg:grid-cols-[0.85fr_1.15fr]"
      >
        <div className="relative flex flex-col justify-between overflow-hidden bg-primary p-7 text-primary-foreground sm:p-10 lg:p-12">
          <div className="pointer-events-none absolute -bottom-16 -right-10 text-[17rem] font-black leading-none text-white/10" aria-hidden="true">
            @
          </div>
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground/75">A good place to start</p>
            <h2 className="mb-5 text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl">
              Have a big
              <br />
              little idea?
            </h2>
            <p className="mb-8 max-w-sm text-sm leading-6 text-primary-foreground/80">
              Collaborate with us, ask a question, or just say hello. The
              CodeStorm door is open.
            </p>

            <div className="flex flex-wrap gap-2">
              <SocialLink
                href="https://www.linkedin.com/company/codestorm-crce/"
                label="LinkedIn"
                icon={
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V23h-4V8zm7.5 0h3.8v2.05h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V23h-4v-6.6c0-1.57-.03-3.6-2.2-3.6-2.2 0-2.53 1.72-2.53 3.49V23H8V8z" />
                  </svg>
                }
              />
              <SocialLink
                href="https://www.instagram.com/codestormcrce/"
                label="Instagram"
                icon={
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d="M12 2.2c3.2 0 3.6 0 4.85.07 1.17.05 1.8.25 2.23.42.56.22.96.48 1.38.9.42.42.68.82.9 1.38.17.42.37 1.06.42 2.23.06 1.26.07 1.64.07 4.85s0 3.6-.07 4.85c-.05 1.17-.25 1.8-.42 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.17-1.06.37-2.23.42-1.26.06-1.64.07-4.85.07s-3.6 0-4.85-.07c-1.17-.05-1.8-.25-2.23-.42a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.17-.42-.37-1.06-.42-2.23C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.85c.05-1.17.25-1.8.42-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.17 1.06-.37 2.23-.42C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.15 0-3.52.01-4.76.07-.9.04-1.39.19-1.71.32-.43.17-.74.37-1.06.69-.32.32-.52.63-.69 1.06-.13.32-.28.81-.32 1.71-.06 1.24-.07 1.61-.07 4.76s.01 3.52.07 4.76c.04.9.19 1.39.32 1.71.17.43.37.74.69 1.06.32.32.63.52 1.06.69.32.13.81.28 1.71.32 1.24.06 1.61.07 4.76.07s3.52-.01 4.76-.07c.9-.04 1.39-.19 1.71-.32.43-.17.74-.37 1.06-.69.32-.32.52-.63.69-1.06.13-.32.28-.81.32-1.71.06-1.24.07-1.61.07-4.76s-.01-3.52-.07-4.76c-.04-.9-.19-1.39-.32-1.71a2.85 2.85 0 0 0-.69-1.06 2.85 2.85 0 0 0-1.06-.69c-.32-.13-.81-.28-1.71-.32-1.24-.06-1.61-.07-4.76-.07zm0 3.05a4.95 4.95 0 1 1 0 9.9 4.95 4.95 0 0 1 0-9.9zm0 1.8a3.15 3.15 0 1 0 0 6.3 3.15 3.15 0 0 0 0-6.3zm5.15-2.15a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3z" />
                  </svg>
                }
              />
            </div>
          </motion.div>

          <motion.div
            className="relative z-10 mt-12"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground/65">Or email us directly</p>
            <a className="mt-2 inline-block text-sm font-bold transition hover:underline" href="mailto:codestorm.crce@gmail.com">
              codestorm.crce@gmail.com
            </a>
          </motion.div>
        </div>

        <div className="p-7 sm:p-10 lg:p-12">
          <div className="mb-8">
            <p className="page-eyebrow">Drop us a line</p>
            <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">Let&apos;s make something happen.</p>
          </div>
          <motion.div
            className="w-full"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <form
              className="flex w-full flex-col gap-4"
              onSubmit={handleSend}
            >
              <label htmlFor="email" className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Your email</label>
              <Input
                id="email"
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-xl border-border/70 bg-background/70 px-4 focus-visible:ring-primary/50"
              />
              <label htmlFor="message" className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">What&apos;s on your mind?</label>
              <Textarea
                id="message"
                placeholder="Your message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="resize-none rounded-xl border-border/70 bg-background/70 px-4 py-3 focus-visible:ring-primary/50"
              />
              <motion.button
                type="submit"
                className="relative mt-1 inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60 sm:self-start"
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02 }}
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                    Sending...
                  </span>
                ) : status === "error" ? (
                  "Error! Try again"
                ) : (
                  "Send message"
                )}
              </motion.button>

              <AnimatePresence>
                {status === "sent" && (
                  <motion.span
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-green-500 text-xs mt-1"
                  >
                    ✓ We'll get back to you soon!
                  </motion.span>
                )}
              </AnimatePresence>
            </form>

          </motion.div>
        </div>
      </section>
    </div>
  );
}

/* Small reusable social pill */
function SocialLink({ href, label, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 text-white text-sm font-medium transition-all duration-300"
    >
      <span className="text-primary transition-transform group-hover:scale-110">
        {icon}
      </span>
      {label}
    </a>
  );
}