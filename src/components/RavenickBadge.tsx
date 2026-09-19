export default function RavenickBadge() {
  return (
    <a
      href="https://github.com/Ravenick"
      target="_blank"
      rel="noreferrer"
      aria-label="Built by Ravenick"
      className="ravenick-badge"
    >
      <img
        src="/oc-logo-no-bg.png"
        alt=""
        aria-hidden="true"
        className="ravenick-badge__logo"
      />
      <span className="ravenick-badge__text">
        <span>built by</span>
        <strong>Ravenick</strong>
      </span>
    </a>
  );
}
