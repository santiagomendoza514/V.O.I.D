# Supabase en V.O.I.D

Guía para montar la base de datos, la autenticación y los roles del sitio. Está escrita para seguirse en orden: cada paso supone que el anterior está hecho.

Las secciones 1 a 3 las haces tú en el panel de Supabase, porque requieren tu cuenta y tus credenciales. De la 4 en adelante es código: cuando tengas las llaves en `.env.local`, lo puedo conectar yo.

---

## 0. Qué es y por qué lo necesitas

Hasta hoy todo el sitio son archivos TypeScript estáticos. Eso alcanza para mostrar un catálogo, pero no para nada que cambie según quién visite o que tenga que persistir: cuentas, perfiles, avatares, pedidos, favoritos, suscriptores. Eso necesita una base de datos.

Supabase te da cuatro cosas en un solo servicio:

- **Postgres**: una base de datos relacional real, la misma que usan empresas grandes.
- **Auth**: registro, inicio de sesión, recuperación de contraseña.
- **Storage**: archivos, para los avatares.
- **Row Level Security (RLS)**: reglas dentro de la base de datos que deciden quién puede leer o escribir cada fila. **Es el corazón de la seguridad**, y lo explico en la sección 3.

### Qué va en Supabase y qué se queda en el código

Esta es la decisión de arquitectura más importante de toda la guía.

| Dato | Dónde vive | Por qué |
|---|---|---|
| Nombre, descripción, precio, fotos de cada prenda | `muladhara.ts` | Cambia poco y lo editas tú con push. Se pre-renderiza y carga instantáneo. |
| **Existencias** | **Supabase** | Cambian cuando alguien compra. Tienen que bajar en un solo lugar, al instante. |
| Cuentas, perfiles, avatares | Supabase | Son de cada usuario. |
| Pedidos | Supabase | Historial que el cliente consulta y tú gestionas. |
| Favoritos | Supabase | Son de cada usuario. |
| Suscriptores del boletín | Supabase | Incluye invitados sin cuenta. |

El campo `stock` de `muladhara.ts` deja de ser la verdad en cuanto conectes Supabase. Queda como valor de referencia; la cifra real sale de la tabla `inventario`.

**Consecuencia que no hay que olvidar:** como el precio vive en el código, cada pedido guarda una **copia** del nombre y el precio en el momento de la compra. Si el mes que viene subes Sedimento a $95.000, los pedidos viejos deben seguir diciendo $90.000.

---

## 1. Crear el proyecto

