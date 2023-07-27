const net = require("node:net");

const isEven = (number) => number % 2 === 0;

const onConnection = (socket, id) => {
  socket.setEncoding("utf-8");

  console.log(`Connected with client ${id}`);
  socket.write("Connected with server\n");

  socket.on("data", (data) => {
    let text = "It is an odd number\n";
    if (isEven(+data)) text = "It is an even number\n";
    socket.write(text);
  });

  socket.on("end", () => console.log(`Client ${id} closed`));
};

const main = () => {
  let id = 0;
  const server = net.createServer();

  //so the server starts listening in the port when we call server.listen and give a port number and it call the call back given to it
  server.listen(8000, () => {
    console.log("Server started listening...");
  });

  server.on("connection", (socket) => onConnection(socket, ++ id));
};

main();
