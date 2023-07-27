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

const startChatBot = (socket, clients) => {
  socket.setEncoding("utf-8");

  socket.on("data", (data) => {
    clients.forEach((client) => {
      if (client !== socket) client.write(`${data.trim()}\n`);
    });
  });
};

const main = () => {
  const server = net.createServer();
  let count = 0;

  server.listen(8000, () => {
    console.log("Server started listening...");
  });

  server.on("connection", (socket) => {
    socket.setEncoding("utf-8");

    socket.write("Guess a number\n");

    socket.on("data", (data) => {
      count++;
      if (count === 5) {
        socket.write("You lose\n");
        socket.end();
      }
      console.log(data);
    });
  });
};

main();
