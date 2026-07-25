// import { createClient } from "@supabase/supabase-js";

// export const supabaseClient = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!) ;


import { createClient } from "@supabase/supabase-js";

 export const supabaseClient = createClient(
   import.meta.env.VITE_SUPABASE_URL!,
   import.meta.env.VITE_SUPABASE_ANON_KEY!
 );