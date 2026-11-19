import { useState } from "react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const EMPTY = { name: "", email: "", subject: "", message: "", website: "" };
const FIELD =
  "mt-2 w-full rounded-[14px] border border-[#2b2119]/25 bg-[#efe7da] px-4 py-3 text-[#2b2119] placeholder:text-[#6b5848]/70 outline-none transition-colors focus:border-[#a8471f]";

const Field = ({ label, id, as: Tag = "input", ...props }) => (
  <label htmlFor={id} className="block text-sm">
    {label}
    <Tag id={id} name={id} required className={FIELD} data-testid={`contact-form-${id}`} {...props} />
  </label>
);

const errorText = (err) => {
  const detail = err.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (err.response?.status === 422) return "Please check your email address and try again.";
  return "Something went wrong. Please email me directly instead.";
};

export const ContactForm = () => {
  const [form, setForm] = useState(EMPTY);
  const [state, setState] = useState({ status: "idle", text: "" });
  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setState({ status: "sending", text: "" });
    try {
      await axios.post(`${API}/contact`, form);
      setForm(EMPTY);
      setState({ status: "sent", text: "Thanks, your message is on its way. I'll reply by email." });
    } catch (err) {
      setState({ status: "error", text: errorText(err) });
    }
  };

  return (
    <form
      onSubmit={submit}
      className="space-y-5 rounded-[28px] bg-[#e3d6c3] p-7 text-[#2b2119] md:p-9"
      data-testid="contact-form"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" id="name" value={form.name} onChange={set} maxLength={80} placeholder="Your name" />
        <Field
          label="Email"
          id="email"
          type="email"
          value={form.email}
          onChange={set}
          placeholder="you@example.com"
        />
      </div>
      <Field
        label="Subject"
        id="subject"
        value={form.subject}
        onChange={set}
        maxLength={140}
        placeholder="What's this about?"
      />
      <Field
        label="Message"
        id="message"
        as="textarea"
        rows={5}
        value={form.message}
        onChange={set}
        maxLength={4000}
        placeholder="Your message..."
        style={{ resize: "none" }}
      />
      {/* Honeypot: hidden from people, tempting for bots. */}
      <input
        type="text"
        name="website"
        value={form.website}
        onChange={set}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={state.status === "sending"}
          data-testid="contact-form-submit"
          className="rounded-full bg-[#2b2119] px-7 py-3.5 text-[#efe7da] transition-colors hover:bg-[#a8471f] disabled:opacity-60"
        >
          {state.status === "sending" ? "Sending..." : "Send message"}
        </button>
        {state.text && (
          <p
            role="status"
            data-testid="contact-form-status"
            className={`text-sm ${state.status === "error" ? "text-[#a8471f]" : "text-[#4a3a2d]"}`}
          >
            {state.text}
          </p>
        )}
      </div>
    </form>
  );
};

export default ContactForm;
