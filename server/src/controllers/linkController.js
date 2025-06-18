// src/controllers/linkController.js
import Link from '../models/Link.js'; // ייבוא מודל הקישור
import { nanoid } from 'nanoid'; // ייבוא nanoid ליצירת קיצורים ייחודיים

// @desc    קיצור URL חדש
// @route   POST /api/links
// @access  Public (ניתן להוסיף אימות בעתיד)
const createShortUrl = async (req, res) => {
  const { originalUrl } = req.body; // קבלת ה-URL המקורי מגוף הבקשה

  // וודא שה-originalUrl סופק
  if (!originalUrl) {
    return res.status(400).json({ message: 'Original URL is required' });
  }

  try {
    // בדוק אם ה-URL המקורי כבר קיים ב-DB
    const existingLink = await Link.findOne({ originalUrl });
    if (existingLink) {
      return res.status(200).json({ // מחזיר קישור קיים במקום ליצור חדש
        message: 'Short URL already exists for this original URL',
        shortUrl: existingLink.shortUrl,
        originalUrl: existingLink.originalUrl,
      });
    }

    // יצירת קיצור ייחודי
    const shortUrl = nanoid(7); // יצירת קיצור באורך 7 תווים (ניתן לשנות אורך)

    // יצירת אובייקט קישור חדש
    const newLink = new Link({
      originalUrl,
      shortUrl,
      clicks: 0, // אתחול מונה קליקים
    });

    // שמירת הקישור במסד הנתונים
    const createdLink = await newLink.save();

    res.status(201).json({
      message: 'Short URL created successfully',
      _id: createdLink._id,
      originalUrl: createdLink.originalUrl,
      shortUrl: createdLink.shortUrl,
      clicks: createdLink.clicks,
      createdAt: createdLink.createdAt,
    });
  } catch (error) {
    console.error(`Error creating short URL: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    הפניה ל-URL מקורי וספירת קליקים (Redirect & Tracking)
// @route   GET /api/links/:shortUrlCode
// @access  Public
const redirectToOriginalUrl = async (req, res) => {
  const { shortUrlCode } = req.params;

  try {
    const link = await Link.findOne({ shortUrl: shortUrlCode });

    if (!link) {
      return res.status(404).json({ message: 'Short URL not found' });
    }

    // שליפת פרמטר הטירגוט מה-Query String
    const targetParamName = link.targetParamName || 't';
    const targetParamValue = req.query[targetParamName] || '';

    // שמירת הקליק עם מידע נוסף
    link.clicks.push({
      insertedAt: new Date(),
      ipAddress: req.ip,
      targetParamValue: targetParamValue
    });

    await link.save();

    return res.redirect(link.originalUrl);
  } catch (error) {
    console.error(`Error redirecting URL: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// @desc    שליפת כל הקישורים
// @route   GET /api/links
// @access  Public (ניתן להוסיף אימות למנהלים)
const getLinks = async (req, res) => {
  try {
    const links = await Link.find({}); // שליפת כל הקישורים
    res.status(200).json(links);
  } catch (error) {
    console.error(`Error fetching links: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    שליפת קישור לפי ID (לצרכי ניהול/עדכון)
// @route   GET /api/links/id/:id
// @access  Public (ניתן להוסיף אימות)
const getLinkById = async (req, res) => {
  const { id } = req.params;

  try {
    const link = await Link.findById(id); // שליפת קישור לפי ID

    if (link) {
      res.status(200).json(link);
    } else {
      res.status(404).json({ message: 'Link not found' });
    }
  } catch (error) {
    console.error(`Error fetching link by ID: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    עדכון קישור לפי ID
// @route   PUT /api/links/id/:id
// @access  Public (ניתן להוסיף אימות)
const updateLink = async (req, res) => {
  const { id } = req.params;
  const { originalUrl } = req.body; // מקבל רק originalUrl לעדכון

  try {
    const link = await Link.findById(id);

    if (link) {
      link.originalUrl = originalUrl || link.originalUrl; // עדכן אם סופק

      const updatedLink = await link.save();
      res.status(200).json({
        message: 'Link updated successfully',
        _id: updatedLink._id,
        originalUrl: updatedLink.originalUrl,
        shortUrl: updatedLink.shortUrl,
        clicks: updatedLink.clicks,
      });
    } else {
      res.status(404).json({ message: 'Link not found' });
    }
  } catch (error) {
    console.error(`Error updating link: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    מחיקת קישור לפי ID
// @route   DELETE /api/links/id/:id
// @access  Public (ניתן להוסיף אימות)
const deleteLink = async (req, res) => {
  const { id } = req.params;

  try {
    const link = await Link.findById(id);

    if (link) {
      await link.deleteOne(); // שימוש ב-deleteOne()
      res.status(200).json({ message: 'Link removed successfully' });
    } else {
      res.status(404).json({ message: 'Link not found' });
    }
  } catch (error) {
    console.error(`Error deleting link: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// getLinkClicks
const getLinkClicks = async (req, res) => {
  const { id } = req.params;

  try {
    const link = await Link.findById(id);
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    res.status(200).json(link.clicks);
  } catch (error) {
    console.error(`Error fetching clicks: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// @desc    קבלת פילוח של קליקים לפי מקורות target
// @route   GET /api/links/id/:id/analytics
const getClickAnalytics = async (req, res) => {
  const { id } = req.params;

  try {
    const link = await Link.findById(id);

    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    // פילוח לפי targetParamValue
    const analytics = {};
    link.clicks.forEach(click => {
      const key = click.targetParamValue || 'unknown';
      analytics[key] = (analytics[key] || 0) + 1;
    });

    res.status(200).json({ shortUrl: link.shortUrl, analytics });
  } catch (error) {
    console.error(`Error in analytics: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



export {
  createShortUrl,
  redirectToOriginalUrl,
  getLinks,
  getLinkById,
  updateLink,
  deleteLink,
  getLinkClicks,
  getClickAnalytics
};