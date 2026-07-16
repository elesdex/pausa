import Link from "next/link";

export const metadata = {
  title: "Privacidad — HELP",
  description: "Cómo HELP maneja mensajes, imágenes, voz y resultados.",
};

export default function PrivacyPage() {
  return (
    <main className="legal-shell legal-page">
      <header className="legal-topbar">
        <Link href="/" aria-label="Volver a HELP">
          <span className="legal-mark" aria-hidden="true">Ⅱ</span>
        </Link>
        <Link href="/">← Volver / Back</Link>
      </header>

      <p className="eyebrow">HELP</p>
      <h1>Privacidad</h1>
      <p className="updated">Versión del 16 de julio de 2026</p>

      <section>
        <h2>La versión corta</h2>
        <p>
          HELP no crea cuentas, no monitorea mensajes en segundo plano, no incluye analítica y no guarda
          permanentemente lo que compartes. Una imagen o texto solamente se envía para análisis cuando tú
          presionas “Revisar ahora”.
        </p>
      </section>

      <section>
        <h2>Texto, fotos y capturas</h2>
        <p>
          La vista previa de una imagen permanece en tu navegador hasta que solicitas el análisis. En ese momento,
          el texto y la imagen elegida se envían al servidor de HELP y al modelo de OpenAI para producir la
          orientación. El MVP no tiene base de datos propia y no conserva estos materiales después de responder.
          OpenAI puede conservar contenido en registros de monitoreo de abuso hasta 30 días bajo la configuración
          estándar de su API. Consulta sus{" "}
          <a href="https://developers.openai.com/api/docs/guides/your-data" target="_blank" rel="noreferrer">
            controles de datos
          </a>.
        </p>
      </section>

      <section>
        <h2>Voz</h2>
        <p>
          Cuando el navegador ofrece dictado, el propio navegador convierte tu voz en texto. HELP recibe la
          transcripción, no un archivo de audio. El procesamiento de voz específico depende del navegador y del
          sistema operativo que uses.
        </p>
      </section>

      <section>
        <h2>Demostración y compartir</h2>
        <ul>
          <li>El ejemplo guiado usa un mensaje ficticio y no llama al modelo.</li>
          <li>La opción de compartir incluye la orientación y los pasos seguros, no el mensaje ni la imagen original.</li>
          <li>HELP no envía nada automáticamente a familiares, bancos o autoridades.</li>
        </ul>
      </section>

      <section>
        <h2>Antes de compartir</h2>
        <p>
          Oculta contraseñas, NIP, números completos de tarjeta, identificaciones y otros datos que no sean
          necesarios. HELP ofrece orientación, no una garantía de que algo sea seguro o fraudulento.
        </p>
      </section>

      <hr className="language-divider" />

      <p className="eyebrow">English</p>
      <h1>Privacy</h1>
      <p className="updated">Version dated July 16, 2026</p>

      <section>
        <h2>The short version</h2>
        <p>
          HELP creates no accounts, performs no background message monitoring, includes no analytics, and does
          not permanently store what you share. Text or an image is sent for analysis only after you press “Check
          it now.”
        </p>
      </section>

      <section>
        <h2>Text, photos, and screenshots</h2>
        <p>
          An image preview remains in your browser until you request analysis. At that point, the selected text and
          image are sent to the HELP server and the OpenAI model to produce guidance. The MVP has no database and
          does not retain these materials after responding. Under standard API settings, OpenAI may retain customer
          content in abuse-monitoring logs for up to 30 days. See OpenAI&apos;s{" "}
          <a href="https://developers.openai.com/api/docs/guides/your-data" target="_blank" rel="noreferrer">
            data controls
          </a>.
        </p>
      </section>

      <section>
        <h2>Voice</h2>
        <p>
          When browser dictation is available, your browser converts speech into text. HELP receives the
          transcript, not an audio file. Specific voice processing depends on your browser and operating system.
        </p>
      </section>

      <section>
        <h2>Demo and sharing</h2>
        <ul>
          <li>The guided example uses a fictional message and does not call the model.</li>
          <li>Sharing includes the guidance and safe steps, not the original message or image.</li>
          <li>HELP never contacts relatives, banks, or authorities automatically.</li>
        </ul>
      </section>

      <section>
        <h2>Before sharing</h2>
        <p>
          Hide passwords, PINs, complete card numbers, identity documents, and other unnecessary personal data.
          HELP provides guidance, not a guarantee that something is safe or fraudulent.
        </p>
      </section>
    </main>
  );
}
