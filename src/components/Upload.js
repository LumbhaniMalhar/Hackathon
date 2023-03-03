import * as React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";
import { maxWidth } from "@mui/system";
import { createWorker } from "tesseract.js";

export default function Upload() {
  const [imageData, setImageData] = React.useState("");
  const [textData, setTextData] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [code, setCode] = React.useState("");
  const convertImageToText = async (file) => {
    setLoading(true);
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
      // var myHeaders = new Headers();
      // myHeaders.append("Content-Type", "application/json");
      // var raw = JSON.stringify({
      //   text: data.text,
      // });
      // var requestOptions = {
      //   method: "POST",
      //   headers: myHeaders,
      //   body: raw,
      //   redirect: "follow",
      // };
      // fetch("http://localhost:8000/explain", requestOptions)
      //   .then((response) => response.json())
      //   .then((result) => {
      //     console.log(result);
      //     setTextData(result.data);
      //   })
      //   .catch((error) => console.log("error", error));
      const response = await makeSimpleText(data.text);
      if (response.data) {
        setTextData(response.data);
      }
      setLoading(false)
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
    let response = await fetch("https://a77e-69-166-117-246.ngrok.io/explain", requestOptions);
    let result = response.json();
    return result;
  }

  function debounce(func, timeout = 1000) {
    console.log({ func });
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }

  const handleTextChange = async (value) => {
    setLoading(true);
    console.log("hello11");
    const response = await makeSimpleText(value);
    if (response.data) {
      setTextData(response.data);
    }
    setLoading(false);
  };

  return (
    <Stack
      sx={{
        m: 2,
        p: 2,
        mt: 10,
        boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
      }}
      // gap={1}
      justifyContent={"center"}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        sx={{
          p: 0,
          m: 2,
          minHeight: "350px",
        }}
        gap={2}
      >
        {!imageData && (
          <Editor
            placeholder="Write about your topic that needs to be simplified"
            value={code}
            onValueChange={(code) => {
              setCode(code);
              // debounce(handleTextChange(code))
              if(code.length>10){
                debounce(handleTextChange(code))
                // handleTextChange(code);
              }
            }}
            highlight={(code) => highlight(code, languages.js)}
            padding={10}
            style={{
              // margin: 5,
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 20,
              minWidth: "50%",
              maxWidth: { xs: "50%", sm: "50%", },
              height: "350px",
              overflow: "scroll",
              border: "1px solid grey",
            }}
          />
        )}
        {imageData && (
          <Box
            component="img"
            sx={{
              content: `url(${imageData})`,
              height: "350px",
              minWidth: "50%",
              objectFit: "contain",
            }}
            alt="Logo"
          />
        )}
        {!loading && <Editor
          disabled
          value={textData}
          onValueChange={(code) => setTextData(code)}
          highlight={(code) => highlight(code, languages.js)}
          padding={10}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 20,
            minWidth: "50%",
            height: "350px",
            overflow: "scroll",
            border: "1px solid grey",
          }}
        />}
        {loading && <Stack
          sx={{
            minWidth: "50%",
            maxWidth: { xs: "100%", sm: "50%", },
            height: "350px",
            overflow: "scroll",
            border: "1px solid grey",
          }}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Box sx={{ display: loading ? 'flex' : 'none', }}>
            <CircularProgress sx={{ color: 'black' }} />
          </Box>
        </Stack>}
      </Stack>
      <Stack
        direction={"row"}
        sx={{
          p: 0,
          m: 2,
        }}
      >
        <Stack direction={"row"} gap={1}>
          <Button
            variant="contained"
            component="label"
            fullWidth={false}
            sx={{ minWidth: "0px", backgroundColor: "black" }}
            disabled={loading}
          >
            Upload image
            <input
              hidden
              accept="image/*"
              type="file"
              onChange={(e) => getImageData(e.target.files[0])}
            />
          </Button>
          {imageData && (
            <Button
              variant="contained"
              component="label"
              fullWidth={false}
              sx={{ minWidth: "0px", backgroundColor: "black" }}
              onClick={() => {
                setImageData("");
              }}
              disabled={loading}
            >
              Add Text
            </Button>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}
