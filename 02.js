import { Application, send } from "https://deno.land/x/oak/mod.ts";

const app = new Application();

// Define a map that associates room codes with room names
const roomMap = new Map([
  [
 
"e320", "多媒體教室"],
  [
 
"e319", "嵌入式實驗室"],
  // Add more room mappings as needed
]);

app.use(async (ctx) => {
  console.log('path=', ctx.request.url.pathname);

  if (ctx.request.url.pathname === '/nqu/') {
    ctx.
   
response.body = `
      <html>
        <body>
          <a href="https://www.nqu.edu.tw/">NQU</a>
        </body>
      </html>
    `;
  } else if (ctx.request.url.pathname === '/nqu/csie/') {
    ctx.
   
response.body = `
      <html>
        <body>
          <a href="https://csie.nqu.edu.tw/">NQU CSIE</a>
        </body>
      </html>
    `;
  } else if (ctx.request.url.pathname === '/to/nqu/') {
    ctx.response.redirect('https://www.nqu.edu.tw/');
  } else if (ctx.request.url.pathname === '/to/nqu/csie/') {
    ctx.response.redirect('https://csie.nqu.edu.tw/');
  } else if (ctx.request.url.pathname.startsWith('/room/')) {
    // If the path starts with "/room/", extract the room code from the path
    
   
const roomCode = ctx.request.url.pathname.slice(6); // Remove "/room/" from the path

    

   
// Look up the room name from the map
    const roomName = roomMap.get(roomCode);

    if (roomName) {
      ctx.response.body = `<html><body>${roomName}</body></html>`;
    } 
    }
else {
      // If the room code is not found in the map, display a message
      ctx.response.body = `<html><body>Room not found</body></html>`;
    }
  }
});

console.log('Server started at: http://127.0.0.1:8000');
await app.listen({ port: 8000 });
