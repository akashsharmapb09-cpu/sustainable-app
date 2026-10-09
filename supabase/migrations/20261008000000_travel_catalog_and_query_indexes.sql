-- Travel factors and activities keep flight records distinct from daily transport.
INSERT INTO public.emission_factors
    (id, category, name, co2e_per_unit, unit, region, year, source, source_url, confidence_interval, notes)
VALUES
    ('trvl-flight-domestic-2024', 'travel', 'Domestic flight, economy class (<1000 km)', 0.2450,
     'passenger_km', 'GLOBAL', 2024, 'UK DESNZ/DEFRA 2024 Greenhouse Gas Conversion Factors',
     'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024',
     0.15, 'Economy seating class; radiative-forcing treatment is described in the cited factor guidance.')
ON CONFLICT (id) DO UPDATE SET
    category = EXCLUDED.category,
    name = EXCLUDED.name,
    co2e_per_unit = EXCLUDED.co2e_per_unit,
    unit = EXCLUDED.unit,
    region = EXCLUDED.region,
    year = EXCLUDED.year,
    source = EXCLUDED.source,
    source_url = EXCLUDED.source_url,
    confidence_interval = EXCLUDED.confidence_interval,
    notes = EXCLUDED.notes;

INSERT INTO public.activities
    (id, category, name, description, default_unit, emission_factor_id, default_frequency_per_week, default_quantity)
VALUES
    ('act-travel-domestic-flight', 'travel', 'Domestic air travel',
     'Economy-class domestic air travel, measured in passenger-kilometres.',
     'passenger_km', 'trvl-flight-domestic-2024', 1, 500)
ON CONFLICT (id) DO UPDATE SET
    category = EXCLUDED.category,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    default_unit = EXCLUDED.default_unit,
    emission_factor_id = EXCLUDED.emission_factor_id,
    default_frequency_per_week = EXCLUDED.default_frequency_per_week,
    default_quantity = EXCLUDED.default_quantity;

INSERT INTO public.alternatives
    (id, category, title, description, why_better, baseline_activity_id, co2e_saved_ratio,
     cost_delta_monthly_inr, difficulty, feasibility_score, prerequisites, caveats,
     region_availability, tags, source_citation, source_url)
VALUES
    ('alt-travel-rail-short-haul', 'travel', 'Take intercity rail instead of a short domestic flight',
     'Choose rail for a short domestic route when a practical service is available.',
     'The cited passenger-kilometre factors indicate lower operational emissions for rail than for domestic air travel.',
     'act-travel-domestic-flight', 0.9142, 0, 'moderate', 0.75,
     ARRAY['A suitable rail service is available'],
     'The comparison is operational CO2e per passenger-kilometre; route, occupancy, access trips, and service availability affect the result.',
     ARRAY['IN'], ARRAY['travel', 'rail', 'lower-emission'],
     'UK DESNZ/DEFRA 2024 Greenhouse Gas Conversion Factors; Indian Railways 2023',
     'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024'),
    ('alt-travel-overnight-rail', 'travel', 'Use an overnight train where it replaces a flight',
     'Consider an overnight intercity train for a route with a suitable direct or connecting service.',
     'Rail can have lower operational emissions per passenger-kilometre than a domestic flight.',
     'act-travel-domestic-flight', 0.9142, 0, 'moderate', 0.70,
     ARRAY['A suitable overnight rail service is available'],
     'The estimate compares passenger-kilometre factors and excludes hotel, station access, and schedule trade-offs.',
     ARRAY['IN'], ARRAY['travel', 'rail', 'overnight'],
     'UK DESNZ/DEFRA 2024 Greenhouse Gas Conversion Factors; Indian Railways 2023',
     'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024'),
    ('alt-travel-virtual-meeting', 'travel', 'Replace an optional business flight with a remote meeting',
     'Use a remote meeting when an in-person visit is not needed for the work.',
     'Avoiding the flight avoids its modeled flight emissions; energy used by the meeting is not included.',
     'act-travel-domestic-flight', 1.0000, 0, 'easy', 0.85,
     ARRAY['The meeting can achieve its purpose remotely'],
     'This estimate covers the logged flight only. It does not account for home or office energy, equipment, or other travel.',
     ARRAY['GLOBAL'], ARRAY['travel', 'remote', 'conditional'],
     'UK DESNZ/DEFRA 2024 Greenhouse Gas Conversion Factors',
     'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024'),
    ('alt-travel-combine-flight-trips', 'travel', 'Combine two similar trips into one journey',
     'Where practical, coordinate dates and plans so one of two otherwise similar domestic flight journeys is avoided.',
     'Avoiding one of two equal flight journeys would avoid half of those two journeys’ modeled flight emissions.',
     'act-travel-domestic-flight', 0.5000, 0, 'moderate', 0.60,
     ARRAY['The purposes and dates can be combined'],
     'The 50% estimate applies only to two equal logged flight journeys when one is avoided; actual routes may differ.',
     ARRAY['GLOBAL'], ARRAY['travel', 'planning', 'conditional'],
     'UK DESNZ/DEFRA 2024 Greenhouse Gas Conversion Factors',
     'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024')
ON CONFLICT (id) DO UPDATE SET
    category = EXCLUDED.category,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    why_better = EXCLUDED.why_better,
    baseline_activity_id = EXCLUDED.baseline_activity_id,
    co2e_saved_ratio = EXCLUDED.co2e_saved_ratio,
    cost_delta_monthly_inr = EXCLUDED.cost_delta_monthly_inr,
    difficulty = EXCLUDED.difficulty,
    feasibility_score = EXCLUDED.feasibility_score,
    prerequisites = EXCLUDED.prerequisites,
    caveats = EXCLUDED.caveats,
    region_availability = EXCLUDED.region_availability,
    tags = EXCLUDED.tags,
    source_citation = EXCLUDED.source_citation,
    source_url = EXCLUDED.source_url,
    is_active = true;

CREATE INDEX IF NOT EXISTS idx_emission_factors_category_region_year
    ON public.emission_factors(category, region, year DESC);
CREATE INDEX IF NOT EXISTS idx_activities_category_name
    ON public.activities(category, name);
CREATE INDEX IF NOT EXISTS idx_activities_emission_factor_id
    ON public.activities(emission_factor_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_logged_at
    ON public.activity_logs(user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_alternatives_active_title
    ON public.alternatives(title) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_alternatives_active_category_title
    ON public.alternatives(category, title) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_alternatives_baseline_activity_id
    ON public.alternatives(baseline_activity_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_user_created_at
    ON public.recommendations(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_actions_user_status_updated_at
    ON public.user_actions(user_id, status, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_goals_user_target_date
    ON public.goals(user_id, target_date);
CREATE INDEX IF NOT EXISTS idx_user_challenges_user_status
    ON public.user_challenges(user_id, status);
CREATE INDEX IF NOT EXISTS idx_user_challenges_challenge_id
    ON public.user_challenges(challenge_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_awarded_at
    ON public.user_badges(user_id, awarded_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_user_created_at
    ON public.feedback(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_data_export_requests_user_created_at
    ON public.data_export_requests(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id
    ON public.user_roles(user_id);
