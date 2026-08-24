import { siteContact } from "@/data/site";

export function FloatingWhatsApp() {
  return (
    <a
      className="floating-whatsapp"
      href={siteContact.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hubungi Indofishmart melalui WhatsApp di 0859 2132 7969"
      data-track="whatsapp-floating"
    >
      <span className="floating-whatsapp-icon" aria-hidden="true">
        <svg viewBox="0 0 32 32" role="img">
          <path
            d="M16 4.25a11.5 11.5 0 0 0-9.97 17.23L4.4 27.6l6.27-1.64A11.5 11.5 0 1 0 16 4.25Z"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.25"
          />
          <path
            d="M11.1 10.7c.3-.64.62-.66.93-.67h.79c.25 0 .53.1.66.43l1.02 2.45c.1.27.06.51-.12.75l-.75.93c-.2.23-.16.46-.03.68.8 1.35 1.82 2.39 3.2 3.18.23.13.45.15.66-.1l.97-1.18c.22-.26.5-.32.78-.2l2.34 1.1c.3.14.48.31.5.52.04.48-.19 1.5-.55 2.03-.54.8-1.61 1.27-2.54 1.27-.68 0-1.55-.14-2.67-.62a14.33 14.33 0 0 1-5.9-5.17c-.68-.98-1.14-2.1-1.15-3.03 0-.91.3-1.72.86-2.37Z"
            fill="currentColor"
          />
        </svg>
      </span>
      <span className="floating-whatsapp-copy">
        <small>Butuh bantuan?</small>
        <strong>Chat WhatsApp</strong>
      </span>
    </a>
  );
}
