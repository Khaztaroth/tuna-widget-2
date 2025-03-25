export type MusicData = {
    recenttracks: {
      track: Array<{
        artist: {
          mbid: string
          "#text": string
        }
        streamable: string
        image: Array<{
          size: string
          "#text": string
        }>
        mbid: string
        album: {
          mbid: string
          "#text": string
        }
        name: string
        "@attr"?: {
          nowplaying: string
        }
        url: string
        date?: {
          uts: string
          "#text": string
        }
      }>
      "@attr": {
        user: string
        totalPages: string
        page: string
        total: string
        perPage: string
      }
    }
  }
  
 export  type SongData = {
    artist: {
        mbid: string
        "#text": string
      }
      streamable: string
      image: Array<{
        size: string
        "#text": string
      }>
      mbid: string
      album: {
        mbid: string
        "#text": string
      }
      name: string
      "@attr"?: {
        nowplaying: string
      }
      url: string
      date?: {
        uts: string
        "#text": string
      }
    }

    export type DetailedSongData = {
        track: {
          name: string
          mbid: string
          url: string
          duration: string
          streamable: {
            "#text": string
            fulltrack: string
          }
          listeners: string
          playcount: string
          artist: {
            name: string
            mbid: string
            url: string
          }
          album: {
            artist: string
            title: string
            mbid: string
            url: string
            image: Array<{
              "#text": string
              size: string
            }>
            "@attr": {
              position: string
            }
          }
          toptags: {
            tag: Array<{
              name: string
              url: string
            }>
          }
          wiki: {
            published: string
            summary: string
            content: string
          }
        }
      }
