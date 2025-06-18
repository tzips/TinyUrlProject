// src/routs/linkRouts.js
import express from 'express';
import {
  createShortUrl,
  redirectToOriginalUrl,
  getLinks,
  getLinkById,
  updateLink,
  deleteLink,
  getLinkClicks,      // 👈 אל תשכחי אותו
  getClickAnalytics
} from '../controllers/linkController.js';
// ייבוא הפונקציות מהקונטרולר

const router = express.Router();

// נתיבים עבור קישורים (Links)
// POST /api/links - ליצירת קישור מקוצר חדש
// GET /api/links - לשליפת כל הקישורים
router.route('/').post(createShortUrl).get(getLinks);

// GET /api/links/:shortUrlCode - לביצוע הפניה (Redirect) וספירת קליקים
router.route('/:shortUrlCode').get(redirectToOriginalUrl);

// נתיבים עבור פעולות CRUD על קישור ספציפי לפי ID
// GET /api/links/id/:id - שליפת קישור לפי ID
// PUT /api/links/id/:id - עדכון קישור לפי ID
// DELETE /api/links/id/:id - מחיקת קישור לפי ID
router.route('/id/:id').get(getLinkById).put(updateLink).delete(deleteLink);
// src/routs/linkRouts.js
router.route('/id/:id/clicks').get(getLinkClicks);/*החזרת פרטי ההקלקה*/
router.route('/id/:id/analytics').get(getClickAnalytics);/*פילוח מקור הקליק*/


export default router;