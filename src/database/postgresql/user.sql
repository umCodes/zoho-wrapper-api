CREATE TABLE IF NOT EXISTS users  (
    id BIGINT PRIMARY KEY DEFAULT (floor(random() * 9000000000 + 1000000000)::bigint),
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('loader', 'admin', 'praperer', 'driver')),
    password TEXT NOT NULL,
    phone_number VARCHAR(12) NOT NULL UNIQUE,
    refresh_token TEXT,
    expires_at TIMESTAMP,
    CHECK(
        refresh_token IS NULL OR expires_at IS NOT NULL
    )
)


CREATE TABLE IF NOT EXISTS used_refresh_tokens(
    id SERIAL PRIMARY KEY,
    token TEXT NOT NULL,
    last_used_at TIMESTAMP NOT NULL,
    user_id BIGINT REFERENCES users(id) NOT NULL
)

CREATE INDEX IF NOT EXISTS token_idx ON used_refresh_tokens(token)