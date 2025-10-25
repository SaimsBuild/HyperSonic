import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import webpush from "web-push";
import { insertPushSubscriptionSchema } from "@shared/schema";

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || "BB8SWhWBDGWUDuB1A5weQ4W882B9LtwvoWmWz0zPLyIrgbQQpFkWmknQvwe_4JHSkSNhpLPn-bUwzOB2x6ki1Gw";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || "z29G88i-gu5jeLHP5AF39CZTA-853ewiVbSXenK8OVU";

webpush.setVapidDetails(
  'mailto:hypersonic@example.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

export async function registerRoutes(app: Express): Promise<Server> {
  app.get('/api/push/vapid-public-key', (req, res) => {
    res.json({ publicKey: VAPID_PUBLIC_KEY });
  });

  app.post('/api/push/subscribe', async (req, res) => {
    try {
      const subscriptionData = insertPushSubscriptionSchema.parse(req.body);
      const subscription = await storage.createSubscription(subscriptionData);
      res.json(subscription);
    } catch (error) {
      console.error('Error subscribing to push:', error);
      res.status(400).json({ error: 'Invalid subscription data' });
    }
  });

  app.post('/api/push/send', async (req, res) => {
    try {
      const { title, body, url, tag } = req.body;
      
      const payload = JSON.stringify({
        title: title || 'HyperSonic Notification',
        body: body || 'You have a new notification',
        url: url || '/',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag
      });

      const subscriptions = await storage.getAllSubscriptions();
      
      const sendPromises = subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.keys.p256dh,
                auth: sub.keys.auth
              }
            },
            payload
          );
        } catch (error: any) {
          if (error.statusCode === 410) {
            await storage.deleteSubscription(sub.endpoint);
          }
          console.error('Error sending to subscription:', error);
        }
      });

      await Promise.all(sendPromises);
      
      res.json({ success: true, sent: subscriptions.length });
    } catch (error) {
      console.error('Error sending push notifications:', error);
      res.status(500).json({ error: 'Failed to send notifications' });
    }
  });

  app.delete('/api/push/unsubscribe', async (req, res) => {
    try {
      const { endpoint } = req.body;
      const deleted = await storage.deleteSubscription(endpoint);
      res.json({ success: deleted });
    } catch (error) {
      console.error('Error unsubscribing:', error);
      res.status(500).json({ error: 'Failed to unsubscribe' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
