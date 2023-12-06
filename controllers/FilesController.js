const dbClient = require('../utils/db');

class FilesController {
  static async postUpload(req, res) {
    const { userId } = req;
    const { name, type, parentId = '0', isPublic = false, data } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!name) {
      res.status(400).json({ error: 'Missing name' });
      return;
    }

    const acceptedTypes = ['folder', 'file', 'image'];
    if (!type || !acceptedTypes.includes(type)) {
      res.status(400).json({ error: 'Missing type' });
      return;
    }

    if ((type !== 'folder' && !data)) {
      res.status(400).json({ error: 'Missing data' });
      return;
    }

    try {
      const user = await dbClient.getUserById(userId);
      if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      if (parentId !== '0') {
        const parentFile = await dbClient.getFileById(parentId);
        if (!parentFile) {
          res.status(400).json({ error: 'Parent not found' });
          return;
        }

        if (parentFile.type !== 'folder') {
          res.status(400).json({ error: 'Parent is not a folder' });
          return;
        }
      }

      let localPath = '';
      if (type !== 'folder') {
        // The remaining code for storing the file locally...
        // Store the file in clea
        // Example:
        // const folderPath = process.env.FOLDER_PATH || 
        // ...
        // localPath = `${folderPath}/${someGeneratedUUID}`;
      }

      const newFile = await dbClient.createFile({
        userId,
        name,
        type,
        isPublic,
        parentId,
        localPath,
      });

      res.status(201).json(newFile);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = FilesController;
