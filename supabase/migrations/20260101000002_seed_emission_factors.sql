-- =============================================================================
-- Migration: 20260101000002_seed_emission_factors.sql
-- Description: Verifiable emission factors from DEFRA 2024, CEA India 2023, US EPA, IPCC AR6
-- =============================================================================

INSERT INTO public.emission_factors 
(id, category, name, co2e_per_unit, unit, region, year, source, source_url, confidence_interval, notes)
VALUES
-- Transport Factors
('trns-car-petrol-in', 'transport', 'Passenger Car (Petrol, Average Engine)', 0.1705, 'km', 'IN', 2024, 'DEFRA 2024 / ARAI India', 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024', 0.10, 'Average passenger vehicle, petrol powertrain'),
('trns-car-diesel-in', 'transport', 'Passenger Car (Diesel, Medium)', 0.1710, 'km', 'IN', 2024, 'DEFRA 2024', 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024', 0.10, 'Diesel passenger vehicle'),
('trns-car-ev-in', 'transport', 'Electric Car (Grid Charged, India CEA)', 0.0930, 'km', 'IN', 2023, 'CEA India CO2 Baseline Database v19', 'https://cea.nic.in/cdm-co2-baseline-database', 0.12, 'Calculated at 130 Wh/km on average Indian national grid emission factor (0.716 kg CO2/kWh)'),
('trns-2w-petrol-in', 'transport', 'Two-Wheeler Motorcycle / Scooter (Petrol 100-150cc)', 0.0435, 'km', 'IN', 2024, 'India GHG Platform / DEFRA 2024', 'https://www.indiaghgplatform.org/', 0.08, 'Standard Indian commuter motorbike or scooter'),
('trns-2w-ev-in', 'transport', 'Electric Scooter (Grid Charged, India CEA)', 0.0180, 'km', 'IN', 2023, 'CEA India / BEE 2023', 'https://cea.nic.in/cdm-co2-baseline-database', 0.10, 'Estimated at 25 Wh/km on Indian grid factor'),
('trns-auto-cng-in', 'transport', 'Auto-Rickshaw (CNG / Shared Passenger)', 0.0380, 'passenger_km', 'IN', 2023, 'TERI India / CSTEP', 'https://www.teriin.org/', 0.15, 'Average occupancy of 2.2 passengers'),
('trns-metro-in', 'transport', 'Metro Rail / Rapid Urban Transit', 0.0150, 'passenger_km', 'IN', 2023, 'DMRC Annual Sustainability Report / DEFRA 2024', 'https://www.delhimetrorail.com/', 0.10, 'Regenerative braking mass transit'),
('trns-bus-diesel-in', 'transport', 'City Transit Bus (Diesel)', 0.0890, 'passenger_km', 'GLOBAL', 2024, 'DEFRA 2024', 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024', 0.12, 'Average municipal bus load factor'),
('trns-bus-electric-in', 'transport', 'City Transit Bus (Electric)', 0.0320, 'passenger_km', 'IN', 2023, 'CEA India / CESL e-Bus Benchmark', 'https://cea.nic.in/', 0.12, 'Electric city bus passenger-km'),
('trns-train-electric-in', 'transport', 'Intercity Train (Indian Railways Electric)', 0.0210, 'passenger_km', 'IN', 2023, 'Indian Railways Sustainability Disclosure', 'https://indianrailways.gov.in/', 0.15, 'Broad gauge electrified route average'),
('trns-flight-domestic', 'transport', 'Domestic Flight (<1000 km, with Radiative Forcing)', 0.2450, 'passenger_km', 'GLOBAL', 2024, 'DEFRA 2024', 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024', 0.15, 'Includes IPCC radiative forcing multiplier 1.9x'),
('trns-flight-longhaul', 'transport', 'Long-Haul Flight (>3700 km, with Radiative Forcing)', 0.1930, 'passenger_km', 'GLOBAL', 2024, 'DEFRA 2024', 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024', 0.15, 'Economy seating class with high altitude contrail factor'),
('trns-walk-cycle', 'transport', 'Walking & Active Bicycle Commute', 0.0000, 'km', 'GLOBAL', 2024, 'IPCC AR6 WGIII', 'https://www.ipcc.ch/report/ar6/wg3/', 0.00, 'Direct zero operational tailpipe emissions'),

-- Energy Factors
('nrg-grid-elec-in', 'energy', 'Grid Electricity (India National Weighted Average)', 0.7160, 'kWh', 'IN', 2023, 'CEA India CO2 Baseline Database v19', 'https://cea.nic.in/cdm-co2-baseline-database', 0.05, 'Combined margin grid intensity across all regional grids'),
('nrg-grid-elec-us', 'energy', 'Grid Electricity (US eGRID National Average)', 0.3860, 'kWh', 'US', 2024, 'US EPA eGRID 2024', 'https://www.epa.gov/egrid', 0.05, 'US annual non-baseload and baseload generation average'),
('nrg-grid-elec-eu', 'energy', 'Grid Electricity (EU-27 Average)', 0.2300, 'kWh', 'EU', 2023, 'European Environment Agency (EEA)', 'https://www.eea.europa.eu/', 0.05, 'EU electricity production greenhouse gas intensity'),
('nrg-lpg-cooking-in', 'energy', 'LPG Liquefied Petroleum Gas Cylinder', 2.9830, 'kg', 'GLOBAL', 2024, 'DEFRA 2024 / IPCC AR6', 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024', 0.05, '14.2 kg domestic cooking gas cylinder benchmark'),
('nrg-png-naturalgas', 'energy', 'Piped Natural Gas (PNG)', 2.0200, 'm3', 'GLOBAL', 2024, 'DEFRA 2024', 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024', 0.05, 'City gas distribution network'),
('nrg-solar-rooftop', 'energy', 'Rooftop Solar PV (Life-cycle Embodied)', 0.0410, 'kWh', 'GLOBAL', 2023, 'NREL / IPCC Life Cycle Assessment', 'https://www.nrel.gov/analysis/life-cycle-assessment.html', 0.15, 'Full life-cycle manufacturing and end-of-life amortization'),

-- Food Factors
('food-beef-ruminant', 'food', 'Beef / Ruminant Meat', 27.0000, 'kg', 'GLOBAL', 2018, 'Poore & Nemecek (Science 2018) / IPCC AR6', 'https://science.sciencemag.org/content/360/6392/987', 0.15, 'High enteric fermentation and feed conversion'),
('food-mutton-goat', 'food', 'Mutton / Goat Meat', 24.5000, 'kg', 'GLOBAL', 2024, 'DEFRA 2024 / Poore & Nemecek', 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024', 0.15, 'Small ruminant pastoral and intensive systems'),
('food-poultry-chicken', 'food', 'Poultry / Chicken Meat', 6.1000, 'kg', 'GLOBAL', 2024, 'DEFRA 2024 / FAO', 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024', 0.10, 'Standard broiler production system'),
('food-dairy-milk', 'food', 'Cow Dairy Milk', 1.3900, 'liter', 'GLOBAL', 2024, 'DEFRA 2024', 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024', 0.10, 'Whole pasteurized cow milk'),
('food-plant-milk', 'food', 'Plant Milk (Soy / Oat / Almond)', 0.3800, 'liter', 'GLOBAL', 2023, 'Poore & Nemecek 2018', 'https://science.sciencemag.org/content/360/6392/987', 0.12, 'Commercial non-dairy milk alternative'),
('food-eggs', 'food', 'Chicken Eggs', 4.6700, 'kg', 'GLOBAL', 2024, 'DEFRA 2024', 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024', 0.10, 'Shell eggs (approx 16 eggs per kg)'),
('food-rice-paddy', 'food', 'Rice (Methane Intensive Cultivation)', 2.7000, 'kg', 'GLOBAL', 2021, 'IPCC AR6 / IRRI', 'https://www.ipcc.ch/', 0.12, 'Continuously flooded paddy fields producing CH4'),
('food-millets-pulses', 'food', 'Lentils / Dal / Millets (Ragi, Jowar)', 0.8500, 'kg', 'IN', 2023, 'ICRISAT / Poore & Nemecek', 'https://www.icrisat.org/', 0.10, 'Drought-tolerant leguminous and coarse grains'),
('food-vegetables-seasonal', 'food', 'Local Seasonal Field Vegetables', 0.4000, 'kg', 'GLOBAL', 2024, 'DEFRA 2024', 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024', 0.15, 'Unheated local open field seasonal crops'),

-- Shopping Factors
('shop-apparel-virgin', 'shopping', 'Fast Fashion Cotton / Synthetic Garment (Virgin)', 12.5000, 'item', 'GLOBAL', 2023, 'WRAP UK / Ellen MacArthur Foundation', 'https://wrap.org.uk/', 0.20, 'Cradle-to-consumer virgin textile supply chain'),
('shop-apparel-thrift', 'shopping', 'Second-hand / Pre-loved Garment', 1.2000, 'item', 'GLOBAL', 2023, 'WRAP UK', 'https://wrap.org.uk/', 0.15, 'Laundering and transport logistics only (90% savings)'),
('shop-phone-new', 'shopping', 'New Smartphone (Cradle-to-Gate Manufacturing)', 70.0000, 'device', 'GLOBAL', 2023, 'Apple / Fairphone Environmental LCA', 'https://www.apple.com/environment/', 0.10, 'Embodied emissions in silicon fabrication and casing'),
('shop-phone-refurb', 'shopping', 'Refurbished Smartphone', 14.0000, 'device', 'GLOBAL', 2022, 'ADEME France', 'https://presse.ademe.fr/', 0.12, 'Refurbishment and distribution amortization'),

-- Waste Factors
('wst-landfill-general', 'waste', 'Landfilled Mixed Solid Waste', 0.5800, 'kg', 'GLOBAL', 2024, 'US EPA WARM 2024 / IPCC AR6', 'https://www.epa.gov/warm', 0.15, 'Anaerobic decomposition generating methane gas'),
('wst-composting-organic', 'waste', 'Aerobic Compost (Home / Community)', 0.0800, 'kg', 'GLOBAL', 2024, 'US EPA WARM 2024', 'https://www.epa.gov/warm', 0.15, 'Controlled aerobic organic degradation'),
('wst-plastic-bottle-pet', 'waste', 'Single-Use 1L PET Bottle', 0.0828, 'item', 'GLOBAL', 2024, 'DEFRA 2024', 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024', 0.10, 'Virgin polymer production, blow molding and disposal')
ON CONFLICT (id) DO UPDATE SET
    co2e_per_unit = EXCLUDED.co2e_per_unit,
    source = EXCLUDED.source,
    source_url = EXCLUDED.source_url,
    confidence_interval = EXCLUDED.confidence_interval,
    notes = EXCLUDED.notes;

-- -----------------------------------------------------------------------------
-- BASELINE ACTIVITIES SEEDING
-- -----------------------------------------------------------------------------
INSERT INTO public.activities
(id, category, name, description, default_unit, emission_factor_id, default_frequency_per_week, default_quantity)
VALUES
('act-petrol-commute', 'transport', 'Solo Petrol Car Commute', 'Driving a petrol vehicle to work or college', 'km', 'trns-car-petrol-in', 5, 15.0),
('act-diesel-commute', 'transport', 'Solo Diesel Car Commute', 'Driving a diesel car for daily commute', 'km', 'trns-car-diesel-in', 5, 20.0),
('act-2w-commute', 'transport', 'Petrol Two-Wheeler Commute', 'Riding a 110-150cc scooter/motorcycle', 'km', 'trns-2w-petrol-in', 6, 12.0),
('act-flight-domestic', 'transport', 'Domestic Flights (Short-Haul)', 'Flights between major cities', 'passenger_km', 'trns-flight-domestic', 1, 500.0),
('act-ac-cooling', 'energy', 'Air Conditioning (Standard 3-Star Split AC)', 'Cooling bedroom/office during hot months', 'kWh', 'nrg-grid-elec-in', 7, 6.0),
('act-water-heater-elec', 'energy', 'Electric Storage Geyser', 'Heating bath water using immersion/geyser', 'kWh', 'nrg-grid-elec-in', 7, 3.0),
('act-lpg-cooking', 'energy', 'Cooking with LPG Cylinders', 'Stove gas consumption for family meals', 'kg', 'nrg-lpg-cooking-in', 7, 0.45),
('act-meat-diet', 'food', 'Non-Vegetarian Meals (Chicken / Mutton)', 'Eating meat courses several times a week', 'kg', 'food-poultry-chicken', 4, 0.25),
('act-dairy-heavy', 'food', 'Daily Dairy Consumption', 'Milk, paneer, and curd consumption', 'liter', 'food-dairy-milk', 7, 1.0),
('act-rice-heavy', 'food', 'Polished White Rice Staple', 'Daily white rice portions', 'kg', 'food-rice-paddy', 7, 0.35),
('act-fast-fashion', 'shopping', 'Fast Fashion & Online Clothing Purchases', 'Buying brand new apparel monthly', 'item', 'shop-apparel-virgin', 1, 3.0),
('act-new-electronics', 'shopping', 'Smartphone & Gadget Replacement', 'Upgrading tech devices yearly', 'device', 'shop-phone-new', 1, 1.0),
('act-wet-waste-landfill', 'waste', 'Unsegregated Organic Food Waste', 'Throwing kitchen scraps directly into municipal trash', 'kg', 'wst-landfill-general', 7, 0.8),
('act-packaged-water', 'waste', 'Single-Use Packaged Mineral Water', 'Buying bottled water while on the go', 'item', 'wst-plastic-bottle-pet', 5, 2.0)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    emission_factor_id = EXCLUDED.emission_factor_id,
    default_frequency_per_week = EXCLUDED.default_frequency_per_week,
    default_quantity = EXCLUDED.default_quantity;
