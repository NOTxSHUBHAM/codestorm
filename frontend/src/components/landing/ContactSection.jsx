import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { InstagramIcon, LinkedInIcon } from "@/components/ui/icons";

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
                icon={<LinkedInIcon className="h-4 w-4" />}
              />
              <SocialLink
                href="https://www.instagram.com/codestormcrce/"
                label="Instagram"
                icon={<InstagramIcon className="h-4 w-4" />}
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
      className="group flex min-h-12 items-center gap-2 rounded-full border border-white/35 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:border-white/60 hover:bg-white/20"
    >
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/15 text-white transition-transform group-hover:scale-110">
        {icon}
      </span>
      {label}
    </a>
  );
}