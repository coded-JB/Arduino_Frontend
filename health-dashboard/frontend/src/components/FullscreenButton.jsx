export default function FullscreenButton() {

  function toggleFullscreen() {

    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }

  }

  return (
    <button
      onClick={toggleFullscreen}
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,

        background: "#00ff88",

        color: "#000",

        border: "none",

        padding: "14px 20px",

        borderRadius: 12,

        fontWeight: "bold",

        cursor: "pointer",

        zIndex: 9999
      }}
    >
      FULLSCREEN
    </button>
  );
}