# Tuna Widget 2 for OBS

- Code written in Vite Lit-Ts for faster performance
- Build configured with vite-plugin-singlefile to enable running localy

### How to build
- Clone the repo and run ```yarn```
- Test with ```yarn dev```
- Build with ```yarn build```

Building creates a single HTML file in the `dist` folder inside your project. vite-plugin-singlefile is required for this, building without it creates an HTML file along a JS file and a CSS file, if so, opening it directly will result in a CORS error, since VITE is not meant to run directly from the file but rather in a server. 

## How to use in OBS

Create a browser souce and check the `use localy` box, then point the source to the html file.
Make sure the Tuna plugin is running and the local server is active. 

If you are running a port other than the default you'll have to change it in `song-info.ts`
