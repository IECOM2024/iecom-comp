import { Global } from '@emotion/react';

const Fonts = () => (
  <Global
    styles={`
      @font-face {
        font-family: 'Bodwars';
        src: url('/fonts/Bodwars.woff2') format('woff2'), url('/fonts/Bodwars.woff') format('woff'), url('/fonts/Bodwars.ttf') format('truetype');
      }

      @font-face {
        font-family: 'SomarRounded-Bold';
        src: url('/fonts/SomarRounded-Bold.woff2') format('woff2'), url('/fonts/SomarRounded-Bold.woff') format('woff'), url('/fonts/SomarRounded-Bold.ttf') format('truetype');
      }

      @font-face {
        font-family: 'SomarRounded-Regular';
        src: url('/fonts/SomarRounded-Regular.woff2') format('woff2'), url('/fonts/SomarRounded-Regular.woff') format('woff'), url('/fonts/SomarRounded-Regular.ttf') format('truetype');
      }
    `}
  />
);

export default Fonts;
