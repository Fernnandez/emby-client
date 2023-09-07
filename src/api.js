import axios from 'axios';

export const auth = async () => {
  try {
    const params = {
      'X-Emby-Client': 'Emby Web',
      'X-Emby-Device-Name': 'Chrome macOS',
      'X-Emby-Device-Id': '3c8c4fef-02d9-4643-b6b6-da9f37debebb',
      'X-Emby-Client-Version': '4.7.13.0',
      'X-Emby-Language': 'pt-br',
    };

    const { data } = await axios.post(
      'http://150.161.121.253:8096/emby/Users/authenticateByName',
      { Username: 'controle', Pw: '@controle23' },
      { params }
    );

    return { token: data.AccessToken, user: data.User.Id };
  } catch (error) {
    console.error(error);
  }
};

export const getItem = async () => {
  try {
    const authData = await auth();

    const params = {
      SortBy: 'IsFolder,Filename',
      SortOrder: 'Ascending',
      Recursive: false,
      Fields:
        'BasicSyncInfo,CanDelete,Container,PrimaryImageAspectRatio,ProductionYear',
      StartIndex: 0,
      ParentId: 7,
      EnableImageTypes: 'Primary,Backdrop,Thumb',
      ImageTypeLimit: 1,
      Limit: 50,
      'X-Emby-Client': 'Emby Web',
      'X-Emby-Device-Name': 'Chrome macOS',
      'X-Emby-Device-Id': '3c8c4fef-02d9-4643-b6b6-da9f37debebb',
      'X-Emby-Client-Version': '4.7.13.0',
      'X-Emby-Token': authData.token,
      'X-Emby-Language': 'pt-br',
    };

    const response = await axios.get(
      `http://150.161.121.253:8096/emby/Users/${authData.user}/items`,
      {
        params,
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getImageUrl = (itemId, imageTag) => {
  return `http://150.161.121.253:8096/emby/Items/${itemId}/Images/Primary?maxHeight=141&maxWidth=250&tag=${imageTag}`;
};

export const getVideoUrl = async (id) => {
  const authParams = await auth();

  return `http://150.161.121.253:8096/emby/videos/${id}/stream.mp4?Static=true&api_key=${authParams.token}`;
};
