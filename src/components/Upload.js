import * as React from "react";
import { Box, Button, Skeleton, Stack, TextField, Typography } from "@mui/material";
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import { maxWidth } from "@mui/system";
import { createWorker } from "tesseract.js";

export default function Upload() {
  const [imageData, setImageData] = React.useState("");
  const [textData, setTextData] = React.useState("");
  const [code, setCode] = React.useState("");
  const convertImageToText = async (file) => {
    const worker = await createWorker({
      logger: (m) => console.log(m),
    });
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    try {
      console.log("selectedImage", file);
      const { data } = await worker.recognize(file);
      console.log("data", data.text);
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      var raw = JSON.stringify({
        text: data.text,
      });
      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      fetch("http://localhost:8000/explain", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          setTextData(result.data);
        })
        .catch((error) => console.log("error", error));
      // setTextResult(data.text);
    } catch (error) {
      console.log("error", error);
    }
  };
  const getImageData = (value) => {
    console.log({ value });
    let imageUrl = URL.createObjectURL(value);
    setImageData(imageUrl);
    convertImageToText(value);
  };

  // React.useEffect(() => {
  //   const explainText = `First, we load the Tesseract core scripts using the worker.load() function.
  //   After that, we load the language trained model from the cache storage.
  //   Otherwise, it will download the trained modal from the Tesseract server,
  //   cache it, and use it.`;
  //   setTextData(explainText);
  // }, []);

  async function makeSimpleText(value) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      text: value,
    });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch("http://localhost:8000/explain", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        return result;
        // setTextData(result.data);
      })
      .catch((error) => console.log("error", error));
  }

  function debounce(func, timeout = 1000) {
    console.log({func})
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  }


  const handleTextChange = async (value) => {
    console.log("hello11")
    const response = await makeSimpleText(value);
    if(response.data) {
      setTextData(response.data);
    }
  }

  return (
    <Stack
      sx={{
        m: 2,
        p: 2,
        mt: 10,
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
      }}
      gap={1}
      justifyContent={'center'}
    >
      {/* <Stack direction="column" alignItems="center" spacing={2}>
          <Button variant="contained" component="label">
            Upload
            <input
              hidden
              accept="image/*"
              type="file"
              onChange={(e) => getImageData(e.target.files[0])}
            />
          </Button>
          <Stack sx={{ p: 2, boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }}>
            <Typography variant="h5">{textData}</Typography>
          </Stack>

          {imageData && (
            <Stack sx={{ p: 2, boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }}>
              <Box
                component="img"
                sx={{
                  content: `url(${imageData})`,
                  height: { xs: "75vw", sm: "175px", md: "250px", lg: "300px" },
                  maxWidth: "350px",
                  objectFit: "contain",
                }}
                alt="Logo"
              />
            </Stack>
          )}
        </Stack> */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        sx={{
          p: 0,
          m: 2,
          // boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
          minHeight: '350px'
        }}
        gap={0}
      >
        {!imageData && <Editor
          placeholder="Write about your topic that needs to be simplified"
          value={code}
          onValueChange={code => {
            setCode(code)
            // debounce(handleTextChange(code))
            handleTextChange(code)
          }}
          highlight={code => highlight(code, languages.js)}
          padding={10}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 20,
            minWidth: '48%',
            height: '350px',
            overflow: 'scroll',
            border: '1px solid grey'
          }}
        />}
        {imageData &&
          <Box
            component="img"
            sx={{
              content: `url(${imageData})`,
              // height: { xs: "75vw", sm: "175px", md: "250px", lg: "300px" },
              height: '350px',
              minWidth: "48%",
              objectFit: "contain",
            }}
            alt="Logo"
          />
        }
        <Editor
          disabled
          value={textData}
          onValueChange={code => setTextData(code)}
          highlight={code => highlight(code, languages.js)}
          padding={10}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 20,
            minWidth: '48%',
            height: '350px',
            overflow: 'scroll',
            border: '1px solid grey'
          }}
        />
      </Stack>
      <Stack
        direction={'row'}
        sx={{
          p: 0,
          m: 2,
        }}
      >
        <Stack direction={'row'} gap={1}>
          <Button variant="contained" component="label" fullWidth={false} sx={{ minWidth: '0px', backgroundColor: 'black' }} >
            Upload image
            <input
              hidden
              accept="image/*"
              type="file"
              onChange={(e) => getImageData(e.target.files[0])}
            />
          </Button>
          {imageData && <Button
            variant="contained"
            component="label"
            fullWidth={false}
            sx={{ minWidth: '0px', backgroundColor: 'black' }}
            onClick={() => {
              setImageData("")
            }}
          >
            Add Text
          </Button>}
        </Stack>
      </Stack>
    </Stack>
  );
}
