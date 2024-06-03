import { CSSResultGroup, LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { Task } from '@lit/task'

type info = {
    album: string
    artists: Array<string>
    cover_path: string
    cover_url: string
    duration: number
    lyrics: string
    playback_date: string
    playback_time: string
    status: string
    status_id: number
    title: string
  };

@customElement('song-info')
export class SongInfo extends LitElement {
    private _InfoTask: Task;

    intervalid: number | undefined;
    songInfo?: info
    songArtist?: string[]
    songTitle?: string
    songAlbum?: string
    songCoverURL: string = ''

    constructor() {
        super();
        this.intervalid = undefined;
        this._InfoTask = new Task (this, {
            task: async () => {
               
                const response = await fetch("http://localhost:1608")
                if (!response.ok) {throw new Error(`${response.status}`); }
                const data: info = await response.json()
                this.songInfo = data

                //If information has changed, update the component                
                if (this.songTitle !== this.songInfo.title) {
                    this.updateWithFade(this.songInfo)
                }               
            },
        })
    }

    connectedCallback(): void {
        super.connectedCallback();
        this.intervalid = window.setInterval(() => this._InfoTask.run(), 5000);
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        if(this.intervalid !== undefined ) {
            clearInterval(this.intervalid);
        }
    }

    updateWithFade(data: {artists: string[], title: string, cover_path: string, album: string}) {
        const mainBlock = this.shadowRoot!.getElementById('mainBlock')

        if (mainBlock) {
            mainBlock.classList.add('fade-out');

            //Info gets updated only after the element has faded out, creating a cleaner transition
            setTimeout(() => {
                this.songArtist = data.artists;
                this.songTitle = data.title;
                this.songCoverURL = data.cover_path;
                this.songAlbum = data.album;
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
        </div>
        </div>
        `
    }

    static styles?: CSSResultGroup | undefined = css`
        .bgBlock {
            margin: calc( 1rem + 0.5vw );
            padding: calc( 1rem + 0.5vw );

            border-radius: calc(1rem + 1vw );
            width: calc( 100vw - 10% );
            height: calc( 100vw - 20% );

            background-color: rgba(0, 0, 0, 0.75)

            }
        .imgBlock img {
            height: calc(85% + 2vw);
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