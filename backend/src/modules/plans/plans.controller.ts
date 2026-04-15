import { Request, Response } from 'express';
import * as plansService from './plans.service';

export const listPlans = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 12));
    const sortBy = (req.query.sortBy as string) || 'popular';
    const currency = (req.query.currency as string) || 'USD';

    // Build filters object safely picking keys
    const filters = {
      region: req.query.region,
      countryCode: req.query.countryCode,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      minData: req.query.minData,
      unlimited: req.query.unlimited,
      validity: req.query.validity,
      speed: req.query.speed,
      search: req.query.q
    };

    const results = await plansService.getPlans(filters, sortBy, page, limit, currency);
    return res.json(results);
  } catch (error) {
    console.error('List plans error:', error);
    return res.status(500).json({ message: 'Internal error' });
  }
};

export const getPopular = async (req: Request, res: Response) => {
  try {
    const currency = (req.query.currency as string) || 'USD';
    const plans = await plansService.getPopularPlans(currency);
    return res.json(plans);
  } catch (error) {
    return res.status(500).json({ message: 'Internal error' });
  }
};

export const getBySlug = async (req: Request, res: Response) => {
  try {
    const currency = (req.query.currency as string) || 'USD';
    const plan = await plansService.getPlanBySlug(req.params.slug, currency);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    return res.json(plan);
  } catch (error) {
    return res.status(500).json({ message: 'Internal error' });
  }
};

export const getByCountry = async (req: Request, res: Response) => {
  try {
    req.query.countryCode = req.params.code; // Override for specific country
    return await listPlans(req, res); // Reuse list logic 
  } catch (error) {
    return res.status(500).json({ message: 'Internal error' });
  }
};

export const getByRegion = async (req: Request, res: Response) => {
  try {
    req.query.region = req.params.region.toUpperCase(); // Override specifically
    return await listPlans(req, res);
  } catch (error) {
    return res.status(500).json({ message: 'Internal error' });
  }
};
