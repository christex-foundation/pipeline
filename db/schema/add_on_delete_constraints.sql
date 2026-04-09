ALTER TABLE projects
DROP CONSTRAINT projects_user_id_fkey,
ADD CONSTRAINT projects_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

ALTER TABLE bookmark_project
DROP CONSTRAINT bookmark_project_user_id_fkey,
ADD CONSTRAINT bookmark_project_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

ALTER TABLE profile
DROP CONSTRAINT profile_user_id_fkey,
ADD CONSTRAINT profile_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

ALTER TABLE evaluation_queue
DROP CONSTRAINT evaluation_queue_requested_by_fkey,
ADD CONSTRAINT evaluation_queue_requested_by_fkey
FOREIGN KEY (requested_by)
REFERENCES auth.users(id)
ON DELETE SET NULL;

ALTER TABLE project_members
DROP CONSTRAINT project_members_user_id_fkey,
ADD CONSTRAINT project_members_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

ALTER TABLE project_members
DROP CONSTRAINT project_members_creator_id_fkey,
ADD CONSTRAINT project_members_creator_id_fkey
FOREIGN KEY (creator_id)
REFERENCES auth.users(id)
ON DELETE SET NULL;

ALTER TABLE project_resource
DROP CONSTRAINT project_resource_user_id_fkey,
ADD CONSTRAINT project_resource_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE SET NULL;

ALTER TABLE project_updates
DROP CONSTRAINT project_updates_user_id_fkey,
ADD CONSTRAINT project_updates_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE SET NULL;

ALTER TABLE project_update_comment
DROP CONSTRAINT project_update_comment_user_id_fkey,
ADD CONSTRAINT project_update_comment_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE SET NULL;
