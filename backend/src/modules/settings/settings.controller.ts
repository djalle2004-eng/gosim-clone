import { Request, Response } from 'express';
import {
  getAllSettings,
  upsertSettings,
  testConnection,
  PROVIDERS_REGISTRY,
} from './settings.service';

/**
 * GET /api/admin/settings
 * Returns all settings grouped by category, with secrets masked.
 */
export const getSettings = async (req: Request, res: Response) => {
  try {
    const settings = await getAllSettings();
    res.json({ success: true, data: settings });
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/admin/settings/registry
 * Returns the static provider registry (for building UI forms).
 */
export const getRegistry = async (_req: Request, res: Response) => {
  res.json({ success: true, data: PROVIDERS_REGISTRY });
};

/**
 * PUT /api/admin/settings/:category/:provider
 * Upsert settings for a specific provider.
 */
export const updateProviderSettings = async (req: Request, res: Response) => {
  try {
    const { category, provider } = req.params;
    const { keys, isActive } = req.body;

    if (!keys || !Array.isArray(keys)) {
      return res.status(400).json({ success: false, message: 'Le champ "keys" est requis (tableau).' });
    }

    const adminUserId = (req as any).user?.id || 'unknown';
    const result = await upsertSettings(category, provider, keys, isActive ?? true, adminUserId);

    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error updating settings:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/admin/settings/test/:category/:provider
 * Test connectivity for a provider.
 */
export const testProviderConnection = async (req: Request, res: Response) => {
  try {
    const { category, provider } = req.params;
    const result = await testConnection(category, provider);
    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error testing connection:', error);
    res.status(500).json({
      success: false,
      data: { success: false, message: error.message },
    });
  }
};
