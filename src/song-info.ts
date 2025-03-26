import { CSSResultGroup, LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { Task } from '@lit/task'
import { DetailedSongData, MusicData, SongData } from "./types";
import { DateTime, Duration } from "luxon";

const apiKey = import.meta.env.VITE_API_KEY

@customElement('song-info')
export class SongInfo extends LitElement {
    private _InfoTask: Task;
    private _DurationTask: Task;

    songUpdateInterval: number | undefined;
    durationUpdateInterval: number | undefined;
    songInfo?: MusicData
    songArtist?: string
    songTitle?: string
    songAlbum?: string 
    songCoverURL: string = './placeholder.png'

    detailedSongData: DetailedSongData | undefined
    initialSongDuration: string = '0:00'
    songDuration: string = '0:00'
    now: DateTime = DateTime.now()

    constructor() {
        super();
        this.songUpdateInterval = undefined;
        this._InfoTask = new Task (this, {
            task: async () => {
               
                const musicInfo = await fetch(`http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=khaztaroth315&api_key=${apiKey}&format=json&limit=2`)
                if (!musicInfo.ok) {throw new Error(`${musicInfo.status}`); }
                const MusicData: MusicData = await musicInfo.json()
                this.songInfo = MusicData 

                const artistName = encodeURIComponent(this.songInfo?.recenttracks.track[0].artist["#text"]);
                const songName = encodeURIComponent(this.songInfo?.recenttracks.track[0].name);
    
                const songInfo = await fetch(`http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${apiKey}&artist=${artistName}&track=${songName}&format=json`)
                if (!songInfo.ok) {throw new Error(`${songInfo.status}`)}
                this.detailedSongData = await songInfo.json()
                this.initialSongDuration = this.detailedSongData?.track.duration || '0:00'

                //If information has changed, update the component                
                if (this.songTitle !== this.songInfo?.recenttracks.track[0].name) {
                    this.now = DateTime.now()
                    this.updateWithFade(this.songInfo)
                }           
            },

        })
        this._DurationTask = new Task(this, {
            task: async () => {
                this.songDuration = this.now.diff(DateTime.now().minus(Duration.fromObject({milliseconds: +this.initialSongDuration}))).toFormat('m:ss')
            }
        })
    }

    connectedCallback(): void {
        super.connectedCallback();
        this.songUpdateInterval = window.setInterval(() => this._InfoTask.run(), 5000);
        this.durationUpdateInterval = window.setInterval(() => this._DurationTask.run(), 1000);
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        if(this.songUpdateInterval !== undefined ) {
            clearInterval(this.songUpdateInterval);
        }
    }

    updateWithFade(data: MusicData) {
        const mainBlock = this.shadowRoot!.getElementById('mainBlock')

        var newSong: SongData = data.recenttracks.track[0]

        if (mainBlock) {
            mainBlock.classList.add('fade-out');

            //Info gets updated only after the element has faded out, creating a cleaner transition
            setTimeout(() => {
                this.songArtist = newSong.artist["#text"];
                this.songTitle = newSong.name;
                this.songCoverURL = newSong.image[3]["#text"];
                this.songAlbum = newSong.album["#text"];
                this.requestUpdate();
                setTimeout(() => {
                    mainBlock.classList.remove('fade-out');
                }, 50)
            }, 1000)
        }
    }

    render() {
        return html`
        <div class="bgBlock" id="bgBlock">
            <div class="mainBlock" id="mainBlock">
                <div class="imgBlock" id="imgBlock">
                <img src=${this.songCoverURL} alt=${`Album cover for ${this.songAlbum}`}>
                </div>
                <div class="infoBlock" id="infoBlock">
                    <h2>${this.songArtist}</h2>
                    <h1>${this.songTitle}</h1>
                </div>
                <h3>${this.songDuration}</h3>
        </div>
        </div>
        `
    }

    static styles?: CSSResultGroup | undefined = css`
        .bgBlock {
            margin: calc( 1rem + 0.5vw );
            padding: calc( 1rem + 0.5vw );

            border-radius: calc(1rem + 1vw );
            width: calc( 100vw - 5% );
            height: calc( 100vw - 20% );

            background-color: rgba(0, 0, 0, 0.75)

            }
        .imgBlock {
            --height-size: 300px;
            min-width: var(--height-size);
            max-width: var(--height-size);
        }
        .imgBlock img {
            --height-size: 300px ;
            height: var(--height-size);
            max-width: var(--height-size);
            border-radius: calc( 0.5rem + 0.5vw );
            
        }
        .infoBlock {
            height: calc( 100vw - 10% );
            width: 95vw;
            margin-left: 2rem;

            display: flex;
            flex-direction: column;

            text-shadow: 0.3rem 0.2rem 2rem #000000
        }
        .infoBlock h1 {
            margin: 0;
            padding: 0;
            font-size: calc(100% + 4vw);
            font-weight: 800;
        }
        .infoBlock h2 {
            margin: 0;
            padding: 0;
            font-size: calc(100% + 2.5vw);
            font-weight: 600;
        }
        .mainBlock {
            display: flex;
            align-items: center;

            width: calc( 100vw - 10% );
            height: calc( 100vw - 20% );

            transition: opacity 1s;
            opacity: 1;
        }
        .mainBlock h3 {
            font-size: calc(100% + 2.5vw);
            text-align: center;
            align-self: flex-end;
            margin-left: auto;
            margin-right: 0;
            font-weight: 400;
        }
        .fade-out {
            opacity: 0;
        }
    `
}

declare global {
    interface HTMLElementTagNameMap {
        'song-info': SongInfo
    }
}