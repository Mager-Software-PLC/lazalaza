const Video = require('../models/Video');

// Get all active videos (public)
exports.getVideos = async (req, res, next) => {
  try {
    const { active } = req.query;
    const where = active !== undefined ? { is_active: active === 'true' } : { is_active: true };

    const videos = await Video.findAll({
      where,
      order: [['order_index', 'ASC'], ['created_at', 'DESC']],
    });
    res.json(videos);
  } catch (error) {
    next(error);
  }
};

// Get all videos (admin - includes inactive)
exports.getAllVideos = async (req, res, next) => {
  try {
    const videos = await Video.findAll({
      order: [['order_index', 'ASC'], ['created_at', 'DESC']],
    });
    res.json(videos);
  } catch (error) {
    next(error);
  }
};

// Get video by ID
exports.getVideoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const video = await Video.findByPk(id);

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json(video);
  } catch (error) {
    next(error);
  }
};

// Create video (admin)
exports.createVideo = async (req, res, next) => {
  try {
    const video = await Video.create(req.body);
    res.status(201).json(video);
  } catch (error) {
    next(error);
  }
};

// Update video (admin)
exports.updateVideo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const video = await Video.findByPk(id);

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    await video.update(req.body);
    res.json(video);
  } catch (error) {
    next(error);
  }
};

// Delete video (admin)
exports.deleteVideo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const video = await Video.findByPk(id);

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    await video.destroy();
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Reorder videos (admin)
exports.reorderVideos = async (req, res, next) => {
  try {
    const { videos } = req.body; // Array of { id, order_index }

    const updates = videos.map(({ id, order_index }) =>
      Video.update({ order_index }, { where: { id } })
    );

    await Promise.all(updates);
    res.json({ message: 'Videos reordered successfully' });
  } catch (error) {
    next(error);
  }
};

