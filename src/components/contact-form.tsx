import { useState, type FormEvent } from "react";
import { site } from "@/lib/site";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Short message form for visitors who are not ready to book a call.
 * Submissions go to Formspree, which forwards each one to the site email.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    setStatus("sending");
    setError("");
    try {
      const response = await fetch(site.contactFormEndpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (response.ok) {
        form.reset();
        setStatus("sent");
        return;
      }
      const data = (await response.json().catch(() => null)) as {
        errors?: { message?: string }[];
      } | null;
      setError(data?.errors?.map((item) => item.message).filter(Boolean).join(" ") ?? "");
      setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="lw-contact-form lw-contact-form-done" role="status">
        <p className="lw-contact-form-title">Message sent. Thank you!</p>
        <p>I&rsquo;ll reply to you by email.</p>
        <button type="button" className="lw-copy" onClick={() => setStatus("idle")}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      id="contact-form"
      className="lw-contact-form"
      action={site.contactFormEndpoint}
      method="POST"
      onSubmit={onSubmit}
      aria-labelledby="contact-form-title"
      noValidate
    >
      <p id="contact-form-title" className="lw-contact-form-title">
        Not ready for a call? Send a quick message.
      </p>

      <input type="hidden" name="_subject" value="New message from your portfolio" />
      {/* Spam trap: hidden from people, filled in only by bots. */}
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        className="lw-contact-form-trap"
        aria-hidden="true"
      />

      <div className="lw-contact-form-row">
        <label>
          <span>Name</span>
          <input name="name" type="text" autoComplete="name" required maxLength={120} />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required maxLength={200} />
        </label>
      </div>
      <label>
        <span>What would you like to automate?</span>
        <textarea
          name="message"
          rows={4}
          required
          maxLength={3000}
          placeholder="e.g. New leads from our website should go into GoHighLevel and get a follow-up text."
        />
      </label>
      <label>
        <span>
          Tools you use <em>(optional)</em>
        </span>
        <input name="tools" type="text" maxLength={300} placeholder="GoHighLevel, n8n, Zapier, Google Sheets…" />
      </label>

      <div className="lw-contact-form-actions">
        <button type="submit" className="lw-btn lw-btn-primary" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send Message"}
        </button>
        <p className="lw-contact-form-hint">I&rsquo;ll reply to you by email.</p>
      </div>

      <p className="lw-contact-form-error" role="alert">
        {status === "error"
          ? `${error || "The message couldn't be sent."} Please email me at ${site.email} instead.`
          : ""}
      </p>
    </form>
  );
}
