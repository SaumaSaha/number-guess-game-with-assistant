const net = require("node:net");

const main = () => {
  const client = net.createConnection(9000);
  client.setEncoding("utf-8");

  client.on("connect", () => {
    console.log("connected with server");
    client.on("data", (data) => {
      console.log(data);
    });

    client.write("1");
  });
};

main();
