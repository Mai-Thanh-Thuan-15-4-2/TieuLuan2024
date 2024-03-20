class HandleDataMongoDB {
    constructor(mongoDBConnect) {
      this.collectionName = 'EXAM_COLLECTION';
      this.mongoDBConnect = mongoDBConnect;
      this.collection = this.mongoDBConnect.db.collection(this.collectionName);
    }
  
    async getHeader() {
      try {
        const document = await this.collection.findOne({});
        return document.Header;
      } catch (error) {
        console.error('Error getting header:', error);
        throw error;
      }
    }
  
    async getTitle() {
      try {
        const document = await this.collection.findOne({});
        return document.Header.title;
      } catch (error) {
        console.error('Error getting title:', error);
        throw error;
      }
    }
  
    async getPara() {
      try {
        const document = await this.collection.findOne({});
        return document.Header.paragraph;
      } catch (error) {
        console.error('Error getting paragraph:', error);
        throw error;
      }
    }
  
    async updateTitle(newTitle) {
      try {
        await this.collection.updateOne({}, { $set: { 'Header.title': newTitle } });
        console.log('Title updated successfully');
      } catch (error) {
        console.error('Error updating title:', error);
        throw error;
      }
    }
  
    async updatePara(newPara) {
      try {
        await this.collection.updateOne({}, { $set: { 'Header.paragraph': newPara } });
        console.log('Paragraph updated successfully');
      } catch (error) {
        console.error('Error updating paragraph:', error);
        throw error;
      }
    }
  }
  
  module.exports = HandleDataMongoDB;
  