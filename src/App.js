import * as React from 'react';
import { Route, Routes } from "react-router-dom";
import './App.css';
// import Upload from "./components/Upload";

import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from '@mui/material/styles';
import Upload from './components/Upload';

let theme = createTheme(
  {
    typography: {
      h1: {
        fontFamily: '"Lato", sans-serif',
        fontWeight: 'bold',
      },
      h2: {
        fontFamily: '"Lato", sans-serif',
        fontWeight: 700,
      },
      h3: {
        fontFamily: '"Lato", sans-serif',
        fontWeight: 'bold',
      },
      h4: {
        fontFamily: '"Lato", sans-serif',
        fontWeight: 'bold',
      },
      h5: {
        fontFamily: '"Lato", sans-serif',
        fontWeight: 900,
      },
      h6: {
        fontFamily: '"Lato", sans-serif',
        fontWeight: 500,
      },
      body1: {
        fontFamily: '"Lato", sans-serif',
        fontWeight: 400,
      }
    },
  }
);
theme = responsiveFontSizes(theme);


function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* <CssBaseline /> */}
      <Routes>
        <Route path="/upload" element={<Upload />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
