ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS image_variants jsonb NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE public.products
  ADD CONSTRAINT products_image_variants_is_array
  CHECK (jsonb_typeof(image_variants) = 'array') NOT VALID;