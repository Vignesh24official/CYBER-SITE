ALTER TABLE complaints ADD COLUMN IF NOT EXISTS resolution_verdict VARCHAR(150);
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS resolution_summary TEXT;
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS actions_taken_summary TEXT;
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS citizen_guidance TEXT;
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS resolution_badge VARCHAR(50);

CREATE TABLE IF NOT EXISTS case_messages (
    id BIGSERIAL PRIMARY KEY,
    complaint_id BIGINT NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    sender_id BIGINT NOT NULL REFERENCES users(id),
    message TEXT NOT NULL,
    sender_role VARCHAR(50) NOT NULL,
    attachment_name VARCHAR(200),
    attachment_data TEXT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_case_messages_complaint ON case_messages(complaint_id);
CREATE INDEX IF NOT EXISTS idx_case_messages_sender ON case_messages(sender_id);
