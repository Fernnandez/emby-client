import { Box, Button, Card, Stack, Text } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { auth, getImageUrl, getItem } from './api';

// eslint-disable-next-line react/prop-types
const VideoCard = ({ id, title, imageTag, setCurrent }) => {
  const url = getImageUrl(id, imageTag);
  return (
    <Card shadow="xs" style={{ maxWidth: 300 }}>
      <img src={url} width="100%" />
      <Text size="xs" weight={700} style={{ marginTop: '0.5rem' }}>
        {title}
      </Text>
      <Button style={{ marginTop: '1rem' }} onClick={() => setCurrent(id)}>
        Assistir
      </Button>
    </Card>
  );
};

// eslint-disable-next-line react/prop-types
const VideoCardList = ({ setCurrent }) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    // Faz uma requisição para a API externa para obter os dados dos vídeos
    getItem()
      .then((response) => {
        setVideos(response.Items);
      })
      .catch((error) => {
        console.error('Erro na requisição:', error);
      });
  }, []);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
      {videos?.length > 0 &&
        videos.map((video, index) => {
          return (
            <VideoCard
              key={index}
              title={video.Name}
              imageTag={video.ImageTags.Primary}
              id={video.Id}
              setCurrent={setCurrent}
            />
          );
        })}
    </div>
  );
};

// eslint-disable-next-line react/prop-types
const VideoPlayer = ({ id }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    auth().then((response) => {
      // Carregar o vídeo quando o componente for montado
      const videoUrl = `http://150.161.121.253:8096/emby/videos/${id}/stream.mp4?Static=true&api_key=${response.token}`;

      videoRef.current.src = videoUrl;

      // Iniciar a reprodução do vídeo (opcional)
      videoRef.current.play();
    });
  }, []);

  return (
    <Card shadow="xs" style={{ maxWidth: 1000 }}>
      <Box>
        <video ref={videoRef} width="1000px" height="500px" controls />
      </Box>
    </Card>
  );
};

function App() {
  const [currentVideo, setCurrentVideo] = useState('');

  useEffect(() => {
    console.log(currentVideo);
  }, [currentVideo]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Meus videos</h1>
      <Stack>
        <VideoCardList setCurrent={setCurrentVideo} />
        {currentVideo !== '' && <VideoPlayer id={currentVideo} />}
      </Stack>
    </div>
  );
}

export default App;
