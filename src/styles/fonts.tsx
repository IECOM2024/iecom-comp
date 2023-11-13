import { Global } from '@emotion/react';

const Fonts = () => (
  <Global
    styles={`
      @font-face {
        font-family: 'Alsans';
        src: url('/fonts/Albert_Sans/AlberSans-VariableFont-wght.ttf'), url('/fonts/Albert_Sans/AlberSans-Italic-VariableFont-wght.ttf')
      }
      @font-face {
        font-family: alsans;
        font-style: italic;
        src: url("/fonts/Albert_Sans/AlbertSans-Italic-VariableFont_wght.ttf");
      }
      
      @font-face {
        font-family: ebgar;
        src: url("/fonts/EB_Garamond/EBGaramond-VariableFont_wght.ttf");
      }
      
      @font-face {
        font-family: ebgar;
        font-style: italic;
        src: url("/fonts/EB_Garamond/EBGaramond-Italic-VariableFont_wght.ttf");
      }

      @font-face{
        font-family: inter;
        src:url("/fonts/Inter/Inter-VariableFont_slnt_wght.ttf");
      }

    `}
  />
);

export default Fonts;
