const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync(
  path.join(__dirname, '../protos/processing.proto')
);
const processingProto = grpc.loadPackageDefinition(packageDefinition);

const process = (call) => {
  let orderReq = call.request;
  let time = orderReq.orderId * 1000 + orderReq.recipeId * 10;
  call.write({ status: 2 });
  setTimeout(() => {
    call.write({ status: 3 });
    setTimeout(() => {
      call.write({ status: 4 });
      call.end();
    }, time);
  }, time);
};
const server = new grpc.Server();
server.addService(processingProto.Processing.service, { process });
server.bindAsync(
  '0.0.0.0:50052',
  grpc.ServerCredentials.createInsecure(),
  () => {
    server.start();
  }
);
