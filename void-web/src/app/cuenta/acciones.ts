'use server';

import { redirect } from 'next/navigation';
import { supabaseConfigurado } from '@/lib/supabase/config';
import { crearClienteServidor } from '@/lib/supabase/servidor';

export async function salir() {
  if (supabaseConfigurado) {
    const supabase = await crearClienteServidor();
    await supabase.auth.signOut();
  }
  redirect('/');
}
