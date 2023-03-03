import * as React from 'react';
import {
  Box,
  Button,
  Stack,
  Typography,
} from '@mui/material';
import { maxWidth } from '@mui/system';

export default function Upload() {
  const [imageData, setImageData] = React.useState('');
  const [textData, setTextData] = React.useState('');


  const getImageData = (value) => {
    console.log({ value })
    let imageUrl = URL.createObjectURL(value);
    setImageData(imageUrl);
  }

  React.useEffect(() => {
    const explainText = `First, we load the Tesseract core scripts using the worker.load() function.
    After that, we load the language trained model from the cache storage.
    Otherwise, it will download the trained modal from the Tesseract server,
    cache it, and use it.`
    setTextData(explainText);
  })

  return (
    <Box sx={{ m: 2 }}>
      <Stack direction="column" alignItems="center" spacing={2}>
        <Button variant="contained" component="label">
          Upload
          <input hidden accept="image/*" type="file" onChange={(e) => getImageData(e.target.files[0])} />
        </Button>
        <Stack sx={{ p: 2, boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)' }}>
          <Typography variant='h5'>
            {textData}
          </Typography>
        </Stack>

        {imageData &&
          <Stack sx={{ p: 2, boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)' }}>
            <Box
              component="img"
              sx={{
                content: `url(${imageData})`,
                height: { xs: '75vw', sm: '175px', md: '250px', lg: '300px' },
                maxWidth: '350px',
                objectFit: 'contain'
              }}
              alt="Logo"
            />
          </Stack>}
      </Stack>
    </Box>
  )
}