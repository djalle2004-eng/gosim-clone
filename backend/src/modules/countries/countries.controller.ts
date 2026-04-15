import { Request, Response } from 'express';
import * as countriesService from './countries.service';

export const getAll = async (req: Request, res: Response) => {
  try {
    const countries = await countriesService.getCountries();
    return res.json(countries);
  } catch (error) {
    return res.status(500).json({ message: 'Internal error' });
  }
};

export const getPopular = async (req: Request, res: Response) => {
  try {
    const countries = await countriesService.getPopularCountries();
    return res.json(countries);
  } catch (error) {
    return res.status(500).json({ message: 'Internal error' });
  }
};

export const getByCode = async (req: Request, res: Response) => {
  try {
    const country = await countriesService.getCountryByCode(req.params.code);
    if (!country) return res.status(404).json({ message: 'Country not found' });
    return res.json(country);
  } catch (error) {
    return res.status(500).json({ message: 'Internal error' });
  }
};

export const search = async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string;
    if (!q) return res.status(400).json({ message: 'Search query required' });

    const results = await countriesService.searchCountries(q);
    return res.json(results);
  } catch (error) {
    return res.status(500).json({ message: 'Internal error' });
  }
};
