DROP TABLE IF EXISTS submissions;

CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    development_type TEXT NOT NULL,
    property_address TEXT NOT NULL,
    answers_json TEXT NOT NULL,
    timestamp TEXT NOT NULL
);
