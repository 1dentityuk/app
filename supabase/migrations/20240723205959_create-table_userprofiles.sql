CREATE TABLE public.userprofiles (
    id uuid not null references auth.users on delete cascade,
    first_name text,
    last_name text,
    known_by text,
    date_of_birth text,
    telephone_number text,
    public_key uuid not null,
    metadata jsonb,
    primary key (id)
);

ALTER TABLE public.userprofiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Can only view own profile data"
    ON public.userprofiles
    FOR SELECT
    TO authenticated
    USING ( (SELECT auth.uid()) = id );

CREATE POLICY "Can only update own profile data"
    ON public.userprofiles
    FOR UPDATE
    TO authenticated
    USING ( (SELECT auth.uid()) = id )
    WITH CHECK ( (SELECT auth.uid()) = id );

CREATE OR REPLACE FUNCTION public.create_userprofile()
RETURNS TRIGGER AS $$
BEGIN
INSERT INTO public.userprofiles (id, first_name, last_name, known_by, public_key)
VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'first_name', 
    NEW.raw_user_meta_data ->> 'last_name', 
    NEW.raw_user_meta_data ->> 'name', 
    gen_random_uuid());
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER create_userprofile_trigger AFTER
INSERT ON auth.users FOR EACH ROW WHEN (
    NEW.raw_user_meta_data IS NOT NULL
) EXECUTE FUNCTION public.create_userprofile();