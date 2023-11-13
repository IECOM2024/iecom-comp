import { extendTheme } from '@chakra-ui/react';
import { colors } from './component/colors';
import { Button } from './component/button';
import { Input } from './component/input';
import { Table } from './component/table';
import { Textarea } from './component/textarea';

const theme = extendTheme({
  fonts: {
    heading: 'Alsans',
    body: 'ebgar'
  },
  colors,
  styles: {
    global: {
      body: {
        color: 'black'
      },
      '*': {
        '&::-webkit-scrollbar': {
          w: '2',
          h: '1.5'
        },
      }
    }
  },
  components: {
    Button,
    Input,
    Table,
    Textarea
  }
});

export default theme;