1. Entra a [supabase.com](https://supabase.com) y crea una cuenta.
2. **New project**. Nombre: `void-web`.
3. **Contraseña de la base de datos**: genera una fuerte y guárdala en tu gestor de contraseñas. No la vas a usar en el código, pero la necesitas si algún día te conectas directo.
4. **Región: `East US (North Virginia)`**. Las funciones de Vercel corren por defecto en `iad1`, que es Virginia, y tu proyecto no ha cambiado eso. El servidor del sitio habla con la base de datos en cada petición: si están en continentes distintos, cada consulta paga ese viaje. Lo que importa es que estén **juntos** — si algún día mueves las funciones de Vercel a otra región, mueve también la base de datos.
5. Espera un par de minutos a que termine de aprovisionar.

### Antes de seguir: el plan gratuito

El plan gratuito sirve para construir y probar, pero tiene una trampa para una tienda en producción: **los proyectos gratuitos se pausan tras una semana sin actividad**. Si nadie entra al sitio durante siete días, la base de datos se duerme y el sitio deja de cargar pedidos hasta que la reactives a mano.

Para construir, el gratuito está perfecto. **Antes de abrir ventas**, pasa al plan Pro. Verifica el precio y los límites vigentes en su página, porque cambian.

---

## 2. Las llaves

Ve a la configuración del proyecto, sección **API** (o **API Keys**). Vas a ver la URL del proyecto y dos llaves. Según cuándo se haya creado el proyecto, se llaman de una de estas dos formas — son lo mismo:

| Nombre antiguo | Nombre nuevo | Qué es |
|---|---|---|
| `anon` / `public` | `publishable` | **Pública.** Va en el navegador. Es segura *solo porque* existe RLS. |
| `service_role` | `secret` | **Secreta.** Se salta todas las reglas de RLS. Acceso total. |

### La regla que no se rompe

Ya nos pasó una vez con la llave de Google en `V.O.I.D.md`, en un repositorio público. Con la llave secreta de Supabase sería peor: quien la tenga puede leer todos los pedidos, todos los correos, todas las direcciones, y vaciar el inventario.

- La llave **secreta nunca lleva el prefijo `NEXT_PUBLIC_`**. Ese prefijo hace que Next la incruste en el JavaScript que descarga cualquier visitante.
- **Nunca va en un archivo del repositorio.** Solo en `.env.local`, que ya está en `.gitignore`, y en las variables de entorno de Vercel.
- Si alguna vez se filtra: se rota en el panel en ese mismo momento.

Agrégalas a `void-web/.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=la-llave-publica
SUPABASE_SERVICE_ROLE_KEY=la-llave-secreta
```

### Ojo: hay dos archivos `.env.local`

En el repositorio existen dos, y es fácil equivocarse:

| Archivo | Lo lee | Para qué |
|---|---|---|
| `V.O.I.D/.env.local` (raíz del repo) | el CLI de Vercel | Lo creó `vercel link`. Solo guarda `VERCEL_OIDC_TOKEN`. |
| **`V.O.I.D/void-web/.env.local`** | **Next.js** | **Aquí van las de Supabase.** |

Next solo lee el `.env.local` de la carpeta que tiene `package.json`, que es `void-web/`. Si las pones en la raíz, el sitio no las ve y se comporta como si Supabase no existiera.

### En Vercel, por terminal

El panel de Vercel puede pedir pasar a Pro según la opción que toques. Las variables de entorno no lo requieren, y por terminal se agregan sin pasar por esa pantalla. Desde la **raíz del repositorio** (no desde `void-web`), corre una vez por variable:

```bash
npx vercel env add NEXT_PUBLIC_SUPABASE_URL production
```

```bash
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
```

```bash
npx vercel env add SUPABASE_SERVICE_ROLE_KEY production
```

Cada comando te pide el valor: lo pegas ahí y queda guardado en Vercel, sin pasar por ningún archivo. Repite los tres con `preview` en lugar de `production` si quieres que también funcionen las URLs de prueba de cada rama. Para confirmar que quedaron:

```bash
npx vercel env ls
```

**Mientras no estén en Vercel, el sitio publicado sigue funcionando**: el middleware y la lectura de existencias detectan que faltan y caen al stock escrito en `muladhara.ts`. Lo que no funcionará es nada que dependa de la base de datos — cuentas, pedidos, favoritos.

---

## 3. El esquema

### Cómo funciona la seguridad aquí

La llave pública viaja en el navegador. Cualquiera puede abrir la consola, copiarla y hacerle consultas directas a tu base de datos, saltándose tu sitio por completo. **Eso no es un fallo: así está diseñado Supabase.**

Lo que te protege es RLS. Cada tabla tiene `enable row level security`, y a partir de ahí **todo está prohibido por defecto**. Las políticas abren permisos concretos: "un usuario puede ver *sus* pedidos", "cualquiera puede ver las existencias". Lo que no está permitido explícitamente, no se puede hacer.

Por eso la verificación de rol va en la base de datos y no en la interfaz. Esconder el botón de "administrar" no protege nada; la política sí.

### Cómo correr el SQL

Panel → **SQL Editor** → **New query**. Pega cada bloque y pulsa **Run**. Córrelos en orden.

### 3.1 Perfiles y roles

Cada cuenta de Supabase Auth tiene un perfil con su nombre, avatar y rol. Los tres roles que definiste se resuelven así:

- **No registrado**: no tiene sesión. RLS solo le deja ver lo público.
- **Registrado**: tiene sesión y un perfil con `rol = 'usuario'`.
- **Admin**: perfil con `rol = 'admin'`. Solo tú.

```sql
create table public.perfiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nombre text,
  avatar_url text,
  rol text not null default 'usuario' check (rol in ('usuario', 'admin')),
  creado_en timestamptz not null default now()
);

alter table public.perfiles enable row level security;

create policy "ver el propio perfil" on public.perfiles
  for select using (auth.uid() = id);

create policy "editar el propio perfil" on public.perfiles
  for update using (auth.uid() = id);

-- Un usuario puede cambiar su nombre y su avatar, pero NUNCA su rol.
-- Sin esto, cualquiera podría ascenderse a admin desde la consola.
revoke update on public.perfiles from authenticated;
grant update (nombre, avatar_url) on public.perfiles to authenticated;

-- Crea el perfil automáticamente al registrarse.
create function public.crear_perfil()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.perfiles (id) values (new.id);
  return new;
end;
$$;

create trigger al_registrarse
  after insert on auth.users
  for each row execute function public.crear_perfil();

-- ¿El usuario actual es admin?
-- Es "security definer" a propósito: consulta perfiles saltándose RLS. Si las
-- políticas de perfiles consultaran perfiles directamente, Postgres entraría en
-- recursión infinita.
create function public.es_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from perfiles where id = auth.uid() and rol = 'admin'
  );
$$;
```

### 3.2 Inventario

```sql
create table public.inventario (
  sku text primary key,
  stock integer not null check (stock >= 0)
);

alter table public.inventario enable row level security;

-- Cualquiera puede ver las existencias: así el sitio muestra "queda 1".
create policy "existencias públicas" on public.inventario
  for select using (true);

-- No hay política de escritura: nadie la modifica desde el navegador.
-- Solo el servidor, con la llave secreta, al confirmarse un pago.
```

**Cargar las existencias de Mūlādhāra.** Generado desde los SKU reales de `muladhara.ts`: 33 SKU, 34 unidades. Vestigio no aparece porque aún no tiene cantidad definida.

```sql
insert into public.inventario (sku, stock) values
  ('VOID-MUL-CHA-MIC-NEG-M', 1),
  ('VOID-MUL-PAN-PNA-CAF-M', 1),
  ('VOID-MUL-SUD-BUR-NEG-S', 1),
  ('VOID-MUL-SUD-BUR-NEG-M', 1),
  ('VOID-MUL-SUD-BUR-NEG-L', 1),
  ('VOID-MUL-SUD-BUR-CAF-S', 1),
  ('VOID-MUL-SUD-BUR-CAF-M', 1),
  ('VOID-MUL-SUD-BUR-CAF-L', 1),
  ('VOID-MUL-SUD-BUR-VIN-S', 1),
  ('VOID-MUL-SUD-BUR-VIN-M', 1),
  ('VOID-MUL-SUD-BUR-VIN-L', 1),
  ('VOID-MUL-SUD-BUR-VER-S', 1),
  ('VOID-MUL-SUD-BUR-VER-M', 1),
  ('VOID-MUL-SUD-BUR-VER-L', 1),
  ('VOID-MUL-SUD-NAU-VER-S', 1),
  ('VOID-MUL-SUD-NAU-VER-M', 1),
  ('VOID-MUL-SUD-NAU-VER-L', 1),
  ('VOID-MUL-CAM-JAC-CRE-M', 1),
  ('VOID-MUL-CAM-JAC-VER-M', 1),
  ('VOID-MUL-CAM-JAC-CAB-M', 1),
  ('VOID-MUL-SAC-BUR-VIN-M', 1),
  ('VOID-MUL-SAC-BUR-CAF-M', 1),
  ('VOID-MUL-SAC-BUR-VER-M', 1),
  ('VOID-MUL-HOO-ACO-CAF-M', 1),
  ('VOID-MUL-HOO-ACO-BUR-M', 1),
  ('VOID-MUL-HOO-ACO-TER-M', 1),
  ('VOID-MUL-PAN-DRT-CAF-S', 1),
  ('VOID-MUL-PAN-DRT-CAF-M', 1),
  ('VOID-MUL-PAN-DRT-CAF-L', 1),
  ('VOID-MUL-PAN-PAD-NEG-S', 1),
  ('VOID-MUL-PAN-PAD-NEG-M', 1),
  ('VOID-MUL-PAN-PAD-NEG-L', 1),
  ('VOID-MUL-TOT-PNA-CAF-U', 2);
```

### 3.3 Descontar existencias sin vender dos veces

Este es el punto donde una tienda pequeña falla en silencio. Kanda es una pieza única. Si dos personas pagan al mismo tiempo, y el código hace "leer el stock, ver que es 1, restar 1", las dos leen 1 antes de que ninguna reste. Vendes una chaqueta que no existe.

La solución es que la base de datos haga la comprobación y la resta en **una sola operación**:

```sql
create function public.descontar_stock(p_sku text, p_cantidad integer)
returns boolean
language plpgsql
security definer set search_path = public
as $$
begin
  update inventario
     set stock = stock - p_cantidad
   where sku = p_sku
     and stock >= p_cantidad;
  -- found es true solo si alguna fila cumplió la condición y se actualizó.
  return found;
end;
$$;

-- Solo el servidor puede llamarla. Desde el navegador, nadie.
revoke execute on function public.descontar_stock from public, anon, authenticated;
```

Si devuelve `false`, otro comprador se la llevó primero: ese pago hay que reembolsarlo.

**Una decisión pendiente, para cuando conectemos Wompi:** con piezas únicas, descontar solo cuando el pago se confirma deja abierta esa ventana de reembolso. La alternativa es **reservar** la unidad durante unos minutos al iniciar el checkout y liberarla si el pago no llega. Es más trabajo, pero para Kanda y Vetas probablemente lo vale. Lo decidimos en ese momento.

### 3.4 Pedidos

```sql
create table public.pedidos (
  id uuid primary key default gen_random_uuid(),
  -- null = compra como invitado. Se enlaza si después crea la cuenta.
  usuario_id uuid references auth.users (id) on delete set null,
  email text not null,
  estado text not null default 'pendiente'
    check (estado in ('pendiente', 'pagado', 'enviado', 'entregado', 'cancelado')),
  total integer not null,             -- pesos colombianos
  direccion jsonb not null,
  referencia_pago text unique,        -- la referencia de Wompi
  creado_en timestamptz not null default now()
);

alter table public.pedidos enable row level security;

create policy "ver los propios pedidos" on public.pedidos
  for select using (auth.uid() = usuario_id);

create policy "el admin ve todos los pedidos" on public.pedidos
  for select using (public.es_admin());

create table public.pedido_items (
  pedido_id uuid references public.pedidos (id) on delete cascade,
  sku text not null,
  nombre text not null,     -- copia del momento de la compra
  precio integer not null,  -- copia del momento de la compra
  cantidad integer not null check (cantidad > 0),
  primary key (pedido_id, sku)
);

alter table public.pedido_items enable row level security;

create policy "ver los artículos de los propios pedidos" on public.pedido_items
  for select using (
    exists (
      select 1 from public.pedidos p
      where p.id = pedido_id
        and (p.usuario_id = auth.uid() or public.es_admin())
    )
  );
```

No hay política para **crear** pedidos desde el navegador. Los crea el servidor, después de validar los precios contra `muladhara.ts`. Si el navegador pudiera crear pedidos, alguien podría mandar uno con Kanda a $1.

### 3.5 Favoritos

```sql
create table public.favoritos (
  usuario_id uuid references auth.users (id) on delete cascade,
  producto_slug text not null,
  creado_en timestamptz not null default now(),
  primary key (usuario_id, producto_slug)
);

alter table public.favoritos enable row level security;

create policy "gestionar los propios favoritos" on public.favoritos
  for all
  using (auth.uid() = usuario_id)
  with check (auth.uid() = usuario_id);
```

### 3.6 Boletín

Va separado de las cuentas porque **los invitados también se pueden suscribir** sin registrarse.

```sql
create table public.suscriptores (
  email text primary key,
  confirmado boolean not null default false,
  creado_en timestamptz not null default now()
);

alter table public.suscriptores enable row level security;

-- Sin políticas: solo el servidor lee y escribe.
-- Así nadie puede descargar tu lista de correos desde la consola.
```

`confirmado` es para el doble opt-in: la persona se suscribe, le llega un correo, confirma. Evita que alguien suscriba correos ajenos, y protege la reputación de tu dominio frente a los filtros de spam.

### 3.7 Avatares

Panel → **Storage** → **New bucket** → nombre `avatares`, **público**.

```sql
-- Cada usuario solo puede subir dentro de una carpeta con su propio id.
create policy "subir el propio avatar" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'avatares'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "reemplazar el propio avatar" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'avatares'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
```

### 3.8 Hacerte admin

El sitio todavía no tiene página de registro, así que tu cuenta se crea desde el panel:

1. **Authentication** → **Users** → **Add user** → **Create new user**.
2. Tu correo y una contraseña. Marca **Auto Confirm User**: aún no hay servidor de correo configurado (sección 8) para enviarte la confirmación.
3. Al crearla, el trigger de la sección 3.1 te genera el perfil automáticamente, con `rol = 'usuario'`.

Después, en el SQL Editor, te subes a admin:

```sql
update public.perfiles
   set rol = 'admin'
 where id = (select id from auth.users where email = 'TU-CORREO');
```

Esto funciona porque el SQL Editor corre con permisos totales. Desde el sitio, nadie puede hacer este cambio: lo impide el `revoke` de la sección 3.1.

---

## 4. Instalar las librerías

```bash
npm install @supabase/supabase-js @supabase/ssr server-only
```

- `@supabase/supabase-js`: el cliente.
- `@supabase/ssr`: lo que hace funcionar las sesiones con el App Router de Next, guardándolas en cookies.
- `server-only`: hace que el build **falle** si un archivo marcado como de servidor termina importado en el navegador. Es la red de seguridad para la llave secreta.

---

## 5. Los tres clientes

Hay tres porque hay tres contextos distintos, con permisos distintos.

### `src/lib/supabase/navegador.ts`

Para componentes de cliente (`'use client'`). Usa la llave pública: RLS aplica.

```ts
import { createBrowserClient } from '@supabase/ssr';

export function crearClienteNavegador() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

### `src/lib/supabase/servidor.ts`

Para Server Components, Server Actions y rutas de API. Lee la sesión desde las cookies: RLS aplica como el usuario que está navegando.

```ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function crearClienteServidor() {
  const almacen = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return almacen.getAll();
        },
        setAll(nuevas) {
          try {
            nuevas.forEach(({ name, value, options }) =>
              almacen.set(name, value, options)
            );
          } catch {
            // Un Server Component no puede escribir cookies. No pasa nada:
            // el middleware se encarga de refrescar la sesión.
          }
        },
      },
    }
  );
}
```

### `src/lib/supabase/admin.ts`

Con la llave secreta. **Se salta RLS.** Solo para lo que el servidor hace en nombre del sistema: descontar existencias, crear pedidos, gestionar suscriptores.

```ts
import 'server-only';
import { createClient } from '@supabase/supabase-js';

