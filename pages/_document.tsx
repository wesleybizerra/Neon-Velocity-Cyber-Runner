
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang="pt-BR">
            <Head>
                <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Rajdhani:wght@300;500;700&display=swap" rel="stylesheet" />
                <script src="https://cdn.tailwindcss.com"></script>
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
