import { Op } from 'sequelize';
import db from '../database/models';
import Socket from '../utils/socket';

const {
  Notification,
} = db;

/**
 * @class NotificationsControllers
 */
class NotificationsController {
  /**
   * @description Save notification on the database
   *
   * @param {Object} notificationData
   * @param {*} next - Next function
   *
   * @return {null} - null
   */
  static saveNotification(notificationData, next) {
    Notification.create({
      ...notificationData
    }).then((notification) => {
      Socket.send(notificationData.type, notification);
    }).catch(next);
  }

  /**
   * @description Save article notifications on the database
   *
   * @param {Integer} userId
   * @param {Object} notificationDetails
   * @param {Object} notificationData
   * @param {*} next - Next function
   *
   * @return {null} - null
   */
  static saveArticleNotification(userId, notificationDetails, notificationData, next) {
    Notification.bulkCreate(notificationData).then(() => {
      const notification = {
        userId,
        ...notificationDetails
      };

      Socket.send(notificationDetails.type, notification);
    }).catch(next);
  }

  /**
   * @description update notification status on the database
   *
   * @param {Object} req - HTTP Request
   * @param {Object} res - HTTP Response
   * @param {*} next - Next function
   *
   * @return {Object} Returned object
   */
  static updateNotification(req, res, next) {
    const { articleSlug, userId, commentId } = req.body;

    Notification.find({
      where: {
        articleSlug: {
          [Op.eq]: articleSlug,
        },
        userId: {
          [Op.eq]: userId
        },
        commentId: {
          [Op.eq]: !commentId ? null : commentId
        }
      }
    }).then((notification) => {
      if (!notification) {
        return res.status(404).json({
          message: 'Notification does not exist'
        });
      }

      if (req.body.userId !== req.decoded.userId) {
        return res.status(403).json({
          message: 'Access denied.'
        });
      }

      if (notification.status === 'read') {
        return res.status(400).json({
          message: 'Notification has already been read'
        });
      }

      notification.update({
        status: 'read'
      }).then(() => res.status(200).json({
        message: 'Notification has been read'
      })).catch(next);
    }).catch(next);
  }

  /**
   * @description update notification on the database
   *
   * @param {Object} req - HTTP Request
   * @param {Object} res - HTTP Response
   * @param {*} next - Next function
   *
   * @return {Object} Returned object
   */
  static updateUserNotificationStatus(req, res, next) {
    const {
      status,
    } = req.body.notification;

    const { decoded, userFound } = req;
    if (userFound.id !== decoded.userId) {
      return res.status(403).json({
        message: 'Access denied.'
      });
    }

    userFound.update({
      notificationStatus: status || userFound.notificationStatus,
    }).then((updatedNotification) => {
      const { notificationStatus } = updatedNotification;

      res.status(200).json({
        message: 'Notification updated successfully',
        notification: {
          status: notificationStatus
        }
      });
    }).catch(next);
  }

  /**
   * @description get notifications for login users database
   *
   * @param {Object} req - HTTP Request
   * @param {Object} res - HTTP Response
   * @param {*} next - Next function
   *
   * @return {Object} Returned object
   */
  static getNotifications(req, res, next) {
    const { page, limit } = req.query;
    const offset = parseInt((page - 1), 10) * limit;

    const { decoded, userFound } = req;
    if (userFound.id !== decoded.userId) {
      return res.status(403).json({
        message: 'Access denied.'
      });
    }

    if (userFound.notificationStatus === 'off') {
      return res.status(403).json({
        message: 'Access denied.'
      });
    }

    Notification.findAndCountAll({
      where: {
        userId: {
          [Op.eq]: req.decoded.userId
        },
        status: {
          [Op.eq]: 'unread'
        }
      },
      offset,
      limit,
    }).then((notifications) => {
      const { count } = notifications;
      const pageCount = Math.ceil(count / limit);

      if (notifications.rows.length === 0) {
        return res.status(200).json({
          message: 'No notification on this page',
          notifications: notifications.rows,
        });
      }

      return res.status(200).json({
        paginationMeta: {
          pageCount,
          totalCount: count,
          outputCount: notifications.rows.length,
          pageSize: limit,
          currentPage: page,
        },
        notifications: notifications.rows,
        notificationCount: notifications.count,
      });
    }).catch(next);
  }
}

export default NotificationsController;
