const HandleDataMongoDB = require('./handleDataMongoDB');
const MongoDBConnect = require('./MongoDBConnect');

const mongoDBConnect = new MongoDBConnect();

async function main() {
  try {

    await mongoDBConnect.connect();

    const handleDataMongoDB = new HandleDataMongoDB(mongoDBConnect);
    const header = await handleDataMongoDB.getHeader();
    console.log('Header:', header);

    await handleDataMongoDB.updateTitle('Hệ thống tài liệu & kiểm tra trực tuyến');

    const updatedHeader = await handleDataMongoDB.getHeader();
    console.log('Updated Header:', updatedHeader);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoDBConnect.close();
  }
}

main();
