const net = require("node:net");

const main = () => {
  const server = net.createServer();
  server.listen(9000);

  server.on("connection", (socket) => {
    console.log("client connected");
    socket.setEncoding("utf-8");

    socket.on("data", (data) => {
      console.log(`<< ${data}`);
      socket.write(`>> ${data}`);
      socket.end();
    });

    socket.on("end", () => console.log("connection closed from server"));
  });
};

main();
