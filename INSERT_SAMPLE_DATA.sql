-- Insert Sample Weather Data
INSERT INTO weather_alerts (sector, cell, forecast, temperature, rainfall) VALUES
('Nyagatare', 'Karangazi', 'Sunny with light clouds', 28, 0),
('Nyagatare', 'Rukomo', 'Partly cloudy, possible rain', 26, 15),
('Nyagatare', 'Matimba', 'Clear skies', 30, 0),
('Nyagatare', 'Mimuli', 'Heavy rain expected', 24, 45),
('Nyagatare', 'Karama', 'Moderate rain', 25, 20);

-- Insert Sample Market Prices
INSERT INTO market_prices (product, price, unit, market_name) VALUES
('Maize', 350, 'kg', 'Nyagatare Central Market'),
('Beans', 800, 'kg', 'Nyagatare Central Market'),
('Rice', 1200, 'kg', 'Nyagatare Central Market'),
('Potatoes', 400, 'kg', 'Karangazi Market'),
('Tomatoes', 600, 'kg', 'Karangazi Market'),
('Onions', 500, 'kg', 'Rukomo Market'),
('Cassava', 250, 'kg', 'Matimba Market'),
('Sweet Potatoes', 300, 'kg', 'Mimuli Market');

-- Insert Sample Pest/Disease Data
INSERT INTO pest_disease_db (name_rw, name_en, description_rw, description_en, treatment_rw, treatment_en, crops_affected) VALUES
('Inzoka y''ibigori', 'Maize Stalk Borer', 'Inzoka zirya ibigori mu muti', 'Larvae bore into maize stalks causing damage', 'Koresha imiti ya Cypermethrin', 'Use Cypermethrin pesticide', ARRAY['maize', 'sorghum']),
('Indwara y''ibishyimbo', 'Bean Rust', 'Amabara y''umuhondo ku mababi', 'Orange-brown spots on bean leaves', 'Koresha fungicide ya Mancozeb', 'Apply Mancozeb fungicide', ARRAY['beans']),
('Inzoka z''ibirayi', 'Potato Blight', 'Amababi arashira vuba', 'Leaves turn brown and die quickly', 'Koresha Metalaxyl fungicide', 'Use Metalaxyl fungicide', ARRAY['potatoes']),
('Udukoko tw''inyanya', 'Tomato Whitefly', 'Udukoko dutukura ku mababi', 'Small white insects on leaves', 'Koresha imiti ya Imidacloprid', 'Apply Imidacloprid insecticide', ARRAY['tomatoes', 'vegetables']);

-- Verify data
SELECT 'Weather Alerts:' as table_name, COUNT(*) as count FROM weather_alerts
UNION ALL
SELECT 'Market Prices:', COUNT(*) FROM market_prices
UNION ALL
SELECT 'Pest/Disease DB:', COUNT(*) FROM pest_disease_db;
