-- Seed data for events and notifications

-- Insert sample events with various statuses and upcoming dates
INSERT INTO events (id, name, description, status, start_date, end_date, location, tags, notification_count, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'Annual Tech Conference 2024', 'A comprehensive technology conference featuring industry leaders and emerging trends in software development, AI, and digital transformation.', 'published', '2024-12-15 09:00:00', '2024-12-17 18:00:00', 'San Francisco Convention Center', ARRAY['technology', 'conference', 'networking'], 3, NOW(), NOW()),
  (gen_random_uuid(), 'Marketing Workshop Series', 'Weekly workshop series covering digital marketing strategies, social media optimization, and customer engagement techniques.', 'published', '2024-11-01 14:00:00', '2024-11-29 16:00:00', 'Downtown Business Hub', ARRAY['marketing', 'workshop', 'professional development'], 1, NOW(), NOW()),
  (gen_random_uuid(), 'Holiday Party Planning Committee', 'Draft event for organizing the annual company holiday celebration. Still finalizing venue and catering options.', 'draft', '2024-12-20 19:00:00', '2024-12-20 23:00:00', 'TBD', ARRAY['holiday', 'party', 'company'], 0, NOW(), NOW()),
  (gen_random_uuid(), 'Q1 Sales Kickoff 2025', 'Quarterly sales team meeting to review performance, set new targets, and introduce product updates for the upcoming quarter.', 'draft', '2025-01-08 10:00:00', '2025-01-08 15:00:00', 'Corporate Headquarters', ARRAY['sales', 'quarterly', 'business'], 2, NOW(), NOW()),
  (gen_random_uuid(), 'Summer Internship Program 2023', 'Completed summer internship program that provided hands-on experience for college students in various departments.', 'archived', '2023-06-01 09:00:00', '2023-08-31 17:00:00', 'Multiple Office Locations', ARRAY['internship', 'education', 'summer'], 0, NOW() - INTERVAL '6 months', NOW() - INTERVAL '6 months'),
  (gen_random_uuid(), 'Product Launch Webinar', 'Virtual presentation showcasing the latest product features and demonstrating new capabilities to customers and stakeholders.', 'published', '2024-11-15 13:00:00', '2024-11-15 14:30:00', 'Virtual Event Platform', ARRAY['product', 'webinar', 'launch'], 4, NOW(), NOW());

--> statement-breakpoint

-- Insert notifications for events that have unread notifications
INSERT INTO notifications (id, event_id, title, message, is_read, created_at)
VALUES
  (gen_random_uuid(), (SELECT id FROM events WHERE name = 'Annual Tech Conference 2024' LIMIT 1), 'Speaker Confirmed', 'Keynote speaker John Smith has confirmed his attendance for the opening session.', 0, NOW() - INTERVAL '2 days'),
  (gen_random_uuid(), (SELECT id FROM events WHERE name = 'Annual Tech Conference 2024' LIMIT 1), 'Venue Update', 'Additional breakout rooms have been secured for the conference workshops.', 0, NOW() - INTERVAL '1 day'),
  (gen_random_uuid(), (SELECT id FROM events WHERE name = 'Annual Tech Conference 2024' LIMIT 1), 'Registration Milestone', 'We have reached 500 registrations for the tech conference!', 1, NOW() - INTERVAL '3 days'),
  (gen_random_uuid(), (SELECT id FROM events WHERE name = 'Marketing Workshop Series' LIMIT 1), 'Material Ready', 'All workshop materials and handouts are now available for download.', 0, NOW() - INTERVAL '12 hours'),
  (gen_random_uuid(), (SELECT id FROM events WHERE name = 'Q1 Sales Kickoff 2025' LIMIT 1), 'Agenda Draft', 'First draft of the meeting agenda is ready for review.', 0, NOW() - INTERVAL '6 hours'),
  (gen_random_uuid(), (SELECT id FROM events WHERE name = 'Q1 Sales Kickoff 2025' LIMIT 1), 'Room Booking', 'Conference room has been reserved for the sales kickoff meeting.', 1, NOW() - INTERVAL '1 day'),
  (gen_random_uuid(), (SELECT id FROM events WHERE name = 'Product Launch Webinar' LIMIT 1), 'Technical Check', 'Pre-event technical testing completed successfully.', 0, NOW() - INTERVAL '4 hours'),
  (gen_random_uuid(), (SELECT id FROM events WHERE name = 'Product Launch Webinar' LIMIT 1), 'Demo Ready', 'Product demonstration slides and demo environment are prepared.', 0, NOW() - INTERVAL '8 hours'),
  (gen_random_uuid(), (SELECT id FROM events WHERE name = 'Product Launch Webinar' LIMIT 1), 'Registration Update', 'Current webinar registration count: 247 attendees.', 1, NOW() - INTERVAL '1 day'),
  (gen_random_uuid(), (SELECT id FROM events WHERE name = 'Product Launch Webinar' LIMIT 1), 'Promotion Complete', 'Social media promotion campaign has been executed across all channels.', 0, NOW() - INTERVAL '2 hours');

--> statement-breakpoint