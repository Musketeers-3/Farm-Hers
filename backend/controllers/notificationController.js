import Notification from '../models/Notification.js';

export const getNotifications = async (req, res) => {
  try {
    const { userId, read } = req.query;
    let query = {};

    if (userId) query.userId = userId;
    if (read === 'true') query.read = true;
    if (read === 'false') query.read = false;

    const notifications = await Notification.find(query).sort({ createdAt: -1 });
    res.json({ notifications });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const createNotification = async (req, res) => {
  try {
    const { userId, type, title, message, relatedId } = req.body;

    const notification = new Notification({
      userId,
      type,
      title,
      message,
      relatedId: relatedId || null,
      read: false,
      createdAt: new Date(),
    });

    await notification.save();
    res.status(201).json({
      id: notification._id.toString(),
      ...notification.toObject(),
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ notification });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ error: error.message });
  }
};