export function crearClienteAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
```

La primera línea, `import 'server-only'`, es la que importa. Si algún día alguien importa este archivo desde un componente de cliente, el build se rompe en vez de publicar tu llave secreta.

---

## 6. El middleware

Las sesiones de Supabase caducan y se renuevan. El middleware corre antes de cada petición y mantiene la sesión fresca.

### Por qué tiene que tolerar que falte Supabase

Corre en **cada** petición, a todas las páginas. Si faltan las variables, crear el cliente lanza un error — y un error en el middleware no rompe una función: **tumba el sitio entero**, todas las páginas en error 500 a la vez. Pasaría, por ejemplo, al publicar en Vercel antes de cargar las variables allí.

Por eso las credenciales se leen en un solo sitio, que además dice si están completas.

`src/lib/supabase/config.ts`:

```ts
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabaseConfigurado = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
```

`src/middleware.ts` (va en `src/`, al nivel de `app/`, no dentro):

```ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { SUPABASE_ANON_KEY, SUPABASE_URL, supabaseConfigurado } from '@/lib/supabase/config';

export async function middleware(request: NextRequest) {
  let respuesta = NextResponse.next({ request });

  // Sin credenciales no hay sesión que refrescar: se deja pasar la petición.
  if (!supabaseConfigurado) return respuesta;

  const supabase = createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(nuevas) {
          nuevas.forEach(({ name, value }) => request.cookies.set(name, value));
          respuesta = NextResponse.next({ request });
          nuevas.forEach(({ name, value, options }) =>
            respuesta.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresca la sesión. No borres esta línea aunque parezca que no hace nada.
  // Si Supabase no responde, la página carga igual.
  try {
    await supabase.auth.getUser();
  } catch {
    // La sesión se reintenta en la siguiente petición.
  }

  return respuesta;
}

export const config = {
  // No corre para archivos estáticos ni imágenes.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

---

## 7. Verificar quién es el usuario

En el servidor, **usa siempre `getUser()`, nunca `getSession()`**.

`getSession()` lee la cookie tal cual, sin comprobarla: alguien podría fabricar una. `getUser()` le pregunta a Supabase si el token es auténtico. Para cualquier decisión de permisos, solo sirve la segunda.

```ts
const supabase = await crearClienteServidor();
const { data: { user } } = await supabase.auth.getUser();

if (!user) {
  // No registrado.
}
```

Y para saber si es admin, se pregunta a la base de datos — con la función de la sección 3.1, que no se puede falsificar desde el navegador:

```ts
const { data: esAdmin } = await supabase.rpc('es_admin');
```

---

## 8. Correos: una trampa antes de producción

Supabase Auth envía los correos de confirmación de cuenta y de recuperación de contraseña. Pero **su servidor de correo incorporado es solo para pruebas**: tiene un límite muy bajo de envíos por hora. En producción, con varias personas registrándose el mismo día, los correos simplemente dejan de llegar.

Antes de abrir el sitio hay que configurar un servidor de correo propio: Panel → **Authentication** → **SMTP Settings**. Resend, Postmark o Amazon SES funcionan bien.

Y una aclaración sobre el **boletín**: Supabase no envía campañas de correo. Guarda la lista de suscriptores, pero los envíos —lanzamientos, eventos, códigos de descuento— necesitan un servicio de correo aparte. Lo resolvemos cuando lleguemos al boletín.

---

## 9. Compra como invitado y cuenta después

Lo que decidiste: se puede comprar sin cuenta, y se ofrece crearla después de pagar.

1. El invitado compra. Se crea un pedido con `usuario_id = null` y su `email`.
2. En la confirmación del pago se le ofrece crear la cuenta, con el correo ya rellenado.
3. Al crearla, se enlazan sus pedidos anteriores. Esto lo hace el servidor con el cliente admin:

```ts
await crearClienteAdmin()
  .from('pedidos')
  .update({ usuario_id: nuevoUsuario.id })
  .eq('email', nuevoUsuario.email)
  .is('usuario_id', null);
```

**Importante:** este enlace solo es seguro **después de que la persona confirme su correo**. Si no, alguien podría registrarse con el correo de otro cliente y quedarse con su historial de pedidos y sus direcciones.

---

## Lista de verificación

Estado comprobado contra la base de datos real, con la llave pública y solo lecturas.

- [x] Proyecto creado
- [x] Las tres variables en **`void-web/.env.local`** — estaban en la raíz del repo; se movieron
- [x] La llave secreta **sin** prefijo `NEXT_PUBLIC_`
- [x] SQL de las secciones 3.1 a 3.7 — `inventario` con 33 SKU y 34 unidades, las cinco tablas protegidas por RLS, `es_admin()` responde, `descontar_stock` rechazada desde el navegador
- [x] Bucket `avatares` creado
- [x] Librerías instaladas (4)
- [x] Los tres clientes y el middleware (5 y 6), con el middleware tolerante a que falte Supabase
- [x] Las existencias del sitio salen de `inventario`, regeneradas cada minuto
- [ ] **Las tres variables en Vercel** — por terminal, ver sección 2
- [ ] Tu cuenta creada y con rol de admin (3.8)
- [ ] Antes de abrir ventas: plan Pro y SMTP propio (1 y 8)
